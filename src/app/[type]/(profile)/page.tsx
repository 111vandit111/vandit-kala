import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Carosel from "../../../../lib/Carosel";
import Herosection, { type HeroStat } from "../../../../lib/HeroSection/Herosection";
import SavedProjectsAndSkills from "../../../../lib/SavedProjectsAndSkills";
import ContactMe from "../../../../lib/contactMe";
import ExperienceTimeline, { type ExperienceTimelineItem } from "../../../../lib/ExperienceTimeline";
import { SkillSummaryCard } from "../../../../lib/SkillCard";
import { safeHttpUrl } from "../../../../lib/safeUrl";
import { CONTACT_TONE, NAV_MENU_BY_PROFILE, SECTION_TITLES_BY_PROFILE, isProfileType } from "../../../../constants";
import { getTextMap, listPublic } from "../../../../lib/server/contentService";
import { getCards, toCard, type CardProps } from "../../../../lib/server/cardMapper";
import type { ProfileType } from "../../../../lib/server/limits";

export const dynamic = "force-dynamic";

const DEFAULT_EMPTY_TEXT = "Nothing here yet. Check back soon.";
const DEFAULT_ERROR_TITLE = "We could not load this content";
const DEFAULT_ERROR_BODY = "Please refresh the page in a moment.";
const DEFAULT_NAME = "Vandit Kala";
const MAX_HERO_STATS = 4;
const RECRUITER_SKILL_PREVIEW_COUNT = 12;
const STAT_SEPARATOR = "|";
const RECRUITER_RAIL_INSET = "px-[calc(6%-1.5rem)] sm:px-0";

interface ProfileContent {
  emptyText: string;
  texts: Record<string, string>;
  skills: CardProps[];
  projects: CardProps[];
  experienceCards: CardProps[];
  timeline: ExperienceTimelineItem[];
  education: CardProps[];
}

function textList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parseStats(raw: string | undefined): HeroStat[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => line.split(STAT_SEPARATOR))
    .filter(([value, label]) => value?.trim() && label?.trim())
    .slice(0, MAX_HERO_STATS)
    .map(([value, label]) => ({ value: value.trim(), label: label.trim() }));
}

async function loadProjectCards(): Promise<CardProps[]> {
  const docs = await listPublic("projects");
  const featured = docs.filter((doc) => doc.isFeatured === true);
  const others = docs.filter((doc) => doc.isFeatured !== true);
  return [...featured, ...others].map((doc) => toCard("projects", doc));
}

async function loadExperience(): Promise<Pick<ProfileContent, "experienceCards" | "timeline">> {
  const docs = await listPublic("experience");
  return {
    experienceCards: docs.map((doc) => toCard("experience", doc)),
    timeline: docs.map((doc) => ({
      company: text(doc.company),
      role: text(doc.role),
      period: text(doc.period),
      summary: text(doc.summary),
      bullets: textList(doc.bullets),
      tags: textList(doc.tags),
      path: `/experience/${text(doc.slug)}`,
      image: text(doc.image),
    })),
  };
}

async function loadContent(): Promise<Omit<ProfileContent, "emptyText"> | null> {
  try {
    const [texts, skills, projects, experience, education] = await Promise.all([
      getTextMap(),
      getCards("skills"),
      loadProjectCards(),
      loadExperience(),
      getCards("education"),
    ]);
    return { texts, skills, projects, education, ...experience };
  } catch (error) {
    console.error("Profile page content failed to load:", error instanceof Error ? error.message : error);
    return null;
  }
}

const Section = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-24">
    {children}
  </section>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-4 text-2xl font-bold text-white sm:text-xl">{children}</h2>
);

const EmptyState = ({ title, message }: { title: string; message: string }) => (
  <div className="px-6 py-8 sm:px-5">
    <SectionHeading>{title}</SectionHeading>
    <p className="rounded-xl bg-white/5 p-6 text-center text-secondary-400">{message}</p>
  </div>
);

const ErrorState = ({ title, body }: { title: string; body: string }) => (
  <div role="alert" className="mx-6 my-10 rounded-xl bg-white/5 p-8 text-center sm:mx-5">
    <p className="text-xl font-bold">{title}</p>
    <p className="mt-2 text-secondary-400">{body}</p>
  </div>
);

const CardSection = ({
  id, title, cards, listof, carouselId, emptyText,
}: {
  id: string; title: string; cards: CardProps[]; listof: "projects" | "skills" | "experience" | "education"; carouselId: number; emptyText: string;
}) => (
  <Section id={id}>
    {cards.length === 0 ? (
      <EmptyState title={title} message={emptyText} />
    ) : (
      <Carosel carouselData={cards} id={carouselId} name={title} listof={listof} />
    )}
  </Section>
);

const RecruiterSkills = ({ skills, title, type, emptyText }: { skills: CardProps[]; title: string; type: ProfileType; emptyText: string }) => (
  <Section id="skills">
    {skills.length === 0 ? (
      <EmptyState title={title} message={emptyText} />
    ) : (
      <div className="px-6 py-8 sm:px-5">
        <SectionHeading>{title}</SectionHeading>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
          {skills.slice(0, RECRUITER_SKILL_PREVIEW_COUNT).map((skill) => (
            <SkillSummaryCard key={skill.path} {...skill} />
          ))}
        </div>
        {skills.length > RECRUITER_SKILL_PREVIEW_COUNT && (
          <Link
            href={`/${type}/list/skills`}
            className="mt-6 inline-flex min-h-11 items-center font-semibold text-prime hover:underline focus-visible:ring-2 focus-visible:ring-prime outline-none rounded"
          >
            View all {skills.length} skills
          </Link>
        )}
      </div>
    )}
  </Section>
);

const TimelineSection = ({ items, title, type, emptyText }: { items: ExperienceTimelineItem[]; title: string; type: ProfileType; emptyText: string }) => (
  <Section id="experience">
    {items.length === 0 ? (
      <EmptyState title={title} message={emptyText} />
    ) : (
      <div className="px-6 py-8 sm:px-5">
        <SectionHeading>{title}</SectionHeading>
        <ExperienceTimeline items={items} type={type} />
      </div>
    )}
  </Section>
);

const RecruiterSections = ({ content, type, show }: { content: ProfileContent; type: ProfileType; show: (anchor: string) => boolean }) => {
  const titles = SECTION_TITLES_BY_PROFILE[type];
  return (
    <div className={RECRUITER_RAIL_INSET}>
      {show("projects") && (
        <CardSection emptyText={content.emptyText} id="projects" title={titles.projects ?? "Projects"} cards={content.projects} listof="projects" carouselId={4} />
      )}
      {show("skills") && <RecruiterSkills emptyText={content.emptyText} skills={content.skills} title={titles.skills ?? "Skills"} type={type} />}
      {show("experience") && <TimelineSection emptyText={content.emptyText} items={content.timeline} title={titles.experience ?? "Experience"} type={type} />}
      {show("education") && (
        <CardSection emptyText={content.emptyText} id="education" title={titles.education ?? "Education"} cards={content.education} listof="education" carouselId={2} />
      )}
    </div>
  );
};

const PlayfulSections = ({ content, type, show }: { content: ProfileContent; type: ProfileType; show: (anchor: string) => boolean }) => {
  const titles = SECTION_TITLES_BY_PROFILE[type];
  return (
    <>
      {show("skills") && (
        <CardSection emptyText={content.emptyText} id="skills" title={titles.skills ?? "Skills"} cards={content.skills} listof="skills" carouselId={3} />
      )}
      {show("experience") && (
        <CardSection emptyText={content.emptyText} id="experience" title={titles.experience ?? "Experience"} cards={content.experienceCards} listof="experience" carouselId={2} />
      )}
      {show("projects") && (
        <CardSection emptyText={content.emptyText} id="projects" title={titles.projects ?? "Projects"} cards={content.projects} listof="projects" carouselId={1} />
      )}
      {show("education") && (
        <CardSection emptyText={content.emptyText} id="education" title={titles.education ?? "Education"} cards={content.education} listof="education" carouselId={5} />
      )}
    </>
  );
};

const AppPage = async ({ params }: { params: Promise<{ type: string }> }) => {
  const { type } = await params;
  if (!isProfileType(type)) notFound();

  const loaded = await loadContent();
  const texts = loaded?.texts ?? {};
  const content = loaded && { ...loaded, emptyText: texts[`section.empty.${type}`] || DEFAULT_EMPTY_TEXT };
  const anchors = new Set(NAV_MENU_BY_PROFILE[type].map((item) => item.section.slice(1)));
  const show = (anchor: string) => anchors.has(anchor);
  const isRecruiter = type === "recruiter";
  const tagline = texts[`hero.tagline.${type}`] ?? "";

  return (
    <div className={isRecruiter ? "bg-prime-navy" : undefined}>
      <Section id="about">
        <Herosection
          profile={type}
          name={texts["hero.name"] || DEFAULT_NAME}
          headline={isRecruiter ? texts["hero.headline"] || tagline : tagline}
          tagline={tagline}
          about={texts[`about.${type}`] ?? ""}
          availability={texts["hero.availability"]}
          stats={parseStats(texts["hero.stats"])}
          resumeUrl={safeHttpUrl(texts["resume.url"])}
          githubUrl={safeHttpUrl(texts["social.github"])}
          linkedinUrl={safeHttpUrl(texts["social.linkedin"])}
          ctaLabel={texts[`cta.contact.${type}`] || texts["cta.contact"] || undefined}
        />
      </Section>

      {content === null ? (
        <ErrorState title={texts[`section.errorTitle.${type}`] || DEFAULT_ERROR_TITLE} body={texts[`section.errorBody.${type}`] || DEFAULT_ERROR_BODY} />
      ) : (
        <>
          {show("saved") && (
            <Section id="saved">
              <div className={isRecruiter ? RECRUITER_RAIL_INSET : undefined}>
                <SavedProjectsAndSkills />
              </div>
            </Section>
          )}
          {isRecruiter ? (
            <RecruiterSections content={content} type={type} show={show} />
          ) : (
            <PlayfulSections content={content} type={type} show={show} />
          )}
        </>
      )}

      <ContactMe heading={texts["contact.heading"] || CONTACT_TONE[type].heading} tone={type} />
    </div>
  );
};

export default AppPage;
