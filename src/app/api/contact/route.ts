import { z } from "zod";
import { saveMessage } from "../../../../lib/server/contactService";
import { handleError, ok, parseBody, tooManyRequests } from "../../../../lib/server/http";
import { checkRateLimit } from "../../../../lib/server/rateLimit";
import { contactSchema } from "../../../../lib/server/schemas";

const submissionSchema = contactSchema.extend({ website: z.string().max(200).optional() });

export async function POST(request: Request) {
  try {
    const limit = checkRateLimit("contact", request);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSec);
    const parsed = await parseBody(request, submissionSchema);
    if (!parsed.ok) return parsed.response;
    const { name, email, subject, message, website } = parsed.value;
    if (website) return ok({ ok: true }, 201);
    await saveMessage({ name, email, subject, message });
    return ok({ ok: true }, 201);
  } catch (err) {
    return handleError("POST /api/contact", err);
  }
}
