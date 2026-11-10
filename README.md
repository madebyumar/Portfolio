# Umar Shoaib Portfolio — Next.js

Next.js portfolio with a Supabase-backed CMS and authenticated admin dashboard.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Supabase Auth + Postgres
- Deploy-ready for Vercel (Hobby) / Netlify

## Project structure

```text
app/                         Routes, API, layout, SEO (sitemap/robots)
  admin/                     Authenticated dashboard
  api/contact/               Contact form (validation, honeypot, rate limit)
  blog/[slug]/               SEO article pages
  project/[slug]/            SEO case-study pages
components/portfolio/        UI sections, pages, effects
lib/
  data/                      Public portfolio queries + types
  auth/                      Admin allowlist helpers
  supabase/                  Browser/server clients + session gate
public/                      Static assets (`theme.js`, uploads)
proxy.ts                     Session refresh + admin protection
```

## Setup

1. Copy env template and fill values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (no trailing slash) |
| `ADMIN_EMAILS` | Comma-separated emails allowed into `/admin` (required in production) |
| `GOOGLE_GENERATIVE_AI_API_KEY` or `GEMINI_API_KEY` | Free Gemini key for the portfolio chatbot (primary) |
| `GROQ_API_KEY` | Free Groq key used automatically if Gemini fails / rate-limits |

2. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm start
```

On Netlify, set the same env vars in Site settings → Environment variables. Ensure Supabase RLS allows:

- Public `SELECT` on published projects/blogs/skills/experiences/testimonials/settings
- Public `INSERT` on `contact_messages` only
- Public `INSERT`/`UPDATE` on chat tables (server API only; no public reads)
- Authenticated (admin) write access on CMS tables
- Chatbot config lives in `site_settings` key `chatbot` (managed in `/admin/chatbot`)

## Security notes

- Admin routes are gated by Supabase session **and** `ADMIN_EMAILS` allowlist
- Contact API rate-limits by IP and ignores honeypot submissions
- Security headers are set in `next.config.ts`
