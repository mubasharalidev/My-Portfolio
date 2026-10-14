/**
 * Single source of truth for identity, contact and career content.
 * Source: Mubashar_Ali_Senior_Full_Stack_AI_Engineer_CV.pdf (in /public).
 */

export type Stat = { value: string; label: string };

export type Milestone = {
  period: string;
  title: string;
  organisation: string;
  location: string;
  kind: "education" | "role";
  summary: string;
  /** Short impact lines shown on the timeline. */
  highlights: string[];
  /** Full CV bullets shown on the /resume page. */
  bullets: string[];
};

export type SocialLink = { label: string; handle: string; href: string };

export const profile = {
  name: "Mubashar Ali",
  firstName: "Mubashar",
  initials: "MA",
  role: "Senior Full Stack AI Engineer",
  focus: ["AI Systems", "LLMs & RAG", "Agentic AI", "Scalable Backends", "Cloud-Native"],

  intro:
    "I design, build and ship AI-powered products and scalable SaaS and fintech platforms — LLM applications, RAG pipelines and multi-agent workflows on cloud-native backends built to stay up.",

  summary:
    "Senior Full Stack AI Engineer with 5+ years of experience designing, building, and shipping AI-powered products and scalable SaaS and fintech platforms for clients in the UK, the Netherlands, and Pakistan. Expert in Python, FastAPI, React.js, Next.js, Node.js, TypeScript, and PostgreSQL, with deep expertise in REST API design, microservices, event-driven architecture, system design, and cloud-native deployment on AWS with Docker and Kubernetes. Delivers production Generative AI systems — LLM applications, RAG pipelines, and agentic multi-agent workflows built with LangChain, LangGraph, and CrewAI on OpenAI GPT-4o, Anthropic Claude, and AWS Bedrock with Pinecone and ChromaDB vector search.",

  stats: [
    { value: "5+", label: "Years experience" },
    { value: "3M+", label: "Daily transactions handled" },
    { value: "99.95%", label: "Uptime SLA delivered" },
    { value: "UK · NL · PK", label: "Client markets" },
  ] satisfies Stat[],

  availability: {
    open: true,
    label: "Open to remote opportunities",
    detail: "Based in Lahore, Pakistan · PKT (UTC+5)",
  },
  currentlyBuilding: "Enterprise fintech backends & LLM automation at 10Pearls",
  quote: "Technology amplifies human potential.",
  location: "Lahore, Pakistan",

  email: "mubasharalidev4@gmail.com",
  /** Shown on the /resume page only, not on the public landing page. */
  phone: "+92 316 1625922",
  socials: [
    {
      label: "LinkedIn",
      handle: "in/mubashar-ali-full-stack-engineer",
      href: "https://www.linkedin.com/in/mubashar-ali-full-stack-engineer",
    },
    {
      label: "GitHub",
      handle: "mubasharalidev",
      href: "https://github.com/mubasharalidev",
    },
  ] satisfies SocialLink[],

  /** Web résumé generated from this data, and the original PDF in /public. */
  resumeUrl: "/resume",
  resumePdf: "/Mubashar_Ali_Senior_Full_Stack_AI_Engineer_CV.pdf",
};

/** Newest first. */
export const experience: Milestone[] = [
  {
    period: "Jul 2025 — Present",
    title: "Senior Full Stack & AI Engineer · Backend Architect",
    organisation: "10Pearls",
    location: "Onsite — Lahore, Pakistan",
    kind: "role",
    summary:
      "Architecting the core backend of an enterprise financial platform and bringing LLM automation into operations workflows.",
    highlights: [
      "3M+ daily transactions · p95 < 200ms · 99.9% uptime",
      "LLM automation cut manual review ~40%",
      "Leading 5 engineers · post-release defects −35%",
    ],
    bullets: [
      "Architected the core backend of an enterprise financial platform in Python and FastAPI on AWS, processing 3M+ daily transactions at sub-200ms p95 latency with 99.9% uptime; migrated batch workflows to Databricks and Spark SQL.",
      "Integrated LLM-powered automation (OpenAI GPT-4o and LangChain) into internal operations workflows, reducing manual review effort by ~40% on document-heavy processes.",
      "Lead a backend team of 5 engineers, owning code reviews, architecture RFCs, sprint planning, and release cycles; introduced PR standards and CI/CD quality gates that reduced post-release defects by ~35%.",
    ],
  },
  {
    period: "Nov 2022 — Jun 2025",
    title: "Senior Full Stack Engineer & Team Lead",
    organisation: "Tech Domain",
    location: "Remote — United Kingdom",
    kind: "role",
    summary:
      "Promoted to Team Lead within 8 months; owned end-to-end delivery of UK multi-tenant SaaS products serving 50,000+ users across Europe.",
    highlights: [
      "99.95% uptime SLA on AWS & Kubernetes",
      "Led a team of 6 · production bugs −45%",
      "Shared React / Next.js component library",
    ],
    bullets: [
      "Promoted to Team Lead within 8 months; owned end-to-end delivery of UK multi-tenant SaaS products serving 50,000+ users across Europe.",
      "Built responsive React.js and Next.js (TypeScript) interfaces on Python (FastAPI, Django) and Node.js services, standardizing a reusable component library across product squads.",
      "Architected AWS cloud infrastructure on Kubernetes and Docker, achieving a 99.95% uptime SLA with zero critical incidents across the final 18 months.",
      "Led, mentored, and scaled a cross-functional team of 6 engineers; code review standards and automated test gates reduced the production bug rate by 45%.",
    ],
  },
  {
    period: "Sep 2021 — Oct 2022",
    title: "Full Stack AI Engineer",
    organisation: "Sprinta Tech",
    location: "Remote — Netherlands",
    kind: "role",
    summary:
      "Sole backend engineer owning core platform architecture for a Dutch product company serving 3 European markets.",
    highlights: [
      "API layer rebuilt · responses 50% faster",
      "Schemas for 10M+ records",
      "Auth became company standard · incidents −40%",
    ],
    bullets: [
      "Sole backend engineer owning core platform architecture for a Dutch product company serving 3 European markets.",
      "Rebuilt the entire API layer in Node.js and PostgreSQL with schemas for 10M+ records, improving average response times by 50% and eliminating recurring production failures.",
      "Engineered multi-tenant authentication with JWT and OAuth2, adopted as the company-wide security standard; introduced code reviews that cut production incidents by 40%.",
    ],
  },
  {
    period: "Feb 2021 — Aug 2021",
    title: "Full Stack Developer",
    organisation: "Micro Data Tech Solutions",
    location: "Onsite — Lahore, Pakistan",
    kind: "role",
    summary: "Built scalable full-stack applications across a portfolio of client engagements.",
    highlights: [
      "Node.js · Express · React · MongoDB · PostgreSQL",
      "Secure REST APIs with JWT, OAuth 2.0 & RBAC",
      "Dockerised services via CI/CD on AWS",
    ],
    bullets: [
      "Built scalable full-stack applications with Node.js, Express.js, React.js, MongoDB, and PostgreSQL across a portfolio of client engagements.",
      "Designed secure RESTful APIs with JWT, OAuth 2.0, and RBAC; optimized queries and shipped Dockerized services via CI/CD on AWS.",
    ],
  },
  {
    period: "2018 — 2022",
    title: "BS Computer Science",
    organisation: "University of Management and Technology (UMT)",
    location: "Lahore, Pakistan",
    kind: "education",
    summary: "Bachelor of Science in Computer Science.",
    highlights: [],
    bullets: [],
  },
];

/** Skill groups exactly as listed on the CV (used by /resume). */
export const skillGroups: { title: string; items: string }[] = [
  {
    title: "AI & LLM Engineering",
    items:
      "Generative AI, Large Language Models (LLMs), Agentic AI, AI Agents, Multi-Agent Systems, Retrieval-Augmented Generation (RAG), Prompt Engineering, Embeddings, Semantic Search, Function Calling / Tool Use, Model Routing, Chatbots, AI Copilots, AI Automation",
  },
  {
    title: "AI Frameworks & Models",
    items:
      "LangChain, LangGraph, CrewAI, OpenAI API (GPT-4o), Anthropic Claude API (Claude 3.5 Sonnet), AWS Bedrock, Hugging Face, Pinecone, ChromaDB, Vector Databases",
  },
  {
    title: "Backend Development",
    items: "Python, FastAPI, Django, Flask, Node.js, Express.js, NestJS, Golang, REST APIs, GraphQL, WebSockets, Celery, AsyncIO",
  },
  {
    title: "Frontend Development",
    items: "React.js, Next.js, TypeScript, JavaScript (ES6+), Redux, React Query, Tailwind CSS, HTML5, CSS3, Responsive Design, Component Libraries",
  },
  {
    title: "Databases & Data",
    items:
      "PostgreSQL, MongoDB, MySQL, Redis, Databricks, Spark SQL, Apache Kafka, Schema Design, Query Optimization, Indexing, Table Partitioning, Multi-Tenant Data Architecture",
  },
  {
    title: "Cloud & DevOps",
    items:
      "AWS (EC2, S3, Lambda, RDS, ECS, EKS, Bedrock), Microsoft Azure, Google Cloud Platform (GCP), Docker, Kubernetes, Terraform, CI/CD, GitHub Actions, ArgoCD, Nginx, Linux",
  },
  {
    title: "Architecture & Patterns",
    items: "System Design, Microservices, Event-Driven Architecture, Distributed Systems, Strangler Pattern, Clean Architecture, SOLID Principles",
  },
  {
    title: "Security & Authentication",
    items: "JWT, OAuth2, Role-Based Access Control (RBAC), Multi-Tenant Authentication, API Security, Data Encryption",
  },
  {
    title: "Testing, Tools & Practice",
    items:
      "PyTest, Jest, Unit, Integration & End-to-End (E2E) Testing, TDD, Swagger (OpenAPI), Datadog, Git, GitHub, Jira, Agile / Scrum, Code Review, Technical Leadership, Mentoring",
  },
];

export const navItems = [
  { id: "expertise", label: "Expertise" },
  { id: "work", label: "Work" },
  { id: "engine", label: "Engine" },
  { id: "experience", label: "Experience" },
  { id: "lab", label: "Lab" },
  { id: "about", label: "About" },
] as const;
