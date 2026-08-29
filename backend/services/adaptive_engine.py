import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.models.domain import (
    LearnerProfile, LearnerSkill, Assessment, AssessmentResult, Feedback, PathStep, LearningPath
)
from backend.services.skill_gap_engine import SkillGapEngine
from backend.services.roadmap_engine import RoadmapEngine

class AdaptiveLearningEngine:

    @staticmethod
    def process_assessment_result(db: Session, profile_id: str, assessment_id: str, answers: Dict[str, int]) -> Dict[str, Any]:
        """
        Assessment-Driven Adaptation Engine.
        Evaluates answers, updates skill proficiency/confidence, triggers adaptive path replanning if score is low or high.
        """
        assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
        if not assessment:
            raise ValueError("Assessment not found")

        total_q = len(assessment.questions)
        correct_count = 0
        weak_skills = []
        strong_skills = []

        for q in assessment.questions:
            selected = answers.get(q.id)
            if selected is not None and selected == q.correct_option_index:
                correct_count += 1
            else:
                weak_skills.append(assessment.skill_id)

        score_percentage = round((correct_count / total_q) * 100, 1) if total_q > 0 else 100.0
        passed = score_percentage >= 70.0

        if passed:
            strong_skills.append(assessment.skill_id)

        # Record Result
        res = AssessmentResult(
            id=f"res_{profile_id}_{assessment_id}_{int(datetime.datetime.utcnow().timestamp())}",
            profile_id=profile_id,
            assessment_id=assessment_id,
            score_percentage=score_percentage,
            passed=passed,
            weak_skills=weak_skills,
            strong_skills=strong_skills
        )
        db.add(res)
        db.commit()

        # Update Learner Model State
        ls = db.query(LearnerSkill).filter(
            LearnerSkill.profile_id == profile_id,
            LearnerSkill.skill_id == assessment.skill_id
        ).first()

        if not ls:
            ls = LearnerSkill(
                id=f"ls_{profile_id}_{assessment.skill_id}",
                profile_id=profile_id,
                skill_id=assessment.skill_id
            )
            db.add(ls)

        if score_percentage >= 85.0:
            ls.proficiency = "Intermediate"
            ls.confidence = "High"
            ls.status = "MASTERED"
            ls.evidence = f"Passed Assessment ({score_percentage}%)"
            recommendation_msg = "Outstanding performance! Advanced to next roadmap phase."
        elif score_percentage >= 70.0:
            ls.proficiency = "Intermediate"
            ls.confidence = "Medium"
            ls.status = "MASTERED"
            ls.evidence = f"Passed Assessment ({score_percentage}%)"
            recommendation_msg = "Good job! You've mastered this skill. Moving to next topic."
        else:
            ls.confidence = "Low"
            ls.status = "DEVELOPING"
            ls.evidence = f"Assessment score {score_percentage}%. Needs remediation."
            recommendation_msg = f"Weak concept detected in {assessment.skill.name if assessment.skill else 'this topic'}. Remediation practice added to your path."

        ls.last_updated = datetime.datetime.utcnow()
        db.commit()

        # Recalculate Gaps & Replan Path
        SkillGapEngine.analyze_gaps(db, profile_id)
        RoadmapEngine.generate_roadmap(db, profile_id)

        return {
            "result_id": res.id,
            "score_percentage": score_percentage,
            "passed": passed,
            "weak_skills": weak_skills,
            "strong_skills": strong_skills,
            "recommendation": recommendation_msg
        }

    @staticmethod
    def process_feedback(db: Session, profile_id: str, skill_id: str, sentiment: str, comment: str = None) -> Dict[str, Any]:
        """
        Feedback-Driven Adaptation Loop.
        Accepts: Struggling, Need Practice, Comfortable, Confident, Too Easy.
        Dynamically adapts skill status & roadmap.
        """
        fb = Feedback(
            id=f"fb_{profile_id}_{skill_id}_{int(datetime.datetime.utcnow().timestamp())}",
            profile_id=profile_id,
            skill_id=skill_id,
            sentiment=sentiment,
            comment=comment
        )
        db.add(fb)

        ls = db.query(LearnerSkill).filter(
            LearnerSkill.profile_id == profile_id,
            LearnerSkill.skill_id == skill_id
        ).first()

        if not ls:
            ls = LearnerSkill(
                id=f"ls_{profile_id}_{skill_id}",
                profile_id=profile_id,
                skill_id=skill_id
            )
            db.add(ls)

        path_updated = False
        if sentiment in ["Too Easy", "Confident"]:
            ls.status = "MASTERED"
            ls.confidence = "High"
            ls.evidence = f"User feedback: {sentiment}"
            path_updated = True
        elif sentiment in ["Struggling", "Need Practice"]:
            ls.status = "DEVELOPING"
            ls.confidence = "Low"
            ls.evidence = f"User feedback: {sentiment} - remediation requested"
            path_updated = True
        elif sentiment == "Comfortable":
            ls.status = "MASTERED"
            ls.confidence = "Medium"

        ls.last_updated = datetime.datetime.utcnow()
        db.commit()

        if path_updated:
            SkillGapEngine.analyze_gaps(db, profile_id)
            RoadmapEngine.generate_roadmap(db, profile_id)

        return {
            "status": "success",
            "message": f"Feedback received. Updated profile confidence for this skill.",
            "path_updated": path_updated
        }
