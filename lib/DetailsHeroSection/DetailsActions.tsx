"use client";

import React, { useState } from "react";
import { useSavedProjectContext } from "../../hooks/useSavedProjectContext";
import type { SkillCardProps } from "../SkillCard";
import { CheckIcon, CodeIcon, DocumentIcon, PlusIcon, ShareIcon } from "./DetailsIcons";

export interface DetailsActionsProps {
  title: string;
  saveCard?: SkillCardProps;
  sourceUrl?: string;
  sourceLabel?: string;
  resumeUrl?: string;
}

const EXTERNAL_LINK_PROPS = { target: "_blank", rel: "noopener noreferrer" } as const;
const ACTION_CLASS =
  "flex min-h-16 min-w-20 flex-col items-center justify-start gap-2 rounded-xl px-3 py-2 text-base font-bold text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-prime outline-none";
const ICON_CLASS = "h-7 w-7";
const SHARE_NOTE_MS = 2500;

const useShare = (title: string) => {
  const [note, setNote] = useState("");

  const flash = (message: string) => {
    setNote(message);
    window.setTimeout(() => setNote(""), SHARE_NOTE_MS);
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      flash("Link copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      flash("Could not share");
    }
  };

  return { note, share };
};

const DetailsActions = ({ title, saveCard, sourceUrl, sourceLabel = "Source code", resumeUrl }: DetailsActionsProps) => {
  const { savedProjects, setSavedProjects } = useSavedProjectContext();
  const { note, share } = useShare(title);
  const isSaved = saveCard ? savedProjects.some((item) => item.name === saveCard.name) : false;

  const toggleSaved = () => {
    if (!saveCard) return;
    setSavedProjects(isSaved ? savedProjects.filter((item) => item.name !== saveCard.name) : [...savedProjects, saveCard]);
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        {sourceUrl && (
          <a href={sourceUrl} className={ACTION_CLASS} {...EXTERNAL_LINK_PROPS}>
            <CodeIcon className={ICON_CLASS} />
            {sourceLabel}
          </a>
        )}
        {saveCard && (
          <button type="button" onClick={toggleSaved} aria-pressed={isSaved} className={`${ACTION_CLASS} cursor-pointer`}>
            {isSaved ? <CheckIcon className={ICON_CLASS} /> : <PlusIcon className={ICON_CLASS} />}
            {isSaved ? "Saved" : "Watchlist"}
          </button>
        )}
        {resumeUrl && (
          <a href={resumeUrl} className={ACTION_CLASS} {...EXTERNAL_LINK_PROPS}>
            <DocumentIcon className={ICON_CLASS} />
            Resume
          </a>
        )}
        <button type="button" onClick={share} className={`${ACTION_CLASS} cursor-pointer`}>
          <ShareIcon className={ICON_CLASS} />
          Share
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-1 min-h-5 text-sm font-semibold text-prime">
        {note}
      </p>
    </div>
  );
};

export default DetailsActions;
