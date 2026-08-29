export type Project = {
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  problem: string;
  did: string;
  outcome: string;
  image?: string;
  imageAlt?: string;
  evidenceLabel: string;
  evidenceNote?: string;
  tech: string[];
  repoUrl?: string;
  repoNote?: string;
};

export const projects: Project[] = [
  {
    slug: 'agentic-bi-builder',
    title: 'Agentic BI Builder',
    subtitle: 'Automating BI report creation from raw data to a Power BI file.',
    summary: 'Starting a BI project means profiling the data, deciding what matters to the business, writing the queries, and building the report. That setup gets redone from scratch for every new business.',
    problem: 'Starting a BI project means profiling the data, deciding what matters to the business, writing the queries, and building the report. That setup gets redone from scratch for every new business.',
    did: "I built a BI report automation tool with deterministic data profiling and LLM-based KPI inference. Profiling is deterministic on purpose: typing and structuring a column has one correct answer and doesn't need an LLM guessing at it. KPI inference is where the judgment lives, so the LLM proposes KPIs within a schema rather than free text. A Reflector checks those proposals before they move forward. Early runs sometimes produced something technically valid but wrong for the data, like a churn rate for a business with no repeat customers. The final stage is a PBIR compiler I built by reverse-engineering Power BI's file format, so the output opens directly in Power BI Desktop rather than becoming another CSV to import manually.",
    outcome: "I ran the full pipeline against HR analytics, Chinook, and retail, three different domains, and all three completed end to end, with the pipeline catching and rectifying errors. Next time I'd test it against more domains before calling the architecture settled.",
    image: '/images/agentic-bi-demo.gif',
    imageAlt: 'Full in-motion demo of Agentic BI Builder running from raw data through KPI reasoning to a Power BI file.',
    evidenceLabel: 'End-to-end demo',
    tech: ['Power BI'],
    repoNote: 'Private repository, available on request.',
  },
  {
    slug: 'financial-risk-monitor',
    title: 'Financial Risk Monitor',
    summary: "Investors don't have one place to see portfolio risk alongside the macro conditions around it. That makes questions like “what happens if rates move?” slow to answer.",
    problem: "Investors don't have one place to see portfolio risk alongside the macro conditions around it. That makes questions like “what happens if rates move?” slow to answer.",
    did: "I built a portfolio risk monitoring tool that pulls live data from Yahoo Finance and FRED into SQLite when the update scripts run, computes VaR and drawdown, and runs 10,000-path Monte Carlo simulations. I chose Monte Carlo over historical VaR because historical VaR only shows what already happened. It can't answer what a 2 percentage point rate move would do to the portfolio. Prophet handles forecasting, and SQLite was enough because this is a single-analyst tool where concurrent writes weren't the actual constraint. I put the output into a 4-page Power BI dashboard with scenario slicers the investor can move themselves.",
    outcome: "Shipped as v1.0.0. The macro data currently informs the dashboard but doesn't feed directly into the risk calculations. Next time I'd make the macro data part of the risk calculations themselves.",
    image: '/images/financial-risk-scenario.png',
    imageAlt: 'Scenario Explorer dashboard showing an adjusted risk score, shock controls, and Monte Carlo paths.',
    evidenceLabel: 'Scenario Explorer',
    tech: ['Yahoo Finance', 'FRED', 'SQLite', 'Prophet', 'Power BI'],
    repoNote: 'Private repository, available on request.',
  },
  {
    slug: 'solarsense',
    title: 'SolarSense',
    summary: 'A proper solar feasibility study takes 1 to 3 weeks of consultant time. For SMEs across Sub-Saharan Africa, that cost can put the decision out of reach before they even know whether solar makes sense.',
    problem: 'A proper solar feasibility study takes 1 to 3 weeks of consultant time. For SMEs across Sub-Saharan Africa, that cost can put the decision out of reach before they even know whether solar makes sense.',
    did: "As technical lead, I built the solar viability assessment engine behind the tool. It routes through a gateway to three services: one model for energy consumption, one for generation, and a deterministic ROI engine. ROI is arithmetic once the inputs exist, so I kept that part deterministic instead of adding a model where it adds variance without adding value. I trained both ML models myself, sourced CBECS, and reworked it for African SME contexts since it wasn't built for them. I also built the shared authentication and rate limiting, and reviewed the security work on the parts I didn't personally build.",
    outcome: "Assessment time dropped from 1 to 3 weeks to about 3 minutes. Most cities came back with single-digit MAPE. Cape Town was roughly triple that because its Mediterranean climate didn't match the training distribution well. The models were trained on data from only 2 cities, which is the obvious limitation. I disclosed the Cape Town result rather than smoothing it over. Next time I'd expand the training data to more than 20 cities so the model holds up better on edge climates like Cape Town's.",
    image: '/images/solarsense-architecture.jpeg',
    imageAlt: 'Portfolio system diagram showing the SolarSense gateway, orchestration layer, two trained models, and deterministic ROI engine.',
    evidenceLabel: 'System architecture',
    evidenceNote: 'Portfolio diagram representing the implemented workflow, not an application screenshot.',
    tech: ['Gradient Boosting', 'XGBoost'],
    repoUrl: 'https://github.com/SolarSense-Capstone/DSE-models',
  },
  {
    slug: 'studygapai',
    title: 'StudyGapAI',
    summary: "Students can study hard and still fail because they're reinforcing what they already know while the actual gap causing the failure goes undiagnosed. A useful tool can't just grade the answer. It has to work out why the wrong answer happened.",
    problem: "Students can study hard and still fail because they're reinforcing what they already know while the actual gap causing the failure goes undiagnosed. A useful tool can't just grade the answer. It has to work out why the wrong answer happened.",
    did: 'I built a tool for diagnosing gaps and building a study plan around them, solo. It uses a React frontend, Flask backend, and Supabase for auth. It works in two steps: first it diagnoses the gap behind a wrong answer, then it builds a 6-week study plan around that gap. In one real case, it traced a wrong Calculus answer back to basic arithmetic and algebra prerequisites. The plan started there and moved toward Calculus once those dependencies were in place.',
    outcome: "It's live, deployed, and in use. I can explain how the plan is built, but I don't yet have data showing how much it improves results over time. Next time I'd track those outcomes systematically.",
    image: '/images/studygapai-diagnostic.png',
    imageAlt: 'StudyGapAI diagnostic report with a diagnostic summary and overall performance details.',
    evidenceLabel: 'Diagnostic report',
    tech: ['React', 'Flask', 'Supabase'],
    repoUrl: 'https://github.com/Tessa-777/StudyGapAI',
  },
  {
    slug: 'alzheimers-disease-classification',
    title: "Alzheimer's Disease Classification",
    summary: "I built an Alzheimer's image classifier intended to assist with timely flagging, but a working classifier isn't enough. I needed to know which model to trust and whether its performance was actually real.",
    problem: "I built an Alzheimer's image classifier intended to assist with timely flagging, but a working classifier isn't enough. I needed to know which model to trust and whether its performance was actually real.",
    did: "I trained and compared DenseNet, ResNet, and EfficientNet rather than defaulting to one architecture. For each model, I tested which blocks to freeze rather than tuning the same layers across all three. I also used per-image regularization. For model selection, I didn't optimize for the highest accuracy. I selected for the smallest training validation gap because I wanted a better signal of generalization. Then I audited the dataset and found augmented duplicate scans across the train and test split, which meant the original result was leaked. I rejected it rather than reporting it.",
    outcome: "The three-architecture comparison and selection process are done. The corrected rerun on a clean dataset is still in progress, so I don't have a final performance number yet. Next time I'd audit the data thoroughly before building the elaborate pipeline, not after.",
    image: '/images/alzheimers-leakage-evidence.jpeg',
    imageAlt: 'Rejected DenseNet confusion matrix with a note explaining duplicate scan leakage across train and test data.',
    evidenceLabel: 'Data leakage evidence',
    evidenceNote: 'This result was rejected and is not presented as a valid performance outcome.',
    tech: ['DenseNet', 'ResNet', 'EfficientNet'],
    repoUrl: 'https://github.com/Tessa-Saumu/Alzheimer-s-Disease-Classification',
  },
];

export const selectedProjects = projects.slice(0, 2);
