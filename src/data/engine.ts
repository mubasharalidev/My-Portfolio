/**
 * "Inside the Engine" — an illustrative reference architecture for a
 * retrieval-augmented, tool-using AI application. Not a live system.
 */

export type EngineNodeId = "interface" | "api" | "orchestrator" | "llm" | "retrieval" | "response";

export type EngineNode = {
  id: EngineNodeId;
  index: string;
  title: string;
  kicker: string;
  description: string;
  receives: string;
  emits: string;
  concerns: string[];
  tech: string[];
  /** Position in the 1000×560 desktop diagram. */
  x: number;
  y: number;
};

export const engineNodes: EngineNode[] = [
  {
    id: "interface",
    index: "01",
    title: "User Interface",
    kicker: "Web · Mobile",
    description:
      "Where intent enters the system. Captures the request with its conversation context, then renders the answer token by token as it streams back.",
    receives: "User intent, session context",
    emits: "Structured request over HTTPS",
    concerns: ["Streaming render", "Optimistic state", "Graceful failure"],
    tech: ["Next.js", "React.js", "TypeScript", "WebSockets"],
    x: 90,
    y: 280,
  },
  {
    id: "api",
    index: "02",
    title: "API Layer",
    kicker: "Gateway · Contracts",
    description:
      "The boundary that keeps the AI core safe. Authenticates, validates and rate-limits every request before opening a streaming connection.",
    receives: "Raw client request",
    emits: "Validated, authorised job",
    concerns: ["Auth & tenancy", "Schema validation", "Rate limiting"],
    tech: ["FastAPI", "NestJS", "REST · GraphQL", "JWT · OAuth2"],
    x: 290,
    y: 280,
  },
  {
    id: "orchestrator",
    index: "03",
    title: "AI Orchestrator",
    kicker: "Agent logic · State",
    description:
      "The control loop. Decides what the model needs to know, which tools it may call and in what order — then manages state across every step.",
    receives: "Job + conversation state",
    emits: "Prompts, tool calls, state updates",
    concerns: ["Planning & routing", "Tool permissions", "Step limits"],
    tech: ["LangGraph", "LangChain", "CrewAI", "Python"],
    x: 520,
    y: 280,
  },
  {
    id: "llm",
    index: "04",
    title: "LLM & Tools",
    kicker: "Reasoning · Action",
    description:
      "The model reasons over the assembled context and may request tool calls. Tools execute in the orchestrator, and their results flow back to the model.",
    receives: "Prompt with grounded context",
    emits: "Tokens or tool-call requests",
    concerns: ["Context budget", "Structured outputs", "Fallback models"],
    tech: ["GPT-4o", "Claude 3.5 Sonnet", "AWS Bedrock"],
    x: 760,
    y: 120,
  },
  {
    id: "retrieval",
    index: "05",
    title: "Retrieval & Memory",
    kicker: "Vectors · History",
    description:
      "Grounds the model in real knowledge. Embeds the query, runs a filtered similarity search, and loads relevant conversation memory.",
    receives: "Query embedding + filters",
    emits: "Ranked passages with sources",
    concerns: ["Chunking strategy", "Permission filters", "Freshness"],
    tech: ["Pinecone", "ChromaDB", "PostgreSQL", "Redis"],
    x: 760,
    y: 440,
  },
  {
    id: "response",
    index: "06",
    title: "Response",
    kicker: "Validate · Stream",
    description:
      "Output is checked before it reaches a person — schema-validated, citations attached — then streamed back to the interface.",
    receives: "Model output + sources",
    emits: "Validated, cited token stream",
    concerns: ["Output validation", "Citations", "Observability"],
    tech: ["WebSockets / SSE", "Datadog"],
    x: 920,
    y: 280,
  },
];

export type EngineEdge = { id: string; from: EngineNodeId; to: EngineNodeId; label: string };

export const engineEdges: EngineEdge[] = [
  { id: "ui-api", from: "interface", to: "api", label: "request" },
  { id: "api-orc", from: "api", to: "orchestrator", label: "job" },
  { id: "orc-ret", from: "orchestrator", to: "retrieval", label: "query" },
  { id: "ret-orc", from: "retrieval", to: "orchestrator", label: "context" },
  { id: "orc-llm", from: "orchestrator", to: "llm", label: "prompt" },
  { id: "llm-orc", from: "llm", to: "orchestrator", label: "tool call" },
  { id: "llm-res", from: "llm", to: "response", label: "tokens" },
  { id: "res-ui", from: "response", to: "interface", label: "stream" },
];

/** One request travelling through the system. */
export const engineTrace: { node: EngineNodeId; edge: string | null; caption: string }[] = [
  { node: "interface", edge: null, caption: "A user asks a question about their documents." },
  { node: "api", edge: "ui-api", caption: "Authenticated, validated and rate-limited. A stream opens." },
  { node: "orchestrator", edge: "api-orc", caption: "The orchestrator decides it needs grounding first." },
  { node: "retrieval", edge: "orc-ret", caption: "Query embedded; permission-filtered vector search runs." },
  { node: "orchestrator", edge: "ret-orc", caption: "Top passages and memory are assembled into the prompt." },
  { node: "llm", edge: "orc-llm", caption: "The model reasons over the grounded context." },
  { node: "orchestrator", edge: "llm-orc", caption: "It requests a tool; the orchestrator executes it." },
  { node: "llm", edge: "orc-llm", caption: "With the tool result, the model writes the answer." },
  { node: "response", edge: "llm-res", caption: "Output validated and citations attached." },
  { node: "interface", edge: "res-ui", caption: "Tokens stream back and render as they arrive." },
];
