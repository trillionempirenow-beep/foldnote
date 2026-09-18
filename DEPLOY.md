# Deploying Foldnote (Phase 1) to Vercel

Your Supabase backend is already fully set up and live — no setup needed there.
This zip just needs to reach Vercel, and the Vercel connector in this Claude
session currently can't push deployments (permission error at the token
level), so do this step yourself — it takes about 2 minutes.

## Fastest path: drag-and-drop import (no GitHub needed)

1. Unzip this file locally.
2. Go to https://vercel.com/new
3. Look for an option to deploy without Git / import a local folder (Vercel
   CLI is the most reliable way to do this — see below). If the dashboard in
   your account doesn't offer a folder upload, use the CLI instead:

```bash
cd foldnote-phase1
npm i -g vercel
vercel login
vercel --prod
```

Follow the prompts (link to your `trillionempirenow-8574` scope, project
name `foldnote`). Vercel will install dependencies and build automatically.

## Preferred path: push to GitHub, then import

This is more reliable long-term since every `git push` will auto-deploy.

```bash
cd foldnote-phase1
git init
git add .
git commit -m "Phase 1: Foldnote"
gh repo create foldnote --private --source=. --push
# or manually create a repo on github.com and:
# git remote add origin https://github.com/<you>/foldnote.git
# git branch -M main
# git push -u origin main
```

Then on vercel.com: **Add New → Project → Import** your `foldnote` repo.
Vercel auto-detects Next.js — no config needed.

## Environment variables

These are already hardcoded as safe, publishable values in `next.config.ts`
(Supabase's publishable/anon key is meant to be public), so **no environment
variables are required** for this to work out of the box:

- `NEXT_PUBLIC_SUPABASE_URL=https://eijptlqhryelatlxkggp.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_82TSYWqMecq-BJnLL4T5Gw_dMOxhwGL`

If you'd rather not ship them inline, delete the `env` block from
`next.config.ts` and instead add those two as Environment Variables in the
Vercel project settings — same values, just not committed to source.

## What's already live and working

- Supabase project `foldnote` (id `eijptlqhryelatlxkggp`): all 10 tables,
  RLS policies, storage buckets, auth trigger, security-hardened functions.
- Google OAuth and email/password auth both wired up in the code — but
  **Google sign-in won't work until you enable the Google provider** in
  Supabase: Dashboard → Authentication → Providers → Google, and add your
  OAuth client ID/secret there.
- Once deployed, add the deployment's URL (e.g.
  `https://foldnote.vercel.app`) to Supabase → Authentication → URL
  Configuration → Redirect URLs, as `https://<your-domain>/auth/callback`,
  or Google login will redirect but fail to complete.

## After it's live

Come back and tell me the live URL (or just say "it's deployed") and I'll
pick up with Phase 2 — the Fabric.js editor, pages, stickers.
