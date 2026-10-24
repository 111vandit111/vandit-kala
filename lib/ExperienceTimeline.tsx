import Link from "next/link";
import React from "react";
import CardImage from "./CardImage";
import { getInitials } from "./imageUtils";

export interface ExperienceTimelineItem {
  company: string;
  role: string;
  period: string;
  summary: string;
  bullets: string[];
  tags: string[];
  path: string;
  image: string;
}

const MAX_BULLETS = 3;

const ExperienceTimeline = ({ items, type }: { items: ExperienceTimelineItem[]; type: string }) => {
  return (
    <ol className="relative ml-3 border-l border-prime/40 sm:ml-2">
      {items.map((item) => (
        <li key={item.path} className="relative mb-10 pl-8 last:mb-0 sm:pl-6">
          <span
            aria-hidden="true"
            className="absolute -left-[7px] top-2 h-3.5 w-3.5 rounded-full bg-prime ring-4 ring-prime-navy"
          />
          <div className="rounded-xl bg-prime-navyLight p-6 ring-1 ring-white/10 sm:p-4">
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-28 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 sm:w-24">
                <CardImage
                  src={item.image}
                  alt={item.company}
                  sizes="112px"
                  logoClassName="p-2"
                  fallback={
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-prime-navyLight via-prime-navy to-primary text-xl font-bold text-prime"
                    >
                      {getInitials(item.company)}
                    </span>
                  }
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-prime">{item.period}</p>
                <h3 className="mt-1 text-2xl font-bold text-white break-words">{item.role}</h3>
                <p className="text-lg font-semibold text-white/80 break-words">{item.company}</p>
              </div>
            </div>
            <p className="mt-3 text-white/80 break-words">{item.summary}</p>
            {item.bullets.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-white/90">
                {item.bullets.slice(0, MAX_BULLETS).map((bullet) => (
                  <li key={bullet} className="break-words">{bullet}</li>
                ))}
              </ul>
            )}
            {item.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
                {item.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-prime/15 px-3 py-1 text-xs font-semibold text-prime">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={`/${type}${item.path}`}
              className="mt-4 inline-flex min-h-11 items-center font-semibold text-prime hover:underline focus-visible:ring-2 focus-visible:ring-prime outline-none rounded"
            >
              Read the full story
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ExperienceTimeline;
