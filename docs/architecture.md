# PATHFINDER AI — System Architecture

## High-Level Architecture Overview

PathFinder AI follows a modular, decoupled full-stack architecture designed for maximum performance, determinism, and reliability.

```mermaid
flowchart TD
    subgraph Frontend ["Frontend (React 18 + TS + Vite)"]
        UI[User Interface & Dashboard]
        RQ[TanStack React Query]
        RF[React Flow Knowledge Graph]
        RC[Recharts Analytics]
        LC[Learner Context & State]
    end

    subgraph Backend ["Backend (FastAPI Layer)"]
        API[FastAPI Routers]
        NLP[Layer 1: NLP Profile Parser]
        GE[Skill Gap Engine]
        RE[Hybrid Recommendation Engine]
        RM[Topological Roadmap Engine]
        AE[Adaptive Replanning Engine]
        SE[What-if Simulator Engine]
        CO[Contextual AI Copilot]
        LLM[LLM Client & Offline Fallback]
    end

    subgraph Database ["Persistence Layer"]
        DB[(PostgreSQL / SQLite ORM)]
    end

    UI <--> RQ <--> API
    API --> NLP
    API --> GE
    API --> RE
    API --> RM
    API --> AE
    API --> SE
    API --> CO
    
    GE & RE & RM & AE & SE & CO <--> DB
    NLP & RE & CO <--> LLM
```

---

## Technical Component Breakdown

### 1. Frontend Layer
- **Framework**: React 18, TypeScript, Vite.
- **Styling**: Vanilla Tailwind CSS v3 with sleek SaaS color palette (`#FAFAFA` neutral, `#FFFFFF` surfaces, `#4F46E5` indigo accent).
- **Knowledge Graph**: `@xyflow/react` for rendering prerequisite DAGs.
- **Analytics & Readiness**: `recharts` for semi-circle readiness gauges and skill growth curves.
- **State & Server Sync**: `@tanstack/react-query` for API caching and pessimistic background invalidation.

### 2. Backend API & Service Layer
- **Framework**: FastAPI (Python 3.10+) with Pydantic v2 validation.
- **Deterministic Services**:
  - `SkillGapEngine`: Deterministically calculates skill status (`MASTERED`, `DEVELOPING`, `MISSING`, `LOCKED`, `RECOMMENDED`).
  - `ReadinessEngine`: Computes $0.5 \times \text{Mastered} + 0.3 \times \text{Developing} + 0.2 \times \text{Prerequisite Completion}$.
  - `TopologicalRoadmapEngine`: Performs DAG topological sorting on missing skills respecting prerequisite edges.
  - `AdaptiveLearningEngine`: Re-evaluates gaps upon assessment submission or 5-tier confidence feedback.
  - `SimulatorEngine`: Computes skill overlap % and transition timelines.
- **AI Integration**:
  - `LLMClient`: Unified LLM wrapper supporting OpenAI / Gemini with structured Pydantic schema parsing and automatic failover to `OfflineFallbackEngine`.

### 3. Persistence & Data Layer
- **ORM**: SQLAlchemy 2.0.
- **Database**: Supabase PostgreSQL / SQLite zero-config fallback.
- **Data Models**: `User`, `LearnerProfile`, `Skill`, `Career`, `CareerSkill`, `SkillPrerequisite`, `LearnerSkill`, `Resource`, `Project`, `LearningPath`, `PathStep`, `Assessment`, `AssessmentQuestion`, `AssessmentResult`, `Feedback`, `ChatMessage`.
