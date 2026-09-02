"""
Deterministic Offline Fallback Engine for PathFinder AI
Provides offline capability for NLP profile extraction, recommendation explanations,
and grounded copilot answers if the external LLM provider is unavailable or lacks an API key.
"""

import re
from typing import List, Dict, Any

class OfflineFallbackEngine:

    @staticmethod
    def extract_profile_from_text(text: str) -> Dict[str, Any]:
        """Deterministic keyword extraction for onboarding profile parsing."""
        text_lower = text.lower()

        # Skill detection dictionary
        skill_keywords = {
            "s_python": ["python", "py"],
            "s_sql": ["sql", "postgres", "mysql", "database", "queries"],
            "s_numpy": ["numpy", "arrays", "vectors"],
            "s_pandas": ["pandas", "dataframe", "data wrangling"],
            "s_stats": ["statistics", "stats", "probability", "p-value"],
            "s_ml": ["machine learning", "ml", "scikit-learn", "sklearn"],
            "s_supervised_learning": ["supervised", "classification", "regression", "xgboost", "random forest"],
            "s_deep_learning": ["deep learning", "neural network", "neural nets"],
            "s_pytorch": ["pytorch", "torch"],
            "s_fastapi": ["fastapi", "flask", "django", "rest api"],
            "s_docker": ["docker", "container", "containers"],
            "s_react": ["react", "react.js", "frontend"],
            "s_typescript": ["typescript", "ts"],
            "s_html_css": ["html", "css", "web development"]
        }

        extracted_skills = []
        for skill_id, keywords in skill_keywords.items():
            for kw in keywords:
                if kw in text_lower:
                    # Estimate level
                    level = "Beginner"
                    if any(adv in text_lower for adv in ["advanced", "expert", "built", "projects", "experience", "intermediate"]):
                        level = "Intermediate"
                    
                    skill_name_map = {
                        "s_python": "Python Programming", "s_sql": "SQL & Relational Databases",
                        "s_numpy": "NumPy", "s_pandas": "Pandas Data Wrangling",
                        "s_stats": "Statistics & Probability", "s_ml": "Machine Learning Fundamentals",
                        "s_supervised_learning": "Supervised Learning", "s_deep_learning": "Deep Learning Principles",
                        "s_pytorch": "PyTorch Framework", "s_fastapi": "FastAPI & REST APIs",
                        "s_docker": "Docker & Containerization", "s_react": "React.js",
                        "s_typescript": "TypeScript", "s_html_css": "HTML5 & CSS3"
                    }
                    extracted_skills.append({
                        "name": skill_name_map.get(skill_id, skill_id),
                        "level": level
                    })
                    break

        # Career role detection
        target_role = "AI Engineer"
        if "data scientist" in text_lower or "data science" in text_lower:
            target_role = "Data Scientist"
        elif "full stack" in text_lower or "web developer" in text_lower or "react" in text_lower:
            target_role = "Full Stack Developer"
        elif "data analyst" in text_lower or "tableau" in text_lower:
            target_role = "Data Analyst"
        elif "cloud" in text_lower or "aws" in text_lower or "devops" in text_lower:
            target_role = "Cloud Engineer"
        elif "security" in text_lower or "cyber" in text_lower or "pentest" in text_lower:
            target_role = "Cybersecurity Engineer"

        # Time extraction
        weekly_hours = 8
        hours_match = re.search(r'(\d+)\s*(?:hours|hrs|hr)', text_lower)
        if hours_match:
            weekly_hours = int(hours_match.group(1))

        # Preference extraction
        learning_pref = "Project Based"
        if "video" in text_lower or "watch" in text_lower:
            learning_pref = "Video"
        elif "read" in text_lower or "book" in text_lower or "article" in text_lower:
            learning_pref = "Reading"

        return {
            "target_role": target_role,
            "experience_level": "Intermediate" if len(extracted_skills) >= 3 else "Beginner",
            "skills": extracted_skills if extracted_skills else [{"name": "Python Programming", "level": "Beginner"}],
            "interests": [target_role],
            "weekly_hours": max(2, min(40, weekly_hours)),
            "timeline_months": 6,
            "learning_preference": learning_pref,
            "extracted_summary": f"Identified target career as {target_role} with {len(extracted_skills)} initial skills detected from onboarding description."
        }

    @staticmethod
    def generate_explanation(skill_name: str, status: str, prereqs: List[str], target_career: str) -> str:
        """Deterministic explanation generator for 'Why This?' recommendation cards."""
        if prereqs:
            prereq_str = ", ".join(prereqs)
            return (
                f"You have satisfied the prerequisites ({prereq_str}). "
                f"Mastering '{skill_name}' directly addresses a critical requirement for your target goal as an {target_career} "
                f"and unlocks advanced downstream topics on your personalized path."
            )
        else:
            return (
                f"'{skill_name}' is a foundational prerequisite for {target_career}. "
                f"Completing this milestone establishes the core computational concepts needed before moving into specialized modules."
            )

    @staticmethod
    def generate_copilot_response(user_query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Context-grounded copilot response generation."""
        q_lower = user_query.lower()
        profile = context.get("profile", {})
        readiness = context.get("readiness_score", 64.0)
        target_career = context.get("target_career", "AI Engineer")
        next_action = context.get("next_action", {})
        missing_skills = context.get("missing_skills", [])

        if "what should i learn" in q_lower or "focus" in q_lower or "today" in q_lower:
            act_title = next_action.get("title", "Model Evaluation")
            return {
                "reply": f"Based on your current {target_career} path, your top priority for today is: **{act_title}** ({next_action.get('estimated_minutes', 45)} mins). Completing this milestone resolves a current gap and unlocks the next phase of your roadmap.",
                "suggested_actions": ["Start Next Action", "View Roadmap", "Why is this recommended?"]
            }
        elif "why" in q_lower or "reason" in q_lower:
            return {
                "reply": f"Your current readiness score for **{target_career}** is **{readiness:.0f}%**. We recommend focusing on your developing skills first because prerequisite relationships block downstream advanced modules like Deep Learning and MLOps.",
                "suggested_actions": ["Show Skill Graph", "Take Assessment", "Simulate Career"]
            }
        elif "skip" in q_lower:
            return {
                "reply": f"You can skip foundational steps if you take a micro-assessment to demonstrate proficiency ($\ge 85\%$). However, skipping key prerequisites without assessment evidence risks struggling on advanced capstone projects.",
                "suggested_actions": ["Take Assessment", "View Prerequisites"]
            }
        elif "project" in q_lower or "build" in q_lower:
            role_projects = {
                "Data Scientist": "the **Customer Churn Analysis** (EDA & ML) followed by the **Sales Forecasting Pipeline** (Feature Engineering).",
                "Full Stack Developer": "the **Interactive SaaS Collaboration Platform** (React & TypeScript) followed by the **Scalable RESTful Backend Microservices** (Node.js & PostgreSQL).",
                "Data Analyst": "the **E-Commerce Relational Analytics Pipeline** (SQL) followed by the **Executive Business Intelligence KPI Dashboard** (Tableau/PowerBI).",
                "Cloud Engineer": "the **Resilient Multi-Tier AWS Infrastructure** (VPC & EC2) followed by the **Containerized Microservice Kubernetes Deployment** (Docker & K8s).",
                "Cybersecurity Engineer": "the **Zero-Trust Cloud IAM & Network Security Audit** followed by the **Vulnerability Assessment Lab**."
            }
            rec = role_projects.get(target_career, "the **Customer Churn Prediction Engine** (XGBoost) followed by the **Production ML Inference Microservice** with Docker & FastAPI.")
            return {
                "reply": f"To build portfolio evidence for **{target_career}**, we recommend {rec}",
                "suggested_actions": ["View Recommended Projects", "Start Next Milestone"]
            }
        else:
            missing_str = ", ".join(missing_skills[:3]) if missing_skills else "advanced topics"
            return {
                "reply": f"As an aspiring **{target_career}** with **{readiness:.0f}% readiness**, your next best leverage comes from mastering: {missing_str}. Follow your customized roadmap to systematically close these gaps.",
                "suggested_actions": ["View Roadmap", "Check Skill Gaps", "What-if Simulator"]
            }
