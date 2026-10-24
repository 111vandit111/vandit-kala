import Link from "next/link";
import React from "react";
import type { ProfileType } from "../server/limits";
import CardImage from "../CardImage";
import { CHAT_BLOCK_LIMITS, type ChatSkillCard } from "../chatReply";
import { ALLOWED_IMAGE_HOSTS } from "../imageHosts";
import { formatSkillMeta } from "../skillMeta";

const CARD_CLASS =
  "chat-grad-card flex min-h-11 min-w-0 max-w-full items-center gap-3 rounded-xl border border-white/10 p-2 transition hover:brightness-125 focus-visible:ring-2 focus-visible:ring-prime outline-none motion-reduce:transition-none";

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

const Initials = ({ name }: { name: string }) => (
  <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-prime-navy text-sm font-bold text-white">
    {initialsOf(name) || "?"}
  </div>
);

/** next/image throws for https hosts outside next.config images, so those use the Initials tile. */
const renderableImage = (src: string): string => {
  if (!src.startsWith("https://")) return src;
  try {
    return ALLOWED_IMAGE_HOSTS.includes(new URL(src).hostname) ? src : "";
  } catch {
    return "";
  }
};

interface CardProps {
  skill: ChatSkillCard;
  type: ProfileType;
  onNavigate?: () => void;
}

const SkillCard = ({ skill, type, onNavigate }: CardProps) => {
  const meta = [skill.category, formatSkillMeta({ years: skill.years })].filter(Boolean).join(" · ");
  return (
    <Link href={`/${type}/skills/${skill.id}`} onClick={onNavigate} className={CARD_CLASS}>
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-prime-navy">
        <CardImage src={renderableImage(skill.image)} alt={`${skill.name} logo`} sizes="40px" logoClassName="p-1.5" fallback={<Initials name={skill.name} />} />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="break-words text-sm font-semibold text-white">{skill.name}</p>
        {meta && <p className="break-words text-xs text-white/70">{meta}</p>}
        {skill.level > 0 && (
          <div role="img" aria-label={`Level ${skill.level} of 100`} className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-prime to-primary-500" style={{ width: `${skill.level}%` }} />
          </div>
        )}
      </div>
    </Link>
  );
};

const List = ({ skills, type, onNavigate }: SkillCardsProps) => (
  <ul className="grid min-w-0 grid-cols-2 gap-2 xs:grid-cols-1">
    {skills.map((skill) => (
      <li key={skill.id} className="min-w-0">
        <SkillCard skill={skill} type={type} onNavigate={onNavigate} />
      </li>
    ))}
  </ul>
);

interface SkillCardsProps {
  skills: ChatSkillCard[];
  type: ProfileType;
  onNavigate?: () => void;
}

const SkillCards = ({ skills, type, onNavigate }: SkillCardsProps) => {
  const shown = skills.slice(0, CHAT_BLOCK_LIMITS.skills);
  const groups = new Map<string, ChatSkillCard[]>();
  shown.forEach((skill) => groups.set(skill.category, [...(groups.get(skill.category) ?? []), skill]));
  const grouped = groups.size > 1;

  return (
    <section aria-label="Skills" className="min-w-0 max-w-full">
      {grouped ? (
        <div className="space-y-3">
          {Array.from(groups, ([category, list]) => (
            <div key={category || "other"} className="min-w-0 space-y-2">
              <h3 className="break-words text-xs font-semibold uppercase tracking-wide text-white/70">{category || "Other"}</h3>
              <List skills={list} type={type} onNavigate={onNavigate} />
            </div>
          ))}
        </div>
      ) : (
        <List skills={shown} type={type} onNavigate={onNavigate} />
      )}
    </section>
  );
};

export default SkillCards;
