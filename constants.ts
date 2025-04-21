import { profileCardsProps } from "./lib/profileCards";
import { SkillCardProps } from "./lib/SkillCard";

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

export const SKILLS : SkillCardProps[] = [
  {
    name: "HTML",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, laboriosam.",
    speciality: 90,
    image: "/vanditkalahero.png",
    path: "/html",
  },
  {
    name: "CSS",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, laboriosam.",
    speciality: 90,
    image: "/vanditkalahero.png",
    path: "/css",
  },
  {
    name: "Javascript",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, laboriosam.",
    speciality: 90,
    image: "/vanditkalahero.png",
    path: "/javascript",
  },
  {
    name: "Typescript",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, laboriosam.",
    speciality: 90,
    image: "/vanditkalahero.png",
    path: "/typescript",
  },
  {
    name: "React.js",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, laboriosam.",
    speciality: 90,
    image: "/vanditkalahero.png",
    path: "/reactjs",
  },
  {
    name: "Next.js",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, laboriosam.",
    speciality: 90,
    image: "/vanditkalahero.png",
    path: "/nextjs",
  },
  {
    name: "Node.js",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, laboriosam.",
    speciality: 90,
    image: "/vanditkalahero.png",
    path: "/nodejs",
  },
  {
    name: "MongoDB",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, laboriosam.",
    speciality: 90,
    image: "/vanditkalahero.png",
    path: "/mongodb",
  },
  {
    name: "TailwindCSS",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, laboriosam.",  
    speciality: 90,
    image: "/vanditkalahero.png",
    path: "/tailwindcss",
  }
]