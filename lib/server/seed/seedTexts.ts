import { contactTextEntries } from "../../contactCopy";

// Site copy. The recruiter view is professional; the personal and stalker views are deliberately
// silly (self-deprecating developer humour, family-safe). Edit any of it in admin Texts.
export const TEXTS: Record<string, string> = {
  "hero.name": "Vandit Kala",
  "hero.headline":
    "Software engineer and problem solver building fast, real-time products with React, Next.js, TypeScript and Node.js",
  "hero.availability":
    "Currently a Software Development Engineer at Northstarz.ai. Get in touch about software engineering opportunities.",
  "hero.stats": [
    "3+|Years building production grade web apps",
    "SDE|Currently at Northstarz.ai",
    "20s → <2s|Page load time I cut",
  ].join("\n"),
  "cta.contact": "Contact me",
  "cta.contact.recruiter": "Contact me",
  "cta.contact.personal": "Poke me",
  "cta.contact.stalker": "Say hi, stranger",
  "hero.tagline.recruiter":
    "Software engineer and problem solver shipping fast, real-time products for AI hiring teams.",
  "hero.tagline.personal":
    "Same guy, fewer buzzwords, more bugs. Welcome to my corner of the internet. Shoes off, please.",
  "hero.tagline.stalker":
    "You found the front door. Nobody will stop you, the lock is a sticky note. Just say hi on your way out.",
  "about.recruiter":
    "Software engineer and problem solver with nearly 3 years building production web apps and services in React, Next.js, TypeScript, Node.js and MongoDB, focused on performance and real-time media. I own frontend architecture for a 7-engineer team on an AI hiring platform serving 20+ enterprise clients (including Mahindra), shipped a real-time voice-streaming AI interviewer used in 10,000+ interviews, built a custom video player for recorded interviews, and cut load times from about 20s to under 2s.",
  "about.personal":
    "I'm a software developer, which means I type things into a computer until it stops being red. By day I build AI hiring software, by night I build side projects nobody asked for. Family: yes, I still can't fix your printer. Friends: yes, I'm still 'five minutes away'.",
  "about.stalker":
    "Hi, I'm Vandit, a software engineer and part-time professional solver of problems I created myself. I like fast interfaces, real-time voice and video, and side projects that are almost finished. You're here anyway, so poke around the projects and skills. Curious about something? Send a message. I don't bite. My code might.",
  "resume.url": "",
  "social.github": "https://github.com/111vandit111",
  "social.linkedin": "https://linkedin.com/in/vandit-kala-8293b4200",
  "social.instagram": "",
  "social.whatsapp": "",
  "section.empty.recruiter": "Nothing here yet. Check back soon.",
  "section.empty.personal": "Nothing here yet. I'm as surprised as you are.",
  "section.empty.stalker": "Nothing here. The hamsters running this site are on a break.",
  "section.errorTitle.recruiter": "We could not load this content",
  "section.errorTitle.personal": "Oops. I broke something.",
  "section.errorTitle.stalker": "Well, this is awkward",
  "section.errorBody.recruiter": "Please refresh the page in a moment.",
  "section.errorBody.personal": "It's not you, it's me. Refresh and we'll both pretend this never happened.",
  "section.errorBody.stalker": "The server tripped over a cable. Refresh and act natural.",
  "contact.heading": "Let's build something together",
  ...contactTextEntries(),
};
