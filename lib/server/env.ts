import { z } from "zod";

const MIN_SESSION_SECRET_LENGTH = 32;

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  ADMIN_SESSION_SECRET: z.string().min(MIN_SESSION_SECRET_LENGTH),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | undefined;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const names = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Invalid or missing environment variables: ${names}`);
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}

// Same lookup order @google/adk uses; the SDK reads the key from process.env itself, this only decides availability.
export function getChatApiKey(): string | undefined {
  return process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || undefined;
}
