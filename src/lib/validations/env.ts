import "server-only";
import { z } from "zod";

const optionalUrl = z.string().url().or(z.literal("")).optional();

export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_PROJECT_REF: z.string().optional(),
  APP_URL: optionalUrl,
  NEXT_PUBLIC_APP_URL: optionalUrl,
  BOOTSTRAP_ADMIN_EMAIL: z.string().email().or(z.literal("")).optional(),
  EMAIL_PROVIDER: z.enum(["", "resend", "smtp", "mock"]).optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM_ADDRESS: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  ZOOM_ACCOUNT_ID: z.string().optional(),
  ZOOM_CLIENT_ID: z.string().optional(),
  ZOOM_CLIENT_SECRET: z.string().optional(),
  ZOOM_WEBHOOK_SECRET: z.string().optional(),
  CRON_SECRET: z.string().optional()
});

export function readEnv() {
  return envSchema.parse(process.env);
}
