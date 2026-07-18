# Environment Variables

Use `.env.example` as the source of truth for required variables.

## Public Browser Variables

Only variables prefixed with `NEXT_PUBLIC_` may be used in client-side code:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## Server-only Variables

These must never be imported into Client Components or browser bundles:

- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `SMTP_PASSWORD`
- `ZOOM_CLIENT_SECRET`
- `ZOOM_WEBHOOK_SECRET`
- `CRON_SECRET`

Server-only validation starts in `src/lib/validations/env.ts`.

Do not paste secrets into chat or commit `.env` files.
