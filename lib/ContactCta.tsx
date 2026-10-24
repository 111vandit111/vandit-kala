"use client";

import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { isProfileType } from "../constants";
import ChatPanel from "./ChatPanel";

const CONTACT_ANCHOR_ID = "contact";
const CHAT_CTA_LABEL = "Ask about Vandit";

const ContactCta = () => {
  const { type } = useParams<{ type: string }>();
  const pathname = usePathname();
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const target = document.getElementById(CONTACT_ANCHOR_ID);
    setIsContactVisible(false);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setIsContactVisible(entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  if (!isProfileType(type)) return null;

  return (
    <>
      {!isContactVisible && (
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="chat-panel"
          aria-label={CHAT_CTA_LABEL}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] sm:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:right-[max(1rem,env(safe-area-inset-right))] z-[900] min-h-11 inline-flex items-center justify-center rounded-full bg-prime px-6 py-3 sm:h-12 sm:w-12 sm:p-0 font-semibold text-white shadow-lg transition hover:bg-prime-dark focus-visible:ring-2 focus-visible:ring-white outline-none animate-fade-in"
        >
          <span className="sm:hidden">{CHAT_CTA_LABEL}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="hidden h-6 w-6 sm:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          </svg>
        </button>
      )}
      <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} type={type} contactHref={`/${type}#${CONTACT_ANCHOR_ID}`} />
    </>
  );
};

export default ContactCta;
