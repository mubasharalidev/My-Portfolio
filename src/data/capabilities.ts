/**
 * Capability clusters and how they connect in a production system.
 * Skills are taken from the CV (Mubashar_Ali_Senior_Full_Stack_AI_Engineer_CV.pdf).
 */

export type CapabilityId = "ai" | "backend" | "frontend" | "cloud" | "data";

export type Capability = {
  id: CapabilityId;
  index: string;
  title: string;
  short: string;
  summary: string;
  skills: string[];
  /** Position on the desktop constellation, in a 100×100 viewBox. */
  pos: { x: number; y: number };
};

export const capabilities: Capability[] = [
  {
    id: "ai",
    index: "01",
    title: "AI & LLM Engineering",
    short: "Intelligence",
    summary:
      "Treating the model as one component of a larger system: deciding what context it sees, which tools it may call, which model handles which task, and how its output is checked before anyone relies on it.",
    skills: [
      "LLMs · RAG · Agentic AI",
      "LangChain · LangGraph · CrewAI",
      "OpenAI GPT-4o · Claude 3.5 Sonnet",
      "AWS Bedrock · Hugging Face",
      "Multi-agent systems",
      "Function calling & model routing",
      "Embeddings & semantic search",
    ],
    pos: { x: 78, y: 30 },
  },
  {
    id: "backend",
    index: "02",
    title: "Backend Engineering",
    short: "Services",
    summary:
      "Typed, secure services that hold everything together — microservices and event-driven systems with model calls behind stable APIs, built for high throughput and low latency.",
    skills: [
      "Python · FastAPI · Django · Flask",
      "Node.js · Express · NestJS",
      "Golang",
      "REST · GraphQL · WebSockets",
      "Celery · AsyncIO",
      "JWT · OAuth2 · RBAC",
      "Microservices & event-driven",
    ],
    pos: { x: 50, y: 50 },
  },
  {
    id: "frontend",
    index: "03",
    title: "Frontend Engineering",
    short: "Interface",
    summary:
      "Interfaces that make complex systems feel simple: streaming responses, real-time state and component libraries that stay consistent across product squads.",
    skills: [
      "React.js · Next.js",
      "TypeScript · JavaScript (ES6+)",
      "Redux · React Query",
      "Tailwind CSS",
      "Component libraries",
      "Responsive design",
    ],
    pos: { x: 22, y: 30 },
  },
  {
    id: "data",
    index: "04",
    title: "Data & Knowledge Systems",
    short: "Knowledge",
    summary:
      "The data layer everything depends on: relational stores scaled to tens of millions of rows, vector search for retrieval, and streaming and batch pipelines that keep it fresh.",
    skills: [
      "PostgreSQL · MySQL · MongoDB",
      "Redis",
      "Pinecone · ChromaDB",
      "Databricks · Spark SQL",
      "Apache Kafka",
      "Partitioning & query optimisation",
      "Multi-tenant data architecture",
    ],
    pos: { x: 72, y: 78 },
  },
  {
    id: "cloud",
    index: "05",
    title: "Cloud & DevOps",
    short: "Platform",
    summary:
      "Cloud-native infrastructure underneath it all — containerised services on Kubernetes, infrastructure as code and GitOps delivery, observed and kept up.",
    skills: [
      "AWS — EC2, S3, Lambda, RDS, ECS, EKS",
      "Azure · GCP",
      "Docker · Kubernetes",
      "Terraform · ArgoCD (GitOps)",
      "CI/CD · GitHub Actions",
      "Nginx · Linux · Datadog",
    ],
    pos: { x: 28, y: 78 },
  },
];

/** Undirected relationships, each with the engineering reason it exists. */
export const capabilityLinks: { a: CapabilityId; b: CapabilityId; note: string }[] = [
  { a: "frontend", b: "backend", note: "Typed contracts and streamed responses to the UI" },
  { a: "backend", b: "ai", note: "Model calls behind APIs with retries, timeouts and guardrails" },
  { a: "ai", b: "data", note: "Retrieval grounds generation in your own knowledge" },
  { a: "backend", b: "data", note: "Schemas, partitioning and event pipelines" },
  { a: "cloud", b: "backend", note: "Containerised services, scaled and observed" },
  { a: "cloud", b: "data", note: "Managed stores, replicas and data platforms" },
  { a: "frontend", b: "ai", note: "UX patterns for non-deterministic output" },
];
