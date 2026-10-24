"use client";

import Image from 'next/image';
import React from 'react'
import Tooltip from '../tooltip';
import HeroBackdrop from '../HeroBackdrop';
import HeroPortrait from './HeroPortrait';
import type { ProfileType } from '../server/limits';
import { DocumentIcon, MailIcon, VerifiedIcon } from '../DetailsHeroSection/DetailsIcons';

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroProps {
  profile: ProfileType;
  name: string;
  headline: string;
  tagline: string;
  about: string;
  availability?: string;
  stats?: HeroStat[];
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  ctaLabel?: string;
}

const DEFAULT_CTA_LABEL = "Contact me";
const AVAILABILITY_BADGE_LABEL = "Open to work";
const ICON_LINK_CLASS = "group/button flex items-center justify-center min-h-11 min-w-11 rounded-lg bg-white/5 backdrop-blur-lg p-3 hover:bg-white focus-visible:ring-2 focus-visible:ring-prime outline-none";
const EXTERNAL_LINK_PROPS = { target: "_blank", rel: "noopener noreferrer" } as const;

const SocialLinks = ({ githubUrl, linkedinUrl }: Pick<HeroProps, "githubUrl" | "linkedinUrl">) => (
  <>
    {githubUrl && (
      <Tooltip text="Leave a Star on Github" className="h-full">
        <a href={githubUrl} aria-label="Github profile" className={ICON_LINK_CLASS} {...EXTERNAL_LINK_PROPS}>
          <Image src="/github.svg" alt="" width={30} height={30} className="group-hover/button:invert sm:w-4.5 sm:h-4.5" />
        </a>
      </Tooltip>
    )}
    {linkedinUrl && (
      <Tooltip text="Follow me on Linkedin" className="h-full">
        <a href={linkedinUrl} aria-label="Linkedin profile" className={ICON_LINK_CLASS} {...EXTERNAL_LINK_PROPS}>
          <Image src="/linkedin.svg" alt="" width={30} height={30} className="group-hover/button:invert sm:w-4.5 sm:h-4.5" />
        </a>
      </Tooltip>
    )}
  </>
);

const ResumeLink = ({ resumeUrl }: { resumeUrl?: string }) =>
  resumeUrl ? (
    <a
      href={resumeUrl}
      className="inline-flex items-center min-h-11 rounded-lg bg-white/5 backdrop-blur-lg px-5 py-3 text-lg font-semibold hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-prime outline-none sm:px-3 sm:text-base"
      {...EXTERNAL_LINK_PROPS}
    >
      Download Resume
    </a>
  ) : null;

const BILLBOARD_BUTTON_CLASS = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-prime outline-none";

const BillboardLinks = ({ resumeUrl, githubUrl, linkedinUrl }: Pick<HeroProps, "resumeUrl" | "githubUrl" | "linkedinUrl">) => (
  <>
    {resumeUrl && (
      <a href={resumeUrl} className={BILLBOARD_BUTTON_CLASS} {...EXTERNAL_LINK_PROPS}>
        <DocumentIcon className="h-5 w-5" />
        Download Resume
      </a>
    )}
    {githubUrl && (
      <a href={githubUrl} className={BILLBOARD_BUTTON_CLASS} {...EXTERNAL_LINK_PROPS}>
        <Image src="/github.svg" alt="" width={20} height={20} />
        GitHub
      </a>
    )}
    {linkedinUrl && (
      <a href={linkedinUrl} className={BILLBOARD_BUTTON_CLASS} {...EXTERNAL_LINK_PROPS}>
        <Image src="/linkedin.svg" alt="" width={20} height={20} />
        LinkedIn
      </a>
    )}
  </>
);

const StatChips = ({ stats }: { stats: HeroStat[] }) => (
  <ul className="mt-8 flex flex-wrap gap-2" aria-label="Highlights">
    {stats.map((stat) => (
      <li key={stat.label} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/70 ring-1 ring-white/10 break-words">
        <span className="font-bold text-white">{stat.value}</span> {stat.label}
      </li>
    ))}
  </ul>
);

const RecruiterHero = (props: HeroProps) => {
  const { name, headline, about, availability, stats = [], resumeUrl, githubUrl, linkedinUrl, ctaLabel = DEFAULT_CTA_LABEL } = props;
  return (
    <div className="relative flex min-h-[88vh] items-end overflow-hidden bg-prime-navy md:min-h-[78vh] sm:min-h-0 sm:flex-col sm:items-stretch sm:justify-end">
      <HeroBackdrop variant="recruiter" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[1] h-1/2 bg-gradient-to-t from-prime-navy via-prime-navy/60 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-prime-navy/80 to-transparent" />
      <HeroPortrait variant="recruiter" />
      <div className="rise-in relative z-10 w-full pb-14 pl-[6%] pr-[44%] pt-36 sm:px-5 sm:pb-10 sm:pt-6">
        {availability && (
          <p className="inline-flex items-center gap-2 text-base font-bold text-white">
            <VerifiedIcon className="h-6 w-6 shrink-0 text-prime" />
            {AVAILABILITY_BADGE_LABEL}
          </p>
        )}
        <h1 className="mt-3 break-words text-7xl font-extrabold leading-[1.02] tracking-tight md:text-6xl sm:text-5xl xs:text-4xl">{name}</h1>
        <p className="mt-4 max-w-[720px] break-words text-2xl font-semibold text-white sm:text-xl">{headline}</p>
        {availability && <p className="mt-3 max-w-[640px] break-words text-base text-white/60">{availability}</p>}
        {about && <p className="mt-3 max-w-[640px] break-words text-base text-white/70">{about}</p>}
        <div className="rise-in-delay mt-8 flex flex-wrap items-center gap-3 sm:flex-col sm:items-stretch">
          <a
            href="#contact"
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-white px-8 py-3 text-xl font-bold text-black transition hover:scale-[1.03] hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-prime outline-none"
          >
            <MailIcon className="h-6 w-6" />
            {ctaLabel}
          </a>
          <div className="flex flex-wrap gap-3">
            <BillboardLinks resumeUrl={resumeUrl} githubUrl={githubUrl} linkedinUrl={linkedinUrl} />
          </div>
        </div>
        {stats.length > 0 && <StatChips stats={stats} />}
      </div>
    </div>
  );
};

const PlayfulHero = (props: HeroProps) => {
  const { name, tagline, about, resumeUrl, githubUrl, linkedinUrl } = props;

  return (
    <div className='relative overflow-hidden md:min-h-[520px] sm:min-h-0'>
      <HeroBackdrop variant="playful" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[1] h-1/3 bg-gradient-to-t from-secondary-900 to-transparent" />
      <HeroPortrait variant="playful" />
      <div className="relative p-10 pt-28 z-10 sm:p-5 sm:pt-6">
        <div className="flex min-h-[25vw] items-end pr-[40%] md:min-h-[32.5vw] sm:min-h-0 sm:pr-0">
          <div className="flex w-full min-w-0 max-w-[900px] flex-col justify-end">
            <Image
              src="/vanditkalaText.png"
              alt="logo"
              width={100}
              height={100}
              className="rounded-full invert-100 xs:w-[96px] xs:h-[30px] xs:object-cover"
            />
            <h1 className="text-7xl sm:text-5xl xs:text-3xl py-4 font-bold break-words">{name}</h1>
            <p className="font-bold sm:text-xs text-alert-success break-words">{tagline}</p>
            {about && (
              <div className="max-w-[600px] font-semibold mt-2 break-words">
                {about}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <ResumeLink resumeUrl={resumeUrl} />
          <SocialLinks githubUrl={githubUrl} linkedinUrl={linkedinUrl} />
        </div>
      </div>
    </div>
  );
};

const Herosection = (props: HeroProps) =>
  props.profile === "recruiter" ? <RecruiterHero {...props} /> : <PlayfulHero {...props} />;

export default Herosection
