"use client";

import React, { useState } from "react";
import Button from "./Button";
import Tooltip from "./tooltip";
import Image from "next/image";
import { CONTACT_LIMITS } from "./contactLimits";
import type { ContactCopy } from "./contactCopy";

const CONTACT_URL = "/api/contact";
const INPUT_CLASS =
  "w-full my-4 p-2 py-3 rounded-md border-[0.5px] outline-0 border-default-gray focus-visible:ring-2 focus-visible:ring-prime";
const SOCIAL_LINK_CLASS =
  "inline-flex items-center justify-center min-h-11 min-w-11 rounded-full px-4 bg-white/20 shadow-lg backdrop-blur-lg font-semibold text-base text-white hover:bg-white hover:text-secondary-900 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-prime outline-none";
const STATUS_RATE_LIMITED = 429;

type FormStatus = "idle" | "submitting" | "success" | "error";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

interface ContactMeFormProps {
  copy: ContactCopy;
  githubUrl: string;
  linkedinUrl: string;
  whatsappUrl: string;
}

const ContactMeForm = ({ copy, githubUrl, linkedinUrl, whatsappUrl }: ContactMeFormProps) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorText, setErrorText] = useState("");

  const setField = (field: keyof typeof EMPTY_FORM) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorText("");
    try {
      const response = await fetch(CONTACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot }),
      });
      if (!response.ok) {
        setErrorText(response.status === STATUS_RATE_LIMITED ? copy.ratelimit : copy.error);
        setStatus("error");
        return;
      }
      setForm(EMPTY_FORM);
      setStatus("success");
    } catch {
      setErrorText(copy.error);
      setStatus("error");
    }
  };

  return (
    <div id="contact" className="scroll-mt-24 flex relative overflow-hidden z-10 p-4 mt-20 mb-10 md:flex-col">
      <form onSubmit={handleSubmit} className="my-4 p-10 md:px-2 relative z-10 rounded-lg ">
        <div className="text-5xl font-bold">{copy.heading}</div>
        <p className="mt-3 text-lg text-white/70">{copy.subtext}</p>
        <div className="">
          <label htmlFor="contact-name" className="sr-only">Name</label>
          <input
            id="contact-name"
            type="text"
            required
            maxLength={CONTACT_LIMITS.name}
            value={form.name}
            onChange={setField("name")}
            placeholder={copy["placeholder.name"]}
            className={INPUT_CLASS}
          />
          <label htmlFor="contact-email" className="sr-only">Email</label>
          <input
            id="contact-email"
            type="email"
            required
            maxLength={CONTACT_LIMITS.email}
            value={form.email}
            onChange={setField("email")}
            placeholder={copy["placeholder.email"]}
            className={INPUT_CLASS}
          />
          <label htmlFor="contact-subject" className="sr-only">Subject</label>
          <input
            id="contact-subject"
            type="text"
            required
            maxLength={CONTACT_LIMITS.subject}
            value={form.subject}
            onChange={setField("subject")}
            placeholder={copy["placeholder.subject"]}
            className={INPUT_CLASS}
          />
          <label htmlFor="contact-message" className="sr-only">Message</label>
          <textarea
            id="contact-message"
            rows={4}
            required
            maxLength={CONTACT_LIMITS.message}
            value={form.message}
            onChange={setField("message")}
            placeholder={copy["placeholder.message"]}
            className={`${INPUT_CLASS} text-md resize-none`}
          />
          <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>
        </div>
        {status === "error" && (
          <p role="alert" className="text-alert-error text-sm mb-2">
            {errorText}
          </p>
        )}
        {status === "success" && (
          <p role="status" className="text-alert-success text-sm mb-2">
            {copy.success}
          </p>
        )}
        <Button
          type="submit"
          variant="glassMoprhism"
          size="xl"
          disabled={status === "submitting"}
          className="max-h-[400px] w-full py-4 min-h-11 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? copy.sending : copy.cta}
        </Button>
      </form>

      <div className="m-auto text-3xl font-black text-center md:hidden">
        {copy.socials}
        <div className="flex flex-wrap justify-center gap-3 my-7">
          {githubUrl && (
            <Tooltip text="Leave a Star on Github" className="h-full">
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={`${SOCIAL_LINK_CLASS} group/button`}>
                <Image src="/github.svg" alt="" width={30} height={30} className="group-hover/button:invert sm:w-4.5 sm:h-4.5" />
              </a>
            </Tooltip>
          )}
          {linkedinUrl && (
            <Tooltip text="Follow me on Linkedin" className="h-full">
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={`${SOCIAL_LINK_CLASS} group/button`}>
                <Image src="/linkedin.svg" alt="" width={30} height={30} className="group-hover/button:invert sm:w-4.5 sm:h-4.5" />
              </a>
            </Tooltip>
          )}
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={SOCIAL_LINK_CLASS}>
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMeForm;
