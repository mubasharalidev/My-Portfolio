/**
 * Capability clusters and how they connect in a production system.
 * Skills listed are limited to those confirmed by the design reference and
 * project stacks. EDIT: add tools you use in production (e.g. PostgreSQL,
 * Redis, Django, NestJS, Azure) once confirmed.
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
    title: "AI & Intelligent Systems",
    short: "Intelligence",
    summary:
      "Treating the model as one component of a larger system: deciding what context it sees, which tools it may call, and how its output is checked before anyone relies on it.",
    skills: [
      "LLM integration — OpenAI, Claude",
      "RAG & GraphRAG pipelines",
      "Agentic workflows (LangGraph)",
      "Multi-agent orchestration",
      "Fine-tuning & evaluation",
    ],
    pos: { x: 78, y: 30 },
  },
  {
    id: "backend",
    index: "02",
    title: "Backend Engineering",
    short: "Services",
    summary:
      "Typed, observable services that hold everything together — model calls behind stable APIs, with the timeouts, retries and streaming that AI workloads demand.",
    skills: ["Python · FastAPI", "Node.js", "Scalable REST APIs", "Microservices", "Data pipelines"],
    pos: { x: 50, y: 50 },
  },
  {
    id: "frontend",
    index: "03",
    title: "Frontend Engineering",
    short: "Interface",
    summary:
      "Interfaces that make complex systems feel simple: streaming responses, real-time state and design systems that stay consistent as products grow.",
    skills: ["React · Next.js", "TypeScript", "Modern UI/UX", "Real-time applications", "Design systems"],
    pos: { x: 22, y: 30 },
  },
  {
    id: "data",
    index: "04",
    title: "Data & AI Engineering",
    short: "Knowledge",
    summary:
      "The knowledge layer AI depends on: ingestion, chunking and embeddings, vector search, and the pipelines that keep it all fresh.",
    skills: ["Data processing", "Vector databases", "ETL & analytics", "Model deployment"],
    pos: { x: 72, y: 78 },
  },
  {
    id: "cloud",
    index: "05",
    title: "Cloud & Infrastructure",
    short: "Platform",
    summary:
      "Reproducible infrastructure underneath it all — containerised services, automated delivery and architecture that scales without surprises.",
    skills: ["AWS · GCP", "Docker", "Kubernetes", "CI/CD pipelines", "Scalable architecture"],
    pos: { x: 28, y: 78 },
  },
];

/** Undirected relationships, each with the engineering reason it exists. */
export const capabilityLinks: { a: CapabilityId; b: CapabilityId; note: string }[] = [
  { a: "frontend", b: "backend", note: "Typed contracts and streamed responses to the UI" },
  { a: "backend", b: "ai", note: "Model calls behind APIs with retries, timeouts and guardrails" },
  { a: "ai", b: "data", note: "Retrieval grounds generation in your own knowledge" },
  { a: "backend", b: "data", note: "Ingestion, ETL and storage pipelines" },
  { a: "cloud", b: "backend", note: "Containerised services, scaled and observed" },
  { a: "cloud", b: "data", note: "Managed stores and model deployment" },
  { a: "frontend", b: "ai", note: "UX patterns for non-deterministic output" },
];
