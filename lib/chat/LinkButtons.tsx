import Link from "next/link";
import React from "react";
import type { ChatLink } from "../chatReply";
import { safeHttpsUrl } from "../safeUrl";

const BTN_CLASS =
  "inline-flex min-h-11 min-w-0 max-w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white break-words text-center transition hover:brightness-125 focus-visible:ring-2 focus-visible:ring-prime outline-none motion-reduce:transition-none";
const PRIMARY_CLASS = `${BTN_CLASS} chat-btn-contact`;

export const EXTERNAL_BTN_CLASS = BTN_CLASS;
export const BTN_KIND_CLASS = {
  live: "chat-btn-live",
  repo: "chat-btn-repo",
  github: "chat-btn-repo",
  linkedin: "chat-btn-linkedin",
  instagram: "chat-btn-instagram",
  whatsapp: "chat-btn-whatsapp",
  resume: "chat-btn-resume",
} as const;

const LinkIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4 shrink-0 fill-none stroke-current" strokeWidth={2}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </svg>
);

interface LinkButtonsProps {
  links: ChatLink[];
  label: string;
  showIcon?: boolean;
  contactHref?: string;
  onNavigate?: () => void;
}

const LinkButtons = ({ links, label, showIcon = false, contactHref, onNavigate }: LinkButtonsProps) => {
  const safeLinks = links.map((link) => ({ ...link, href: safeHttpsUrl(link.href) })).filter((link) => link.href);
  if (safeLinks.length === 0 && !contactHref) return null;

  return (
    <section aria-label={label} className="min-w-0 max-w-full">
      <ul className="flex min-w-0 flex-wrap gap-2">
        {safeLinks.map((link) => (
          <li key={`${link.kind}-${link.href}`} className="min-w-0 max-w-full">
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.label} (opens in new tab)`}
              className={`${BTN_CLASS} ${BTN_KIND_CLASS[link.kind]}`}
            >
              {showIcon && <LinkIcon />}
              <span className="min-w-0 break-words">{link.label}</span>
            </a>
          </li>
        ))}
        {contactHref && (
          <li className="min-w-0 max-w-full">
            <Link href={contactHref} onClick={onNavigate} className={PRIMARY_CLASS}>
              Contact page
            </Link>
          </li>
        )}
      </ul>
    </section>
  );
};

export default LinkButtons;
