// Text values the earlier seed wrote. The copy update only replaces a stored value that still
// equals one of these, so anything the owner edited in admin is left alone.
export interface LegacyField {
  resource: "projects" | "skills" | "experience" | "education";
  slug: string;
  field: string;
  value: string | string[];
}

export const LEGACY_TEXTS: Record<string, string> = {
  "hero.headline": "Front-end engineer building fast, real-time web apps in React, Next.js and TypeScript",
  "hero.availability": "Currently a Software Development Engineer at Northstarz.ai. Get in touch about frontend and full-stack opportunities.",
  "hero.stats": "10,000+|AI interviews supported\n20s to 2s|Load time after optimization\n20+|Enterprise clients served\n7|Engineers on the frontend team",
  "hero.tagline.recruiter": "Front-end engineer shipping fast, real-time React and Next.js products for AI hiring teams.",
  "hero.tagline.personal": "Same guy, fewer buzzwords. Welcome to my corner of the internet, make yourself at home.",
  "hero.tagline.stalker": "You found the front door. Look around, nobody is going to stop you. Just say hi on the way out.",
  "about.recruiter": "Front-end engineer with nearly 3 years building production web apps in React, Next.js and TypeScript, focused on performance and real-time media. I own frontend architecture for a 7-engineer team on an AI hiring platform serving 20+ enterprise clients (including Mahindra), shipped a real-time voice-streaming AI interviewer used in 10,000+ interviews, built a custom video player for recorded interviews, and cut load times from about 20s to under 2s.",
  "about.personal": "I build websites for a living: the kind that talk to people in real time, remember what you asked and load before you blink. By day I lead the frontend for an AI hiring platform, by night I tinker with side projects and share them here. Poke around, and tell me what you think.",
  "about.stalker": "Hi, I am Vandit, a front-end engineer who likes fast interfaces, real-time voice and video, and a good side project. Since you are here anyway, read the projects, check the skills and see what I have been up to. Curious about something? Send a message."
};

export const LEGACY_FIELDS: LegacyField[] = [
  {
    "resource": "projects",
    "slug": "vandit-kala",
    "field": "role",
    "value": "Developer of the whole site."
  },
  {
    "resource": "projects",
    "slug": "vandit-kala",
    "field": "approach",
    "value": "Next.js App Router and TypeScript front end with separate recruiter, personal and stalker views. Content (projects, skills, experience, education, copy) lives in MongoDB via Mongoose, is validated with zod, and is editable through a password-protected admin dashboard with analytics and a contact inbox."
  },
  {
    "resource": "experience",
    "slug": "northstarz-ai",
    "field": "role",
    "value": "Software Development Engineer (frontend lead, 7-engineer team)"
  },
  {
    "resource": "experience",
    "slug": "northstarz-ai",
    "field": "role",
    "value": "Software Development Engineer (7-engineer team)"
  },
  {
    "resource": "experience",
    "slug": "northstarz-ai",
    "field": "summary",
    "value": "Frontend lead on an AI hiring and talent CRM platform serving 20+ enterprise clients including Mahindra. Owns frontend architecture, sets engineering standards and ships real-time AI features end to end."
  },
  {
    "resource": "experience",
    "slug": "red-baton",
    "field": "summary",
    "value": "Delivered front-end and full-stack features for client products across AI design tooling, candidate discovery, compliance and enterprise operations, working in React, Next.js, TypeScript, Node.js, Nest.js and MongoDB."
  },
  {
    "resource": "projects",
    "slug": "taskkar",
    "field": "description",
    "value": "An app that simplifies collaborative brainstorming with your team and friends."
  },
  {
    "resource": "projects",
    "slug": "taskkar",
    "field": "problem",
    "value": "Brainstorming across several collaborations gets scattered when teams and friends lack one simple shared space."
  },
  {
    "resource": "projects",
    "slug": "taskkar",
    "field": "role",
    "value": "Creator and developer."
  },
  {
    "resource": "projects",
    "slug": "taskkar",
    "field": "approach",
    "value": "A Next.js and TypeScript web app for running brainstorming sessions with multiple collaborators."
  },
  {
    "resource": "projects",
    "slug": "taskkar",
    "field": "impact",
    "value": "Deployed and publicly available; no usage figures are published."
  },
  {
    "resource": "projects",
    "slug": "taskkar",
    "field": "tags",
    "value": [
      "Next.js",
      "TypeScript"
    ]
  },
  {
    "resource": "projects",
    "slug": "phanroa-ai",
    "field": "description",
    "value": "A place for people to create their own communities and run them."
  },
  {
    "resource": "projects",
    "slug": "phanroa-ai",
    "field": "problem",
    "value": "People who want to start and manage their own community need a home that is simple to set up."
  },
  {
    "resource": "projects",
    "slug": "phanroa-ai",
    "field": "role",
    "value": "Creator and developer."
  },
  {
    "resource": "projects",
    "slug": "phanroa-ai",
    "field": "approach",
    "value": "A Next.js and TypeScript web app for creating and running communities."
  },
  {
    "resource": "projects",
    "slug": "phanroa-ai",
    "field": "impact",
    "value": "Deployed and publicly available; no usage figures are published."
  },
  {
    "resource": "projects",
    "slug": "phanroa-ai",
    "field": "tags",
    "value": [
      "Next.js",
      "TypeScript"
    ]
  },
  {
    "resource": "projects",
    "slug": "the-work-board",
    "field": "description",
    "value": "An AI-based app that helps solve graphical problems."
  },
  {
    "resource": "projects",
    "slug": "the-work-board",
    "field": "problem",
    "value": "Visual and graphical problems are hard to talk through in plain text."
  },
  {
    "resource": "projects",
    "slug": "the-work-board",
    "field": "role",
    "value": "Creator and developer."
  },
  {
    "resource": "projects",
    "slug": "the-work-board",
    "field": "approach",
    "value": "A Next.js and TypeScript web app that applies AI to graphical problems."
  },
  {
    "resource": "projects",
    "slug": "the-work-board",
    "field": "impact",
    "value": "Deployed and publicly available; no usage figures are published."
  },
  {
    "resource": "projects",
    "slug": "the-work-board",
    "field": "tags",
    "value": [
      "Next.js",
      "TypeScript",
      "AI"
    ]
  },
  {
    "resource": "projects",
    "slug": "vandit-kala",
    "field": "description",
    "value": "This portfolio: three audience views, a MongoDB-backed content model and an owner admin dashboard."
  },
  {
    "resource": "projects",
    "slug": "vandit-kala",
    "field": "approach",
    "value": "Next.js App Router and TypeScript app with API routes and separate recruiter, personal and stalker views. Content (projects, skills, experience, education, copy) lives in MongoDB via Mongoose, is validated with zod, and is editable through a password-protected admin dashboard with analytics and a contact inbox."
  },
  {
    "resource": "projects",
    "slug": "vandit-kala",
    "field": "impact",
    "value": "Owner-editable content with no redeploys, per-audience visit analytics and a rate-limited contact form."
  },
  {
    "resource": "projects",
    "slug": "vandit-kala",
    "field": "tags",
    "value": [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "MongoDB",
      "Mongoose",
      "zod"
    ]
  },
  {
    "resource": "projects",
    "slug": "dsa-visualizer",
    "field": "approach",
    "value": "Instruments pasted or picked JavaScript solutions with acorn and runs them in a browser Web Worker against LeetCode-style test cases. A step view shows variables, arrays, maps, sets, heaps and linked lists. Built with Next.js, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, CodeMirror and MongoDB, with Vitest unit tests."
  }
];
