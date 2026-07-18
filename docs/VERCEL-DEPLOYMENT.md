# Vercel Deployment

The current Vercel project is expected to be:

```text
hadith-college
```

Do not create a new Vercel project.

## Current Framework

The repository has been converted from static HTML to Next.js:

- Framework Preset: Next.js
- Root Directory: `./`
- Build Command: `npm run build`

## HUMAN ACTION REQUIRED — VERCEL LOGIN

Before linking or setting environment variables, run:

```bash
vercel login
vercel link
```

Ensure the link targets the existing `hadith-college` project only.

Environment variables should be added to Development, Preview, and Production through Vercel's secure environment settings.
