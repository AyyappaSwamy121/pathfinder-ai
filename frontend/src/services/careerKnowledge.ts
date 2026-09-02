import { Career, PathStep, Project, Resource, AssessmentDetail, LearnerSkillStatus } from '../types';

export interface CareerKnowledgeProfile {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  required_skills_count: number;
  skills: {
    id: string;
    name: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    weight: number;
    prerequisites: string[];
    resources: Resource[];
    project?: Project;
    assessment?: AssessmentDetail;
  }[];
  phases: {
    number: number;
    title: string;
    objective: string;
    skill_ids: string[];
  }[];
  default_next_action: {
    skill_id: string;
    skill_name: string;
    title: string;
    action_type: 'Assessment' | 'Project' | 'Resource';
    estimated_minutes: number;
    why_now: string;
    cta_label: string;
    item_id: string;
  };
}

export const CAREER_PROFILES: Record<string, CareerKnowledgeProfile> = {
  c_ai_engineer: {
    id: 'c_ai_engineer',
    title: 'AI Engineer',
    category: 'Artificial Intelligence',
    description: 'Design, build, deploy, and monitor scalable Machine Learning and Deep Learning models, LLM pipelines, and production MLOps architecture.',
    icon: 'Cpu',
    required_skills_count: 12,
    skills: [
      {
        id: 's_python',
        name: 'Python Programming',
        category: 'Programming',
        difficulty: 'Beginner',
        weight: 1.0,
        prerequisites: [],
        resources: [
          { id: 'r_py_1', skill_id: 's_python', title: 'Python 3 Core Fundamentals', provider: 'PathFinder Academy', type: 'Course', difficulty: 'Beginner', duration_minutes: 180, url: 'https://docs.python.org/3/' }
        ]
      },
      {
        id: 's_numpy',
        name: 'NumPy Vectorization',
        category: 'Math & Data',
        difficulty: 'Beginner',
        weight: 0.8,
        prerequisites: ['s_python'],
        resources: [
          { id: 'r_np_1', skill_id: 's_numpy', title: 'NumPy Array Computing', provider: 'NumPy Docs', type: 'Tutorial', difficulty: 'Beginner', duration_minutes: 90, url: 'https://numpy.org/' }
        ]
      },
      {
        id: 's_pandas',
        name: 'Pandas Data Wrangling',
        category: 'Math & Data',
        difficulty: 'Intermediate',
        weight: 0.85,
        prerequisites: ['s_numpy'],
        resources: [
          { id: 'r_pd_1', skill_id: 's_pandas', title: 'Data Wrangling with Pandas', provider: 'Kaggle Learn', type: 'Course', difficulty: 'Intermediate', duration_minutes: 120, url: 'https://pandas.pydata.org/' }
        ]
      },
      {
        id: 's_stats',
        name: 'Statistics & Probability',
        category: 'Math & Data',
        difficulty: 'Intermediate',
        weight: 0.9,
        prerequisites: ['s_python'],
        resources: [
          { id: 'r_st_1', skill_id: 's_stats', title: 'Practical Statistics for AI', provider: 'OpenIntro', type: 'Course', difficulty: 'Intermediate', duration_minutes: 110, url: 'https://openintro.org/' }
        ]
      },
      {
        id: 's_ml',
        name: 'Machine Learning Fundamentals',
        category: 'Machine Learning',
        difficulty: 'Intermediate',
        weight: 1.0,
        prerequisites: ['s_pandas', 's_stats'],
        resources: [
          { id: 'r_ml_1', skill_id: 's_ml', title: 'Supervised Learning Algorithms', provider: 'Stanford Online', type: 'Course', difficulty: 'Intermediate', duration_minutes: 240, url: 'https://scikit-learn.org/' }
        ],
        project: {
          id: 'p_churn_pred',
          skill_id: 's_ml',
          title: 'Customer Churn Prediction Engine',
          objective: 'Build and evaluate an end-to-end XGBoost machine learning classifier to predict customer churn.',
          difficulty: 'Intermediate',
          estimated_hours: 12,
          deliverables: ['Jupyter EDA Notebook', 'Scikit-Learn pipeline', 'Evaluation report'],
          portfolio_value: 'Demonstrates enterprise classification modeling and feature importance analysis.'
        }
      },
      {
        id: 's_model_eval',
        name: 'Model Evaluation & Metrics',
        category: 'Machine Learning',
        difficulty: 'Intermediate',
        weight: 0.95,
        prerequisites: ['s_ml'],
        assessment: {
          id: 'a_model_eval',
          skill_id: 's_model_eval',
          skill_name: 'Model Evaluation & Metrics',
          title: 'Model Evaluation & Metrics Micro-Assessment',
          description: 'Assess understanding of ROC-AUC, precision, recall, and cross-validation techniques.',
          questions: [
            {
              id: 'q1',
              question_text: 'In an imbalanced diagnosis dataset where false negatives are fatal, which metric must be maximized?',
              options: ['Precision', 'Recall (Sensitivity)', 'Specificity', 'Accuracy']
            },
            {
              id: 'q2',
              question_text: 'What does an ROC-AUC score of 0.5 indicate?',
              options: ['Perfect classification', 'Random chance discrimination', 'Severe overfitting', 'Zero false positive rate']
            }
          ]
        },
        resources: [
          { id: 'r_ev_1', skill_id: 's_model_eval', title: 'Classification Metrics & ROC Curves', provider: 'PathFinder Academy', type: 'Tutorial', difficulty: 'Intermediate', duration_minutes: 60, url: 'https://scikit-learn.org/' }
        ]
      },
      {
        id: 's_deep_learning',
        name: 'Deep Learning & Neural Networks',
        category: 'Deep Learning',
        difficulty: 'Advanced',
        weight: 1.0,
        prerequisites: ['s_model_eval'],
        resources: [
          { id: 'r_dl_1', skill_id: 's_deep_learning', title: 'Deep Learning Specialization', provider: 'DeepLearning.AI', type: 'Course', difficulty: 'Advanced', duration_minutes: 300, url: 'https://deeplearning.ai/' }
        ]
      },
      {
        id: 's_pytorch',
        name: 'PyTorch Framework',
        category: 'Deep Learning',
        difficulty: 'Advanced',
        weight: 0.95,
        prerequisites: ['s_deep_learning'],
        project: {
          id: 'p_image_classifier',
          skill_id: 's_pytorch',
          title: 'PyTorch Multi-Class Image Classifier',
          objective: 'Design and train a PyTorch ResNet model with custom transfer learning on medical imaging data.',
          difficulty: 'Advanced',
          estimated_hours: 16,
          deliverables: ['PyTorch Lightning module', 'Custom dataset class', 'TensorBoard training logs'],
          portfolio_value: 'Proves deep learning capability with computer vision and custom PyTorch architecture design.'
        },
        resources: [
          { id: 'r_pt_1', skill_id: 's_pytorch', title: 'PyTorch Deep Learning Blitz', provider: 'PyTorch.org', type: 'Course', difficulty: 'Advanced', duration_minutes: 120, url: 'https://pytorch.org/' }
        ]
      },
      {
        id: 's_transformers',
        name: 'Transformers & LLM Pipelines',
        category: 'Deep Learning',
        difficulty: 'Advanced',
        weight: 0.95,
        prerequisites: ['s_pytorch'],
        project: {
          id: 'p_rag_assistant',
          skill_id: 's_transformers',
          title: 'RAG Knowledge Retrieval Assistant',
          objective: 'Develop a Retrieval-Augmented Generation pipeline using HuggingFace Transformers, ChromaDB, and FastAPI.',
          difficulty: 'Advanced',
          estimated_hours: 20,
          deliverables: ['FastAPI service', 'Vector database index pipeline', 'LangChain/HuggingFace prompt wrapper'],
          portfolio_value: 'High impact modern AI engineering project demonstrating cutting-edge LLM integration.'
        },
        resources: [
          { id: 'r_tr_1', skill_id: 's_transformers', title: 'HuggingFace NLP Course', provider: 'HuggingFace', type: 'Course', difficulty: 'Advanced', duration_minutes: 180, url: 'https://huggingface.co/' }
        ]
      },
      {
        id: 's_docker',
        name: 'Docker & Containerization',
        category: 'DevOps & MLOps',
        difficulty: 'Intermediate',
        weight: 0.85,
        prerequisites: ['s_python'],
        resources: [
          { id: 'r_dk_1', skill_id: 's_docker', title: 'Docker for AI Engineers', provider: 'Docker Docs', type: 'Tutorial', difficulty: 'Intermediate', duration_minutes: 90, url: 'https://docs.docker.com/' }
        ]
      },
      {
        id: 's_model_deployment',
        name: 'Model Deployment & Serving',
        category: 'DevOps & MLOps',
        difficulty: 'Advanced',
        weight: 0.9,
        prerequisites: ['s_docker', 's_model_eval'],
        project: {
          id: 'p_ml_api_deploy',
          skill_id: 's_model_deployment',
          title: 'Production ML Inference Microservice',
          objective: 'Containerize a trained machine learning model inside Docker with FastAPI, logging, and rate limiting.',
          difficulty: 'Advanced',
          estimated_hours: 14,
          deliverables: ['Dockerfile & docker-compose', 'FastAPI inference service', 'Locust load test report'],
          portfolio_value: 'Exhibits production readiness by bridging data science models with cloud web service architecture.'
        },
        resources: [
          { id: 'r_md_1', skill_id: 's_model_deployment', title: 'Production Model Serving', provider: 'MLSys Guide', type: 'Tutorial', difficulty: 'Advanced', duration_minutes: 120, url: 'https://madewithml.com/' }
        ]
      },
      {
        id: 's_mlops',
        name: 'MLOps & Experiment Tracking',
        category: 'DevOps & MLOps',
        difficulty: 'Advanced',
        weight: 0.9,
        prerequisites: ['s_model_deployment'],
        resources: [
          { id: 'r_mo_1', skill_id: 's_mlops', title: 'MLflow & MLOps Lifecycle', provider: 'MLflow Docs', type: 'Tutorial', difficulty: 'Advanced', duration_minutes: 150, url: 'https://mlflow.org/' }
        ]
      }
    ],
    phases: [
      { number: 1, title: 'Phase 1: Foundations', objective: 'Master Python, NumPy vectorization, and statistical principles.', skill_ids: ['s_python', 's_numpy', 's_pandas', 's_stats'] },
      { number: 2, title: 'Phase 2: Core Modeling', objective: 'Train supervised machine learning models and validate with evaluation metrics.', skill_ids: ['s_ml', 's_model_eval'] },
      { number: 3, title: 'Phase 3: Deep Learning & LLMs', objective: 'Design neural networks, PyTorch modules, and Transformer RAG pipelines.', skill_ids: ['s_deep_learning', 's_pytorch', 's_transformers'] },
      { number: 4, title: 'Phase 4: MLOps Infrastructure', objective: 'Containerize inference microservices with Docker and automated deployment.', skill_ids: ['s_docker', 's_model_deployment'] },
      { number: 5, title: 'Phase 5: Production Capstone', objective: 'Deliver a complete automated MLOps tracking and monitoring pipeline.', skill_ids: ['s_mlops'] }
    ],
    default_next_action: {
      skill_id: 's_model_eval',
      skill_name: 'Model Evaluation & Metrics',
      title: 'Master Model Evaluation & ROC Analysis',
      action_type: 'Assessment',
      estimated_minutes: 60,
      why_now: 'Critical prerequisite before advancing to deep neural networks and transformer architectures.',
      cta_label: 'Start Micro-Assessment',
      item_id: 'a_model_eval'
    }
  },

  c_data_scientist: {
    id: 'c_data_scientist',
    title: 'Data Scientist',
    category: 'Data Science',
    description: 'Extract meaningful insights from unstructured data, build predictive statistical models, perform hypothesis testing, and drive executive strategy.',
    icon: 'LineChart',
    required_skills_count: 11,
    skills: [
      {
        id: 's_python',
        name: 'Python Programming',
        category: 'Programming',
        difficulty: 'Beginner',
        weight: 1.0,
        prerequisites: [],
        resources: [
          { id: 'r_py_ds', skill_id: 's_python', title: 'Python for Data Science Core', provider: 'PathFinder Academy', type: 'Course', difficulty: 'Beginner', duration_minutes: 180, url: 'https://docs.python.org/3/' }
        ]
      },
      {
        id: 's_sql',
        name: 'SQL & Relational Databases',
        category: 'Databases',
        difficulty: 'Intermediate',
        weight: 1.0,
        prerequisites: [],
        assessment: {
          id: 'a_sql',
          skill_id: 's_sql',
          skill_name: 'SQL & Relational Databases',
          title: 'SQL Query & Join Mastery Assessment',
          description: 'Evaluate multi-table joins, subqueries, aggregations, and window functions.',
          questions: [
            {
              id: 'q1_sql',
              question_text: 'Which SQL clause is used to filter aggregated results produced by GROUP BY?',
              options: ['WHERE', 'HAVING', 'QUALIFY', 'ORDER BY']
            },
            {
              id: 'q2_sql',
              question_text: 'What is the primary difference between UNION and UNION ALL?',
              options: ['UNION eliminates duplicate rows; UNION ALL retains all rows.', 'UNION ALL is slower.', 'UNION only works on numbers.', 'There is no difference.']
            }
          ]
        },
        resources: [
          { id: 'r_sql_ds', skill_id: 's_sql', title: 'Advanced SQL Query Optimization', provider: 'PostgreSQL Docs', type: 'Course', difficulty: 'Intermediate', duration_minutes: 150, url: 'https://www.postgresql.org/docs/' }
        ]
      },
      {
        id: 's_stats',
        name: 'Statistical Inference & Probability',
        category: 'Math & Data',
        difficulty: 'Intermediate',
        weight: 1.0,
        prerequisites: ['s_python'],
        assessment: {
          id: 'a_stats',
          skill_id: 's_stats',
          skill_name: 'Statistical Inference & Probability',
          title: 'Statistical Hypothesis Testing Assessment',
          description: 'Assess concepts in p-values, z-scores, confidence intervals, and hypothesis testing.',
          questions: [
            {
              id: 'q1_stat',
              question_text: 'In hypothesis testing, what does a p-value < 0.05 signify?',
              options: ['Reject the null hypothesis with statistical significance.', 'The null hypothesis is definitely true.', 'The test had insufficient sample size.', 'The data is normally distributed.']
            }
          ]
        },
        resources: [
          { id: 'r_stat_ds', skill_id: 's_stats', title: 'Inferential Statistics for Science', provider: 'OpenIntro', type: 'Course', difficulty: 'Intermediate', duration_minutes: 120, url: 'https://openintro.org/' }
        ]
      },
      {
        id: 's_pandas',
        name: 'Pandas Data Wrangling',
        category: 'Math & Data',
        difficulty: 'Intermediate',
        weight: 0.95,
        prerequisites: ['s_python'],
        resources: [
          { id: 'r_pd_ds', skill_id: 's_pandas', title: 'Pandas Data Wrangling & Transformations', provider: 'Kaggle Learn', type: 'Tutorial', difficulty: 'Intermediate', duration_minutes: 120, url: 'https://pandas.pydata.org/' }
        ]
      },
      {
        id: 's_data_viz',
        name: 'Exploratory Data Analysis (EDA)',
        category: 'Analytics',
        difficulty: 'Intermediate',
        weight: 0.9,
        prerequisites: ['s_pandas'],
        resources: [
          { id: 'r_dv_ds', skill_id: 's_data_viz', title: 'Statistical Data Visualization (Seaborn)', provider: 'Seaborn Docs', type: 'Tutorial', difficulty: 'Intermediate', duration_minutes: 90, url: 'https://seaborn.pydata.org/' }
        ]
      },
      {
        id: 's_ml',
        name: 'Machine Learning Algorithms',
        category: 'Machine Learning',
        difficulty: 'Intermediate',
        weight: 0.95,
        prerequisites: ['s_stats', 's_pandas'],
        resources: [
          { id: 'r_ml_ds', skill_id: 's_ml', title: 'Statistical Learning & Scikit-Learn', provider: 'Coursera', type: 'Course', difficulty: 'Intermediate', duration_minutes: 240, url: 'https://scikit-learn.org/' }
        ]
      },
      {
        id: 's_feature_engineering',
        name: 'Feature Engineering & Selection',
        category: 'Machine Learning',
        difficulty: 'Advanced',
        weight: 0.95,
        prerequisites: ['s_ml'],
        project: {
          id: 'p_sales_forecast',
          skill_id: 's_feature_engineering',
          title: 'Predictive Sales Forecasting Pipeline',
          objective: 'Engineer time-series lag features, rolling averages, and encoding strategies to build a high-precision forecasting model.',
          difficulty: 'Intermediate',
          estimated_hours: 14,
          deliverables: ['Feature transformation pipeline', 'Model validation notebook', 'Feature importance summary'],
          portfolio_value: 'Demonstrates end-to-end data science domain feature engineering.'
        },
        resources: [
          { id: 'r_fe_ds', skill_id: 's_feature_engineering', title: 'Feature Engineering Techniques', provider: 'Kaggle', type: 'Tutorial', difficulty: 'Advanced', duration_minutes: 110, url: 'https://kaggle.com/' }
        ]
      },
      {
        id: 's_ab_testing',
        name: 'A/B Testing & Controlled Experiments',
        category: 'Analytics',
        difficulty: 'Intermediate',
        weight: 0.9,
        prerequisites: ['s_stats'],
        project: {
          id: 'p_ab_experiment',
          skill_id: 's_ab_testing',
          title: 'E-Commerce A/B Testing & Lift Analysis',
          objective: 'Design a controlled experiment, calculate minimum sample sizes, run statistical hypothesis tests, and recommend business strategy.',
          difficulty: 'Intermediate',
          estimated_hours: 10,
          deliverables: ['A/B test experimental design doc', 'Python analysis script', 'Executive decision memo'],
          portfolio_value: 'Proves practical experimentation and statistical decision-making rigor.'
        },
        resources: [
          { id: 'r_ab_ds', skill_id: 's_ab_testing', title: 'Controlled Experimentation in Production', provider: 'Towards Data Science', type: 'Article', difficulty: 'Intermediate', duration_minutes: 75, url: 'https://towardsdatascience.com/' }
        ]
      }
    ],
    phases: [
      { number: 1, title: 'Phase 1: Data Foundations & SQL', objective: 'Master Python fundamentals and relational SQL querying.', skill_ids: ['s_python', 's_sql'] },
      { number: 2, title: 'Phase 2: Statistical Inference & Wrangling', objective: 'Wrangle datasets with Pandas and apply hypothesis testing.', skill_ids: ['s_stats', 's_pandas'] },
      { number: 3, title: 'Phase 3: Exploratory Analysis & EDA', objective: 'Uncover patterns and visualize distributions with Seaborn/Matplotlib.', skill_ids: ['s_data_viz'] },
      { number: 4, title: 'Phase 4: Predictive Modeling & ML', objective: 'Train regression and classification models with Scikit-Learn.', skill_ids: ['s_ml', 's_feature_engineering'] },
      { number: 5, title: 'Phase 5: A/B Testing & Experimentation', objective: 'Design controlled A/B experiments and complete the data science capstone.', skill_ids: ['s_ab_testing'] }
    ],
    default_next_action: {
      skill_id: 's_stats',
      skill_name: 'Statistical Inference & Probability',
      title: 'Statistical Hypothesis Testing',
      action_type: 'Assessment',
      estimated_minutes: 75,
      why_now: 'Core statistical foundation required for A/B testing and predictive modeling.',
      cta_label: 'Start Assessment',
      item_id: 'a_stats'
    }
  },

  c_fullstack_dev: {
    id: 'c_fullstack_dev',
    title: 'Full Stack Developer',
    category: 'Software Engineering',
    description: 'Engineer modern web applications from responsive interactive user interfaces to robust microservice backend architectures and relational databases.',
    icon: 'Code2',
    required_skills_count: 11,
    skills: [
      {
        id: 's_html_css',
        name: 'HTML5 & Responsive CSS Grid',
        category: 'Web',
        difficulty: 'Beginner',
        weight: 0.9,
        prerequisites: [],
        resources: [
          { id: 'r_html_fs', skill_id: 's_html_css', title: 'Modern HTML5 & Responsive CSS Grid', provider: 'MDN Web Docs', type: 'Course', difficulty: 'Beginner', duration_minutes: 90, url: 'https://developer.mozilla.org/' }
        ]
      },
      {
        id: 's_typescript',
        name: 'TypeScript & JavaScript ES6+',
        category: 'Web',
        difficulty: 'Intermediate',
        weight: 0.95,
        prerequisites: ['s_html_css'],
        resources: [
          { id: 'r_ts_fs', skill_id: 's_typescript', title: 'TypeScript Handbook & Type System', provider: 'TypeScript Docs', type: 'Course', difficulty: 'Intermediate', duration_minutes: 120, url: 'https://www.typescriptlang.org/' }
        ]
      },
      {
        id: 's_react',
        name: 'React.js & Modern Hooks',
        category: 'Web Frameworks',
        difficulty: 'Intermediate',
        weight: 1.0,
        prerequisites: ['s_typescript'],
        assessment: {
          id: 'a_react',
          skill_id: 's_react',
          skill_name: 'React.js & Modern Hooks',
          title: 'React Architecture & State Management Assessment',
          description: 'Assess virtual DOM reconciliation, custom hooks, and state management.',
          questions: [
            {
              id: 'q1_r',
              question_text: 'What problem does the Virtual DOM solve in single-page React applications?',
              options: ['Eliminates the need for JavaScript', 'Batches and computes minimal DOM diffs to prevent expensive browser repaints', 'Replaces backend REST APIs', 'Generates compiled C++ binaries']
            },
            {
              id: 'q2_r',
              question_text: 'When should the useMemo hook be applied in a component?',
              options: ['On every variable declaration', 'To memoize expensive calculation results across re-renders', 'Only for making HTTP requests', 'To handle routing']
            }
          ]
        },
        project: {
          id: 'p_fullstack_saas',
          skill_id: 's_react',
          title: 'Interactive SaaS Collaboration Platform',
          objective: 'Engineer a responsive React single-page application with TypeScript, state management, and dashboard analytics.',
          difficulty: 'Intermediate',
          estimated_hours: 16,
          deliverables: ['React SPA repository', 'Tailwind CSS component library', 'Jest/RTL test suite'],
          portfolio_value: 'Proves frontend component architecture and complex UI state management for production web apps.'
        },
        resources: [
          { id: 'r_rc_fs', skill_id: 's_react', title: 'React.js Documentation & Modern Hooks', provider: 'React.dev', type: 'Course', difficulty: 'Intermediate', duration_minutes: 150, url: 'https://react.dev/' }
        ]
      },
      {
        id: 's_nodejs',
        name: 'Node.js & Express Architecture',
        category: 'Web Frameworks',
        difficulty: 'Intermediate',
        weight: 0.9,
        prerequisites: ['s_typescript'],
        project: {
          id: 'p_rest_microservices',
          skill_id: 's_nodejs',
          title: 'Scalable RESTful Backend Microservices',
          objective: 'Build a secure REST API with Node.js/Express, JWT authentication, and PostgreSQL integration.',
          difficulty: 'Intermediate',
          estimated_hours: 14,
          deliverables: ['Node/Express API repository', 'Swagger / OpenAPI specification', 'Postman test collection'],
          portfolio_value: 'Validates ability to engineer production backend services handling authentication and relational data.'
        },
        resources: [
          { id: 'r_node_fs', skill_id: 's_nodejs', title: 'Node.js Async Runtime & Express Middleware', provider: 'Node.js Guides', type: 'Tutorial', difficulty: 'Intermediate', duration_minutes: 120, url: 'https://nodejs.org/' }
        ]
      },
      {
        id: 's_rest_api',
        name: 'RESTful API & Auth Design',
        category: 'Web Frameworks',
        difficulty: 'Intermediate',
        weight: 0.95,
        prerequisites: ['s_nodejs'],
        resources: [
          { id: 'r_rest_fs', skill_id: 's_rest_api', title: 'REST API Best Practices & Security', provider: 'MDN Web Docs', type: 'Article', difficulty: 'Intermediate', duration_minutes: 75, url: 'https://developer.mozilla.org/' }
        ]
      },
      {
        id: 's_sql',
        name: 'PostgreSQL Relational Schema Design',
        category: 'Databases',
        difficulty: 'Intermediate',
        weight: 0.9,
        prerequisites: [],
        resources: [
          { id: 'r_sql_fs', skill_id: 's_sql', title: 'PostgreSQL & Database Modeling', provider: 'PostgreSQL Docs', type: 'Course', difficulty: 'Intermediate', duration_minutes: 120, url: 'https://www.postgresql.org/' }
        ]
      },
      {
        id: 's_docker',
        name: 'Docker Containerization',
        category: 'DevOps & MLOps',
        difficulty: 'Intermediate',
        weight: 0.85,
        prerequisites: ['s_rest_api'],
        resources: [
          { id: 'r_dk_fs', skill_id: 's_docker', title: 'Docker Compose for Full Stack Apps', provider: 'Docker Docs', type: 'Tutorial', difficulty: 'Intermediate', duration_minutes: 90, url: 'https://docs.docker.com/' }
        ]
      },
      {
        id: 's_system_design',
        name: 'Full Stack System Design Architecture',
        category: 'Software Engineering',
        difficulty: 'Advanced',
        weight: 0.9,
        prerequisites: ['s_docker', 's_sql'],
        resources: [
          { id: 'r_sd_fs', skill_id: 's_system_design', title: 'Scalable System Architecture & Caching', provider: 'System Design Primer', type: 'Article', difficulty: 'Advanced', duration_minutes: 150, url: 'https://github.com/donnemartin/system-design-primer' }
        ]
      }
    ],
    phases: [
      { number: 1, title: 'Phase 1: Web & Language Fundamentals', objective: 'Master HTML5, modern CSS layouts, and TypeScript typing.', skill_ids: ['s_html_css', 's_typescript'] },
      { number: 2, title: 'Phase 2: React & Modern Frontend', objective: 'Build modular single page applications and custom React hooks.', skill_ids: ['s_react'] },
      { number: 3, title: 'Phase 3: Backend & REST Services', objective: 'Create asynchronous REST APIs with Node.js and Express.', skill_ids: ['s_nodejs', 's_rest_api'] },
      { number: 4, title: 'Phase 4: Database Architecture & Docker', objective: 'Model PostgreSQL relational schemas and containerize with Docker.', skill_ids: ['s_sql', 's_docker'] },
      { number: 5, title: 'Phase 5: Full Stack Production Capstone', objective: 'Design scalable full-stack system architecture with microservices.', skill_ids: ['s_system_design'] }
    ],
    default_next_action: {
      skill_id: 's_react',
      skill_name: 'React.js & Modern Hooks',
      title: 'React Component & Hook Architecture',
      action_type: 'Assessment',
      estimated_minutes: 60,
      why_now: 'Core frontend competency needed to bridge TypeScript skills into full-stack applications.',
      cta_label: 'Start Assessment',
      item_id: 'a_react'
    }
  },

  c_data_analyst: {
    id: 'c_data_analyst',
    title: 'Data Analyst',
    category: 'Analytics',
    description: 'Transform operational raw data into actionable dashboards, perform SQL analytics, build business intelligence reports, and track KPIs.',
    icon: 'BarChart3',
    required_skills_count: 6,
    skills: [
      {
        id: 's_excel',
        name: 'Advanced Excel Analytics',
        category: 'Analytics',
        difficulty: 'Beginner',
        weight: 0.9,
        prerequisites: [],
        resources: [
          { id: 'r_xl_da', skill_id: 's_excel', title: 'Advanced Excel & Financial Modeling', provider: 'Excel Campus', type: 'Course', difficulty: 'Beginner', duration_minutes: 90, url: 'https://support.microsoft.com/excel' }
        ]
      },
      {
        id: 's_sql',
        name: 'SQL Query & Aggregation Mastery',
        category: 'Databases',
        difficulty: 'Intermediate',
        weight: 1.0,
        prerequisites: [],
        assessment: {
          id: 'a_sql',
          skill_id: 's_sql',
          skill_name: 'SQL Query & Aggregation Mastery',
          title: 'SQL Analytics & Reporting Assessment',
          description: 'Assess relational database querying, multi-table joins, aggregations, and window functions.',
          questions: [
            {
              id: 'q1_sql_da',
              question_text: 'Which SQL window function assigns a unique sequential integer to rows within a partition?',
              options: ['ROW_NUMBER()', 'RANK()', 'DENSE_RANK()', 'COUNT()']
            }
          ]
        },
        project: {
          id: 'p_sql_analytics',
          skill_id: 's_sql',
          title: 'E-Commerce Relational Analytics Pipeline',
          objective: 'Write complex SQL analytics utilizing window functions, CTEs, and cohort aggregations to uncover user retention trends.',
          difficulty: 'Intermediate',
          estimated_hours: 8,
          deliverables: ['PostgreSQL query scripts', 'Cohort retention analysis table', 'Data optimization benchmark'],
          portfolio_value: 'Demonstrates advanced SQL proficiency for database reporting and business intelligence.'
        },
        resources: [
          { id: 'r_sql_da', skill_id: 's_sql', title: 'PostgreSQL Analytics & Aggregations', provider: 'PostgreSQL Docs', type: 'Course', difficulty: 'Intermediate', duration_minutes: 120, url: 'https://www.postgresql.org/' }
        ]
      },
      {
        id: 's_stats',
        name: 'Descriptive & Business Statistics',
        category: 'Math & Data',
        difficulty: 'Intermediate',
        weight: 0.85,
        prerequisites: ['s_excel'],
        resources: [
          { id: 'r_st_da', skill_id: 's_stats', title: 'Descriptive Statistics for Analysts', provider: 'OpenIntro', type: 'Course', difficulty: 'Intermediate', duration_minutes: 90, url: 'https://openintro.org/' }
        ]
      },
      {
        id: 's_pandas',
        name: 'Python & Pandas Data Cleaning',
        category: 'Math & Data',
        difficulty: 'Intermediate',
        weight: 0.85,
        prerequisites: ['s_stats'],
        resources: [
          { id: 'r_pd_da', skill_id: 's_pandas', title: 'Automating Cleaning with Pandas', provider: 'Kaggle', type: 'Tutorial', difficulty: 'Intermediate', duration_minutes: 110, url: 'https://pandas.pydata.org/' }
        ]
      },
      {
        id: 's_tableau',
        name: 'Tableau & PowerBI Dashboarding',
        category: 'Analytics',
        difficulty: 'Intermediate',
        weight: 1.0,
        prerequisites: ['s_sql'],
        project: {
          id: 'p_exec_dashboard',
          skill_id: 's_tableau',
          title: 'Executive Business Intelligence KPI Dashboard',
          objective: 'Connect multi-table SQL data sources into an interactive Tableau/PowerBI dashboard tracking revenue, churn, and cohort metrics.',
          difficulty: 'Intermediate',
          estimated_hours: 10,
          deliverables: ['Interactive Tableau dashboard workbook', 'SQL data transformation queries', 'Executive summary slides'],
          portfolio_value: 'Demonstrates executive reporting and visual data storytelling driving business decisions.'
        },
        resources: [
          { id: 'r_tb_da', skill_id: 's_tableau', title: 'Tableau Visual Analytics & Storytelling', provider: 'Tableau Training', type: 'Course', difficulty: 'Intermediate', duration_minutes: 140, url: 'https://www.tableau.com/' }
        ]
      },
      {
        id: 's_data_viz',
        name: 'Data Visualization & Storytelling',
        category: 'Analytics',
        difficulty: 'Intermediate',
        weight: 0.9,
        prerequisites: ['s_tableau'],
        resources: [
          { id: 'r_dv_da', skill_id: 's_data_viz', title: 'Visual Storytelling for Executives', provider: 'Harvard Business Review', type: 'Article', difficulty: 'Intermediate', duration_minutes: 60, url: 'https://hbr.org/' }
        ]
      }
    ],
    phases: [
      { number: 1, title: 'Phase 1: Spreadsheet & Business Modeling', objective: 'Master advanced Excel functions, pivot tables, and financial formulas.', skill_ids: ['s_excel'] },
      { number: 2, title: 'Phase 2: Relational SQL Analytics', objective: 'Write multi-table joins, aggregations, and window functions in SQL.', skill_ids: ['s_sql'] },
      { number: 3, title: 'Phase 3: Business Statistics', objective: 'Apply statistical analysis and distributions to business data.', skill_ids: ['s_stats'] },
      { number: 4, title: 'Phase 4: Automated Data Cleaning', objective: 'Clean, filter, and summarize data using Python & Pandas.', skill_ids: ['s_pandas'] },
      { number: 5, title: 'Phase 5: Executive Dashboard Capstone', objective: 'Deliver an interactive Tableau/PowerBI KPI dashboard.', skill_ids: ['s_tableau', 's_data_viz'] }
    ],
    default_next_action: {
      skill_id: 's_sql',
      skill_name: 'SQL Query & Aggregation Mastery',
      title: 'Master SQL Analytics Queries',
      action_type: 'Assessment',
      estimated_minutes: 50,
      why_now: 'The core language of analytics, essential for pulling data and building dashboards.',
      cta_label: 'Start Assessment',
      item_id: 'a_sql'
    }
  },

  c_cloud_engineer: {
    id: 'c_cloud_engineer',
    title: 'Cloud Engineer',
    category: 'Cloud & Infrastructure',
    description: 'Architect, provision, and maintain secure resilient cloud infrastructure on AWS, automate CI/CD pipelines, and orchestrate containers with Kubernetes.',
    icon: 'Cloud',
    required_skills_count: 8,
    skills: [
      {
        id: 's_linux',
        name: 'Linux Administration & Bash Scripting',
        category: 'Infrastructure',
        difficulty: 'Beginner',
        weight: 0.95,
        prerequisites: [],
        resources: [
          { id: 'r_lx_cl', skill_id: 's_linux', title: 'Linux CLI & Administration Mastery', provider: 'Linux Foundation', type: 'Course', difficulty: 'Beginner', duration_minutes: 100, url: 'https://linuxfoundation.org/' }
        ]
      },
      {
        id: 's_networking',
        name: 'Networking Protocols (TCP/IP, DNS, VPC)',
        category: 'Security',
        difficulty: 'Intermediate',
        weight: 0.9,
        prerequisites: ['s_linux'],
        resources: [
          { id: 'r_nw_cl', skill_id: 's_networking', title: 'Networking Fundamentals for Cloud', provider: 'Cisco Networking Academy', type: 'Course', difficulty: 'Intermediate', duration_minutes: 120, url: 'https://netacad.com/' }
        ]
      },
      {
        id: 's_aws',
        name: 'AWS Cloud Infrastructure Architecture',
        category: 'Infrastructure',
        difficulty: 'Intermediate',
        weight: 1.0,
        prerequisites: ['s_linux', 's_networking'],
        assessment: {
          id: 'a_aws',
          skill_id: 's_aws',
          skill_name: 'AWS Cloud Infrastructure Architecture',
          title: 'AWS Compute & VPC Fundamentals Assessment',
          description: 'Assess knowledge of EC2, Auto Scaling, Application Load Balancers, and VPC subnets.',
          questions: [
            {
              id: 'q1_aws_cl',
              question_text: 'Which AWS service provides managed relational databases with automated backups and read replicas?',
              options: ['Amazon RDS', 'Amazon S3', 'Amazon DynamoDB', 'Amazon EC2']
            }
          ]
        },
        project: {
          id: 'p_cloud_infra',
          skill_id: 's_aws',
          title: 'Resilient Multi-Tier AWS Infrastructure',
          objective: 'Architect a highly available cloud infrastructure on AWS utilizing EC2 Auto Scaling, ALB, S3, and RDS.',
          difficulty: 'Advanced',
          estimated_hours: 16,
          deliverables: ['Terraform configuration', 'VPC architecture diagram', 'Failover recovery test report'],
          portfolio_value: 'Demonstrates enterprise-grade cloud architecture design and resilient infrastructure provisioning.'
        },
        resources: [
          { id: 'r_aws_cl', skill_id: 's_aws', title: 'AWS Solutions Architect Essentials', provider: 'AWS Skill Builder', type: 'Course', difficulty: 'Intermediate', duration_minutes: 180, url: 'https://aws.amazon.com/' }
        ]
      },
      {
        id: 's_docker',
        name: 'Docker & Containerization',
        category: 'DevOps & MLOps',
        difficulty: 'Intermediate',
        weight: 0.95,
        prerequisites: ['s_linux'],
        resources: [
          { id: 'r_dk_cl', skill_id: 's_docker', title: 'Docker Containerization Essentials', provider: 'Docker Docs', type: 'Tutorial', difficulty: 'Intermediate', duration_minutes: 90, url: 'https://docs.docker.com/' }
        ]
      },
      {
        id: 's_kubernetes',
        name: 'Kubernetes Cluster Orchestration',
        category: 'DevOps & MLOps',
        difficulty: 'Advanced',
        weight: 0.95,
        prerequisites: ['s_docker'],
        project: {
          id: 'p_k8s_cluster',
          skill_id: 's_kubernetes',
          title: 'Containerized Microservice Kubernetes Deployment',
          objective: 'Deploy a multi-service web application onto a Kubernetes cluster with Helm charts, Ingress, and auto-scaling.',
          difficulty: 'Advanced',
          estimated_hours: 18,
          deliverables: ['Kubernetes manifest YAMLs', 'Helm chart package', 'Cluster autoscaling verification logs'],
          portfolio_value: 'Proves container orchestration and enterprise DevOps delivery competency.'
        },
        resources: [
          { id: 'r_k8s_cl', skill_id: 's_kubernetes', title: 'Kubernetes Up & Running', provider: 'Kubernetes.io', type: 'Course', difficulty: 'Advanced', duration_minutes: 180, url: 'https://kubernetes.io/' }
        ]
      },
      {
        id: 's_cicd',
        name: 'CI/CD Pipelines (GitHub Actions)',
        category: 'DevOps & MLOps',
        difficulty: 'Intermediate',
        weight: 0.9,
        prerequisites: ['s_docker'],
        resources: [
          { id: 'r_ci_cl', skill_id: 's_cicd', title: 'Automated CI/CD Workflows', provider: 'GitHub Actions Docs', type: 'Tutorial', difficulty: 'Intermediate', duration_minutes: 90, url: 'https://github.com/features/actions' }
        ]
      },
      {
        id: 's_cloud_security',
        name: 'Cloud Security & IAM Governance',
        category: 'Security',
        difficulty: 'Intermediate',
        weight: 0.85,
        prerequisites: ['s_aws'],
        resources: [
          { id: 'r_cs_cl', skill_id: 's_cloud_security', title: 'Zero-Trust Cloud Governance', provider: 'Cloud Security Alliance', type: 'Course', difficulty: 'Intermediate', duration_minutes: 110, url: 'https://cloudsecurityalliance.org/' }
        ]
      }
    ],
    phases: [
      { number: 1, title: 'Phase 1: Systems & Networking Core', objective: 'Master Linux CLI, shell scripting, and TCP/IP networking.', skill_ids: ['s_linux', 's_networking'] },
      { number: 2, title: 'Phase 2: Cloud Fundamentals & AWS', objective: 'Deploy compute instances, VPC subnets, and IAM policies.', skill_ids: ['s_aws'] },
      { number: 3, title: 'Phase 3: Containerization & Docker', objective: 'Package services into reproducible multi-stage Docker containers.', skill_ids: ['s_docker'] },
      { number: 4, title: 'Phase 4: Orchestration & CI/CD', objective: 'Deploy clusters with Kubernetes and automate with GitHub Actions.', skill_ids: ['s_kubernetes', 's_cicd'] },
      { number: 5, title: 'Phase 5: Resilient Infrastructure Capstone', objective: 'Audit governance and deliver auto-scaling cloud infrastructure.', skill_ids: ['s_cloud_security'] }
    ],
    default_next_action: {
      skill_id: 's_aws',
      skill_name: 'AWS Cloud Infrastructure Architecture',
      title: 'Master AWS Compute & VPC Architecture',
      action_type: 'Assessment',
      estimated_minutes: 60,
      why_now: 'Core cloud provider foundation required before deploying containers and orchestration clusters.',
      cta_label: 'Start Assessment',
      item_id: 'a_aws'
    }
  },

  c_cybersecurity: {
    id: 'c_cybersecurity',
    title: 'Cybersecurity Engineer',
    category: 'Security',
    description: 'Protect critical digital infrastructure, audit network security, perform penetration testing, analyze vulnerabilities, and enforce cloud governance.',
    icon: 'ShieldCheck',
    required_skills_count: 6,
    skills: [
      {
        id: 's_linux',
        name: 'Linux Security & System Hardening',
        category: 'Infrastructure',
        difficulty: 'Beginner',
        weight: 1.0,
        prerequisites: [],
        resources: [
          { id: 'r_lx_sec', skill_id: 's_linux', title: 'Linux System Hardening & Auditing', provider: 'Linux Foundation', type: 'Course', difficulty: 'Beginner', duration_minutes: 100, url: 'https://linuxfoundation.org/' }
        ]
      },
      {
        id: 's_networking',
        name: 'Network Protocols, Firewalls & Cryptography',
        category: 'Security',
        difficulty: 'Intermediate',
        weight: 1.0,
        prerequisites: ['s_linux'],
        resources: [
          { id: 'r_nw_sec', skill_id: 's_networking', title: 'TCP/IP Sockets, TLS, and Firewalls', provider: 'Cisco Academy', type: 'Course', difficulty: 'Intermediate', duration_minutes: 130, url: 'https://netacad.com/' }
        ]
      },
      {
        id: 's_cloud_security',
        name: 'Zero-Trust Cloud IAM & Governance',
        category: 'Security',
        difficulty: 'Intermediate',
        weight: 0.95,
        prerequisites: ['s_networking'],
        assessment: {
          id: 'a_cloud_sec',
          skill_id: 's_cloud_security',
          skill_name: 'Zero-Trust Cloud IAM & Governance',
          title: 'Cloud Security Architecture Assessment',
          description: 'Assess security perimeters, zero-trust principles, and least-privilege IAM policies.',
          questions: [
            {
              id: 'q1_sec_cy',
              question_text: 'What is the primary philosophy behind Zero-Trust Architecture?',
              options: ['Perimeter firewalls guarantee safety', 'Never trust, always verify every incoming request', 'Store keys in source code', 'Disable multi-factor authentication']
            }
          ]
        },
        project: {
          id: 'p_security_audit',
          skill_id: 's_cloud_security',
          title: 'Zero-Trust Cloud IAM & Network Security Audit',
          objective: 'Perform a comprehensive security audit on cloud infrastructure, enforcing least privilege access, TLS, and audit logging.',
          difficulty: 'Advanced',
          estimated_hours: 14,
          deliverables: ['IAM policy hardening scripts', 'Threat model diagram', 'Security audit compliance report'],
          portfolio_value: 'Demonstrates ability to identify vulnerabilities and harden perimeters against unauthorized intrusion.'
        },
        resources: [
          { id: 'r_cs_sec', skill_id: 's_cloud_security', title: 'Zero-Trust Cloud Security Architecture', provider: 'Cloud Security Alliance', type: 'Course', difficulty: 'Intermediate', duration_minutes: 120, url: 'https://cloudsecurityalliance.org/' }
        ]
      },
      {
        id: 's_pen_testing',
        name: 'Vulnerability Assessment & Pen Testing',
        category: 'Security',
        difficulty: 'Advanced',
        weight: 0.95,
        prerequisites: ['s_networking', 's_linux'],
        resources: [
          { id: 'r_pt_sec', skill_id: 's_pen_testing', title: 'OWASP Top 10 & Ethical Hacking', provider: 'OWASP Foundation', type: 'Course', difficulty: 'Advanced', duration_minutes: 160, url: 'https://owasp.org/' }
        ]
      }
    ],
    phases: [
      { number: 1, title: 'Phase 1: Systems & Network Defense', objective: 'Inspect network packet flows, DNS, firewalls, and Unix hardening.', skill_ids: ['s_linux', 's_networking'] },
      { number: 2, title: 'Phase 2: Security Architecture & IAM', objective: 'Enforce principle of least privilege and zero-trust policies.', skill_ids: ['s_cloud_security'] },
      { number: 3, title: 'Phase 3: Vulnerability Assessment', objective: 'Audit systems with automated vulnerability scanners and analyze OWASP exploits.', skill_ids: ['s_pen_testing'] },
      { number: 4, title: 'Phase 4: Threat Detection & Monitoring', objective: 'Configure SIEM logging, analyze anomalies, and automate security response scripts.', skill_ids: [] },
      { number: 5, title: 'Phase 5: Enterprise Security Capstone', objective: 'Deliver a comprehensive security audit and penetration mitigation report.', skill_ids: [] }
    ],
    default_next_action: {
      skill_id: 's_cloud_security',
      skill_name: 'Zero-Trust Cloud IAM & Governance',
      title: 'Master Zero-Trust IAM & Perimeters',
      action_type: 'Assessment',
      estimated_minutes: 60,
      why_now: 'Highest-impact security discipline protecting modern cloud workloads and identity perimeters.',
      cta_label: 'Start Assessment',
      item_id: 'a_cloud_sec'
    }
  }
};

/**
 * Deterministic Topological Roadmap Generator for Frontend
 * Generates an ordered LearningPath matching the selected career, learner's mastered skills, and weekly pace.
 */
export function generateRoleRoadmap(
  careerId: string,
  masteredSkillIds: string[] = ['s_python'],
  weeklyHours: number = 8
): {
  career: Career;
  steps: PathStep[];
  totalSteps: number;
  completedSteps: number;
  readinessScore: number;
} {
  const profile = CAREER_PROFILES[careerId] || CAREER_PROFILES.c_ai_engineer;

  // Topological sorting helper
  const visited = new Set<string>();
  const order: string[] = [];
  const skillMap = new Map(profile.skills.map((s) => [s.id, s]));

  function visit(id: string) {
    if (!visited.has(id)) {
      visited.add(id);
      const skill = skillMap.get(id);
      if (skill) {
        for (const prereqId of skill.prerequisites) {
          if (skillMap.has(prereqId)) {
            visit(prereqId);
          }
        }
        order.push(id);
      }
    }
  }

  for (const s of profile.skills) {
    visit(s.id);
  }

  const nodesPerPhase = Math.max(1, Math.ceil(order.length / profile.phases.length));
  let completedCount = 0;

  const steps: PathStep[] = order.map((skillId, index) => {
    const skill = skillMap.get(skillId)!;
    const isMastered = masteredSkillIds.includes(skillId);
    if (isMastered) completedCount++;

    const phaseIdx = Math.min(profile.phases.length - 1, Math.floor(index / nodesPerPhase));
    const phase = profile.phases[phaseIdx];

    const status = isMastered
      ? 'COMPLETED'
      : index === completedCount
      ? 'IN_PROGRESS'
      : 'PENDING';

    return {
      id: `step_${profile.id}_${skillId}`,
      skill_id: skill.id,
      skill_name: skill.name,
      phase_number: phase.number,
      phase_title: phase.title,
      step_order: index + 1,
      status,
      estimated_minutes: skill.difficulty === 'Advanced' ? 180 : skill.difficulty === 'Intermediate' ? 120 : 60,
      difficulty: skill.difficulty,
      reason: isMastered
        ? `You have already demonstrated proficiency in ${skill.name}.`
        : `Key prerequisite for ${profile.title}. Completing this unlocks downstream competencies in ${phase.title}.`,
      resources: skill.resources || [],
      project: skill.project,
      assessment_id: skill.assessment?.id,
    };
  });

  // Calculate readiness score
  const totalWeight = profile.skills.reduce((acc, s) => acc + s.weight, 0);
  const earnedWeight = profile.skills.reduce((acc, s) => {
    if (masteredSkillIds.includes(s.id)) return acc + s.weight;
    return acc;
  }, 0);

  const readinessScore = Math.min(96, Math.max(18, Math.round((earnedWeight / Math.max(1, totalWeight)) * 100)));

  const career: Career = {
    id: profile.id,
    title: profile.title,
    category: profile.category,
    description: profile.description,
    icon: profile.icon,
    required_skills_count: profile.required_skills_count,
  };

  return {
    career,
    steps,
    totalSteps: steps.length,
    completedSteps: completedCount,
    readinessScore,
  };
}
