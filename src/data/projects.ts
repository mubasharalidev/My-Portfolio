/**
 * Featured projects, from the CV (Mubashar_Ali_Senior_Full_Stack_AI_Engineer_CV.pdf).
 * Every figure in `results` is stated in the CV. The Outcomes section only
 * renders when `results` has entries. Add `liveUrl` / `repoUrl` when public.
 */

export type ProjectVisual = "agents" | "pipeline" | "retrieval" | "ledger" | "migration" | "analytics";

export type Project = {
  slug: string;
  index: string;
  category: "AI" | "LLM" | "Backend" | "Cloud" | "Full-stack";
  title: string;
  /** Company / client context, when stated in the CV. */
  context: string | null;
  tagline: string;
  summary: string;
  problem: string;
  role: string;
  solution: string;
  stack: string[];
  visual: ProjectVisual;
  accent: "cyan" | "azure" | "lime";
  challenges: { title: string; body: string }[];
  architecture: { stage: string; detail: string }[];
  highlights: string[];
  decisions: { title: string; body: string }[];
  results: string[];
  liveUrl: string | null;
  repoUrl: string | null;
};

export const projects: Project[] = [
  {
    slug: "agentic-customer-operations",
    index: "01",
    category: "AI",
    title: "Agentic Customer Operations",
    context: "Tech Domain · UK",
    tagline: "RAG pipelines and multi-step AI agents automating customer operations for a 50,000+ user SaaS platform.",
    summary:
      "Multi-step AI agents, grounded by retrieval over the platform’s own knowledge, that take over repetitive customer-operations work on a multi-tenant SaaS product used by 50,000+ people.",
    problem:
      "Customer operations on a 50,000+ user SaaS platform carried a heavy manual workload, and Tier-1 tickets took too long to resolve.",
    role: "Designed the RAG pipelines and multi-step AI agents",
    solution:
      "LangChain agents grounded by RAG pipelines on Pinecone, running on OpenAI and Anthropic Claude models behind FastAPI services, with a React / Next.js interface — deployed on Kubernetes on AWS.",
    stack: ["Python", "FastAPI", "LangChain", "OpenAI", "Anthropic Claude", "Pinecone", "React.js", "Next.js", "Kubernetes", "AWS"],
    visual: "agents",
    accent: "cyan",
    challenges: [
      {
        title: "Grounded, not guessed",
        body: "Agents act on customer operations, so answers have to come from the platform’s own content. Retrieval on Pinecone grounds each step before the model acts.",
      },
      {
        title: "Multi-step work",
        body: "Operational tasks span several steps. Agents chain retrieval, reasoning and actions rather than answering in a single prompt.",
      },
    ],
    architecture: [
      { stage: "Interface", detail: "React.js / Next.js product UI" },
      { stage: "API", detail: "Python FastAPI services" },
      { stage: "Agents", detail: "Multi-step LangChain agents" },
      { stage: "Retrieval", detail: "RAG pipelines on Pinecone" },
      { stage: "Models", detail: "OpenAI and Anthropic Claude" },
      { stage: "Platform", detail: "Kubernetes on AWS" },
    ],
    highlights: [
      "RAG pipelines on Pinecone",
      "Multi-step AI agents with LangChain",
      "OpenAI and Claude models",
      "Serving a 50,000+ user SaaS platform",
    ],
    decisions: [
      {
        title: "Retrieval before action",
        body: "Grounding agents in RAG pipelines keeps their actions tied to the platform’s real knowledge rather than model memory.",
      },
    ],
    results: [
      "~60% less manual workload for the client",
      "~3× faster Tier-1 ticket resolution",
      "Became the platform’s most-adopted feature",
    ],
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "multi-agent-document-intelligence",
    index: "02",
    category: "AI",
    title: "Multi-Agent Document Intelligence",
    context: null,
    tagline: "A five-agent LangGraph pipeline that turns 50–300-PDF due-diligence packages into cited analysis.",
    summary:
      "A due-diligence platform where five specialised agents ingest, classify, extract, cross-reference and summarise entire deal packages — every output traceable to the page it came from.",
    problem:
      "Each deal arrives as a due-diligence package of 50–300 PDFs, and intake took around 2.5 days of analyst time.",
    role: "Built the five-agent pipeline and model-routing strategy",
    solution:
      "A five-agent LangGraph pipeline for ingestion, classification, extraction, cross-referencing and summarisation, with page-level citations. Claude 3.5 Sonnet handles long-context reasoning and GPT-4o handles structured extraction.",
    stack: ["Python 3.11", "FastAPI", "LangGraph", "CrewAI", "Claude 3.5 Sonnet", "GPT-4o", "Pinecone", "PostgreSQL", "AWS Bedrock", "Kubernetes"],
    visual: "pipeline",
    accent: "lime",
    challenges: [
      {
        title: "Volume per deal",
        body: "A single deal can mean 300 PDFs. The work is split into dedicated stages so each agent does one job well.",
      },
      {
        title: "Traceability",
        body: "Analysts must verify findings, so every output carries page-level citations back to the source document.",
      },
    ],
    architecture: [
      { stage: "Ingestion", detail: "Load 50–300 PDFs per deal" },
      { stage: "Classification", detail: "Sort documents by type" },
      { stage: "Extraction", detail: "Structured fields via GPT-4o" },
      { stage: "Cross-referencing", detail: "Reconcile facts across documents" },
      { stage: "Summarisation", detail: "Long-context synthesis via Claude 3.5 Sonnet, with page-level citations" },
    ],
    highlights: [
      "Five specialised LangGraph agents",
      "Page-level citations on outputs",
      "Model routing by task",
      "Pinecone + PostgreSQL storage",
    ],
    decisions: [
      {
        title: "Route models by task",
        body: "Claude 3.5 Sonnet for long-context reasoning; GPT-4o for structured extraction — each model used where it is strongest.",
      },
      {
        title: "One agent, one job",
        body: "Splitting intake into five stages keeps each agent focused and makes the pipeline easier to inspect.",
      },
    ],
    results: ["Intake cut from 2.5 days to ~6 hours", "~62% less analyst effort"],
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "customer-support-copilot",
    index: "03",
    category: "LLM",
    title: "AI Support Copilot",
    context: null,
    tagline: "A RAG copilot over help-center content and Zendesk tickets, streaming answers to support agents in real time.",
    summary:
      "An AI-augmented copilot for B2B support teams that retrieves from help-center content and past Zendesk tickets and streams suggested answers as agents work.",
    problem: "Average handling time was around 11 minutes per ticket, and too few Tier-1 tickets were resolved on first response.",
    role: "Built the RAG copilot and real-time streaming",
    solution:
      "Retrieval over B2B help-center content and Zendesk tickets with ChromaDB, generation with GPT-4o and Anthropic Claude via LangChain on FastAPI, and answers streamed in real time to a React.js interface over WebSockets.",
    stack: ["Python", "FastAPI", "LangChain", "GPT-4o", "Anthropic Claude", "ChromaDB", "Redis", "WebSockets", "React.js", "Zendesk API"],
    visual: "retrieval",
    accent: "azure",
    challenges: [
      {
        title: "Two knowledge sources",
        body: "Useful answers live in both curated help-center articles and the long tail of past Zendesk tickets — retrieval covers both.",
      },
      {
        title: "Speed for live agents",
        body: "Agents are mid-conversation, so answers stream token by token over WebSockets instead of arriving all at once.",
      },
    ],
    architecture: [
      { stage: "Sources", detail: "Help-center content + Zendesk tickets (Zendesk API)" },
      { stage: "Vector store", detail: "ChromaDB retrieval" },
      { stage: "Generation", detail: "GPT-4o and Claude via LangChain" },
      { stage: "API", detail: "FastAPI with Redis" },
      { stage: "Streaming UI", detail: "React.js over WebSockets" },
    ],
    highlights: [
      "RAG over help-center and tickets",
      "Real-time WebSocket streaming",
      "Zendesk API integration",
      "GPT-4o and Claude models",
    ],
    decisions: [
      {
        title: "Stream, don’t wait",
        body: "Real-time WebSocket streaming lets agents start reading a suggestion immediately, which matters when a customer is waiting.",
      },
    ],
    results: ["Average handling time cut from 11 to ~4 minutes", "Tier-1 first-response resolution raised to ~58%"],
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "enterprise-fintech-platform",
    index: "04",
    category: "Backend",
    title: "Enterprise Fintech Platform",
    context: "10Pearls",
    tagline: "A microservices backend processing 3M+ transactions a day at p95 under 200ms — and the data pipelines behind it.",
    summary:
      "The core backend of an enterprise financial platform: high-throughput microservices, PostgreSQL scaled to tens of millions of rows, and batch workflows rebuilt on Databricks.",
    problem:
      "An enterprise financial platform needed to process millions of transactions a day at low latency, while legacy batch workflows took 4.2 hours to run.",
    role: "Backend architecture and data pipelines",
    solution:
      "Python / FastAPI microservices on AWS (ECS, RDS, Lambda, S3) with Docker and Kubernetes; PostgreSQL scaled to 10M+ rows per table with partitioning and read replicas; batch workflows rebuilt as async Spark SQL pipelines on Databricks.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Redis", "Databricks", "Spark SQL", "Docker", "Kubernetes", "AWS ECS", "AWS RDS", "AWS Lambda", "AWS S3"],
    visual: "ledger",
    accent: "cyan",
    challenges: [
      {
        title: "Throughput with low latency",
        body: "3M+ transactions a day with a p95 under 200ms and an error rate under 0.1%.",
      },
      {
        title: "Tables at scale",
        body: "PostgreSQL tables grew past 10M rows, so storage had to scale without slowing reads.",
      },
    ],
    architecture: [
      { stage: "Services", detail: "Python / FastAPI microservices" },
      { stage: "Platform", detail: "Docker & Kubernetes on AWS ECS, Lambda, S3" },
      { stage: "Storage", detail: "PostgreSQL (RDS) with partitioning + read replicas, Redis" },
      { stage: "Batch", detail: "Async Spark SQL pipelines on Databricks" },
    ],
    highlights: [
      "Microservices architecture",
      "Table partitioning and read replicas",
      "Async Spark SQL on Databricks",
      "Containerised on AWS",
    ],
    decisions: [
      {
        title: "Partition and replicate",
        body: "Table partitioning and read replicas let PostgreSQL scale to 10M+ rows per table.",
      },
      {
        title: "Move batch off the hot path",
        body: "Legacy batch workflows were rebuilt as asynchronous Spark SQL pipelines on Databricks.",
      },
    ],
    results: [
      "3M+ transactions/day at p95 < 200ms",
      "Error rate under 0.1%",
      "Batch processing 55% faster (4.2h → 1.9h)",
    ],
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "cloud-native-microservices-migration",
    index: "05",
    category: "Cloud",
    title: "Microservices Migration",
    context: null,
    tagline: "A 200K-line Node.js monolith carved into 8 independently deployable services with the strangler pattern.",
    summary:
      "An incremental, cloud-native migration: a large Node.js monolith split into independently deployable services connected by Kafka events, with GitOps delivery on Kubernetes.",
    problem: "A 200K-line Node.js monolith could only be released monthly.",
    role: "Migration architecture and GitOps infrastructure",
    solution:
      "The strangler pattern carved functionality into 8 services in Golang (Gin) and Node.js (NestJS), communicating through Kafka-based asynchronous events on AWS EKS. Infrastructure is managed with Terraform and delivered through ArgoCD (GitOps), observed with Datadog.",
    stack: ["Golang (Gin)", "Node.js (NestJS)", "Kubernetes (AWS EKS)", "Apache Kafka", "PostgreSQL", "Terraform", "ArgoCD", "Datadog"],
    visual: "migration",
    accent: "azure",
    challenges: [
      {
        title: "Migrating while running",
        body: "The monolith stayed in service throughout, so services were extracted one at a time instead of in a single rewrite.",
      },
      {
        title: "Decoupling services",
        body: "Kafka-based asynchronous events let the new services evolve and deploy independently.",
      },
    ],
    architecture: [
      { stage: "Monolith", detail: "200K-line Node.js application" },
      { stage: "Strangler facade", detail: "Functionality carved out incrementally" },
      { stage: "Services", detail: "8 services in Golang (Gin) and NestJS" },
      { stage: "Events", detail: "Apache Kafka asynchronous messaging" },
      { stage: "Delivery", detail: "Terraform + ArgoCD on AWS EKS, Datadog" },
    ],
    highlights: [
      "Strangler-pattern migration",
      "Kafka event-driven architecture",
      "Infrastructure as code with Terraform",
      "GitOps delivery with ArgoCD",
    ],
    decisions: [
      {
        title: "Strangler over rewrite",
        body: "Extracting services incrementally avoided a risky big-bang rewrite of 200K lines.",
      },
      {
        title: "Events over direct calls",
        body: "Asynchronous Kafka events keep services independently deployable.",
      },
    ],
    results: ["Monthly releases → multiple deploys per day", "8 independently deployable microservices"],
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "ai-shopify-erp",
    index: "06",
    category: "Full-stack",
    title: "AI-Powered Shopify ERP",
    context: null,
    tagline: "A multi-tenant ERP for Shopify merchants, with an AI assistant that answers business questions in plain language.",
    summary:
      "One dashboard for Shopify merchants to run orders, inventory, products, customers, sales and finances — synced in real time, with AI analytics and recommendations built in.",
    problem:
      "Shopify merchants need to manage orders, inventory, products, customers, sales and finances — and make sense of the data — from one place.",
    role: "Built the multi-tenant ERP and AI analytics assistant",
    solution:
      "A multi-tenant Next.js / TypeScript application on FastAPI, PostgreSQL and Redis, synced in real time through the Shopify Admin API (GraphQL) and webhooks. An AI analytics assistant (OpenAI, LangChain) answers business questions in natural language.",
    stack: ["Next.js", "React.js", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Redis", "Shopify Admin API (GraphQL)", "Webhooks", "OpenAI", "LangChain", "AWS"],
    visual: "analytics",
    accent: "lime",
    challenges: [
      {
        title: "Staying in sync",
        body: "Store data changes constantly; the Shopify Admin API and webhooks keep the ERP synced in real time.",
      },
      {
        title: "Insight, not just data",
        body: "The assistant analyses sales, inventory and customer data and turns it into answers and recommendations.",
      },
    ],
    architecture: [
      { stage: "Sync", detail: "Shopify Admin API (GraphQL) + webhooks" },
      { stage: "Backend", detail: "FastAPI, PostgreSQL, Redis — multi-tenant" },
      { stage: "Dashboard", detail: "Next.js / TypeScript ERP interface" },
      { stage: "AI assistant", detail: "OpenAI + LangChain natural-language analytics" },
    ],
    highlights: [
      "Orders, inventory, products, customers, sales and finances in one dashboard",
      "Real-time sync via Shopify webhooks",
      "Natural-language analytics assistant",
      "Restock alerts, sales trends, product and pricing suggestions",
    ],
    decisions: [
      {
        title: "Webhooks for freshness",
        body: "Real-time webhooks alongside the Admin API keep the dashboard current without constant polling.",
      },
    ],
    results: [],
    liveUrl: null,
    repoUrl: null,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
