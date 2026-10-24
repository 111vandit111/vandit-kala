import React from "react";
import ContactMeForm from "./ContactMeForm";
import { resolveContactCopy } from "./contactCopy";
import { safeHttpUrl } from "./safeUrl";
import { getTextMap } from "./server/contentService";
import type { ProfileType } from "./server/limits";

const DEFAULT_PROFILE: ProfileType = "recruiter";

async function loadTexts(): Promise<Record<string, string>> {
  try {
    return await getTextMap();
  } catch (error) {
    console.error("Contact copy failed to load:", error instanceof Error ? error.message : error);
    return {};
  }
}

// Server component: picks the per-profile contact copy from the text keys (falling back to the
// generic keys, then to the professional defaults) and hands it to the client-side form.
const ContactMe = async ({ heading, tone = DEFAULT_PROFILE }: { heading?: string; tone?: ProfileType }) => {
  const texts = await loadTexts();
  return (
    <ContactMeForm
      copy={resolveContactCopy(texts, tone, heading ? { heading } : {})}
      githubUrl={safeHttpUrl(texts["social.github"])}
      linkedinUrl={safeHttpUrl(texts["social.linkedin"])}
      whatsappUrl={safeHttpUrl(texts["social.whatsapp"])}
    />
  );
};

export default ContactMe;
