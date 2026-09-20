# PoleClass Pro — Project Knowledge Base (v2 · Brand Evolution)
*Updated July 24, 2026 — supersedes v1. Brand direction change approved this date.*

## About Clarissa
- **Name:** Clarissa Pierro
- **Industry:** Pole Dance Fitness — 24 years experience
- **Students Taught:** ~250,000 women
- **Role:** Founder, domain expert, and sole pole fitness authority on this project
- **ADHD:** Inattentive type — always use typeform-style interface (one question at a time with button options), ask clarifying questions before complex tasks, provide guardrails and accountability check-ins
- **Note:** Clarissa has a separate proprietary methodology and sensual dance transformational program — these are NOT part of PoleClass Pro and should never be mixed in

---

## Product Overview & Positioning (v2 — APPROVED July 2026)

- **Name:** PoleClass Pro (never deviate: "PoleClass" one word, capital C, one space, "Pro")
- **URL:** poleclasspro.com
- **Category today:** Pole Fitness Class Planning Software
- **Category future:** **Movement Intelligence Platform™** — pole fitness is Version 1 / the first dataset of a larger framework that could later support Pilates, aerial arts, dance education, circus arts, flexibility training, and emerging disciplines
- **Core identity shift:** PoleClass Pro should NOT look like a pole dance company. It should look like a **Movement Education Technology Platform**.
- **Emotional target:** Authority + Optimism — internal shorthand: **"NASA + Sunset Sherbet"**
- **Brand communicates:** Educational authority, curriculum design, instructor development, structured progression, movement science, hopeful future (NOT sexy/nightclub/lifestyle, which is what most pole brands communicate)
- **Key terminology (candidate trademarks):** Structured Visual Movement Education™ (strongest phrase), Movement Intelligence Platform™, Structured Visual Curriculum™, Visual Movement Framework™, Movement Education System™, Movement GPS™

### Major product insight
The database is not a move library — it is a **Movement Knowledge Graph**. Move → Entry → Function → Transition → Polish creates *relationships*, not lists (comparable to Obsidian graph / network thinking).

### Potential flagship feature: Movement GPS™
Visual node graph connecting moves, entries, exits, prerequisites, progressions, regressions, and combo pathways. Connection colors carry meaning: Green = prerequisite, Blue = transition, Coral = combo, Lavender = alternative entry. Likely a major differentiator.

### Educational framework (Clarissa's pyramid → to be redesigned)
1. Learn Move → 2. Learn Function → 3. Learn Transition → 4. Integration → 5. Polish (presence, expression, performance, connection). Most fitness systems stop at competency; this extends into mastery. Redesign pyramid as mountain, constellation, or progression pathway.

### Homepage principle
**System first. Humans second.** Lead with the visual movement map / curriculum pathways / knowledge graph — not hero images of women on poles. Introduce students, instructors, and success stories after the system.

---

## Brand System v2 (APPROVED July 2026)

### Foundation colors
| Role | Hex |
|---|---|
| Midnight Navy (base) | `#151A22` |
| Deep Surface | `#1E2530` |
| Secondary Surface | `#283241` |
| Card Surface | `#313D4D` |
| Warm Ivory | `#FAF8F5` |
| Text Primary | `#F7F4EF` |
| Text Secondary | `#B8C0CC` |

### Accent system
| Accent | Hex |
|---|---|
| Ocean | `#73D9D6` |
| Coral | `#FF8F7A` |
| Sherbet Gold | `#FFC870` |
| Lavender | `#B8B3FF` |

**Usage ratio:** 70% neutral · 20% navy · 10% accent.
**Pathway color coding:** Peach = Beginner, Lavender = Intermediate, Ocean = Advanced.

### Typography
- **Headings:** Murecho (ExtraBold / Bold / SemiBold) — precision, structure, modernity
- **Body:** IBM Plex Sans — systems, professionalism, readability

### ADHD accessibility standards
Body text 18px minimum · line-height 1.8 · max line width 70–80ch · card padding 24–32px · section spacing 64–96px. Goal: reduce cognitive load, increase scanability.

### Icon language (category markers — avoid left-border callout boxes)
- ⬢ Hexagon = Safety
- ○ Circle = Coaching Cue
- ◈ Diamond = Curriculum
- △ Triangle = Progression
- ✦ Starburst = Pro Tip

### Micro headers
Small, human, elegant: "◈ Curriculum", "○ Coaching", "⬢ Safety", "△ Progression" — never "SECTION 01 / OVERVIEW / FOUNDATION".

### Tables
Aircraft-instrument-panel inspired: soft tinted headers, rounded corners, minimal borders, structured spacing, color-coded educational pathways. Tables are learning tools.

### Dividers
No standard horizontal rules. Use subtle geometric systems: ✦ ✦ ✦ · ◈ ◈ ◈ · ● ○ ● ○ ●

### Photography
Movement Science Photography: clean, consistent, future-facing, educational color grade. Avoid heavy purple lighting, nightclub look, extreme magenta.

### Outstanding brand decisions (tracked on dashboard)
1. ~~Final brand palette approval~~ ✅ Approved 7/24/26
2. Final icon system
3. Divider system selection
4. Homepage wireframe
5. Knowledge graph visualization
6. Movement GPS concept validation
7. Category language selection
8. Rewrite complete brand guidelines
9. Create visual design system
10. Design curriculum table standards

---

## Legacy Brand v1 (ARCHIVED July 2026 — do not use for new work)
- Colors: `#140B26` · `#662490` · `#FF559D` · `#FF8CC2` · `#FF7CC1` · `#BF1E6E`
- Fonts: Barlow Bold 700/900, DM Sans, DM Mono
- Logo: horizontal wordmark, dancer silhouette on the "l" in "Pole" (SVG in Google Doc 14PFrUhlVOyYOaHKEwlDzMIPLSvnMOaGKVSo7lqHvC7Y)
- Retained only for reference and migration audits.

---

## Tier Structure

| Tier | Subdomain | Price | Key Features |
|------|-----------|-------|--------------|
| Free | poleclasspro.com | $0 | Lead gen, email capture |
| Pro Lite | liteapp.poleclasspro.com | ~$12 | No AI, no saves, session only, can view published program planning |
| Pro | app. + dashboard. | $20 | Full AI generator, templates, combo builder, Supabase saves, Spotify embed, notes |
| Team Admin | teamdashboard. | TBD | Manages programming planning DB, views team class plans, publishes plans |

Terminology: always "class plan/class plans" — never "class summary."

---

## Subdomain Map

| Subdomain | Purpose |
|-----------|---------|
| poleclasspro.com | Marketing site |
| liteapp.poleclasspro.com | Pro Lite — no saves, no AI |
| app.poleclasspro.com | Pro — full app |
| dashboard.poleclasspro.com | Pro — subscriber portal + saved plans |
| teamdashboard.poleclasspro.com | Team Admin — curriculum planning, class plans |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Atoms.dev | AI + app builder (project `347cdca11be74414981e4339c2c9f0d0`) |
| Supabase | Org "PoleClass Pro": Moves, Competition, and -C (auth, ref `ehtznmrfttpflegtxexz`) projects |
| Make.com | Notion→Supabase live sync (scenario `5590229`, 15-min polling) |
| Stripe | Payments |
| Claude AI | Class generator + Spotify embed logic |
| Notion | Master planning + Pole Moves Master Database (554 moves, DB `95d2120a-b155-42c2-bdac-e376ab3eb89f`) |
| Obsidian | Future iteration — knowledge brain for users |

---

## Iteration Roadmap (in order)
1. Launch with sign-in and Stripe capabilities
2. Determine pricing structure for more Supabase + Obsidian storage
3. Fully launch Obsidian — knowledge brain for users
4. Multilingual launch (started from the beginning)

---

## Advisory Council
| Role | Expertise |
|------|-----------|
| ACE Curriculum Expert | Certification, curriculum standards — no common language yet documented for pole fitness as exercise |
| Web App Developer | Full-stack development, architecture |
| Financial/Startup Expert | Costs, KPIs, projections, profitability |
| Clarissa Pierro | Pole fitness domain expert — all content decisions |

---

## How to Work With Clarissa
- Always use **typeform-style interface** — one question at a time, button options
- Ask questions BEFORE starting any complex task
- Provide guardrails and accountability check-ins
- She is the sole decision-maker on all pole fitness content
- Keep her proprietary methodology completely separate from PoleClass Pro
