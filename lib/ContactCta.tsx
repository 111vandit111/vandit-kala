"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CONTACT_TONE, isProfileType } from "../constants";

const CONTACT_ANCHOR_ID = "contact";

const ContactCta = () => {
  const { type } = useParams<{ type: string }>();
  const pathname = usePathname();
  const [isContactVisible, setIsContactVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(CONTACT_ANCHOR_ID);
    setIsContactVisible(false);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setIsContactVisible(entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  if (!isProfileType(type) || isContactVisible) return null;

  return (
    <Link
      href={`/${type}#${CONTACT_ANCHOR_ID}`}
      className="fixed bottom-6 right-6 sm:bottom-4 sm:right-4 z-[900] min-h-11 inline-flex items-center rounded-full bg-prime px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-prime-dark focus-visible:ring-2 focus-visible:ring-white outline-none animate-fade-in"
    >
      {CONTACT_TONE[type].cta}
    </Link>
  );
};

export default ContactCta;
