import datetime
import uuid
from sqlalchemy.orm import Session
from backend.models.domain import (
    User, LearnerProfile, Skill, Career, CareerSkill, SkillPrerequisite,
    LearnerSkill, Resource, Project, LearningPath, PathStep, Assessment, AssessmentQuestion
)
from backend.seed.seed_data import (
    CAREERS_SEED, SKILLS_SEED, PREREQUISITES_SEED, RESOURCES_SEED,
    PROJECTS_SEED, ASSESSMENTS_SEED, DEMO_USER_ID, DEMO_PROFILE_ID
)

def init_seed_database(db: Session):
    """Seed database with careers, skills, prerequisites, resources, projects, and demo learner."""
    # 1. Seed Skills
    for s in SKILLS_SEED:
        existing = db.query(Skill).filter(Skill.id == s["id"]).first()
        if not existing:
            skill = Skill(
                id=s["id"],
                name=s["name"],
                category=s["category"],
                difficulty=s["difficulty"],
                description=s["description"]
            )
            db.add(skill)
    db.commit()

    # 2. Seed Prerequisites
    for skill_id, prereq_id, rel_type in PREREQUISITES_SEED:
        existing = db.query(SkillPrerequisite).filter(
            SkillPrerequisite.skill_id == skill_id,
            SkillPrerequisite.prerequisite_id == prereq_id
        ).first()
        if not existing:
            edge = SkillPrerequisite(
                id=f"prereq_{skill_id}_{prereq_id}",
                skill_id=skill_id,
                prerequisite_id=prereq_id,
                relationship_type=rel_type
            )
            db.add(edge)
    db.commit()

    # 3. Seed Careers & CareerSkills
    for c in CAREERS_SEED:
        career = db.query(Career).filter(Career.id == c["id"]).first()
        if not career:
            career = Career(
                id=c["id"],
                title=c["title"],
                description=c["description"],
                icon=c["icon"],
                category=c["category"]
            )
            db.add(career)
            db.commit()

        for skill_id, req_prof, weight in c["skills"]:
            existing_cs = db.query(CareerSkill).filter(
                CareerSkill.career_id == c["id"],
                CareerSkill.skill_id == skill_id
            ).first()
            if not existing_cs:
                cs = CareerSkill(
                    id=f"cs_{c['id']}_{skill_id}",
                    career_id=c["id"],
                    skill_id=skill_id,
                    required_proficiency=req_prof,
                    importance_weight=weight
                )
                db.add(cs)
    db.commit()

    # 4. Seed Resources
    for r in RESOURCES_SEED:
        existing_res = db.query(Resource).filter(Resource.id == r["id"]).first()
        if not existing_res:
            res = Resource(
                id=r["id"],
                skill_id=r["skill_id"],
                title=r["title"],
                provider=r["provider"],
                type=r["type"],
                difficulty=r["difficulty"],
                duration_minutes=r["duration_minutes"],
                url=r.get("url"),
                why_this=r.get("why_this")
            )
            db.add(res)
    db.commit()

    # 5. Seed Projects
    for p in PROJECTS_SEED:
        existing_p = db.query(Project).filter(Project.id == p["id"]).first()
        if not existing_p:
            proj = Project(
                id=p["id"],
                skill_id=p["skill_id"],
                title=p["title"],
                objective=p["objective"],
                difficulty=p["difficulty"],
                estimated_hours=p["estimated_hours"],
                deliverables=p["deliverables"],
                portfolio_value=p["portfolio_value"]
            )
            db.add(proj)
    db.commit()

    # 6. Seed Assessments & Questions
    for a in ASSESSMENTS_SEED:
        existing_a = db.query(Assessment).filter(Assessment.id == a["id"]).first()
        if not existing_a:
            asm = Assessment(
                id=a["id"],
                skill_id=a["skill_id"],
                title=a["title"],
                description=a.get("description")
            )
            db.add(asm)
            db.commit()

            for q in a["questions"]:
                q_obj = AssessmentQuestion(
                    id=f"{a['id']}_{q['id']}",
                    assessment_id=a["id"],
                    question_text=q["question_text"],
                    options=q["options"],
                    correct_option_index=q["correct_option_index"],
                    explanation=q["explanation"]
                )
                db.add(q_obj)
    db.commit()

    # 7. Seed Demo User ("Alex")
    demo_user = db.query(User).filter(User.id == DEMO_USER_ID).first()
    if not demo_user:
        demo_user = User(
            id=DEMO_USER_ID,
            email="alex.demo@pathfinder.ai",
            name="Alex Morgan",
            first_name="Alex",
            last_name="Morgan",
            college_name="Stanford University",
            is_onboarded=True
        )
        db.add(demo_user)
        db.commit()

    demo_profile = db.query(LearnerProfile).filter(LearnerProfile.id == DEMO_PROFILE_ID).first()
    if not demo_profile:
        demo_profile = LearnerProfile(
            id=DEMO_PROFILE_ID,
            user_id=DEMO_USER_ID,
            target_career_id="c_ai_engineer",
            experience_level="Intermediate",
            weekly_hours=8,
            timeline_months=6,
            learning_preference="Project Based",
            raw_onboarding_input="I'm a CSE student with Python and SQL experience. I have done two ML projects and want to become an AI Engineer within six months.",
            readiness_score=64.0
        )
        db.add(demo_profile)
        db.commit()

        # Seed initial skills for Alex:
        # Python: MASTERED
        # SQL: MASTERED
        # NumPy: MASTERED
        # Pandas: MASTERED
        # Stats: DEVELOPING
        # ML: DEVELOPING
        # Model Evaluation: DEVELOPING (current next milestone)
        demo_skills = [
            ("s_python", "Intermediate", "High", "MASTERED", "Completed core coursework and projects"),
            ("s_sql", "Intermediate", "High", "MASTERED", "Built relational database backend"),
            ("s_numpy", "Intermediate", "Medium", "MASTERED", "Used in ML projects"),
            ("s_pandas", "Intermediate", "Medium", "MASTERED", "Data cleaning experience"),
            ("s_stats", "Beginner", "Medium", "DEVELOPING", "Basic statistics knowledge"),
            ("s_ml", "Beginner", "Medium", "DEVELOPING", "Completed introduction to ML"),
            ("s_supervised_learning", "Beginner", "Medium", "DEVELOPING", "Built basic classification models"),
            ("s_model_eval", "Beginner", "Low", "RECOMMENDED", "Needs practical metric evaluation training")
        ]
        for skill_id, prof, conf, status, ev in demo_skills:
            ls = LearnerSkill(
                id=f"ls_{DEMO_PROFILE_ID}_{skill_id}",
                profile_id=DEMO_PROFILE_ID,
                skill_id=skill_id,
                proficiency=prof,
                confidence=conf,
                status=status,
                evidence=ev
            )
            db.add(ls)
        db.commit()

    return True
