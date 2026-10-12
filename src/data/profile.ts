/**
 * Single source of truth for identity, contact and career content.
 *
 * Source: the supplied portfolio design reference (no resume / LinkedIn
 * export was present in the repository). Anything marked `EDIT` should be
 * confirmed against the real profile before publishing. Fields set to
 * `null` are intentionally hidden in the UI until filled in.
 */

export type Stat = { value: string; label: string };

export type Milestone = {
  period: string;
  title: string;
  /** Company or institution — hidden when null. EDIT: add real names. */
  organisation: string | null;
  kind: "education" | "role";
  summary: string;
  highlights: string[];
};

export type SocialLink = { label: string; handle: string; href: string };

export const profile = {
  name: "Muhammad Noman",
  firstName: "Muhammad",
  initials: "MN",
  role: "Senior AI/ML & Full-Stack Engineer",
  focus: ["AI Systems", "LLMs", "Agentic AI", "Scalable Backends", "Modern Frontends"],

  intro:
    "I design and ship AI products end to end — agent orchestration and retrieval pipelines, the APIs and cloud infrastructure underneath, and the interfaces people actually use.",

  // EDIT: confirm these figures — taken from the design reference.
  stats: [
    { value: "6+", label: "Years experience" },
    { value: "20+", label: "Projects delivered" },
    { value: "AI", label: "LLM & agentic systems" },
    { value: "Global", label: "Remote & open to relocate" },
  ] satisfies Stat[],

  availability: {
    open: true,
    label: "Available for opportunities",
    detail: "Open to remote & on-site roles",
  },
  currentlyBuilding: "AI agents for real-world workflows",
  quote: "Technology amplifies human potential.",

  /** EDIT: set a city / timezone to show it in About & Contact. */
  location: null as string | null,

  // EDIT: verify contact details.
  email: "muhammadnoman.dev@gmail.com",
  socials: [
    {
      label: "LinkedIn",
      handle: "in/muhammadnoman",
      href: "https://www.linkedin.com/in/muhammadnoman",
    },
    {
      label: "GitHub",
      handle: "muhammad-noman",
      href: "https://github.com/muhammad-noman",
    },
  ] satisfies SocialLink[],

  /**
   * `/resume` is a printable page generated from this file.
   * To serve a PDF instead, drop it in /public and set e.g. "/muhammad-noman-cv.pdf".
   */
  resumeUrl: "/resume",
};

export const experience: Milestone[] = [
  {
    period: "2024 — Present",
    title: "Senior AI/ML & Full-Stack Engineer",
    organisation: null,
    kind: "role",
    summary:
      "Owning AI products end to end — from agent and retrieval design through backend services to the shipped interface.",
    highlights: ["End-to-end AI products", "Leading complex, real-world solutions"],
  },
  {
    period: "2023 — 2024",
    title: "AI/ML Engineer",
    organisation: null,
    kind: "role",
    summary:
      "Moved from integrating models to engineering around them: LLM systems, retrieval-augmented generation and agentic workflows.",
    highlights: ["LLM systems, RAG, agentic AI", "Production deployments"],
  },
  {
    period: "2021 — 2023",
    title: "Senior Software Engineer",
    organisation: null,
    kind: "role",
    summary:
      "Designed scalable services and cloud deployments, and began bringing AI capabilities into product architecture.",
    highlights: ["Scalable systems & cloud", "AI integration and architecture"],
  },
  {
    period: "2019 — 2021",
    title: "Software Engineer",
    organisation: null,
    kind: "role",
    summary: "Shipped full-stack features across web and mobile products.",
    highlights: ["Full-stack development", "Web & mobile applications"],
  },
  {
    period: "2018 — 2019",
    title: "Computer Science",
    organisation: null,
    kind: "education",
    summary: "BS in Computer Science — algorithms, systems and the fundamentals everything else is built on.",
    highlights: ["BS in Computer Science", "Building the foundation"],
  },
];

/** Smaller explorations listed in the Lab index. EDIT: add links when public. */
export const notebook: { title: string; note: string; href: string | null }[] = [
  { title: "Realtime AI Chat", note: "Chat with multiple AI models", href: null },
  { title: "Image Generation Lab", note: "Text-to-image with custom models", href: null },
  { title: "Voice AI Assistant", note: "Natural voice conversations", href: null },
  { title: "3D World Generator", note: "AI-powered 3D environments", href: null },
  { title: "Computer Vision Playground", note: "Object detection & analysis", href: null },
  { title: "AI Agent Playground", note: "Custom agent workflows", href: null },
];

export const navItems = [
  { id: "expertise", label: "Expertise" },
  { id: "work", label: "Work" },
  { id: "engine", label: "Engine" },
  { id: "experience", label: "Experience" },
  { id: "lab", label: "Lab" },
  { id: "about", label: "About" },
] as const;
