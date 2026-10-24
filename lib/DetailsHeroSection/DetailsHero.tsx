"use client";

import Link from "next/link";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import HeroBackdrop from "../HeroBackdrop";
import type { SkillCardProps } from "../SkillCard";
import CardImage from "../CardImage";
import { isLogoImage } from "../imageUtils";
import DetailsActions from "./DetailsActions";
import { BackIcon, MailIcon, PlayIcon, VerifiedIcon } from "./DetailsIcons";

export interface DetailsSection {
  heading: string;
  body?: string;
  items?: string[];
}

export interface DetailsHeroProps {
  kicker: string;
  title: string;
  meta?: string[];
  availabilityLabel: string;
  description: string;
  descriptors?: string[];
  badges?: string[];
  bullets?: string[];
  sections?: DetailsSection[];
  liveUrl?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  resumeUrl?: string;
  saveCard?: SkillCardProps;
  image?: string;
}

const FOCUS_CLASS = "focus-visible:ring-2 focus-visible:ring-prime outline-none";
const PRIMARY_BUTTON_CLASS = `inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-white px-8 py-3 text-xl font-bold text-black transition hover:bg-white/85 sm:w-full ${FOCUS_CLASS}`;
const SECTION_HEADING_CLASS = "mb-3 text-2xl font-bold text-white sm:text-xl";

const SectionBlock = ({ heading, body, items }: DetailsSection) => (
  <div className="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10 sm:p-4">
    <h2 className={SECTION_HEADING_CLASS}>{heading}</h2>
    {body && <p className="whitespace-pre-line break-words text-lg leading-relaxed text-white/80">{body}</p>}
    {items && items.length > 0 && (
      <ul className="list-disc space-y-2 pl-5 text-lg leading-relaxed text-white/80">
        {items.map((item) => (
          <li key={item} className="break-words">{item}</li>
        ))}
      </ul>
    )}
  </div>
);

const HeroGradients = () => (
  <>
    <div className="absolute inset-0 bg-gradient-to-r from-prime-night via-prime-night/50 to-transparent md:via-prime-night/20" />
    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-prime-night to-transparent" />
  </>
);

// Logos are shown whole, so they only need a light fade on the text side instead of the full photo vignette.
const LogoFade = () => <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-prime-night to-transparent md:hidden" />;

const HeroArt = ({ image, title }: { image?: string; title: string }) => (
  <div className="pointer-events-none absolute right-0 top-0 h-full w-[62%] md:h-[420px] md:w-full sm:h-[340px]">
    <CardImage
      src={image}
      alt={title}
      sizes="(max-width: 1100px) 100vw, 62vw"
      logoClassName="p-[16%] md:p-[10%]"
      priority
      overlay={image && isLogoImage(image) ? <LogoFade /> : <HeroGradients />}
      fallback={null}
    />
  </div>
);

const BackButton = ({ type }: { type: string }) => {
  const router = useRouter();
  const handleBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(`/${type}`);
  };
  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className={`-ml-3 flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full hover:bg-white/10 ${FOCUS_CLASS}`}
    >
      <BackIcon className="h-7 w-7 text-white" />
    </button>
  );
};

const MetaRow = ({ meta }: { meta: string[] }) => (
  <p className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-xl font-semibold text-white/50 sm:text-lg">
    {meta.map((item, index) => (
      <span key={item} className={`break-words ${index === 0 ? "font-bold text-white" : ""}`}>{item}</span>
    ))}
  </p>
);

const DescriptorRow = ({ descriptors }: { descriptors: string[] }) => (
  <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xl font-semibold text-white/50 sm:text-lg" aria-label="Details">
    {descriptors.map((item, index) => (
      <li key={item} className="flex items-center gap-3">
        {index > 0 && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white/50" />}
        <span className="break-words">{item}</span>
      </li>
    ))}
  </ul>
);

const BadgeRow = ({ badges }: { badges: string[] }) => (
  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
    {badges.map((badge, index) => (
      <li
        key={badge}
        className={`rounded-md px-3 py-1.5 text-sm font-extrabold uppercase tracking-wide ${index === 0 ? "bg-white text-black" : "bg-white/15 text-white/90"}`}
      >
        {badge}
      </li>
    ))}
  </ul>
);

const PrimaryAction = ({ liveUrl, type }: { liveUrl?: string; type: string }) =>
  liveUrl ? (
    <a href={liveUrl} className={PRIMARY_BUTTON_CLASS} target="_blank" rel="noopener noreferrer">
      <PlayIcon className="h-6 w-6" />
      View live site
    </a>
  ) : (
    <Link href={`/${type}#contact`} className={PRIMARY_BUTTON_CLASS}>
      <MailIcon className="h-6 w-6" />
      Contact Vandit
    </Link>
  );

const DetailsHero = ({
  kicker, title, meta = [], availabilityLabel, description, descriptors = [], badges = [], bullets = [], sections = [],
  liveUrl, sourceUrl, sourceLabel, resumeUrl, saveCard, image,
}: DetailsHeroProps) => {
  const { type } = useParams<{ type: string }>();
  const allSections: DetailsSection[] = [...(bullets.length > 0 ? [{ heading: "Highlights", items: bullets }] : []), ...sections];

  return (
    <div className="overflow-hidden bg-prime-night text-white">
      <div className="relative">
      <HeroBackdrop variant="detail" />
      <HeroArt image={image} title={title} />
      <div className="relative z-10 px-[6%] pb-12 pt-24 sm:px-5 sm:pt-3">
        <BackButton type={type} />
        <div className="rise-in mt-40 max-w-[760px] md:mt-48 sm:mt-44">
          <p className="break-words text-lg font-bold text-white/60">{kicker}</p>
          <h1 className="mt-4 break-words text-6xl font-extrabold leading-[1.05] tracking-tight md:text-5xl sm:text-4xl xs:text-3xl">{title}</h1>
          {meta.length > 0 && <MetaRow meta={meta} />}
          <p className="mt-6 flex items-center gap-3 text-lg font-bold">
            <VerifiedIcon className="h-7 w-7 shrink-0 text-prime" />
            {availabilityLabel}
          </p>
          <div className="mt-4">
            <PrimaryAction liveUrl={liveUrl} type={type} />
          </div>
          <DetailsActions title={title} saveCard={saveCard} sourceUrl={sourceUrl} sourceLabel={sourceLabel} resumeUrl={resumeUrl} />
          <p className="mt-6 max-w-[720px] break-words text-2xl font-semibold leading-snug sm:text-xl">{description}</p>
          {descriptors.length > 0 && <DescriptorRow descriptors={descriptors} />}
          {badges.length > 0 && <BadgeRow badges={badges} />}
        </div>
      </div>
      </div>
      {allSections.length > 0 && (
        <div className="mx-[6%] border-t border-white/10 py-10 sm:mx-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
            {allSections.map((section) => (
              <SectionBlock key={section.heading} {...section} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsHero;
