from typing import Dict, Any, List, Optional
import math
from sqlalchemy.orm import Session
from backend.models.domain import (
    LearnerProfile, Career, CareerSkill, LearnerSkill, Skill, SkillPrerequisite, Project
)
from backend.ai.llm_client import llm_client

class CareerTwinEngine:
    """
    Career Twin Intelligent Transition Simulator & Multi-Path Optimization Engine.
    Connects:
    Learner State -> Target Career -> Required Skills -> Skill Gaps -> Prerequisites
    -> Multi-Path Sequencing -> Time/Effort -> Learning ROI -> Grounded AI Explanation.
    """

    @staticmethod
    def simulate_transition(
        db: Session,
        profile_id: str,
        target_career_id: str,
        weekly_hours: int = 8,
        target_timeline_months: int = 6,
        priority_mode: str = "BALANCED"
    ) -> Dict[str, Any]:
        profile = db.query(LearnerProfile).filter(LearnerProfile.id == profile_id).first()
        current_career_id = (profile.target_career_id if profile else "c_ai_engineer") or "c_ai_engineer"
        
        current_career = db.query(Career).filter(Career.id == current_career_id).first()
        target_career = db.query(Career).filter(Career.id == target_career_id).first()
        if not target_career:
            target_career = db.query(Career).first()
            target_career_id = target_career.id if target_career else "c_data_scientist"

        current_title = current_career.title if current_career else "AI Engineer"
        target_title = target_career.title if target_career else "Data Scientist"

        # 1. Fetch learner skills
        learner_skills = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile_id).all()
        learner_status_map = {ls.skill_id: ls.status for ls in learner_skills}
        mastered_skill_ids = set(ls.skill_id for ls in learner_skills if ls.status == "MASTERED")
        developing_skill_ids = set(ls.skill_id for ls in learner_skills if ls.status == "DEVELOPING")
        possessed_skill_ids = mastered_skill_ids.union(developing_skill_ids)

        # 2. Fetch target career skills & weights
        target_career_skills = db.query(CareerSkill).filter(CareerSkill.career_id == target_career_id).all()
        target_skill_ids = [cs.skill_id for cs in target_career_skills]
        importance_map = {cs.skill_id: (cs.importance_weight or 1.0) for cs in target_career_skills}

        # 3. Fetch full prerequisite DAG
        all_prereqs = db.query(SkillPrerequisite).all()
        prereq_graph: Dict[str, List[str]] = {} # skill -> list of required prereqs
        unlocks_graph: Dict[str, List[str]] = {} # skill -> list of downstream skills unlocked
        for p in all_prereqs:
            prereq_graph.setdefault(p.skill_id, []).append(p.prerequisite_id)
            unlocks_graph.setdefault(p.prerequisite_id, []).append(p.skill_id)

        # 4. Partition skills into Transferable, Missing, Blocked
        transferable_ids = [sid for sid in target_skill_ids if sid in possessed_skill_ids]
        missing_ids = [sid for sid in target_skill_ids if sid not in possessed_skill_ids]

        # Blocked if any prerequisite is missing from learner's mastered/developing skills
        blocked_ids = []
        ready_to_learn_ids = []
        for sid in missing_ids:
            prereqs = prereq_graph.get(sid, [])
            # If all prerequisites are possessed, skill is ready to learn
            unmet_prereqs = [p for p in prereqs if p not in possessed_skill_ids]
            if unmet_prereqs:
                blocked_ids.append(sid)
            else:
                ready_to_learn_ids.append(sid)

        total_target_count = max(1, len(target_skill_ids))
        overlap_pct = round((len(transferable_ids) / total_target_count) * 100, 1)

        # Skill names
        all_skills_cache = {s.id: s for s in db.query(Skill).all()}
        def get_name(sid: str) -> str:
            return all_skills_cache[sid].name if sid in all_skills_cache else sid

        transferable_names = [get_name(s) for s in transferable_ids]
        missing_names = [get_name(s) for s in missing_ids]
        blocked_names = [get_name(s) for s in blocked_ids]

        # Current readiness calculation grounded in skill overlap and weights
        total_weight = sum(importance_map.get(sid, 1.0) for sid in target_skill_ids) or 1.0
        earned_weight = sum(
            importance_map.get(sid, 1.0) * (1.0 if sid in mastered_skill_ids else 0.5)
            for sid in transferable_ids
        )
        current_readiness = round((earned_weight / total_weight) * 100, 1)
        target_readiness = round(min(98.0, max(current_readiness + 25.0, 92.0)), 1)

        # 5. Goal Backcasting: Topological sort of missing skills ensuring prerequisites precede downstream skills
        visited = set()
        backcasted_sequence = []
        def visit_node(n: str):
            if n not in visited:
                visited.add(n)
                for pr in prereq_graph.get(n, []):
                    if pr in target_skill_ids and pr not in possessed_skill_ids:
                        visit_node(pr)
                backcasted_sequence.append(n)

        for sid in missing_ids:
            visit_node(sid)

        # 6. Learning ROI Calculation for recommended next actions
        # Formula: ROI = (readiness_impact * prerequisite_leverage * relevance) / (estimated_hours / 10)
        # Normalized onto 0-10 scale
        roi_items = []
        for sid in missing_ids:
            skill_obj = all_skills_cache.get(sid)
            skill_name = skill_obj.name if skill_obj else sid
            weight = importance_map.get(sid, 1.0)
            
            # Prerequisite leverage: count of target skills unlocked by this skill
            downstream = unlocks_graph.get(sid, [])
            unlocked_in_target = [d for d in downstream if d in target_skill_ids and d not in possessed_skill_ids]
            prereq_leverage = len(unlocked_in_target) + 1 # base 1
            
            readiness_impact = round((weight / total_weight) * 10.0, 1)
            relevance = 1.0 if weight >= 1.0 else 0.85
            est_hours = 12 if skill_obj and skill_obj.difficulty == "Intermediate" else (16 if skill_obj and skill_obj.difficulty == "Advanced" else 8)

            raw_roi = (readiness_impact * prereq_leverage * relevance) / max(0.8, est_hours / 10.0)
            # Normalize to 0-10 scale
            normalized_roi = round(min(9.8, max(4.0, raw_roi * 1.8)), 1)

            what_unlocks_names = [get_name(d) for d in unlocked_in_target[:3]]
            why = f"Directly advances {target_title} readiness (+{round(readiness_impact * 1.5, 1)}%)"
            if unlocked_in_target:
                why += f" and unblocks {len(unlocked_in_target)} prerequisite dependencies including {what_unlocks_names[0]}."
            else:
                why += f" as a core evaluated competency."

            roi_items.append({
                "skill_id": sid,
                "skill_name": skill_name,
                "roi_score": normalized_roi,
                "readiness_impact": readiness_impact,
                "prerequisite_leverage": prereq_leverage,
                "relevance_score": relevance,
                "estimated_hours": est_hours,
                "why_it_matters": why,
                "what_it_unlocks": what_unlocks_names
            })

        roi_items.sort(key=lambda x: x["roi_score"], reverse=True)
        highest_leverage = roi_items[0] if roi_items else None

        # 7. Multi-Path Optimization: 3 genuinely calculated strategies
        hours_per_week = max(2, weekly_hours)
        total_missing_count = len(missing_ids)

        # Path A: FASTEST PATH
        # Focuses on high-leverage skills and critical backbone
        fastest_hours_per_skill = 9
        fastest_total_hours = total_missing_count * fastest_hours_per_skill
        fastest_weeks = max(2, math.ceil(fastest_total_hours / hours_per_week))
        fastest_milestones = CareerTwinEngine._build_milestones(
            backcasted_sequence, all_skills_cache, fastest_weeks, project_mode="minimal"
        )
        path_fastest = {
            "id": "fastest",
            "name": "Fastest Path",
            "description": "Streamlined route prioritizing critical prerequisites and direct requirements.",
            "estimated_weeks": fastest_weeks,
            "weekly_hours": hours_per_week,
            "current_readiness": current_readiness,
            "target_readiness": min(90.0, current_readiness + 35.0),
            "skills_count": total_missing_count,
            "projects_count": 1,
            "trade_offs": "Fastest completion time, strictly core curriculum, skips optional domain electives.",
            "milestones": fastest_milestones
        }

        # Path B: BALANCED PATH
        # Balances deep comprehension, progressive difficulty, and steady pacing
        balanced_hours_per_skill = 13
        balanced_total_hours = total_missing_count * balanced_hours_per_skill
        balanced_weeks = max(3, math.ceil(balanced_total_hours / hours_per_week))
        balanced_milestones = CareerTwinEngine._build_milestones(
            backcasted_sequence, all_skills_cache, balanced_weeks, project_mode="standard"
        )
        path_balanced = {
            "id": "balanced",
            "name": "Balanced Path",
            "description": "Recommended path balancing comprehensive competencies, assessments, and structured pace.",
            "estimated_weeks": balanced_weeks,
            "weekly_hours": hours_per_week,
            "current_readiness": current_readiness,
            "target_readiness": target_readiness,
            "skills_count": total_missing_count,
            "projects_count": 2,
            "trade_offs": "Optimal blend of retention and speed; includes milestone self-assessments and code reviews.",
            "milestones": balanced_milestones
        }

        # Path C: PORTFOLIO-FIRST PATH
        # Anchors each learning milestone around demonstrable deliverables and capstones
        portfolio_hours_per_skill = 16
        portfolio_total_hours = (total_missing_count * portfolio_hours_per_skill) + 20
        portfolio_weeks = max(4, math.ceil(portfolio_total_hours / hours_per_week))
        portfolio_milestones = CareerTwinEngine._build_milestones(
            backcasted_sequence, all_skills_cache, portfolio_weeks, project_mode="portfolio"
        )
        path_portfolio = {
            "id": "portfolio",
            "name": "Portfolio-First Path",
            "description": "Artifact-driven strategy producing deployable GitHub repositories and demonstrable proof of skill.",
            "estimated_weeks": portfolio_weeks,
            "weekly_hours": hours_per_week,
            "current_readiness": current_readiness,
            "target_readiness": min(98.0, target_readiness + 5.0),
            "skills_count": total_missing_count,
            "projects_count": 4,
            "trade_offs": "Requires 3-5 additional weeks of effort, but provides strong hiring evidence and public portfolio.",
            "milestones": portfolio_milestones
        }

        paths = [path_fastest, path_balanced, path_portfolio]
        selected_path_id = priority_mode.lower() if priority_mode.lower() in ["fastest", "balanced", "portfolio"] else "balanced"

        # 8. Transition Graph Nodes for DAG Visual
        # Demarcate MASTERED, DEVELOPING, MISSING, BLOCKED, NEWLY_UNLOCKED
        transition_nodes = []
        for sid in target_skill_ids:
            skill_obj = all_skills_cache.get(sid)
            sname = skill_obj.name if skill_obj else sid
            scat = skill_obj.category if skill_obj else "Engineering"
            prereqs = [get_name(p) for p in prereq_graph.get(sid, [])]
            unlocks = [get_name(u) for u in unlocks_graph.get(sid, []) if u in target_skill_ids]

            if sid in mastered_skill_ids:
                status = "MASTERED"
            elif sid in developing_skill_ids:
                status = "DEVELOPING"
            elif sid in blocked_ids:
                status = "BLOCKED"
            elif sid in ready_to_learn_ids:
                status = "NEWLY_UNLOCKED"
            else:
                status = "MISSING"

            transition_nodes.append({
                "skill_id": sid,
                "name": sname,
                "status": status,
                "category": scat,
                "prerequisites": prereqs,
                "unlocks": unlocks,
                "estimated_hours": 12
            })

        # 9. Grounded AI Explanation
        selected_path = next((p for p in paths if p["id"] == selected_path_id), path_balanced)
        explanation = (
            f"Based on your current {current_title} background, you have {overlap_pct}% transferable skill overlap "
            f"with {target_title}. To reach your target readiness of {selected_path['target_readiness']}%, the {selected_path['name']} "
            f"sequences {total_missing_count} skill acquisitions across {selected_path['estimated_weeks']} weeks at {hours_per_week} hours/week. "
            f"Your highest-leverage first action is '{highest_leverage['skill_name'] if highest_leverage else 'Fundamentals'}', which provides an initial readiness boost "
            f"and resolves prerequisite constraints for downstream competencies."
        )

        return {
            "current_career_id": current_career_id,
            "current_career_title": current_title,
            "target_career_id": target_career_id,
            "target_career_title": target_title,
            "current_readiness": current_readiness,
            "target_readiness": target_readiness,
            "skill_overlap_percentage": overlap_pct,
            "transferable_skills": transferable_names,
            "missing_skills": missing_names,
            "blocked_skills": blocked_names,
            "total_estimated_effort_hours": balanced_total_hours,
            "weekly_hours": hours_per_week,
            "paths": paths,
            "selected_path_id": selected_path_id,
            "highest_leverage_action": highest_leverage,
            "learning_roi_recommendations": roi_items[:5],
            "transition_graph_nodes": transition_nodes,
            "ai_explanation": explanation
        }

    @staticmethod
    def _build_milestones(sequence: List[str], cache: Dict[str, Any], total_weeks: int, project_mode: str) -> List[Dict[str, Any]]:
        if not sequence:
            return [
                {"phase": 1, "title": "Phase 1: Foundation Review", "skills": ["Python Programming"], "estimated_weeks": 2, "project": "Environment Setup"}
            ]

        # Break sequence into 3 structured phases
        n = len(sequence)
        chunk_size = max(1, math.ceil(n / 3))
        p1_skills = [cache[s].name for s in sequence[:chunk_size] if s in cache]
        p2_skills = [cache[s].name for s in sequence[chunk_size:chunk_size * 2] if s in cache]
        p3_skills = [cache[s].name for s in sequence[chunk_size * 2:] if s in cache]

        w1 = max(1, math.ceil(total_weeks * 0.3))
        w2 = max(1, math.ceil(total_weeks * 0.35))
        w3 = max(1, total_weeks - w1 - w2)

        proj1 = "Hands-on Exercise" if project_mode == "minimal" else "Core Pipeline Implementation"
        proj2 = None if project_mode == "minimal" else ("Domain Benchmarking Suite" if project_mode == "standard" else "Production Microservice Demo")
        proj3 = "Capstone Project" if project_mode != "portfolio" else "End-to-End Deployed Capstone with CI/CD"

        return [
            {
                "phase": 1,
                "title": "Phase 1: Prerequisite Unblocking & Core Foundations",
                "skills": p1_skills or ["Core Competency"],
                "estimated_weeks": w1,
                "project": proj1
            },
            {
                "phase": 2,
                "title": "Phase 2: Applied Competencies & Intermediate Modeling",
                "skills": p2_skills or ["Applied Practice"],
                "estimated_weeks": w2,
                "project": proj2
            },
            {
                "phase": 3,
                "title": "Phase 3: Advanced Specialization & Capstone Validation",
                "skills": p3_skills or ["Specialization"],
                "estimated_weeks": w3,
                "project": proj3
            }
        ]

    @staticmethod
    def explain_scenario(
        db: Session,
        profile_id: str,
        target_career_id: str,
        question: str,
        selected_path_id: str = "balanced",
        weekly_hours: int = 8
    ) -> Dict[str, Any]:
        """
        AI Explanation Engine for Career Twin scenarios.
        Uses grounded context from the simulation calculation.
        """
        simulation = CareerTwinEngine.simulate_transition(
            db, profile_id, target_career_id, weekly_hours=weekly_hours, priority_mode=selected_path_id
        )

        context = {
            "current_career": simulation["current_career_title"],
            "target_career": simulation["target_career_title"],
            "overlap_pct": simulation["skill_overlap_percentage"],
            "current_readiness": simulation["current_readiness"],
            "target_readiness": simulation["target_readiness"],
            "weekly_hours": weekly_hours,
            "selected_path": selected_path_id,
            "missing_skills": simulation["missing_skills"][:5],
            "highest_leverage": simulation["highest_leverage_action"]
        }

        # Offline / deterministic explanation template
        hl_name = simulation["highest_leverage_action"]["skill_name"] if simulation["highest_leverage_action"] else "Core fundamentals"
        
        q_lower = question.lower()
        if "why should i choose this path" in q_lower or "why this path" in q_lower:
            explanation = (
                f"The {selected_path_id.capitalize()} Path is tailored for transitioning from {simulation['current_career_title']} "
                f"to {simulation['target_career_title']} with {weekly_hours} hours/week. You already possess {simulation['skill_overlap_percentage']}% "
                f"transferable skills. This path prioritizes '{hl_name}' first because it carries the highest Learning ROI, "
                f"unlocking downstream prerequisites before tackling specialized competencies."
            )
            key_takeaways = [
                f"{simulation['skill_overlap_percentage']}% of your current abilities directly transfer.",
                f"Prerequisites are strictly backcasted to prevent getting stuck.",
                f"At {weekly_hours} hrs/week, you will reach ~{simulation['target_readiness']}% readiness."
            ]
        elif "reduce" in q_lower or "hours" in q_lower or "time" in q_lower:
            half_hours = max(2, weekly_hours // 2)
            est_doubled = simulation["paths"][1]["estimated_weeks"] * 2
            explanation = (
                f"If you reduce your commitment from {weekly_hours} hrs/week to {half_hours} hrs/week, your required study time "
                f"extends proportionally to approximately {est_doubled} weeks. However, your prerequisite dependency order remains "
                f"unchanged—starting with '{hl_name}' ensures you maintain momentum without cognitive overload."
            )
            key_takeaways = [
                f"Timeline scales inversely with weekly study hours.",
                "Prerequisite ordering and Learning ROI rankings remain valid.",
                "Consider the Fastest Path strategy if timeline is a primary constraint."
            ]
        elif "missing" in q_lower or "gap" in q_lower:
            missing_str = ", ".join(simulation["missing_skills"][:3])
            explanation = (
                f"The critical gaps identified for {simulation['target_career_title']} are {missing_str}. "
                f"These represent skills not yet evidenced in your profile. PathFinder's backcasting engine schedules "
                f"prerequisites first so you build the necessary foundation before encountering complex topics."
            )
            key_takeaways = [
                f"Top missing competencies: {missing_str}.",
                "Blocked skills are gated until prerequisites are mastered.",
                "Completing targeted assessments will immediately update this graph."
            ]
        elif "faster" in q_lower or "accelerate" in q_lower:
            fastest = simulation["paths"][0]
            explanation = (
                f"Yes, by switching to the Fastest Path strategy ({fastest['estimated_weeks']} weeks at {weekly_hours} hrs/week), "
                f"you concentrate strictly on essential prerequisite chains and core requirements. Alternatively, increasing study "
                f"to 12 hrs/week reduces total calendar time by ~33%."
            )
            key_takeaways = [
                f"Fastest Path finishes in ~{fastest['estimated_weeks']} weeks.",
                "Focuses strictly on essential prerequisites and required skills.",
                "Increase weekly hours to 10–12 to accelerate further."
            ]
        else:
            explanation = (
                f"PathFinder Career Twin evaluates your transition from {simulation['current_career_title']} to {simulation['target_career_title']}. "
                f"With a {simulation['skill_overlap_percentage']}% overlap, your shortest intelligent route starts with {hl_name}, "
                f"progressing through structured milestones to reach {simulation['target_readiness']}% readiness."
            )
            key_takeaways = [
                f"Current readiness: {simulation['current_readiness']}%, Target: {simulation['target_readiness']}%.",
                f"Weekly workload: {weekly_hours} hours/week across {simulation['paths'][1]['estimated_weeks']} weeks.",
                f"Highest leverage action: {hl_name}."
            ]

        suggested_questions = [
            "Why should I choose this path?",
            "What happens if I reduce my study time to 4 hours/week?",
            "Why is this skill missing from my profile?",
            "Can I reach this career faster?",
            "What should I focus on this week?"
        ]

        return {
            "explanation": explanation,
            "key_takeaways": key_takeaways,
            "suggested_questions": suggested_questions
        }
