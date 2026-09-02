import json
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def run_all_backend_tests():
    print("=== STARTING PATHFINDER AI BACKEND VERIFICATION ===")

    # 1. Health Check
    res = client.get("/")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[PASS] Health Check Passed:", res.json()["service"])

    # 1b. User Signup & Login Verification
    import uuid
    test_email = f"student_{uuid.uuid4().hex[:6]}@college.edu"
    res = client.post("/api/auth/signup", json={
        "first_name": "Test",
        "last_name": "Student",
        "college_name": "MIT",
        "email": test_email,
        "password": "securepassword123"
    })
    assert res.status_code == 200, f"Signup failed: {res.text}"
    auth_data = res.json()
    assert "token" in auth_data
    print("[PASS] Auth Signup Endpoint Passed | Token generated for:", auth_data["email"])

    res = client.post("/api/auth/login", json={
        "email": test_email,
        "password": "securepassword123"
    })
    assert res.status_code == 200, f"Login failed: {res.text}"
    print("[PASS] Auth Login Endpoint Passed | Authenticated user:", auth_data["first_name"])

    # 2. Layer 1 NLP Profile Extraction
    res = client.post("/api/profile/analyze", json={
        "natural_language_input": "I'm a CSE student with Python and SQL experience. I want to become an AI Engineer within 6 months."
    })
    assert res.status_code == 200, f"Profile analyze failed: {res.text}"
    data = res.json()
    assert data["target_role"] == "AI Engineer"
    print("[PASS] Layer 1 NLP Profile Extraction Passed:", data["target_role"], "| Skills found:", len(data["skills"]))

    # 3. Profile Update
    res = client.post("/api/profile/update", json={
        "target_career_id": "c_ai_engineer",
        "experience_level": "Intermediate",
        "weekly_hours": 8,
        "timeline_months": 6,
        "learning_preference": "Project Based",
        "skills": [{"name": "Python Programming", "level": "Intermediate"}, {"name": "SQL & Relational Databases", "level": "Intermediate"}]
    })
    assert res.status_code == 200
    print("[PASS] Profile Update & Path Generation Trigger Passed")

    # 4. Dashboard Endpoint
    res = client.get("/api/dashboard")
    assert res.status_code == 200
    dash = res.json()
    assert "readiness_score" in dash
    assert "next_best_action" in dash
    print("[PASS] Dashboard Endpoint Passed | Readiness Score:", dash["readiness_score"], "% | Next Action:", dash["next_best_action"]["skill_name"])

    # 5. Current Roadmap Endpoint
    res = client.get("/api/paths/current")
    assert res.status_code == 200
    path = res.json()
    assert len(path["steps"]) > 0
    print("[PASS] Deterministic Topological Roadmap Passed | Total Steps:", path["total_steps"])

    # 6. Skill Gap Analysis
    res = client.get("/api/skills/gaps")
    assert res.status_code == 200
    gaps = res.json()
    print("[PASS] Skill Gap Analysis Passed | Mastered:", len(gaps["mastered"]), "| Developing:", len(gaps["developing"]), "| Missing/Locked:", len(gaps["missing"]) + len(gaps["locked"]))

    # 7. Careers Knowledge Base
    res = client.get("/api/careers")
    assert res.status_code == 200
    careers = res.json()
    assert len(careers) >= 6
    print("[PASS] Careers Knowledge Base Passed | Total Roles:", len(careers))

    # 8. What-if Career Simulator
    res = client.post("/api/careers/simulate", json={"target_career_id": "c_data_scientist"})
    assert res.status_code == 200
    sim = res.json()
    print("[PASS] What-if Career Simulator Passed | Overlap:", sim["skill_overlap_percentage"], "% | Addl Effort:", sim["estimated_additional_weeks"], "weeks")

    # 9. Assessment Evaluation
    res = client.post("/api/assessment/evaluate", json={
        "assessment_id": "a_model_eval",
        "answers": {"a_model_eval_q1": 1, "a_model_eval_q2": 1, "a_model_eval_q3": 1}
    })
    assert res.status_code == 200
    eval_res = res.json()
    print("[PASS] Assessment Evaluation Passed | Score:", eval_res["score_percentage"], "% | Passed:", eval_res["passed"])

    # 10. Feedback Submission & Adaptive Replanning
    res = client.post("/api/feedback", json={
        "skill_id": "s_model_eval",
        "sentiment": "Too Easy",
        "comment": "Fast forwarding to deep learning"
    })
    assert res.status_code == 200
    fb_res = res.json()
    assert fb_res["path_updated"] == True
    print("[PASS] Adaptive Feedback Loop Passed | Path Updated:", fb_res["path_updated"])

    # 11. Grounded Copilot Chat
    res = client.post("/api/chat", json={"message": "What should I learn today?"})
    assert res.status_code == 200
    chat_res = res.json()
    assert "reply" in chat_res
    print("[PASS] Grounded AI Copilot Passed | Reply snippet:", chat_res["reply"][:60], "...")

    # 12. Career Twin Intelligent Transition Simulator
    res = client.post("/api/career-twin/simulate", json={
        "target_career_id": "c_data_scientist",
        "weekly_hours": 8,
        "target_timeline_months": 6,
        "priority_mode": "BALANCED"
    })
    assert res.status_code == 200, f"Career Twin simulate failed: {res.text}"
    ct_data = res.json()
    assert len(ct_data["paths"]) == 3, "Expected 3 multi-path strategies"
    assert "highest_leverage_action" in ct_data
    assert "learning_roi_recommendations" in ct_data
    assert ct_data["highest_leverage_action"]["roi_score"] > 0
    print("[PASS] Career Twin Simulator Passed | Overlap:", ct_data["skill_overlap_percentage"], "% | 3 Paths:", [p["name"] for p in ct_data["paths"]])

    # 13. Career Twin Grounded AI Explanation
    res = client.post("/api/career-twin/explain", json={
        "target_career_id": "c_data_scientist",
        "question": "Why should I choose this path?",
        "selected_path_id": "balanced",
        "weekly_hours": 8
    })
    assert res.status_code == 200, f"Career Twin explain failed: {res.text}"
    exp_data = res.json()
    assert "explanation" in exp_data
    assert len(exp_data["key_takeaways"]) > 0
    print("[PASS] Career Twin Grounded AI Explanation Passed | Snippet:", exp_data["explanation"][:60], "...")

    # 14. Role-Specific Career Switching & Roadmap Generation
    res = client.post("/api/profile/career", json={"career_id": "c_fullstack_dev"})
    assert res.status_code == 200, f"Career switch failed: {res.text}"
    res = client.get("/api/paths/current")
    assert res.status_code == 200
    fs_path = res.json()
    assert fs_path["career_id"] == "c_fullstack_dev"
    assert "Full Stack Developer" in fs_path["career_title"]
    fs_skills = [s["skill_name"] for s in fs_path["steps"]]
    assert any("React" in s or "HTML" in s or "TypeScript" in s for s in fs_skills)
    print(f"[PASS] Role-Specific Roadmap Generation Passed | Role: Full Stack Developer | Steps: {len(fs_path['steps'])} | First skills: {fs_skills[:3]}")

    print("=== ALL BACKEND TESTS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    run_all_backend_tests()

