import type { profileCardsProps } from "./lib/profileCards";
import type { ProfileType, Resource } from "./lib/server/limits";

export const TYPES_OF_PROFILES = {
  RECRUITER: "recruiter",
  FRIENDS_AND_FAMILY: "personal",
  RANDOM: "stalker",
  EXTREAMLY_PERSONAL: "ritu",
} 

export const profilesCards : profileCardsProps[] = [
  {
    gif: "https://media1.tenor.com/m/yJ1DUZjcVWQAAAAC/smiling-squid-game-season-2.gif",
    image: "/recrt.png",
    name: "Recruiter",
    tooltip: "Wan't to hire me ,i see come take a look.",
    redirectionKey: TYPES_OF_PROFILES.RECRUITER
  },
  {
    image: "/fandf.png",
    gif:"https://media1.tenor.com/m/vv_JkrtXvfMAAAAC/very-well-soldier-boy.gif",
    name: "Family and Friends",
    tooltip: "You're friend i get it but if family why are you here?",
    redirectionKey: TYPES_OF_PROFILES.FRIENDS_AND_FAMILY
  },
  {
    image: "/random.png",
    gif:"https://media1.tenor.com/m/TvavbyWOz80AAAAC/joe-goldberg.gif",
    name: "Random",
    tooltip: "Hey Stalker what are you looking for?",
    redirectionKey: TYPES_OF_PROFILES.RANDOM
  }
];

export const PROFILE_IMAGES = {
  [TYPES_OF_PROFILES.RECRUITER]: { image : "/recrt.png", heading : "Recruiter" },
  [TYPES_OF_PROFILES.FRIENDS_AND_FAMILY]: {image : "/fandf.png" , heading : "Family and Friends"},
  [TYPES_OF_PROFILES.RANDOM]: {image :"/random.png", heading : "Stalker"}
}

export const NAV_MENU_BY_PROFILE = {
  [TYPES_OF_PROFILES.RECRUITER]: [{
    heading: "About me",
    section : "#about"
  },{
    heading: "Saved Projects",
    section : "#saved"
  },{
    heading : "Skills",
    section : "#skills"
  },{
    heading : "Experience",
    section : "#experience"
  },
  {
    heading: "Projects",
    section : "#projects"
  },
  {
    heading : "Education",
    section : "#education"
  },
  {
    heading : "Contact",
    section : "#contact"
  }],
  [TYPES_OF_PROFILES.FRIENDS_AND_FAMILY]: [
    {
      heading: "About me",
      section : "#about"
    },
    {
      heading : "Skills",
      section : "#skills"
    },
    {
      heading : "Experience",
      section : "#experience"
    },
    {
      heading: "Projects",
      section : "#projects"
    },
    {
      heading : "Contact",
      section : "#contact"
    }
  ],
  [TYPES_OF_PROFILES.RANDOM]: [
    {
      heading: "About me",
      section : "#about"
    },
    {
      heading : "Skills",
      section : "#skills"
    },{
      heading : "Experience",
      section : "#experience"
    },{
      heading: "Projects",
      section : "#projects"
    },
    {
      heading : "Contact",
      section : "#contact"
    }
  ],
  [TYPES_OF_PROFILES.EXTREAMLY_PERSONAL]: [
    {
      heading: "About us",
      section : "#about"
    },
    {
      heading: "Our Time together",
      section : "#timeline"
    }
  ],
}

export const isProfileType = (value: string): value is ProfileType =>
  Object.keys(PROFILE_IMAGES).includes(value);

export type SectionKey = Resource | "saved";

export const SECTION_TITLES_BY_PROFILE: Record<ProfileType, Partial<Record<SectionKey, string>>> = {
  recruiter: {
    projects: "Featured Projects",
    skills: "Skills & Expertise",
    experience: "Professional Experience",
    education: "Education",
    saved: "Shortlisted Projects",
  },
  personal: {
    projects: "Things I built instead of sleeping",
    skills: "Stuff I can do (allegedly)",
    experience: "Places that pay me",
    education: "Where I learned to Google",
    saved: "Your favourites (my greatest hits)",
  },
  stalker: {
    projects: "Stuff I made, since you're looking",
    skills: "Things I'm okay at, please clap",
    experience: "Where I've worked (the boring bit)",
    education: "Where I learned to Google",
    saved: "Your bookmarks, you absolute detective",
  },
};

export const CONTACT_TONE: Record<ProfileType, { heading: string }> = {
  recruiter: { heading: "Let's talk about your team" },
  personal: { heading: "Friends and family: WhatsApp me" },
  stalker: { heading: "Slide into my inbox (politely)" },
};
