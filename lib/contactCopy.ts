import type { ProfileType } from "./server/limits";

// Contact section copy. Each field maps to the text key `contact.<field>.<profile>`; the admin can
// also set a generic `contact.<field>` that every profile without its own key falls back to.
export const CONTACT_COPY_FIELDS = [
  "heading",
  "subtext",
  "cta",
  "sending",
  "success",
  "error",
  "ratelimit",
  "socials",
  "placeholder.name",
  "placeholder.email",
  "placeholder.subject",
  "placeholder.message",
] as const;

export type ContactCopyField = (typeof CONTACT_COPY_FIELDS)[number];
export type ContactCopy = Record<ContactCopyField, string>;

export const contactKey = (field: ContactCopyField, profile?: ProfileType): string =>
  profile ? `contact.${field}.${profile}` : `contact.${field}`;

const RECRUITER_COPY: ContactCopy = {
  heading: "Let's build something together",
  subtext: "Hiring for a software engineering role? Tell me about the team and the problem, and I will get back to you.",
  cta: "Send message",
  sending: "Sending...",
  success: "Message sent. Thank you, I will get back to you soon.",
  error: "Something went wrong. Please try again.",
  ratelimit: "Too many messages sent. Please try again later.",
  socials: "Socials",
  "placeholder.name": "Your name",
  "placeholder.email": "Your email",
  "placeholder.subject": "Subject",
  "placeholder.message": "Your message",
};

const PERSONAL_COPY: ContactCopy = {
  heading: "Friends and family: WhatsApp me",
  subtext: "If you're a friend or family, WhatsApp me. This place is not for you.",
  cta: "Send it anyway",
  sending: "Sending... the pigeon is stretching",
  success: "Sent! The pigeon has left the building. I'll reply once I'm done debugging my life.",
  error: "The pigeon crashed into a window. Try again, or just WhatsApp me like a normal person.",
  ratelimit: "Easy there, my inbox is not a group chat. Try again later.",
  socials: "Stalk me elsewhere",
  "placeholder.name": "Your name (or the nickname I use for you)",
  "placeholder.email": "Email (the one you actually check)",
  "placeholder.subject": "What's this about? (be dramatic)",
  "placeholder.message": "Say something nice. Or roast me, I'm used to it.",
};

const STALKER_COPY: ContactCopy = {
  heading: "Slide into my inbox (politely)",
  subtext: "You scrolled all the way down, so we're basically friends now. Say hi. I'm friendlier than my commit messages.",
  cta: "Say hi, stranger",
  sending: "Sending... pretending to look busy",
  success: "Got it! I'll reply once I stop staring at a bug that is definitely not my fault.",
  error: "Something broke. It's me, not you. (It's probably me.) Try again.",
  ratelimit: "Whoa, that's a lot of hellos. Take a breath and try again later.",
  socials: "More places to find me",
  "placeholder.name": "Your name (or alias, no judgement)",
  "placeholder.email": "Email, so I can reply",
  "placeholder.subject": "Subject (make it intriguing)",
  "placeholder.message": "Tell me what you were really looking for",
};

export const CONTACT_COPY_BY_PROFILE: Record<ProfileType, ContactCopy> = {
  recruiter: RECRUITER_COPY,
  personal: PERSONAL_COPY,
  stalker: STALKER_COPY,
};

export function contactTextEntries(): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const [profile, copy] of Object.entries(CONTACT_COPY_BY_PROFILE) as [ProfileType, ContactCopy][]) {
    for (const field of CONTACT_COPY_FIELDS) entries[contactKey(field, profile)] = copy[field];
  }
  return entries;
}

// Picks `contact.<field>.<profile>`, then the generic `contact.<field>`, then the professional default.
export function resolveContactCopy(
  texts: Record<string, string>,
  profile: ProfileType,
  fallbacks: Partial<ContactCopy> = {}
): ContactCopy {
  const copy = { ...RECRUITER_COPY, ...fallbacks };
  for (const field of CONTACT_COPY_FIELDS) {
    copy[field] = texts[contactKey(field, profile)]?.trim() || texts[contactKey(field)]?.trim() || copy[field];
  }
  return copy;
}
