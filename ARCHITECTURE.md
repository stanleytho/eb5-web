# ARCHITECTURE.md

## Overview
```
Browser ──► Vercel (static files)
   │
   └─ contact form ──► Cloudflare Turnstile (client widget)
                          │ token
                          ▼
                    Vercel Function /api/contact ──► verify token (Turnstile siteverify)
                                                  └► deliver message (email)
```

## Components
| Part | Choice | Why |
|------|--------|-----|
| Pages | Static HTML/CSS | Requested: static page |
| Source control | GitHub | Requested |
| Hosting/CI | Vercel, auto-deploy on push to `main` | Requested |
| Human check | Cloudflare Turnstile | Requested ("cloudflare to detect human") |
| Form handling | One Vercel serverless function | A purely static page can't verify the Turnstile token or send mail itself |

## Layout
```
index.html       English (content from Veneta_EB5_Brochure_English_Fixed.html)
vi/index.html    Vietnamese (content from Veneta_EB5_Brochure_Vietnamese_Fixed.html)
assets/site.css  the whole design system, brochure palette (see DESIGN.md)
assets/site.js   exhibit-tab highlighting + contact form submit
api/contact.js   Vercel function
```
Pages were generated once from the brochures (read-only) and are now edited by hand. Parity check at build time: every brochure word is present except the print page footers, section labels, and the partner contact cards (replaced by the form).

## Assumptions
- "Static" means no CMS/framework; one small serverless function for the form is acceptable.
- Cloudflare is used only for Turnstile, not DNS/CDN (no domain yet).

## Decisions
- Form submissions go to `stanleynho@gmail.com` for now. Keep the address in a Vercel env var (`CONTACT_TO_EMAIL`) so it can change later without a code edit.
- Serverless function is OK.
- Languages: English first, Vietnamese next. Keep all visible text in the HTML so a `/vi/` copy can be added later; no i18n library until then.
- Legal disclaimers: a law firm will supply them later. Don't publish publicly until they're in place. Leave a placeholder in the footer.

## Open questions
1. Email delivery service: default to Resend (free tier, one API call from the function) unless you prefer another.
2. Domain and when DNS moves (and whether to put Cloudflare in front then).
