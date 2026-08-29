# PATHFINDER AI — AI/ML Architecture & Strategy

PathFinder AI enforces a strict boundary between **deterministic business logic** and **AI natural language intelligence**. 

> **Core Philosophy**: The LLM provides natural-language understanding, reasoning, and explanations, while structured learner state, career requirements, prerequisite relationships, and deterministic recommendation logic maintain consistency, ordering, and explainability.

---

## AI Architecture Pipeline

```
Learner Input ("CSE student, Python/SQL...")
       │
       ▼
┌───────────────────────────────┐
│ Layer 1: NLP Profile Parser   │ ◄── Structured JSON extraction (Pydantic / OpenAI / Fallback)
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ Live Learner Model State      │ ◄── Persistent database state (Proficiency, Confidence, Evidence)
└──────────────┬────────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
┌──────────────┐ ┌──────────────┐
│ Career Base  │ │ Skill Graph  │ ◄── 40+ Skills & 50+ Prerequisite DAG Edges
└──────┬───────┘ └──────┬───────┘
       │                │
       └───────┬────────┘
               ▼
┌───────────────────────────────┐
│ Skill Gap & Readiness Engine  │ ◄── Deterministic formula calculation
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ Hybrid Recommendation Engine  │ ◄── Weighted scoring algorithm (Gap, Career, Prereqs, Time, Fit)
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ Prerequisite-Aware Roadmap    │ ◄── Topological DAG Sort into 5 phases
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ Explainable AI ("Why This?")  │ ◄── Contextual explanation engine
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ Micro-Assessments & Feedback │ ◄── Assessment scoring & 5-tier confidence feedback
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ Adaptive Replanning Engine    │ ◄── Re-computes gaps & re-ranks roadmap topologically
└───────────────────────────────┘
```

---

## Component Breakdown

### 1. Natural Language Profile Parser
- **Type**: AI Structured JSON Extractor
- **Function**: Takes unstructured conversational text and extracts `target_role`, `experience_level`, `skills` (with levels), `weekly_hours`, `timeline_months`, and `learning_preference`.
- **Offline Fallback**: Regex keyword matcher for offline execution.

### 2. Deterministic Skill Gap Engine
- **Type**: Deterministic Business Logic
- **Function**: Compares Learner Skills against Career Required Skills. Categorizes skills into `MASTERED`, `DEVELOPING`, `MISSING`, `LOCKED`, and `RECOMMENDED`.

### 3. Career Readiness Score Engine
- **Type**: Mathematical Formula
- **Formula**:
  $$\text{Readiness} = (0.5 \times \text{Mastered Ratio} + 0.3 \times \text{Developing Contribution} + 0.2 \times \text{Prerequisite Completion}) \times 100$$
- **Note**: Interpretable estimate of learning readiness, explicitly not job probability or salary prediction.

### 4. Hybrid Recommendation Engine
- **Type**: Multi-Factor Weighted Scoring Algorithm
- **Weights**:
  - 30% Skill Gap Relevance
  - 20% Career Relevance
  - 15% Prerequisite Readiness
  - 10% Difficulty Fit
  - 10% Learning Preference
  - 10% Time Fit
  - 5% Progress & Feedback History

### 5. Deterministic Topological Roadmap Generator
- **Type**: Graph DAG Topological Sorting Algorithm
- **Function**: Orders missing/developing skills strictly respecting prerequisite dependencies. Groups steps into 5 structured learning phases.

### 6. Grounded AI Career Copilot
- **Type**: RAG-Lite Context-Grounded AI Assistant
- **Function**: Answers user queries by injecting current live learner context (Readiness, Missing Skills, Next Action, Target Career) into LLM system prompts.

### 7. Offline Fallback System
- **Type**: Fail-Safe Abstraction Layer (`backend/ai/fallback_engine.py`)
- **Function**: Ensures 100% of application capabilities (Onboarding, Skill Gap, Readiness, Roadmap, Assessments, Simulator, Copilot) remain operational even if LLM provider key is absent or network fails.
