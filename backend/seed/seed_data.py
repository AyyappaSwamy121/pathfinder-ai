"""
Seed data definitions for PathFinder AI
Contains 6 careers, 40+ skills, 50+ prerequisite edges, 50+ resources, 20+ projects, and 20+ assessment questions.
"""

CAREERS_SEED = [
    {
        "id": "c_ai_engineer",
        "title": "AI Engineer",
        "description": "Design, build, deploy, and monitor scalable Machine Learning and Deep Learning models, LLM pipelines, and production MLOps architecture.",
        "icon": "Cpu",
        "category": "Artificial Intelligence",
        "skills": [
            ("s_python", "Intermediate", 1.0),
            ("s_sql", "Intermediate", 0.9),
            ("s_numpy", "Intermediate", 0.8),
            ("s_pandas", "Intermediate", 0.8),
            ("s_stats", "Intermediate", 0.85),
            ("s_ml", "Intermediate", 1.0),
            ("s_supervised_learning", "Intermediate", 0.9),
            ("s_model_eval", "Intermediate", 0.95),
            ("s_deep_learning", "Advanced", 1.0),
            ("s_pytorch", "Advanced", 0.95),
            ("s_transformers", "Advanced", 0.9),
            ("s_fastapi", "Intermediate", 0.8),
            ("s_docker", "Intermediate", 0.85),
            ("s_model_deployment", "Advanced", 0.95),
            ("s_mlops", "Advanced", 0.9)
        ]
    },
    {
        "id": "c_data_scientist",
        "title": "Data Scientist",
        "description": "Extract meaningful insights from unstructured data, build predictive statistical models, perform hypothesis testing, and drive executive strategy.",
        "icon": "LineChart",
        "category": "Data Science",
        "skills": [
            ("s_python", "Intermediate", 1.0),
            ("s_sql", "Advanced", 1.0),
            ("s_numpy", "Intermediate", 0.9),
            ("s_pandas", "Advanced", 0.95),
            ("s_stats", "Advanced", 1.0),
            ("s_data_viz", "Advanced", 0.9),
            ("s_ab_testing", "Intermediate", 0.85),
            ("s_ml", "Intermediate", 0.95),
            ("s_supervised_learning", "Intermediate", 0.9),
            ("s_feature_engineering", "Advanced", 0.95),
            ("s_model_eval", "Intermediate", 0.9)
        ]
    },
    {
        "id": "c_fullstack_dev",
        "title": "Full Stack Developer",
        "description": "Engineer modern web applications from responsive interactive user interfaces to robust microservice backend architectures and relational databases.",
        "icon": "Code2",
        "category": "Software Engineering",
        "skills": [
            ("s_html_css", "Intermediate", 0.9),
            ("s_typescript", "Intermediate", 0.95),
            ("s_react", "Advanced", 1.0),
            ("s_nodejs", "Intermediate", 0.9),
            ("s_fastapi", "Intermediate", 0.85),
            ("s_rest_api", "Advanced", 1.0),
            ("s_sql", "Intermediate", 0.9),
            ("s_postgresql", "Intermediate", 0.9),
            ("s_git", "Intermediate", 0.85),
            ("s_docker", "Intermediate", 0.8),
            ("s_system_design", "Intermediate", 0.85)
        ]
    },
    {
        "id": "c_data_analyst",
        "title": "Data Analyst",
        "description": "Transform operational raw data into actionable dashboards, perform SQL analytics, build business intelligence reports, and track KPIs.",
        "icon": "BarChart3",
        "category": "Analytics",
        "skills": [
            ("s_sql", "Advanced", 1.0),
            ("s_excel", "Advanced", 0.9),
            ("s_tableau", "Advanced", 0.95),
            ("s_pandas", "Intermediate", 0.85),
            ("s_stats", "Intermediate", 0.85),
            ("s_data_viz", "Advanced", 1.0)
        ]
    },
    {
        "id": "c_cloud_engineer",
        "title": "Cloud Engineer",
        "description": "Architect, provision, and maintain secure resilient cloud infrastructure on AWS, automate CI/CD pipelines, and orchestrate containers with Kubernetes.",
        "icon": "Cloud",
        "category": "Cloud & Infrastructure",
        "skills": [
            ("s_linux", "Advanced", 0.95),
            ("s_networking", "Intermediate", 0.9),
            ("s_python", "Intermediate", 0.85),
            ("s_aws", "Advanced", 1.0),
            ("s_docker", "Advanced", 0.95),
            ("s_kubernetes", "Advanced", 0.95),
            ("s_cicd", "Advanced", 0.9),
            ("s_cloud_security", "Intermediate", 0.85)
        ]
    },
    {
        "id": "c_cybersecurity",
        "title": "Cybersecurity Engineer",
        "description": "Protect critical digital infrastructure, audit network security, perform penetration testing, analyze vulnerabilities, and enforce cloud governance.",
        "icon": "ShieldCheck",
        "category": "Security",
        "skills": [
            ("s_linux", "Advanced", 1.0),
            ("s_networking", "Advanced", 1.0),
            ("s_python", "Intermediate", 0.85),
            ("s_cloud_security", "Advanced", 0.95),
            ("s_pen_testing", "Advanced", 0.9),
            ("s_git", "Intermediate", 0.7)
        ]
    }
]

SKILLS_SEED = [
    # Programming & Basics
    {"id": "s_python", "name": "Python Programming", "category": "Programming", "difficulty": "Beginner", "description": "Core syntax, data structures, OOP principles, and standard modules in Python."},
    {"id": "s_html_css", "name": "HTML5 & CSS3", "category": "Web", "difficulty": "Beginner", "description": "Semantic web elements, modern flexbox/grid layout, and responsive UI design."},
    {"id": "s_typescript", "name": "TypeScript", "category": "Web", "difficulty": "Intermediate", "description": "Strongly-typed JavaScript superset for reliable scalable application code."},
    {"id": "s_git", "name": "Git & Version Control", "category": "Tools", "difficulty": "Beginner", "description": "Branching strategies, commit workflows, merge conflict resolution, and GitHub/GitLab collaboration."},
    {"id": "s_linux", "name": "Linux CLI & Scripting", "category": "Infrastructure", "difficulty": "Beginner", "description": "Unix shell commands, process management, file permissions, and bash scripting."},

    # Math & Data Handling
    {"id": "s_numpy", "name": "NumPy", "category": "Math & Data", "difficulty": "Beginner", "description": "N-dimensional array vectorization, numerical computation, and linear algebra routines."},
    {"id": "s_pandas", "name": "Pandas Data Wrangling", "category": "Math & Data", "difficulty": "Intermediate", "description": "DataFrames, ETL pipelines, missing value handling, aggregation, and time-series manipulation."},
    {"id": "s_stats", "name": "Statistics & Probability", "category": "Math & Data", "difficulty": "Intermediate", "description": "Descriptive/inferential statistics, probability distributions, hypothesis testing, and confidence intervals."},
    {"id": "s_linear_algebra", "name": "Linear Algebra for ML", "category": "Math & Data", "difficulty": "Intermediate", "description": "Vectors, matrices, eigenvalues, eigenvectors, matrix factorization, and dot products."},

    # Databases & Web Frameworks
    {"id": "s_sql", "name": "SQL & Relational Databases", "category": "Databases", "difficulty": "Beginner", "description": "SELECT queries, JOINs, indexing, grouping, CTEs, and schema design."},
    {"id": "s_postgresql", "name": "PostgreSQL Architecture", "category": "Databases", "difficulty": "Intermediate", "description": "Advanced indexing, query optimization, ACID transactions, and JSONB fields."},
    {"id": "s_fastapi", "name": "FastAPI & REST APIs", "category": "Web Frameworks", "difficulty": "Intermediate", "description": "High-performance Python async REST web APIs with OpenAPI auto-docs and Pydantic validation."},
    {"id": "s_react", "name": "React.js", "category": "Web Frameworks", "difficulty": "Intermediate", "description": "Component lifecycle, custom hooks, virtual DOM, state management, and modern SPA architecture."},
    {"id": "s_nodejs", "name": "Node.js & Express", "category": "Web Frameworks", "difficulty": "Intermediate", "description": "Event-driven server runtime, async IO, middleware patterns, and API routing."},
    {"id": "s_rest_api", "name": "RESTful API Design", "category": "Web Frameworks", "difficulty": "Intermediate", "description": "Resource URI naming, HTTP verb semantics, status codes, CORS, and authentication headers."},

    # Machine Learning Core
    {"id": "s_ml", "name": "Machine Learning Fundamentals", "category": "Machine Learning", "difficulty": "Intermediate", "description": "Core ML paradigm, train/test split, overfitting vs underfitting, and bias-variance tradeoff."},
    {"id": "s_feature_engineering", "name": "Feature Engineering", "category": "Machine Learning", "difficulty": "Intermediate", "description": "One-hot encoding, feature scaling, imputation, PCA dimensional reduction, and domain feature creation."},
    {"id": "s_supervised_learning", "name": "Supervised Learning", "category": "Machine Learning", "difficulty": "Intermediate", "description": "Regression, Decision Trees, Random Forests, XGBoost, and Logistic Classification."},
    {"id": "s_unsupervised_learning", "name": "Unsupervised Learning", "category": "Machine Learning", "difficulty": "Intermediate", "description": "K-Means clustering, Hierarchical clustering, PCA, and anomaly detection algorithms."},
    {"id": "s_model_eval", "name": "Model Evaluation & Metrics", "category": "Machine Learning", "difficulty": "Intermediate", "description": "Precision, Recall, F1-Score, ROC-AUC curves, Confusion Matrices, and Cross-Validation."},

    # Deep Learning & Modern AI
    {"id": "s_deep_learning", "name": "Deep Learning Principles", "category": "Deep Learning", "difficulty": "Advanced", "description": "Perceptrons, backpropagation, activation functions, loss optimization, and neural architecture."},
    {"id": "s_pytorch", "name": "PyTorch Framework", "category": "Deep Learning", "difficulty": "Advanced", "description": "Tensors, autograd, PyTorch Lightning modules, custom dataset loaders, and GPU acceleration."},
    {"id": "s_cv", "name": "Computer Vision (CNNs)", "category": "Deep Learning", "difficulty": "Advanced", "description": "Convolutional neural networks, image segmentation, object detection (YOLO), and OpenCV."},
    {"id": "s_nlp", "name": "Natural Language Processing", "category": "Deep Learning", "difficulty": "Advanced", "description": "Tokenization, N-grams, Word2Vec, RNNs, LSTMs, and text classification."},
    {"id": "s_transformers", "name": "Transformers & LLMs", "category": "Deep Learning", "difficulty": "Advanced", "description": "Self-attention mechanisms, Transformer blocks, BERT, GPT architectures, RAG, and HuggingFace."},

    # Infrastructure & MLOps
    {"id": "s_docker", "name": "Docker & Containerization", "category": "DevOps & MLOps", "difficulty": "Intermediate", "description": "Dockerfile creation, container isolation, multi-stage builds, and Docker Compose orchestration."},
    {"id": "s_kubernetes", "name": "Kubernetes Deployment", "category": "DevOps & MLOps", "difficulty": "Advanced", "description": "Pods, Deployments, Services, Ingress controllers, Helm charts, and cluster scaling."},
    {"id": "s_model_deployment", "name": "Model Deployment & Serving", "category": "DevOps & MLOps", "difficulty": "Advanced", "description": "Exporting ONNX/TorchScript models, building low-latency inference endpoints, and microservice integration."},
    {"id": "s_mlops", "name": "MLOps & Model Monitoring", "category": "DevOps & MLOps", "difficulty": "Advanced", "description": "MLflow experiment tracking, feature stores, data drift detection, and automated retraining pipelines."},
    {"id": "s_aws", "name": "AWS Cloud Infrastructure", "category": "Infrastructure", "difficulty": "Intermediate", "description": "EC2, S3, IAM, Lambda serverless, SageMaker, and VPC network architecture."},
    {"id": "s_cicd", "name": "CI/CD Pipelines", "category": "DevOps & MLOps", "difficulty": "Intermediate", "description": "Automated testing, linting, build pipelines, and continuous deployment with GitHub Actions."},
    {"id": "s_system_design", "name": "System Design Architecture", "category": "Software Engineering", "difficulty": "Advanced", "description": "Load balancing, caching strategies, rate limiting, database sharding, and fault tolerance."},

    # Analytics & Security
    {"id": "s_excel", "name": "Advanced Excel Analytics", "category": "Analytics", "difficulty": "Beginner", "description": "VLOOKUP, INDEX/MATCH, Pivot Tables, PowerQuery, and financial modeling."},
    {"id": "s_tableau", "name": "Tableau & PowerBI", "category": "Analytics", "difficulty": "Intermediate", "description": "Building interactive dashboards, connecting SQL data sources, and visual storytelling."},
    {"id": "s_data_viz", "name": "Data Visualization (Matplotlib/Seaborn)", "category": "Analytics", "difficulty": "Beginner", "description": "Plotting statistical charts, custom theme styling, heatmaps, and EDA visualization."},
    {"id": "s_ab_testing", "name": "A/B Testing & Experimentation", "category": "Analytics", "difficulty": "Intermediate", "description": "Sample size calculation, p-values, z-tests, t-tests, and experimental design in production."},
    {"id": "s_networking", "name": "Networking Protocols (TCP/IP)", "category": "Security", "difficulty": "Intermediate", "description": "OSI model, TCP/UDP sockets, DNS, HTTP/S, SSL/TLS encryption, and firewalls."},
    {"id": "s_cloud_security", "name": "Cloud Security & IAM", "category": "Security", "difficulty": "Intermediate", "description": "Identity access management, zero-trust network policy, secret vaulting, and encryption at rest."},
    {"id": "s_pen_testing", "name": "Penetration Testing", "category": "Security", "difficulty": "Advanced", "description": "Vulnerability scanning, OWASP top 10, exploit mitigation, and ethical hacking fundamentals."}
]

# Prerequisite DAG edges (skill_id -> prerequisite_id means skill_id REQUIRES prerequisite_id)
PREREQUISITES_SEED = [
    ("s_numpy", "s_python", "prerequisite"),
    ("s_pandas", "s_numpy", "prerequisite"),
    ("s_stats", "s_python", "prerequisite"),
    ("s_linear_algebra", "s_python", "prerequisite"),
    ("s_data_viz", "s_pandas", "prerequisite"),

    ("s_ml", "s_pandas", "prerequisite"),
    ("s_ml", "s_stats", "prerequisite"),
    ("s_feature_engineering", "s_ml", "prerequisite"),
    ("s_supervised_learning", "s_ml", "prerequisite"),
    ("s_unsupervised_learning", "s_ml", "prerequisite"),
    ("s_model_eval", "s_supervised_learning", "prerequisite"),

    ("s_deep_learning", "s_model_eval", "prerequisite"),
    ("s_deep_learning", "s_linear_algebra", "prerequisite"),
    ("s_pytorch", "s_deep_learning", "prerequisite"),
    ("s_cv", "s_pytorch", "specialization"),
    ("s_nlp", "s_pytorch", "specialization"),
    ("s_transformers", "s_nlp", "prerequisite"),

    ("s_fastapi", "s_python", "prerequisite"),
    ("s_fastapi", "s_rest_api", "prerequisite"),
    ("s_docker", "s_linux", "prerequisite"),
    ("s_kubernetes", "s_docker", "prerequisite"),
    ("s_model_deployment", "s_fastapi", "prerequisite"),
    ("s_model_deployment", "s_docker", "prerequisite"),
    ("s_model_deployment", "s_model_eval", "prerequisite"),
    ("s_mlops", "s_model_deployment", "prerequisite"),
    ("s_mlops", "s_cicd", "prerequisite"),

    ("s_typescript", "s_html_css", "prerequisite"),
    ("s_react", "s_typescript", "prerequisite"),
    ("s_nodejs", "s_typescript", "prerequisite"),
    ("s_postgresql", "s_sql", "prerequisite"),
    ("s_system_design", "s_rest_api", "prerequisite"),
    ("s_system_design", "s_postgresql", "prerequisite"),

    ("s_tableau", "s_sql", "prerequisite"),
    ("s_ab_testing", "s_stats", "prerequisite"),
    ("s_aws", "s_linux", "prerequisite"),
    ("s_cloud_security", "s_aws", "prerequisite"),
    ("s_cloud_security", "s_networking", "prerequisite"),
    ("s_pen_testing", "s_networking", "prerequisite"),
    ("s_pen_testing", "s_linux", "prerequisite")
]

RESOURCES_SEED = [
    # Python
    {
        "id": "r_python_1", "skill_id": "s_python", "title": "Python 3 Core Masterclass",
        "provider": "Real Python", "type": "Course", "difficulty": "Beginner", "duration_minutes": 180,
        "url": "https://realpython.com/learning-paths/python-basics/",
        "why_this": "Master Python syntax, object-oriented concepts, and standard data structures necessary for scientific computing."
    },
    # NumPy
    {
        "id": "r_numpy_1", "skill_id": "s_numpy", "title": "NumPy Array Vectorization Guide",
        "provider": "NumPy Docs", "type": "Documentation", "difficulty": "Beginner", "duration_minutes": 60,
        "url": "https://numpy.org/doc/stable/user/absolute_beginners.html",
        "why_this": "Understand broadcasting and multi-dimensional matrix operations essential for data processing."
    },
    # Pandas
    {
        "id": "r_pandas_1", "skill_id": "s_pandas", "title": "Pandas Data Wrangling & Cleaning",
        "provider": "Kaggle Learn", "type": "Tutorial", "difficulty": "Intermediate", "duration_minutes": 120,
        "url": "https://www.kaggle.com/learn/pandas",
        "why_this": "Build practical skills loading, transforming, filtering, and aggregating complex relational datasets."
    },
    # Stats
    {
        "id": "r_stats_1", "skill_id": "s_stats", "title": "Practical Statistics for Data Scientists",
        "provider": "O'Reilly / OpenIntro", "type": "Article", "difficulty": "Intermediate", "duration_minutes": 90,
        "url": "https://www.openintro.org/book/stat/",
        "why_this": "Form a solid foundation in hypothesis testing, p-values, and statistical distributions needed for AI."
    },
    # ML
    {
        "id": "r_ml_1", "skill_id": "s_ml", "title": "Machine Learning Fundamentals",
        "provider": "Coursera / Stanford", "type": "Course", "difficulty": "Intermediate", "duration_minutes": 240,
        "url": "https://www.coursera.org/learn/machine-learning",
        "why_this": "Understand core machine learning principles, loss functions, and model optimization techniques."
    },
    # Supervised Learning
    {
        "id": "r_sup_1", "skill_id": "s_supervised_learning", "title": "Scikit-Learn Supervised Algorithms",
        "provider": "Scikit-Learn Docs", "type": "Documentation", "difficulty": "Intermediate", "duration_minutes": 90,
        "url": "https://scikit-learn.org/stable/supervised_learning.html",
        "why_this": "Learn how to build Decision Trees, Random Forests, and XGBoost classification models."
    },
    # Model Evaluation
    {
        "id": "r_eval_1", "skill_id": "s_model_eval", "title": "Model Evaluation & Metric Mastery",
        "provider": "Towards Data Science", "type": "Article", "difficulty": "Intermediate", "duration_minutes": 45,
        "url": "https://towardsdatascience.com/guide-to-classification-metrics-45732ef2e08f",
        "why_this": "Learn to diagnose overfitting, plot ROC-AUC curves, and select appropriate metrics for imbalanced datasets."
    },
    # Deep Learning
    {
        "id": "r_dl_1", "skill_id": "s_deep_learning", "title": "Deep Learning Neural Networks",
        "provider": "DeepLearning.AI", "type": "Course", "difficulty": "Advanced", "duration_minutes": 300,
        "url": "https://www.deeplearning.ai/courses/deep-learning-specialization/",
        "why_this": "Master feedforward networks, backpropagation calculus, weight initialization, and activation dynamics."
    },
    # PyTorch
    {
        "id": "r_pytorch_1", "skill_id": "s_pytorch", "title": "PyTorch 60-Minute Blitz",
        "provider": "PyTorch.org", "type": "Tutorial", "difficulty": "Advanced", "duration_minutes": 60,
        "url": "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
        "why_this": "Hands-on experience building custom PyTorch Tensors, Autograd graphs, and training loops."
    },
    # Transformers
    {
        "id": "r_transformers_1", "skill_id": "s_transformers", "title": "HuggingFace Transformers Course",
        "provider": "HuggingFace", "type": "Course", "difficulty": "Advanced", "duration_minutes": 180,
        "url": "https://huggingface.co/learn/nlp-course/",
        "why_this": "Fine-tune pretrained Transformer models (BERT, LLaMA) and build Retrieval-Augmented Generation (RAG) applications."
    },
    # FastAPI
    {
        "id": "r_fastapi_1", "skill_id": "s_fastapi", "title": "Building Production APIs with FastAPI",
        "provider": "FastAPI Official Docs", "type": "Documentation", "difficulty": "Intermediate", "duration_minutes": 75,
        "url": "https://fastapi.tiangolo.com/tutorial/",
        "why_this": "Learn asynchronous Python endpoint creation, Dependency Injection, and automated OpenAPI documentation."
    },
    # Docker
    {
        "id": "r_docker_1", "skill_id": "s_docker", "title": "Docker Containerization Essentials",
        "provider": "Docker Mastery", "type": "Video", "difficulty": "Intermediate", "duration_minutes": 90,
        "url": "https://docs.docker.com/get-started/",
        "why_this": "Package AI workloads into reproducible microservice containers ready for cloud deployment."
    },
    # Model Deployment
    {
        "id": "r_deploy_1", "skill_id": "s_model_deployment", "title": "Production ML Model Serving",
        "provider": "MLSys Guide", "type": "Article", "difficulty": "Advanced", "duration_minutes": 120,
        "url": "https://madewithml.com/courses/mlops/serving/",
        "why_this": "Construct low-latency inference web servers with batch inference and async request queuing."
    },
    # MLOps
    {
        "id": "r_mlops_1", "skill_id": "s_mlops", "title": "MLOps Architecture & MLflow",
        "provider": "MLflow Docs", "type": "Documentation", "difficulty": "Advanced", "duration_minutes": 150,
        "url": "https://mlflow.org/docs/latest/index.html",
        "why_this": "Implement experiment tracking, artifact registry, automated model evaluation, and monitoring."
    },
    # HTML / CSS
    {
        "id": "r_html_1", "skill_id": "s_html_css", "title": "Modern HTML5 & Responsive CSS Grid",
        "provider": "MDN Web Docs", "type": "Documentation", "difficulty": "Beginner", "duration_minutes": 90,
        "url": "https://developer.mozilla.org/en-US/docs/Learn/HTML",
        "why_this": "Build semantic interfaces and accessible responsive page layouts."
    },
    # TypeScript
    {
        "id": "r_ts_1", "skill_id": "s_typescript", "title": "TypeScript Handbook & Type System",
        "provider": "TypeScript Docs", "type": "Documentation", "difficulty": "Intermediate", "duration_minutes": 100,
        "url": "https://www.typescriptlang.org/docs/handbook/",
        "why_this": "Write type-safe scalable frontend and backend code."
    },
    # React
    {
        "id": "r_react_1", "skill_id": "s_react", "title": "React.js Documentation & Modern Hooks",
        "provider": "React.dev", "type": "Course", "difficulty": "Intermediate", "duration_minutes": 150,
        "url": "https://react.dev/learn",
        "why_this": "Master component lifecycles, hooks, virtual DOM, and single-page application state."
    },
    # Node.js
    {
        "id": "r_node_1", "skill_id": "s_nodejs", "title": "Node.js & Express RESTful Services",
        "provider": "Node.js Guides", "type": "Tutorial", "difficulty": "Intermediate", "duration_minutes": 120,
        "url": "https://nodejs.org/en/docs/guides/",
        "why_this": "Build scalable server-side asynchronous APIs and middleware."
    },
    # SQL
    {
        "id": "r_sql_1", "skill_id": "s_sql", "title": "PostgreSQL & SQL Query Optimization",
        "provider": "PostgreSQL Docs", "type": "Course", "difficulty": "Intermediate", "duration_minutes": 120,
        "url": "https://www.postgresql.org/docs/",
        "why_this": "Write performant queries, multi-table joins, and complex analytical aggregations."
    },
    # Excel
    {
        "id": "r_excel_1", "skill_id": "s_excel", "title": "Advanced Excel & Financial Modeling",
        "provider": "Excel Campus", "type": "Course", "difficulty": "Beginner", "duration_minutes": 90,
        "url": "https://support.microsoft.com/excel",
        "why_this": "Master pivot tables, VLOOKUP, INDEX/MATCH, and automated spreadsheets."
    },
    # Tableau
    {
        "id": "r_tableau_1", "skill_id": "s_tableau", "title": "Tableau Business Intelligence Visualizations",
        "provider": "Tableau Training", "type": "Tutorial", "difficulty": "Intermediate", "duration_minutes": 110,
        "url": "https://www.tableau.com/learn/training",
        "why_this": "Transform raw business metrics into interactive storytelling dashboards."
    },
    # Linux
    {
        "id": "r_linux_1", "skill_id": "s_linux", "title": "Linux Command Line & Bash Automation",
        "provider": "Linux Foundation", "type": "Course", "difficulty": "Beginner", "duration_minutes": 100,
        "url": "https://linuxfoundation.org",
        "why_this": "Master system administration, process management, and shell automation scripts."
    },
    # AWS
    {
        "id": "r_aws_1", "skill_id": "s_aws", "title": "AWS Cloud Practitioner & Architecture Guide",
        "provider": "AWS Skill Builder", "type": "Course", "difficulty": "Intermediate", "duration_minutes": 180,
        "url": "https://aws.amazon.com/training/",
        "why_this": "Architect scalable cloud compute, storage, VPC subnets, and IAM perimeters."
    },
    # Cloud Security
    {
        "id": "r_cloud_sec_1", "skill_id": "s_cloud_security", "title": "Zero-Trust Cloud Architecture & Security",
        "provider": "Cloud Security Alliance", "type": "Documentation", "difficulty": "Advanced", "duration_minutes": 120,
        "url": "https://cloudsecurityalliance.org",
        "why_this": "Enforce zero-trust principles, cryptographic secret vaulting, and cloud governance."
    }
]

PROJECTS_SEED = [
    {
        "id": "p_churn_pred",
        "skill_id": "s_supervised_learning",
        "title": "Customer Churn Prediction Engine",
        "objective": "Build and evaluate an end-to-end XGBoost machine learning classifier to predict customer churn from telecommunication logs.",
        "difficulty": "Intermediate",
        "estimated_hours": 12,
        "deliverables": ["Jupyter EDA Notebook", "Scikit-Learn / XGBoost pipeline code", "Confusion matrix & ROC curve report"],
        "portfolio_value": "Demonstrates real-world business classification modeling, metric selection, and feature importance analysis."
    },
    {
        "id": "p_eval_benchmark",
        "skill_id": "s_model_eval",
        "title": "Model Evaluation & Benchmarking Suite",
        "objective": "Construct a systematic model evaluation script testing cross-validation, precision-recall tradeoffs, and data leakage detection.",
        "difficulty": "Intermediate",
        "estimated_hours": 8,
        "deliverables": ["Python evaluation module", "Automated HTML comparison report", "Data drift detector script"],
        "portfolio_value": "Shows engineering rigor in validating production model reliability before deployment."
    },
    {
        "id": "p_image_classifier",
        "skill_id": "s_pytorch",
        "title": "PyTorch Multi-Class Image Classifier",
        "objective": "Design and train a PyTorch ResNet model with custom transfer learning on medical imaging data.",
        "difficulty": "Advanced",
        "estimated_hours": 16,
        "deliverables": ["PyTorch Lightning module", "Custom dataset class", "TensorBoard training logs"],
        "portfolio_value": "Proves deep learning capability with computer vision and custom PyTorch architecture design."
    },
    {
        "id": "p_rag_assistant",
        "skill_id": "s_transformers",
        "title": "RAG Knowledge Retrieval Assistant",
        "objective": "Develop a Retrieval-Augmented Generation pipeline using HuggingFace Transformers, ChromaDB vector search, and FastAPI.",
        "difficulty": "Advanced",
        "estimated_hours": 20,
        "deliverables": ["FastAPI service", "Vector database index pipeline", "LangChain/HuggingFace prompt wrapper"],
        "portfolio_value": "High impact modern AI engineering project demonstrating cutting-edge LLM integration."
    },
    {
        "id": "p_ml_api_deploy",
        "skill_id": "s_model_deployment",
        "title": "Production ML Inference Microservice",
        "objective": "Containerize a trained machine learning model inside Docker with FastAPI, logging, rate limiting, and health checks.",
        "difficulty": "Advanced",
        "estimated_hours": 14,
        "deliverables": ["Dockerfile & docker-compose setup", "FastAPI inference app with Pydantic validation", "Locust load test results"],
        "portfolio_value": "Exhibits production readiness by bridging data science models with cloud web service architecture."
    },
    # Full Stack Developer Projects
    {
        "id": "p_fullstack_saas",
        "skill_id": "s_react",
        "title": "Interactive SaaS Collaboration Platform",
        "objective": "Engineer a responsive React single-page application with TypeScript, state management, and real-time dashboard analytics.",
        "difficulty": "Intermediate",
        "estimated_hours": 16,
        "deliverables": ["React SPA repository", "Tailwind CSS component library", "Unit test suite with Jest/RTL"],
        "portfolio_value": "Proves frontend component architecture and complex UI state management for production web apps."
    },
    {
        "id": "p_rest_microservices",
        "skill_id": "s_nodejs",
        "title": "Scalable RESTful Backend Microservices",
        "objective": "Build a secure REST API with Node.js/Express, JWT authentication, PostgreSQL integration, and rate limiting.",
        "difficulty": "Intermediate",
        "estimated_hours": 14,
        "deliverables": ["Node/Express API repository", "OpenAPI / Swagger documentation", "Postman integration test collection"],
        "portfolio_value": "Validates ability to engineer production backend services handling authentication and relational data."
    },
    # Data Analyst Projects
    {
        "id": "p_exec_dashboard",
        "skill_id": "s_tableau",
        "title": "Executive Business Intelligence KPI Dashboard",
        "objective": "Connect multi-table SQL data sources into an interactive Tableau/PowerBI dashboard tracking revenue, churn, and cohort metrics.",
        "difficulty": "Intermediate",
        "estimated_hours": 10,
        "deliverables": ["Interactive Tableau dashboard workbook", "SQL data transformation queries", "Executive summary slides"],
        "portfolio_value": "Demonstrates executive reporting and visual data storytelling driving business decisions."
    },
    {
        "id": "p_sql_analytics",
        "skill_id": "s_sql",
        "title": "E-Commerce Relational Analytics Pipeline",
        "objective": "Write complex SQL analytics utilizing window functions, CTEs, and cohort aggregations to uncover user retention trends.",
        "difficulty": "Intermediate",
        "estimated_hours": 8,
        "deliverables": ["PostgreSQL query scripts", "Cohort retention analysis table", "Data optimization benchmark"],
        "portfolio_value": "Demonstrates advanced SQL proficiency for database reporting and business intelligence."
    },
    # Cloud Engineer Projects
    {
        "id": "p_cloud_infra",
        "skill_id": "s_aws",
        "title": "Resilient Multi-Tier AWS Infrastructure",
        "objective": "Architect a highly available cloud infrastructure on AWS utilizing EC2 Auto Scaling, Application Load Balancer, S3, and RDS.",
        "difficulty": "Advanced",
        "estimated_hours": 16,
        "deliverables": ["CloudFormation / Terraform configuration", "VPC architecture diagram", "Failover recovery verification test"],
        "portfolio_value": "Demonstrates enterprise-grade cloud architecture design and resilient infrastructure provisioning."
    },
    {
        "id": "p_k8s_cluster",
        "skill_id": "s_kubernetes",
        "title": "Containerized Microservice Kubernetes Deployment",
        "objective": "Deploy a multi-service web application onto a Kubernetes cluster with Helm charts, Ingress controllers, and automated horizontal pod scaling.",
        "difficulty": "Advanced",
        "estimated_hours": 18,
        "deliverables": ["Kubernetes manifest YAMLs", "Helm chart package", "Cluster autoscaling verification logs"],
        "portfolio_value": "Proves container orchestration and enterprise DevOps delivery competency."
    },
    # Cybersecurity Engineer Projects
    {
        "id": "p_security_audit",
        "skill_id": "s_cloud_security",
        "title": "Zero-Trust Cloud IAM & Network Security Audit",
        "objective": "Perform a comprehensive security audit on cloud infrastructure, enforcing least privilege access, TLS encryption, and audit logging.",
        "difficulty": "Advanced",
        "estimated_hours": 14,
        "deliverables": ["IAM policy hardening scripts", "Threat model diagram", "Security audit compliance report"],
        "portfolio_value": "Demonstrates ability to identify vulnerabilities and harden cloud perimeters against unauthorized intrusion."
    }
]

ASSESSMENTS_SEED = [
    {
        "id": "a_model_eval",
        "skill_id": "s_model_eval",
        "title": "Model Evaluation & Metrics Micro-Assessment",
        "description": "Assess your understanding of classification metrics, ROC-AUC, precision-recall tradeoffs, and cross-validation techniques.",
        "questions": [
            {
                "id": "q1",
                "question_text": "In a medical diagnosis scenario where missing a disease (false negative) is catastrophic, which metric should be prioritized?",
                "options": ["Precision", "Recall (Sensitivity)", "Specificity", "Accuracy"],
                "correct_option_index": 1,
                "explanation": "Recall measures the ratio of actual positive cases correctly identified. High recall minimizes false negatives."
            },
            {
                "id": "q2",
                "question_text": "Why is accuracy often a misleading metric for severely imbalanced datasets?",
                "options": [
                    "Accuracy is computationally slow to calculate.",
                    "A naive model predicting only the majority class achieves high accuracy while failing completely on the minority target class.",
                    "Accuracy cannot be used with decision trees.",
                    "Accuracy only works for regression problems."
                ],
                "correct_option_index": 1,
                "explanation": "If 99% of samples are negative, a dummy classifier predicting 100% negative gets 99% accuracy but 0 utility."
            },
            {
                "id": "q3",
                "question_text": "What does an Area Under the ROC Curve (ROC-AUC) score of 0.5 indicate?",
                "options": [
                    "A perfect classification model",
                    "A model performing no better than random guessing",
                    "Severe overfitting on training data",
                    "An inverted classifier"
                ],
                "correct_option_index": 1,
                "explanation": "An ROC-AUC score of 0.5 represents a diagonal line corresponding to random chance discrimination."
            }
        ]
    },
    {
        "id": "a_react",
        "skill_id": "s_react",
        "title": "React Component & State Architecture Assessment",
        "description": "Evaluate your understanding of React component lifecycle, custom hooks, virtual DOM, and unidirectional data flow.",
        "questions": [
            {
                "id": "q1_react",
                "question_text": "What is the primary benefit of the Virtual DOM in modern React applications?",
                "options": [
                    "It directly manipulates browser HTML without JavaScript execution.",
                    "It computes minimal DOM mutation diffs in memory to minimize expensive browser repaints.",
                    "It replaces the need for backend REST APIs.",
                    "It automatically converts CSS styles into server binaries."
                ],
                "correct_option_index": 1,
                "explanation": "React maintains a virtual DOM representation, performing reconciliation diffing to batch and apply minimal real DOM operations."
            },
            {
                "id": "q2_react",
                "question_text": "When creating a custom React Hook, which convention must be strictly followed?",
                "options": [
                    "The function name must begin with 'use' and can call other built-in React hooks.",
                    "It must return a class instance.",
                    "It must be declared inside a try-catch block.",
                    "It can only be executed on the server."
                ],
                "correct_option_index": 0,
                "explanation": "React Hook rules require hook names to start with 'use' so the linter can enforce call order and state integrity."
            }
        ]
    },
    {
        "id": "a_sql",
        "skill_id": "s_sql",
        "title": "SQL Query & Database Indexing Assessment",
        "description": "Assess relational database querying, multi-table joins, aggregations, and query optimization.",
        "questions": [
            {
                "id": "q1_sql",
                "question_text": "Which clause is used to filter aggregated groups after a GROUP BY operation?",
                "options": ["WHERE", "HAVING", "LIMIT", "FILTER"],
                "correct_option_index": 1,
                "explanation": "HAVING filters aggregated grouped results, whereas WHERE filters individual rows before grouping."
            },
            {
                "id": "q2_sql",
                "question_text": "What type of index is most effective for speeding up exact equality lookups in large relational tables?",
                "options": ["B-Tree Index", "Full Text Index", "Spatial Index", "Hash Index"],
                "correct_option_index": 0,
                "explanation": "B-Tree indexes provide logarithmic time complexity O(log N) for equality and range query lookups."
            }
        ]
    },
    {
        "id": "a_stats",
        "skill_id": "s_stats",
        "title": "Statistical Inference & Hypothesis Testing Assessment",
        "description": "Evaluate concepts in probability distributions, p-values, hypothesis tests, and statistical significance.",
        "questions": [
            {
                "id": "q1_stat",
                "question_text": "In hypothesis testing, what does a p-value less than alpha (e.g., 0.05) indicate?",
                "options": [
                    "The null hypothesis should be rejected in favor of the alternative hypothesis.",
                    "The sample size was too small to make a conclusion.",
                    "The null hypothesis is proven to be 100% true.",
                    "A Type II error definitely occurred."
                ],
                "correct_option_index": 0,
                "explanation": "A p-value below alpha provides sufficient evidence against the null hypothesis, rejecting it at the specified significance level."
            }
        ]
    },
    {
        "id": "a_aws",
        "skill_id": "s_aws",
        "title": "AWS Cloud Infrastructure & Compute Assessment",
        "description": "Assess core competencies in cloud architecture, virtual private clouds, IAM permissions, and EC2 scaling.",
        "questions": [
            {
                "id": "q1_aws",
                "question_text": "Which AWS networking component enables private subnet instances to access the internet while blocking inbound connections?",
                "options": ["Internet Gateway", "NAT Gateway", "Transit Gateway", "Direct Connect"],
                "correct_option_index": 1,
                "explanation": "A NAT (Network Address Translation) Gateway allows private subnet instances outbound connectivity while preventing external internet traffic from initiating connections."
            }
        ]
    },
    {
        "id": "a_cloud_sec",
        "skill_id": "s_cloud_security",
        "title": "Cloud Security & Zero-Trust IAM Assessment",
        "description": "Assess security perimeters, principle of least privilege, and role-based access control.",
        "questions": [
            {
                "id": "q1_sec",
                "question_text": "What is the core principle of Zero-Trust Security architecture?",
                "options": [
                    "Trust any device as long as it connects from an internal corporate network.",
                    "Never trust, always verify: authenticate and authorize every access request continuously.",
                    "Rely solely on perimeter firewalls.",
                    "Disable password expiration policies."
                ],
                "correct_option_index": 1,
                "explanation": "Zero Trust assumes threats exist inside and outside the perimeter, requiring explicit verification and least-privilege access for every request."
            }
        ]
    }
]

DEMO_USER_ID = "usr_alex_demo"
DEMO_PROFILE_ID = "prof_alex_demo"
