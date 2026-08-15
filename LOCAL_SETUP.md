# Sarkin Mota Autos — Local Setup Guide

How to run this project on your own machine (outside Freebuff).

## 1. Prerequisites

- **Node.js 20+** or **Bun** (the project uses Bun — `bun install`, `bun run dev`)
- A **free Convex account** (sign in with GitHub at https://convex.dev)
- The project files exported from the Freebuff editor (project menu → **Download / Export** — there is no external download link; the export lives in the editor UI)

## 2. Install dependencies

```bash
bun install
```

## 3. Start the backend (Convex)

Open a terminal in the project folder and run:

```bash
bunx convex dev
```

First run only:

1. It will ask you to **log in with GitHub** (opens a browser) — allow it.
2. It creates a **dev deployment** for you (free tier is fine).
3. It automatically writes a `.env.local` file containing `VITE_CONVEX_URL` for the frontend.
4. It watches `src/convex/` and deploys the backend functions as you edit.

Leave this terminal running.

### Set the backend environment variables (once)

The login flow needs two Convex env vars on the deployment. Run in another terminal while `convex dev` is running:

```bash
# 1. Get your deployment URL from the convex dev output, then:
bunx convex env set CONVEX_SITE_URL https://<your-deployment>.convex.site

# 2. A random secret for signing auth tokens (any long random string):
bunx convex env set AUTH_SECRET <long-random-string>
```

> `AUTH_SECRET` is optional in local dev (Convex auto-generates one), but setting it
> keeps admin sessions valid across restarts. If login "loops" back to the auth page,
> the usual cause is `CONVEX_SITE_URL` not matching the actual deployment URL.

## 4. Start the frontend

In a **second** terminal:

```bash
bun run dev
```

Open the printed URL (usually **http://localhost:5173**).

## 5. First-time data

The first time the landing page loads, the app **auto-seeds** the showroom with
9 demo machines and 3 sample leads (`src/convex/seed.ts`). It runs only once
(idempotent) — delete the `settings` table row with `key = "seeded"` to re-seed.

## 6. Admin login (email + password)

- **Account #1:** go to **`/auth`** → **Create account**. Public sign-up is allowed
  only for the very first account (the bootstrap), by design.
- **Accounts #2 and #3:** created by an existing admin from the dashboard's
  **Accounts** section. The total is hard-capped at **3** (CEO, developer, recovery)
  — enforced in `src/convex/auth.ts`.
- After signing in you land on **`/admin`** (dashboard: inventory, leads, accounts).

## 7. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Blank page / "Did you forget to run convex dev?" | The frontend can't reach Convex. Check `.env.local` has `VITE_CONVEX_URL` and the `convex dev` terminal is still running. |
| Login never confirms / bounces back to `/auth` | `CONVEX_SITE_URL` env var doesn't match the real deployment URL — reset it. |
| Port 5173 already in use | Vite auto-picks another port — open the URL it prints. |
| Want a real production backend later | `bunx convex deploy`, then set env vars for production (`bunx convex env set --type production ...`). |

## Notes

- The `vly-toolbar-readonly.tsx` file and `@vly-ai/integrations` package are
  Freebuff editor chrome (dev-only) — safe to leave in place.
- The site needs **no other services**: no Supabase, no Firebase, no email
  provider. Convex does the database, file URLs, and admin auth.
