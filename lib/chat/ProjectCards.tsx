import Link from "next/link";
import React from "react";
import type { ProfileType } from "../server/limits";
import CardImage from "../CardImage";
import { CHAT_BLOCK_LIMITS, type ChatProjectCard } from "../chatReply";
import { ALLOWED_IMAGE_HOSTS } from "../imageHosts";
import { safeHttpsUrl } from "../safeUrl";
import { BTN_KIND_CLASS, EXTERNAL_BTN_CLASS } from "./LinkButtons";

const MAX_TAGS = 3;
const IMAGE_SIZES = "(max-width: 768px) 90vw, 320px";

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

const Initials = ({ name }: { name: string }) => (
  <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-prime-navy text-2xl font-bold text-white">
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

interface ExternalProps {
  href: string;
  text: string;
  name: string;
}

const ExternalButton = ({ href, text, name }: ExternalProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Open ${name} ${text === "Live" ? "live site" : "GitHub repository"} (opens in new tab)`}
    className={`${EXTERNAL_BTN_CLASS} ${text === "Live" ? BTN_KIND_CLASS.live : BTN_KIND_CLASS.repo}`}
  >
    {text}
  </a>
);

interface CardProps {
  project: ChatProjectCard;
  type: ProfileType;
  onNavigate?: () => void;
}

const ProjectCard = ({ project, type, onNavigate }: CardProps) => {
  const liveUrl = safeHttpsUrl(project.liveUrl);
  const repoUrl = safeHttpsUrl(project.repoUrl);

  return (
    <article className="chat-grad-card min-w-0 max-w-full overflow-hidden rounded-2xl border border-white/10 shadow-lg">
      <div className="relative h-32 w-full bg-prime-navy">
        <CardImage src={renderableImage(project.image)} alt={`${project.name} preview`} sizes={IMAGE_SIZES} fallback={<Initials name={project.name} />} />
      </div>
      <div className="min-w-0 space-y-2 p-3">
        <h3 className="break-words text-base font-bold text-white">{project.name}</h3>
        <p className="line-clamp-2 break-words text-sm text-white/80">{project.summary}</p>
        {project.tags.length > 0 && (
          <ul aria-label="Tags" className="flex flex-wrap gap-1">
            {project.tags.slice(0, MAX_TAGS).map((tag) => (
              <li key={tag} className="max-w-full break-words rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">
                {tag}
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href={`/${type}/projects/${project.id}`}
            onClick={onNavigate}
            aria-label={`View ${project.name} details`}
            className={`${EXTERNAL_BTN_CLASS} chat-btn-contact`}
          >
            View
          </Link>
          {liveUrl && <ExternalButton href={liveUrl} text="Live" name={project.name} />}
          {repoUrl && <ExternalButton href={repoUrl} text="GitHub" name={project.name} />}
        </div>
      </div>
    </article>
  );
};

interface ProjectCardsProps {
  projects: ChatProjectCard[];
  type: ProfileType;
  onNavigate?: () => void;
}

const ProjectCards = ({ projects, type, onNavigate }: ProjectCardsProps) => (
  <section aria-label="Projects" className="min-w-0 max-w-full">
    <ul className="flex min-w-0 flex-col gap-3">
      {projects.slice(0, CHAT_BLOCK_LIMITS.projects).map((project) => (
        <li key={project.id} className="min-w-0">
          <ProjectCard project={project} type={type} onNavigate={onNavigate} />
        </li>
      ))}
    </ul>
  </section>
);

export default ProjectCards;
