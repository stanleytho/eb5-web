# CLAUDE.md

Source of intent: `my-ideas.md`. Update that first, then sync these docs.

## Project
Static marketing site for an EB-5 investment project. Visitors learn about it, invest toward a visa / permanent residency, and can contact us via a form.

Existing project material (source content): `/Users/stho/Documents/VUAGG/eb5`. Copy from it, don't link to it.

## Stack
- Static site. No framework, no build step unless needed (plain HTML/CSS, minimal JS).
- Deploy: GitHub → Vercel.
- Bot protection: Cloudflare Turnstile on the contact form.
- Domain: none yet. Use the Vercel `*.vercel.app` URL until added.

## Rules
- Simplest thing that works. No dependencies for what HTML/CSS can do.
- Surgical edits: touch only what the task needs.
- State assumptions; ask when unclear (see Open questions in `ARCHITECTURE.md`).
- Never commit secrets (Turnstile secret key, form endpoint tokens). Use Vercel env vars.
- Verify before claiming done: open the page, submit the form, check Turnstile.

## Docs
- `DESIGN.md` — pages, content, look and feel
- `ARCHITECTURE.md` — hosting, form flow, open questions
