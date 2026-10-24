import { slugify } from "../slug";
import { seedImageUrl } from "./seedImages";

// Static, reviewed seed content. Sources: resume (.tex, uncommented lines) and the public GitHub
// repos of 111vandit111 (description + README). No network access happens at seed time.

export interface SeedProject {
  slug: string;
  name: string;
  description: string;
  problem: string;
  role: string;
  approach: string;
  impact: string;
  tags: string[];
  repoUrl: string;
  liveUrl?: string;
  year: string;
  image: string;
  order: number;
  isFeatured: boolean;
  isVisible: boolean;
}

export interface SeedSkill {
  slug: string;
  name: string;
  description: string;
  detail: string;
  level: number;
  years: number;
  relatedProjects: string[];
  image: string;
  category: string;
  order: number;
  isVisible: boolean;
}

export interface SeedExperience {
  slug: string;
  company: string;
  role: string;
  summary: string;
  period: string;
  bullets: string[];
  tags: string[];
  impact: string;
  image: string;
  order: number;
  isVisible: boolean;
}

export interface SeedEducation {
  slug: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
  image: string;
  order: number;
  isVisible: boolean;
}

const GITHUB = "https://github.com/111vandit111";
// Years of professional experience backing a skill (resume: "nearly 3 years"), and the floor for
// skills that are listed on the resume without a project or role that demonstrates them.
const PRO_YEARS = 3;
const LISTED_YEARS = 1;

const P = {
  portfolio: "vandit-kala",
  dsa: "dsa-visualizer",
  taskkar: "taskkar",
  phanroa: "phanroa-ai",
  aiDevTeam: "ai-dev-team",
  workBoard: "the-work-board",
};

export const PROJECTS: SeedProject[] = [
  {
    slug: P.dsa,
    name: "DSA Visualizer",
    description: "Step through DSA solutions line by line and watch every variable, array, heap and linked list change.",
    problem:
      "Reading a data structure or algorithm solution is hard when you cannot see how its state evolves while it runs.",
    role: "Creator and developer: designed and built the app end to end.",
    approach:
      "Instruments pasted or picked JavaScript solutions with acorn and runs them in a browser Web Worker against LeetCode-style test cases. A step view shows variables, arrays, maps, sets, heaps and linked lists. Built with Next.js, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, CodeMirror and MongoDB, with 455 Vitest tests across 40 test files.",
    impact:
      "A live, deployed tool with an admin area, SEO-ready public pages (sitemap, robots, structured data) and a documented REST API.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "MongoDB", "Framer Motion", "Vitest"],
    repoUrl: `${GITHUB}/dsa-visualizer`,
    liveUrl: "https://dsa-visualizer-gamma-six.vercel.app",
    year: "2026",
    image: seedImageUrl("projects", P.dsa),
    order: 1,
    isFeatured: true,
    isVisible: true,
  },
  {
    slug: P.aiDevTeam,
    name: "AI Dev Team",
    description: "Token-efficient multi-agent dev team skill for Claude Code, Codex, Gemini CLI, Cursor and more.",
    problem:
      "AI coding agents burn tokens and drift from a repo's conventions when one model handles planning, building and checking alone.",
    role: "Creator and maintainer of the open-source skill and plugins.",
    approach:
      "A planner, parallel builders and a verifier (or reviewer and testers on big jobs) work together, sized to the task. Each task gets the cheapest model and effort level from the user's own model list, matches the repo's code style and shares notes so nothing is researched twice. Ships as an Agent Skill plus Claude Code plugins.",
    impact:
      "Public, installable open-source project for multiple AI coding tools, with companion research and recruiter-panel plugins.",
    tags: ["TypeScript", "Agent Skills", "Claude Code", "Multi-agent"],
    repoUrl: `${GITHUB}/ai-dev-team`,
    year: "2026",
    image: seedImageUrl("projects", P.aiDevTeam),
    order: 2,
    isFeatured: true,
    isVisible: true,
  },
  {
    slug: P.portfolio,
    name: "Vandit Kala Portfolio",
    description: "This portfolio: Next.js 15 and MongoDB, three audience views, an owner admin dashboard and an original animated hero.",
    problem:
      "A single static page cannot speak to recruiters, friends and curious visitors at once, and hard-coded content is slow to keep current.",
    role: "Designed and built the whole site, front end to back end.",
    approach:
      "Next.js 15 (App Router) and TypeScript app with 7 pages and 12 API routes and separate recruiter, personal and stalker views. Content (projects, skills, experience, education, copy) lives in MongoDB via Mongoose, is validated with zod, and is editable through a password-protected admin dashboard with analytics and a contact inbox. The hero is an original canvas animation of a breadth-first graph search, drawn without an animation library. 87 Vitest tests across 13 test files.",
    impact:
      "Owner-editable content with no redeploys, per-audience visit analytics, a rate-limited contact form and 87 automated tests.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "MongoDB", "Mongoose", "zod", "Vitest"],
    repoUrl: `${GITHUB}/vandit-kala`,
    liveUrl: "https://vandit-kala.vercel.app",
    year: "2025",
    image: seedImageUrl("projects", P.portfolio),
    order: 3,
    isFeatured: true,
    isVisible: true,
  },
  {
    slug: P.taskkar,
    name: "Taskkar",
    description: "Real-time collaborative whiteboard: sign in, join an organization, create boards and draw, write notes and place shapes together.",
    problem: "Teams brainstorming remotely need one shared canvas where everyone sees the same board change as it happens.",
    role: "Built the app: 29 commits between February and August 2024.",
    approach: "Next.js 14, React 18 and TypeScript app (68 TS/TSX files, about 4,600 lines). Clerk handles sign-in and organizations with member invites, Convex stores boards, favourites and title search, and Liveblocks syncs live cursors and board state. The canvas has freehand drawing, sticky notes, text, rectangles and ellipses, with select, resize, colour picker, undo and redo.",
    impact: "Source is public on GitHub. The hosted demo is currently offline, so no live link is shown; ask Vandit for a walkthrough.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Convex", "Liveblocks", "Clerk"],
    repoUrl: `${GITHUB}/Taskkar`,
    year: "2024",
    image: seedImageUrl("projects", P.taskkar),
    order: 4,
    isFeatured: false,
    isVisible: true,
  },
  {
    slug: P.phanroa,
    name: "Phanroa.ai",
    description: "Early-stage prototype of a creator community platform: landing page, login and sign-up screens, and separate creator and member areas.",
    problem: "People who want to run their own community need a simple place to sign up, claim a URL and manage it.",
    role: "Built the front-end prototype: 2 commits in February 2026.",
    approach: "Next.js 16, React 19, TypeScript and Tailwind CSS 4 app with 4 routes (landing, login and sign-up, creator dashboard, member app) and 24 shadcn/Radix-based UI components. The login screen is front-end only: it routes to the creator or member area by email prefix.",
    impact: "Prototype with public source on GitHub. It has no backend or database yet, so there are no user or usage figures.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    repoUrl: `${GITHUB}/phanroa.ai`,
    liveUrl: "https://phanroa-ai.vercel.app",
    year: "2026",
    image: seedImageUrl("projects", P.phanroa),
    order: 5,
    isFeatured: false,
    isVisible: true,
  },
  {
    slug: P.workBoard,
    name: "The Work Board",
    description: "Draw a math or graphical problem on a canvas and have Google Gemini solve it.",
    problem: "Math and graphical problems are slow to type out and quick to sketch.",
    role: "Built the app: 6 commits between January and July 2025.",
    approach: "Single-page Next.js 15, React 19 and TypeScript app. A full-screen HTML canvas with 10 pen colours and a reset button exports the drawing as a JPEG and sends it to Google's Gemini 2.0 Flash model through @google/generative-ai. The prompt covers five cases (arithmetic, equation sets, variable assignment, graphical word problems, abstract drawings), the JSON answer is shown in a results panel, and assigned variable names are fed back into the next request.",
    impact: "Working prototype with public source and a Vercel deployment; the whole app is under 300 lines of TypeScript. No usage figures are published.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Google Gemini"],
    repoUrl: `${GITHUB}/the-work-board`,
    liveUrl: "https://the-work-board.vercel.app",
    year: "2025",
    image: seedImageUrl("projects", P.workBoard),
    order: 6,
    isFeatured: false,
    isVisible: true,
  },
];

type SkillRow = [
  name: string,
  category: string,
  level: number,
  years: number,
  description: string,
  detail: string,
  related?: string[],
];

const LANG = "Languages";
const FE = "Frontend";
const MEDIA = "Media & Streaming";
const UI = "UI Libraries";
const BE = "Backend";
const TOOLS = "Cloud & Tools";
const PRACTICE = "Testing & Practices";

const ALL_WEB = [P.portfolio, P.dsa, P.taskkar, P.phanroa, P.workBoard];

const SKILL_ROWS: SkillRow[] = [
  [
    "TypeScript", LANG, 90, PRO_YEARS,
    "Primary language for typed, maintainable React and Node codebases.",
    "Used daily in production at Northstarz.ai and Red Baton, and in every project on this site. Applies strict typing to component props, API contracts and validation boundaries so refactors stay safe on a 7-engineer team.",
    [P.portfolio, P.dsa, P.taskkar, P.phanroa, P.workBoard, P.aiDevTeam],
  ],
  [
    "JavaScript", LANG, 88, PRO_YEARS,
    "Strong core JavaScript for browser, Node and real-time interfaces.",
    "Writes modern JavaScript across the stack, from async data flows and RxJS streams to Web Worker based tooling in the DSA Visualizer.",
    [P.dsa],
  ],
  [
    "HTML5", LANG, 88, PRO_YEARS,
    "Semantic, accessible markup as the base of every interface.",
    "Builds semantic HTML with ARIA where needed, and works with HTML5 video for the custom interview player.",
    ALL_WEB,
  ],
  [
    "CSS3", LANG, 85, PRO_YEARS,
    "Responsive layout and styling, from utility classes to custom CSS.",
    "Delivers responsive, accessible interfaces with modern CSS, including grid, flexbox, custom properties and motion that respects reduced-motion preferences.",
    [P.portfolio, P.dsa],
  ],
  [
    "SQL", LANG, 62, LISTED_YEARS,
    "Comfortable writing queries for relational data.",
    "Listed on the resume as part of the data toolkit alongside MongoDB.",
  ],
  [
    "Java", LANG, 60, LISTED_YEARS,
    "Working knowledge of Java fundamentals.",
    "Foundational Java, including working through the LinkedIn Learning course Level Up: Java.",
  ],
  [
    "Python", LANG, 62, LISTED_YEARS,
    "Scripting and general-purpose Python for tooling and experiments.",
    "Listed on the resume as a secondary language next to the main TypeScript stack.",
  ],
  [
    "React 19", FE, 90, PRO_YEARS,
    "Daily driver for building production component architectures.",
    "Owns the frontend architecture of an AI hiring platform at Northstarz.ai: component and data-fetching patterns, a shared accessible component library and performance work that cut load times from about 20s to under 2s. Also builds with React 19 in this portfolio and the DSA Visualizer.",
    [P.portfolio, P.dsa],
  ],
  [
    "Next.js", FE, 90, PRO_YEARS,
    "App Router, server rendering and API routes for full web products.",
    "Built Next.js apps for UXmagic.ai and Unilever at Red Baton, and uses it for this portfolio, DSA Visualizer, Taskkar, Phanroa.ai and The Work Board.",
    ALL_WEB,
  ],
  [
    "Redux Toolkit", FE, 80, PRO_YEARS,
    "Predictable global state for larger React apps.",
    "Used Redux with React Query to manage state in the Unilever operations dashboard built at Red Baton.",
  ],
  [
    "Zustand", FE, 75, LISTED_YEARS,
    "Lightweight store for simple, fast client state.",
    "Listed on the resume as a lightweight alternative to Redux for simple client state.",
  ],
  [
    "TanStack Query", FE, 85, PRO_YEARS,
    "Server-state fetching, caching and invalidation.",
    "Applied in data-fetching and caching work that was part of the platform-wide optimization at Northstarz.ai, and in the Unilever dashboard.",
  ],
  [
    "RxJS", FE, 82, PRO_YEARS,
    "Reactive streams for complex filtering and async flows.",
    "At Hoonr.ai, rebuilt candidate filtering as RxJS streams, reducing code complexity by 35% and improving responsiveness by 25%.",
  ],
  [
    "Vite", FE, 75, LISTED_YEARS,
    "Fast dev server and build tool for React single-page apps.",
    "Used for lightweight React front ends, for example the public Qodex.ai weather app built with React 19, TanStack Query and Vite.",
  ],
  [
    "Tailwind CSS", FE, 90, PRO_YEARS,
    "Utility-first styling for consistent, responsive UIs.",
    "Styles the Unilever dashboard, the DSA Visualizer and this portfolio with Tailwind, using design tokens and responsive breakpoints.",
    [P.portfolio, P.dsa],
  ],
  [
    "HTML5 Video", MEDIA, 85, PRO_YEARS,
    "Custom video player for recorded candidate interviews.",
    "Built a custom React video player for GCP-hosted interview recordings with a seekable timeline, interview chapter markers, ref-controlled playback and a workaround for streams with unknown duration.",
  ],
  [
    "WebSockets", MEDIA, 82, PRO_YEARS,
    "Real-time, two-way communication between client and server.",
    "Part of the real-time conversational AI interviewer at Northstarz.ai, which supports voice streaming and resilient media uploads.",
  ],
  [
    "Voice Streaming", MEDIA, 82, PRO_YEARS,
    "Real-time voice streaming for an AI interviewer.",
    "Architected the conversational AI interviewer with voice streaming, an AI avatar, multilingual support, adaptive follow-ups and integrity monitoring, supporting 10,000+ candidate interviews.",
  ],
  [
    "HLS.js", MEDIA, 65, LISTED_YEARS,
    "Adaptive HLS playback in the browser.",
    "Integrating adaptive HLS playback for video delivery, as noted on the resume.",
  ],
  [
    "shadcn/Radix", UI, 85, PRO_YEARS,
    "Accessible, composable UI primitives.",
    "Used shadcn and Radix for the Unilever operations dashboard and the DSA Visualizer, and as the base for accessible shared components.",
    [P.dsa],
  ],
  [
    "Material UI", UI, 75, LISTED_YEARS,
    "Ready-made React components with a consistent design language.",
    "Listed on the resume for building standard application screens quickly.",
  ],
  [
    "Ant Design", UI, 72, LISTED_YEARS,
    "Enterprise-grade React component library.",
    "Listed on the resume for data-heavy interfaces such as tables and forms.",
  ],
  [
    "SCSS", UI, 78, LISTED_YEARS,
    "Structured, reusable stylesheets with Sass.",
    "Listed on the resume for structured stylesheets with variables, mixins and nesting.",
  ],
  [
    "Framer Motion", UI, 80, LISTED_YEARS,
    "Declarative animation for React interfaces.",
    "Adds purposeful motion to interfaces, including the DSA Visualizer.",
    [P.dsa],
  ],
  [
    "React Flow", UI, 72, LISTED_YEARS,
    "Node-based diagrams and workflow editors.",
    "Listed on the resume for interactive node graph and workflow-style interfaces.",
  ],
  [
    "React DnD", UI, 72, LISTED_YEARS,
    "Drag-and-drop interactions for React.",
    "Listed on the resume for drag-and-drop interfaces.",
  ],
  [
    "Node.js", BE, 82, PRO_YEARS,
    "Server-side JavaScript for APIs and tooling.",
    "Builds REST APIs and services with Node.js, including the API routes and seed tooling behind this portfolio.",
    [P.portfolio],
  ],
  [
    "Express.js", BE, 78, LISTED_YEARS,
    "Minimal, flexible Node web framework for REST APIs.",
    "Listed on the resume for REST endpoints and small back-end services next to Node.js.",
  ],
  [
    "Nest.js", BE, 80, PRO_YEARS,
    "Structured, modular Node back ends.",
    "Powered the back end of the Hoonr.ai candidate discovery platform built at Red Baton, alongside Algolia search.",
  ],
  [
    "MongoDB", BE, 85, PRO_YEARS,
    "Document database for flexible, fast-moving data models.",
    "Led the UXmagic.ai data-layer migration to MongoDB, cutting infrastructure costs by 80%. Also backs this portfolio and the DSA Visualizer.",
    [P.portfolio, P.dsa],
  ],
  [
    "REST APIs", BE, 85, PRO_YEARS,
    "Clean, validated, well-documented HTTP APIs.",
    "Designs and consumes REST APIs across the stack, with input validation at the boundary and consistent response shapes.",
    [P.portfolio, P.dsa],
  ],
  [
    "AWS", TOOLS, 70, LISTED_YEARS,
    "Cloud hosting and services for production apps.",
    "Listed on the resume among the cloud platforms used for web applications.",
  ],
  [
    "GCP", TOOLS, 75, PRO_YEARS,
    "Google Cloud for media hosting and integrations.",
    "Plays GCP-hosted interview video in the custom player at Northstarz.ai and built a GCP integration for Scrut.io.",
  ],
  [
    "Docker", TOOLS, 72, LISTED_YEARS,
    "Containers for consistent local and deployed environments.",
    "Listed on the resume for packaging and running services consistently.",
  ],
  [
    "Vercel", TOOLS, 88, PRO_YEARS,
    "Zero-config deployment for Next.js apps.",
    "Hosts the live deployments of this portfolio, DSA Visualizer, Taskkar, Phanroa.ai and The Work Board.",
    ALL_WEB,
  ],
  [
    "Git", TOOLS, 88, PRO_YEARS,
    "Branching, code review and clean history as daily habits.",
    "Works in Git-based review flows daily, including reviewing frontend code for a 7-engineer team.",
  ],
  [
    "Webpack", TOOLS, 70, LISTED_YEARS,
    "Bundling and code-splitting for larger front ends.",
    "Listed on the resume for bundling and code-splitting work.",
  ],
  [
    "Postman", TOOLS, 80, LISTED_YEARS,
    "API exploration, debugging and collaboration.",
    "Listed on the resume for exercising and debugging REST endpoints.",
  ],
  [
    "JIRA", TOOLS, 78, PRO_YEARS,
    "Sprint planning and ticket tracking in Agile teams.",
    "Tracks work in JIRA within an Agile/Scrum process.",
  ],
  [
    "OpenAI API", TOOLS, 82, PRO_YEARS,
    "Building AI features on top of OpenAI models.",
    "Built the UXmagic.ai AI-powered Figma plugin and Next.js app on the OpenAI API, cutting design time by 30%.",
  ],
  [
    "Algolia", TOOLS, 80, PRO_YEARS,
    "Fast search and filtering for discovery experiences.",
    "Built the Hoonr.ai candidate discovery platform on Algolia and Nest.js.",
  ],
  [
    "Jest", PRACTICE, 82, PRO_YEARS,
    "Unit and integration testing for JavaScript and TypeScript.",
    "Established unit and integration testing standards at Northstarz.ai using Jest.",
  ],
  [
    "React Testing Library", PRACTICE, 82, PRO_YEARS,
    "User-centred component tests.",
    "Tests React components through user behaviour with React Testing Library as part of the team's engineering standards.",
  ],
  [
    "Accessibility", PRACTICE, 85, PRO_YEARS,
    "WCAG and ARIA aware interfaces.",
    "Built an accessible (WCAG, ARIA) shared component library at Northstarz.ai and applies keyboard, focus and screen-reader checks to new UI.",
  ],
  [
    "Code Reviews", PRACTICE, 88, PRO_YEARS,
    "Constructive reviews that raise code quality for the whole team.",
    "Reviews frontend code for a 7-engineer team at Northstarz.ai and mentored 2 interns.",
  ],
  [
    "Agile/Scrum", PRACTICE, 85, PRO_YEARS,
    "Delivering in sprints with clear ownership.",
    "Works in an Agile/Scrum process, owning features end to end across frontend and backend.",
  ],
];

export const SKILLS: SeedSkill[] = SKILL_ROWS.map(
  ([name, category, level, years, description, detail, related], index) => ({
    slug: slugify(name),
    name,
    description,
    detail,
    level,
    years,
    relatedProjects: related ?? [],
    image: seedImageUrl("skills", slugify(name)),
    category,
    order: index + 1,
    isVisible: true,
  })
);

export const EXPERIENCE: SeedExperience[] = [
  {
    slug: "northstarz-ai",
    company: "Northstarz.ai",
    role: "Software Development Engineer",
    summary:
      "Software engineer on an AI hiring and talent CRM platform serving 20+ enterprise clients including Mahindra. Owns frontend architecture, sets engineering standards and ships real-time AI features and backend flows end to end.",
    period: "Aug 2025 - Present",
    bullets: [
      "Own frontend architecture for a 7-engineer team: set component and data-fetching patterns, review frontend code and mentored 2 interns.",
      "Established engineering standards: code reviews, unit and integration testing (Jest, React Testing Library) and an accessible (WCAG, ARIA) shared component library, in an Agile/Scrum process.",
      "Architected a real-time conversational AI interviewer with voice streaming, an AI avatar, multilingual support, adaptive follow-ups, integrity monitoring and resilient media uploads, supporting 10,000+ candidate interviews.",
      "Built a custom React video player for recorded candidate interviews with a seekable timeline, chapter markers, ref-controlled playback and a workaround for streams with unknown duration.",
      "Cut load times from about 20s to under 2s by leading platform-wide optimization of data fetching, caching and code-splitting.",
      "Owned Offer & Compensation end to end (frontend and backend): a configurable salary engine with statutory rules, hike validation and automatic CTC balancing, plus multi-level approvals, PDF offer letters and online acceptance.",
      "Designed a configurable multi-tenant platform (workflows, forms, hiring stages, careers pages, fine-grained RBAC) so each enterprise client configures its hiring process without code changes.",
      "Built AI sourcing interfaces, an agent-style recruiting assistant and internal admin tools for tenant, feature and credit management.",
    ],
    tags: ["React", "Next.js", "TypeScript", "WebSockets", "GCP", "Jest", "React Testing Library"],
    impact:
      "Supported 10,000+ AI-led candidate interviews, cut platform load times from about 20s to under 2s and gave 20+ enterprise clients a hiring process they can configure without code changes.",
    image: seedImageUrl("experience", "northstarz-ai"),
    order: 1,
    isVisible: true,
  },
  {
    slug: "red-baton",
    company: "Red Baton",
    role: "Associate Software Developer",
    summary:
      "Delivered full-stack features for client products across AI design tooling, candidate discovery, compliance and enterprise operations, working in React, Next.js, TypeScript, Node.js, Nest.js and MongoDB.",
    period: "Nov 2023 - Aug 2025",
    bullets: [
      "UXmagic.ai: built an AI-powered Figma plugin and Next.js/TypeScript app on the OpenAI API, cutting design time by 30%; led the data-layer migration to MongoDB, cutting infrastructure costs by 80%.",
      "Hoonr.ai: built a React/TypeScript candidate discovery platform on Algolia and Nest.js; rebuilt filtering as RxJS streams, reducing code complexity by 35% and improving responsiveness by 25%.",
      "Scrut.io: built reusable React modules, filtering workflows and the CAT test-management module for a compliance platform serving 850+ clients; KEKA, BambooHR and GCP integrations cut setup from over an hour to under 15 minutes, and CSV exports got 23% faster.",
      "Unilever: built a Next.js operations dashboard with an interactive India map, incident markers, charts and tables (Tailwind CSS, shadcn, React Query, Redux).",
    ],
    tags: ["React", "Next.js", "TypeScript", "Node.js", "Nest.js", "MongoDB", "RxJS", "Algolia", "OpenAI API"],
    impact:
      "Cut design time by 30% and infrastructure costs by 80% at UXmagic.ai, improved filtering responsiveness by 25% at Hoonr.ai and sped up Scrut.io onboarding from over an hour to under 15 minutes.",
    image: seedImageUrl("experience", "red-baton"),
    order: 2,
    isVisible: true,
  },
];

export const EDUCATION: SeedEducation[] = [
  {
    slug: "jain-university",
    institution: "Jain (Deemed-to-be) University",
    degree: "Bachelor of Technology in Computer Science",
    period: "2019 - 2023",
    description: "Completed a four-year B.Tech programme in Computer Science.",
    image: seedImageUrl("education", "jain-university"),
    order: 1,
    isVisible: true,
  },
];

export { TEXTS } from "./seedTexts";
