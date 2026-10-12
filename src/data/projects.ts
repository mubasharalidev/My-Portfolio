/**
 * Featured projects. Titles, summaries and stacks come from the design
 * reference. The case-study narrative describes the architecture of each
 * system and contains no metrics, clients or outcomes.
 *
 * EDIT: replace the narrative with your specifics, and add verified
 * outcomes to `results` — the Outcomes section only renders when it has
 * entries. Add `liveUrl` / `repoUrl` when they are public.
 */

export type ProjectVisual = "agents" | "retrieval" | "analytics" | "studio";

export type Project = {
  slug: string;
  index: string;
  category: "AI" | "LLM" | "Web";
  title: string;
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
    slug: "ai-agent-platform",
    index: "01",
    category: "AI",
    title: "AI Agent Platform",
    tagline: "Multi-agent system for research, analysis and automated workflows.",
    summary:
      "A platform where specialised agents plan, research, analyse and act together — coordinated as an explicit graph rather than one long prompt.",
    problem:
      "Research and analysis tasks span many steps and sources. A single prompt loses track of intermediate results, can't use tools reliably, and is impossible to inspect when it goes wrong.",
    role: "Architecture, agent design and full-stack implementation",
    solution:
      "Work is decomposed by a planner and routed across specialised agents in a LangGraph state machine. Each agent has a narrow toolset, shared state is explicit, and every step is traceable in the interface.",
    stack: ["Next.js", "LangGraph", "OpenAI", "TypeScript"],
    visual: "agents",
    accent: "cyan",
    challenges: [
      {
        title: "Keeping agents on task",
        body: "Open-ended agents drift. Constraining each agent to a role, a toolset and a typed output keeps behaviour predictable without removing flexibility.",
      },
      {
        title: "Observable execution",
        body: "Multi-step runs need to be debuggable. Every node transition, tool call and intermediate result is recorded so a run can be replayed and inspected.",
      },
      {
        title: "Long-running work in a web UI",
        body: "Agent runs outlive a single request. Progress streams to the interface so users see the plan unfold instead of waiting on a spinner.",
      },
    ],
    architecture: [
      { stage: "Interface", detail: "Next.js app streaming run state and agent output" },
      { stage: "Planner", detail: "Decomposes the goal into a task graph" },
      { stage: "Agent graph", detail: "LangGraph nodes for research, analysis and action" },
      { stage: "Tools", detail: "Search, retrieval and integrations exposed as typed tools" },
      { stage: "Synthesis", detail: "Merges agent outputs into a reviewed final result" },
    ],
    highlights: [
      "Explicit, typed shared state between agents",
      "Role-scoped toolsets per agent",
      "Streamed execution trace in the UI",
      "Graph-based orchestration that is easy to extend",
    ],
    decisions: [
      {
        title: "Graph over chain",
        body: "Modelling the workflow as a graph allows branching, retries and parallel agents — things a linear chain can't express cleanly.",
      },
      {
        title: "Narrow agents, clear contracts",
        body: "Several focused agents with typed outputs are easier to test and reason about than one generalist agent with every tool.",
      },
    ],
    results: [],
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "enterprise-rag-platform",
    index: "02",
    category: "LLM",
    title: "Enterprise RAG Platform",
    tagline: "Production-ready knowledge platform with secure document intelligence.",
    summary:
      "A retrieval-augmented knowledge platform that answers questions from an organisation's own documents — grounded, cited and permission-aware.",
    problem:
      "Valuable knowledge sits in documents nobody can search well. General-purpose models don't know it, and answers that can't be traced back to a source can't be trusted.",
    role: "Backend architecture, retrieval pipeline and API design",
    solution:
      "Documents flow through an ingestion pipeline — parsing, chunking, embedding — into a vector store. A FastAPI service retrieves the most relevant passages, filtered by access rights, and grounds every answer in cited sources.",
    stack: ["Python", "FastAPI", "Vector DB", "OpenAI"],
    visual: "retrieval",
    accent: "azure",
    challenges: [
      {
        title: "Retrieval quality",
        body: "Answers are only as good as the retrieved context. Chunking strategy, metadata and ranking matter more than prompt wording.",
      },
      {
        title: "Security at the retrieval layer",
        body: "Users must never see content they can't access. Permissions are applied when retrieving, not after generation.",
      },
      {
        title: "Trustworthy answers",
        body: "Every answer carries citations back to source passages so users can verify claims instead of taking them on faith.",
      },
    ],
    architecture: [
      { stage: "Ingestion", detail: "Parse, clean and chunk documents with metadata" },
      { stage: "Embedding", detail: "Encode chunks into vectors" },
      { stage: "Vector store", detail: "Similarity search with metadata filtering" },
      { stage: "API", detail: "FastAPI retrieval and generation endpoints" },
      { stage: "Generation", detail: "Grounded answers with source citations" },
    ],
    highlights: [
      "Permission-aware retrieval",
      "Citations on every answer",
      "Async FastAPI service layer",
      "Re-indexable ingestion pipeline",
    ],
    decisions: [
      {
        title: "Filter before you generate",
        body: "Applying access control at retrieval time means restricted content never reaches the model's context in the first place.",
      },
      {
        title: "Retrieval is the product",
        body: "Investing in ingestion and ranking gives larger quality gains than swapping models.",
      },
    ],
    results: [],
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "analytics-dashboard",
    index: "03",
    category: "Web",
    title: "Analytics Dashboard",
    tagline: "Real-time analytics with AI insights and a modern user experience.",
    summary:
      "A real-time analytics interface that pairs live metrics with AI-generated insights, built for clarity at high data density.",
    problem:
      "Dashboards often show everything and explain nothing. Teams need live numbers, but also help understanding what changed and why it matters.",
    role: "Frontend architecture, data visualisation and UX",
    solution:
      "A Next.js and TypeScript interface with live-updating charts and a typed data layer. AI-generated summaries sit beside the data they describe, so insight and evidence are read together.",
    stack: ["Next.js", "TypeScript", "Chart.js"],
    visual: "analytics",
    accent: "lime",
    challenges: [
      {
        title: "Density without noise",
        body: "Showing a lot of data while keeping the important signal obvious takes deliberate hierarchy, not more widgets.",
      },
      {
        title: "Real-time rendering",
        body: "Live updates must not cause jank. Updates are batched and charts only re-render what changed.",
      },
      {
        title: "Placing AI in context",
        body: "Insights are positioned next to the metrics they explain, keeping generated text accountable to visible data.",
      },
    ],
    architecture: [
      { stage: "Data layer", detail: "Typed models for metrics and time series" },
      { stage: "Live updates", detail: "Streaming updates batched into the UI" },
      { stage: "Visualisation", detail: "Chart.js views tuned for density" },
      { stage: "Insights", detail: "AI summaries tied to the underlying data" },
    ],
    highlights: [
      "End-to-end TypeScript types",
      "Batched real-time chart updates",
      "Insight-beside-evidence layout",
      "Responsive from desktop to mobile",
    ],
    decisions: [
      {
        title: "Insight next to evidence",
        body: "AI summaries never float on their own — they are always anchored to the chart they describe.",
      },
    ],
    results: [],
    liveUrl: null,
    repoUrl: null,
  },
  {
    slug: "ai-content-studio",
    index: "04",
    category: "AI",
    title: "AI Content Studio",
    tagline: "End-to-end platform for generating and editing multimedia content.",
    summary:
      "A creative workspace that brings generation and editing together, so AI output is a starting point to refine rather than a final draft to accept.",
    problem:
      "Generating content is easy; making it usable is not. Creators bounce between tools to generate, revise and assemble — losing context at every step.",
    role: "Full-stack implementation and generation pipeline",
    solution:
      "A React workspace backed by Node.js services that orchestrate generation jobs. Outputs land directly in an editor where they can be revised, regenerated in part, and assembled.",
    stack: ["React", "Node.js", "OpenAI"],
    visual: "studio",
    accent: "cyan",
    challenges: [
      {
        title: "Asynchronous generation",
        body: "Generation jobs take time. A job pipeline with progress reporting keeps the editor responsive while work happens in the background.",
      },
      {
        title: "Editing, not just generating",
        body: "Users need to change one part without regenerating everything — so outputs are kept as structured, editable pieces.",
      },
    ],
    architecture: [
      { stage: "Workspace", detail: "React editor for composing and revising" },
      { stage: "Job service", detail: "Node.js orchestration of generation jobs" },
      { stage: "Models", detail: "OpenAI generation behind a provider interface" },
      { stage: "Assets", detail: "Structured, versioned content pieces" },
    ],
    highlights: [
      "Background job pipeline with progress",
      "Partial regeneration of content",
      "Provider-agnostic generation interface",
    ],
    decisions: [
      {
        title: "Structured output",
        body: "Keeping generated content as structured pieces makes targeted edits and partial regeneration possible.",
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
