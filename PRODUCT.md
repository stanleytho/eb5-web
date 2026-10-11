# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Vietnamese investors and the agents/brokers who advise them, evaluating a US EB-5 visa investment for their family. Many read on mobile, many are more comfortable in Vietnamese. Secondary: English-reading immigration attorneys and advisors. Job: understand the Veneta Apartments offer, judge whether it is credible and safe enough, and request a consultation.

## Product Purpose
Public website for the Veneta Apartments EB-5 investment (128-unit multifamily project, Veneta, Lane County, Oregon; developer HT Investment Properties; sponsored via Zephyrus Regional Center; EB-5 legal counsel Hirson EB-5). Success: qualified investors and agents submit the contact form.

## Positioning
A real, permitted, under-construction apartment project with a named developer (3,200+ units built since 1998), a subordinated-loan structure and a regional center already covering Lane County. Not a generic EB-5 promoter page.

## Operating Context
Investors compare several EB-5 offers and consult immigration attorneys. Deal documents (PPM, operating agreement, financing memorandum, pro forma, specs) exist in `/Users/stho/Documents/VUAGG/eb5/reference docs`. Static site on Vercel, Cloudflare Turnstile on the form, Resend for email.

## Capabilities and Constraints
- Static HTML/CSS/JS, no framework; one serverless function (`api/contact.js`).
- Two languages: English (`/`) and Vietnamese (`/vi/`), kept in step.
- All content comes from the original brochures (`/Users/stho/Documents/VUAGG/eb5/html`), which must not be modified.
- Regulated securities offering: all legal disclaimers must remain; law firm will supply final text and review before launch.
- Domain: none yet. Public brand per owner: BD Ventures.
- Open: date-sensitive claims (Sept 30, 2026 grandfathering deadline, April 2027 lease-up) need verification.

## Brand Commitments
Public brand is BD Ventures. No logo supplied yet.

## Evidence on Hand
Brochure content, pro forma figures, unit mix, market data, construction budget. Owner reports having site plan/renderings and property photos but they are not yet in the repo; do not fabricate imagery. No testimonials, no investor counts.

## Product Principles
1. Credibility before persuasion: every number traceable to the deal documents.
2. Vietnamese is a first-class language, not a translation afterthought.
3. Mobile reading comes first.
4. Risk and disclaimers stay visible, never buried.
5. One clear action: request a consultation.

## Accessibility & Inclusion
Readable Vietnamese diacritics at all sizes; sufficient contrast; keyboard-usable form.
