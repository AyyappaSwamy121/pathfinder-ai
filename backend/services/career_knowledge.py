"""
Centralized Career Knowledge Model for PathFinder AI.
Defines role-specific skills, prerequisites, phase progressions, projects, assessments, and weights.
"""

from typing import Dict, Any, List

CAREER_KNOWLEDGE: Dict[str, Dict[str, Any]] = {
    "c_ai_engineer": {
        "id": "c_ai_engineer",
        "title": "AI Engineer",
        "category": "Artificial Intelligence",
        "description": "Design, build, deploy, and monitor scalable Machine Learning and Deep Learning models, LLM pipelines, and production MLOps architecture.",
        "icon": "Cpu",
        "phases": [
            (1, "Phase 1: Foundations", "Master core programming, vectorization, and statistical distributions."),
            (2, "Phase 2: Core Modeling", "Construct supervised algorithms, cross-validation, and metric evaluation."),
            (3, "Phase 3: Deep Learning & LLMs", "Design neural networks, PyTorch modules, Transformers, and RAG architectures."),
            (4, "Phase 4: MLOps Infrastructure", "Containerize models with Docker and automate CI/CD inference serving."),
            (5, "Phase 5: Production Capstone", "Deliver an enterprise-grade deployed AI system.")
        ],
        "default_next_action": {
            "skill_id": "s_model_eval",
            "skill_name": "Model Evaluation & Metrics",
            "title": "Model Evaluation & Metrics",
            "action_type": "Assessment",
            "estimated_minutes": 60,
            "why_now": "Critical prerequisite before advancing to deep neural networks and transformer architectures.",
            "cta_label": "Start Micro-Assessment",
            "item_id": "a_model_eval"
        }
    },
    "c_data_scientist": {
        "id": "c_data_scientist",
        "title": "Data Scientist",
        "category": "Data Science",
        "description": "Extract meaningful insights from unstructured data, build predictive statistical models, perform hypothesis testing, and drive executive strategy.",
        "icon": "LineChart",
        "phases": [
            (1, "Phase 1: Data Foundations & SQL", "Master relational SQL querying, schema joins, and data manipulation."),
            (2, "Phase 2: Exploratory Analysis & Viz", "Wrangle DataFrames with Pandas and plot statistical visualizations."),
            (3, "Phase 3: Statistical Inference & ML", "Perform hypothesis testing, regression, and tree-based classification."),
            (4, "Phase 4: Feature Engineering & A/B Testing", "Engineer domain features, design controlled experiments, and validate lift."),
            (5, "Phase 5: Data Science Capstone", "Complete an end-to-end predictive modeling and executive analytics capstone.")
        ],
        "default_next_action": {
            "skill_id": "s_stats",
            "skill_name": "Statistics & Probability",
            "title": "Statistics & Statistical Inference",
            "action_type": "Assessment",
            "estimated_minutes": 75,
            "why_now": "Core statistical foundation required for A/B testing and predictive modeling.",
            "cta_label": "Start Assessment",
            "item_id": "a_stats"
        }
    },
    "c_fullstack_dev": {
        "id": "c_fullstack_dev",
        "title": "Full Stack Developer",
        "category": "Software Engineering",
        "description": "Engineer modern web applications from responsive interactive user interfaces to robust microservice backend architectures and relational databases.",
        "icon": "Code2",
        "phases": [
            (1, "Phase 1: Web & Language Fundamentals", "Build semantic interfaces with HTML5, CSS3, TypeScript, and Git version control."),
            (2, "Phase 2: React & Modern Frontend", "Develop modular single page applications, hooks, and responsive UX."),
            (3, "Phase 3: Backend & RESTful Microservices", "Create asynchronous REST APIs with Node.js and FastAPI."),
            (4, "Phase 4: Database Architecture & Docker", "Architect PostgreSQL schemas, optimize indexing, and containerize services."),
            (5, "Phase 5: Full Stack Production Capstone", "Deploy a complete SaaS product with authentication and microservices.")
        ],
        "default_next_action": {
            "skill_id": "s_react",
            "skill_name": "React.js",
            "title": "React Component Architecture",
            "action_type": "Assessment",
            "estimated_minutes": 60,
            "why_now": "Core frontend competency needed to bridge TypeScript skills into full-stack applications.",
            "cta_label": "Start Assessment",
            "item_id": "a_react"
        }
    },
    "c_data_analyst": {
        "id": "c_data_analyst",
        "title": "Data Analyst",
        "category": "Analytics",
        "description": "Transform operational raw data into actionable dashboards, perform SQL analytics, build business intelligence reports, and track KPIs.",
        "icon": "BarChart3",
        "phases": [
            (1, "Phase 1: Business & Spreadsheet Modeling", "Master advanced Excel functions, pivot tables, and financial formulas."),
            (2, "Phase 2: Relational SQL Analytics", "Write complex queries, multi-table joins, aggregations, and window functions."),
            (3, "Phase 3: Data Cleaning & Pandas", "Automate data cleaning, filtering, and statistical summaries with Python."),
            (4, "Phase 4: Business Intelligence & Tableau", "Construct interactive KPI dashboards and executive reports in Tableau/PowerBI."),
            (5, "Phase 5: Executive Dashboard Capstone", "Deliver a comprehensive business intelligence portfolio dashboard.")
        ],
        "default_next_action": {
            "skill_id": "s_sql",
            "skill_name": "SQL & Relational Databases",
            "title": "SQL Query & Aggregation Mastery",
            "action_type": "Assessment",
            "estimated_minutes": 50,
            "why_now": "The core language of analytics, essential for pulling data and building dashboards.",
            "cta_label": "Start Assessment",
            "item_id": "a_sql"
        }
    },
    "c_cloud_engineer": {
        "id": "c_cloud_engineer",
        "title": "Cloud Engineer",
        "category": "Cloud & Infrastructure",
        "description": "Architect, provision, and maintain secure resilient cloud infrastructure on AWS, automate CI/CD pipelines, and orchestrate containers with Kubernetes.",
        "icon": "Cloud",
        "phases": [
            (1, "Phase 1: Systems & Networking Core", "Master Linux command line, shell scripting, TCP/IP networking, and Git."),
            (2, "Phase 2: Cloud Fundamentals & AWS", "Deploy compute instances, configure VPC subnets, and manage S3 storage."),
            (3, "Phase 3: Containerization & Docker", "Build reproducible multi-stage Docker containers and microservices."),
            (4, "Phase 4: Orchestration & CI/CD", "Automate deployments using Kubernetes clusters and GitHub Actions pipelines."),
            (5, "Phase 5: Resilient Cloud Architecture Capstone", "Design and deploy a highly available, auto-scaling multi-tier cloud infrastructure.")
        ],
        "default_next_action": {
            "skill_id": "s_aws",
            "skill_name": "AWS Cloud Infrastructure",
            "title": "AWS Compute & VPC Fundamentals",
            "action_type": "Assessment",
            "estimated_minutes": 60,
            "why_now": "Core cloud provider foundation required before deploying containers and orchestration clusters.",
            "cta_label": "Start Assessment",
            "item_id": "a_aws"
        }
    },
    "c_cybersecurity": {
        "id": "c_cybersecurity",
        "title": "Cybersecurity Engineer",
        "category": "Security",
        "description": "Protect critical digital infrastructure, audit network security, perform penetration testing, analyze vulnerabilities, and enforce cloud governance.",
        "icon": "ShieldCheck",
        "phases": [
            (1, "Phase 1: Systems & Networking Security", "Inspect network packet flows, DNS, firewalls, and Unix security controls."),
            (2, "Phase 2: Security Principles & IAM", "Enforce principle of least privilege, zero-trust architecture, and cloud IAM policies."),
            (3, "Phase 3: Vulnerability Assessment & Pen Testing", "Audit systems with automated vulnerability scanners and analyze OWASP Top 10 exploits."),
            (4, "Phase 4: Threat Detection & Incident Response", "Configure SIEM logging, analyze anomalies, and automate security response scripts."),
            (5, "Phase 5: Enterprise Security Capstone", "Conduct a comprehensive security audit and vulnerability penetration report.")
        ],
        "default_next_action": {
            "skill_id": "s_cloud_security",
            "skill_name": "Cloud Security & IAM",
            "title": "Cloud Security Architecture & IAM",
            "action_type": "Assessment",
            "estimated_minutes": 60,
            "why_now": "Highest-impact security discipline protecting modern cloud workloads and identity perimeters.",
            "cta_label": "Start Assessment",
            "item_id": "a_cloud_sec"
        }
    }
}
