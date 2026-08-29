# PATHFINDER AI — Hybrid Recommendation & Topological Roadmap Methodology

## Why Hybrid Recommendation over Pure LLM Generation?

Pure LLM course recommendation platforms suffer from three severe flaws:
1. **Hallucination & Inconsistent Prerequisites**: Asking an LLM to order 20 complex technical skills often produces invalid prerequisite ordering (e.g. recommending PyTorch before Python).
2. **Opacity ("Black Box")**: LLMs cannot provide transparent, mathematically reproducible explanations for why a step was ranked over another.
3. **Lack of Adaptability**: LLMs do not maintain a live mathematical model of learner confidence over time.

PathFinder AI resolves this by separating **prerequisite graph topology** and **hybrid scoring** from natural language reasoning.

---

## The Hybrid Recommendation Algorithm

```
Learner State
      ↓
Career Requirements
      ↓
Skill Gap Classification (Mastered, Developing, Missing, Locked)
      ↓
Prerequisite Resolution (DAG Dependency Check)
      ↓
Candidate Recommendation Generation
      ↓
Multi-Factor Weighted Scoring
      ↓
Topological Sorting into 5 Learning Phases
      ↓
Next Best Action Spotlight
```

---

## Scoring Factors & Formula Weights

Every candidate skill node $S_i$ is evaluated across 7 normalized dimensions ($0.0 \to 1.0$):

$$\text{Score}(S_i) = \sum_{k=1}^7 W_k \cdot F_k(S_i)$$

| Dimension ($F_k$) | Weight ($W_k$) | Description |
|---|---|---|
| **Skill Gap Relevance** | 30% | Higher score for skills classified as `DEVELOPING` or `RECOMMENDED`. |
| **Career Relevance** | 20% | Importance weight assigned to skill in the target career specification. |
| **Prerequisite Readiness** | 15% | Fraction of prerequisite skills satisfied for candidate $S_i$. |
| **Difficulty Fit** | 10% | Alignment with learner's overall experience level (`Beginner`, `Intermediate`, `Advanced`). |
| **Learning Preference** | 10% | Match with preferred format (`Project Based`, `Video`, `Reading`). |
| **Time Availability Fit** | 10% | Estimated duration fits within weekly hours budget. |
| **Progress & Feedback Score**| 5% | Adjusted based on previous assessment scores and confidence feedback. |

---

## Topological Sort & Prerequisite Ordering

1. Represent skills as vertices $V$ and prerequisite relationships as directed edges $E \in (u, v)$ where $u$ is required before $v$.
2. Compute in-degree for missing skills in target career.
3. Perform Topological Sort (Kahn's Algorithm / Depth First Traversal) on missing skills.
4. Partition sorted sequence into 5 learning phases:
   - **Phase 1**: Foundations
   - **Phase 2**: Core Modeling
   - **Phase 3**: Deep Learning & Advanced AI
   - **Phase 4**: Production & MLOps Infrastructure
   - **Phase 5**: Capstone Project
