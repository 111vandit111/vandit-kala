"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Button from "./Button";
import Tooltip from "./tooltip";
import { useParams, useRouter } from "next/navigation";
import { useSavedProjectContext } from "../hooks/useSavedProjectContext";
import CardImage from "./CardImage";
import { getInitials, isPlaceholderImage } from "./imageUtils";
import { formatSkillMeta } from "./skillMeta";

export interface SkillCardProps {
  name: string;
  description: string;
  years?: number;
  projectCount?: number;
  image: string;
  path: string;
  year?: string;
  tags?: string[];
}

const SkillCard = ({
  name,
  description,
  years,
  projectCount,
  image,
  path,
  year,
  tags,
}: SkillCardProps) => {
  const router = useRouter();
  const { type } = useParams();
  const { savedProjects, setSavedProjects } = useSavedProjectContext();

  const isSaved = savedProjects.some((project) => project.name === name);

  const [isImageBroken, setIsImageBroken] = useState(false);
  const isPlaceholder = isPlaceholderImage(image) || isImageBroken;
  const chip = tags?.[0];
  const skillMeta = formatSkillMeta({ years, projectCount });

  const handleSave = () => {
    if (!isSaved) {
      setSavedProjects([
        ...savedProjects,
        { name, description, years, projectCount, image, path, year, tags },
      ]);
    }
  };

  const handleRemove = () => {
    if (isSaved) {
      setSavedProjects(savedProjects.filter((proj) => proj.name !== name));
    }
  };

  return (
    <div className="group/cardGroup min-w-[180px] rounded-md relative z-1 bg-alert hover:z-30 focus-within:z-30">
      <div
        tabIndex={0}
        aria-label={name}
        className="relative h-60 w-[184px] overflow-hidden rounded group-hover/cardGroup:scale-120 group-focus-within/cardGroup:scale-120 sm:group-hover/cardGroup:scale-100 sm:group-focus-within/cardGroup:scale-100 transition-transform duration-300 hover:bg-alert focus-visible:ring-2 focus-visible:ring-prime outline-none"
      >
        <CardImage
          src={image}
          alt={name}
          sizes="184px"
          logoClassName="p-9 pb-24"
          onError={() => setIsImageBroken(true)}
          fallback={
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-start justify-between bg-gradient-to-br from-prime-navyLight via-prime-navy to-primary p-3 sm:pr-12"
            >
              <span className="text-5xl font-bold text-prime/80 leading-none">{getInitials(name)}</span>
              {chip && (
                <span className="max-w-[60%] break-words rounded-2xl bg-prime/20 px-2 py-0.5 text-right text-xs font-semibold leading-tight text-prime">
                  {chip}
                </span>
              )}
            </div>
          }
        />
        <Link
          href={`/${type}${path}`}
          aria-label={`View details for ${name}`}
          className="absolute inset-0 z-[1] hidden sm:block"
        />
        <button
          type="button"
          aria-label={isSaved ? `Unsave ${name}` : `Save ${name}`}
          onClick={isSaved ? handleRemove : handleSave}
          className="absolute right-1 top-1 z-[2] hidden min-h-11 min-w-11 items-center justify-center rounded-full bg-black/60 focus-visible:ring-2 focus-visible:ring-prime outline-none sm:flex"
        >
          <Image src={isSaved ? "/sub.svg" : "/add.svg"} alt="" width={22} height={22} className={isSaved ? "" : "invert"} />
        </button>
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-3 pt-10">
          <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 break-words">{name}</h3>
          {description && <p className="text-xs text-white/85 line-clamp-2 break-words">{description}</p>}
          {(year || (!isPlaceholder && chip)) && (
            <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
              {year && <span>{year}</span>}
              {!isPlaceholder && chip && <span className="break-words text-prime">{chip}</span>}
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute w-[222px] bg-black hidden p-4 rounded-b-xl pt-2 left-[-19px] top-[107%] 
                    shadow-lg transform transition-all group-hover/cardGroup:block group-focus-within/cardGroup:block animate-fade-in-card z-[1100] sm:group-hover/cardGroup:hidden sm:group-focus-within/cardGroup:hidden"
      >
        <div className="space-y-2">
          <h2 className="text-base font-bold text-white">{name}</h2>
          <Button
            variant="glassMoprhism"
            size="2xl"
            className="group/button w-full text-center"
            onClick={() => router.push(`/${type}${path}`)}
          >
            View Details
          </Button>
          <div className="flex gap-2 my-2">
            <Tooltip text={isSaved ? "Unsave Project" : "Save Project"}>
              <Button
                variant="glassMoprhism"
                size="icon"
                className="group/button p-2! sm:p-2!"
                ariaLabel={isSaved ? `Unsave ${name}` : `Save ${name}`}
                onClick={isSaved ? handleRemove : handleSave}
              >
                <Image
                  src={isSaved ? "/sub.svg" : "/add.svg"}
                  alt=""
                  width={24}
                  height={24}
                  className={isSaved ? "group-hover/button:invert" : "group-hover/button:invert-0 invert" } 
                />
              </Button>
            </Tooltip>
            <Tooltip text="Endorse on Linkedin">
              <Button
                variant="glassMoprhism"
                size="icon"
                className="group/button p-2! sm:p-2!"
              >
                <Image
                  src="/linkedin.svg"
                  alt="linkedin"
                  width={24}
                  height={24}
                  className="group-hover/button:invert"
                />
              </Button>
            </Tooltip>
          </div>
          {(year || skillMeta) && (
            <div className="flex flex-wrap gap-2 items-center">
              {year && <p className="text-default-100 font-bold">{year}</p>}
              {skillMeta && <p className="text-xs font-bold text-white/80">{skillMeta}</p>}
            </div>
          )}
          <p className="text-base text-white/90 text-ellipsis overflow-hidden line-clamp-2 font-semibold">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;

export const SkillSummaryCard = ({ name, description, years, projectCount, image, path, year }: SkillCardProps) => {
  const { type } = useParams();
  const skillMeta = formatSkillMeta({ years, projectCount });

  return (
    <Link
      href={`/${type}${path}`}
      className="flex h-full flex-col gap-3 rounded-xl bg-prime-navyLight p-5 ring-1 ring-white/10 transition hover:ring-prime focus-visible:ring-2 focus-visible:ring-prime outline-none"
    >
      <div className="flex items-start gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
          <CardImage
            src={image}
            alt={name}
            sizes="44px"
            logoClassName="p-2"
            fallback={
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-prime-navyLight via-prime-navy to-primary text-sm font-bold text-prime"
              >
                {getInitials(name)}
              </span>
            }
          />
        </div>
        <h3 className="min-w-0 flex-1 text-lg font-bold text-white break-words">{name}</h3>
        {year && <span className="shrink-0 text-xs font-semibold text-secondary-400">{year}</span>}
      </div>
      {skillMeta && <p className="text-xs font-semibold text-prime">{skillMeta}</p>}
      <p className="line-clamp-4 text-sm text-white/80 break-words">{description}</p>
    </Link>
  );
};
