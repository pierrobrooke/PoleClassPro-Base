---
last_updated: 2026-05-16T23:40:57Z
status: active
---

# Project Context

## Project Overview
PoleClass Pro — a web application for pole dance fitness instructors to plan, organize, and deliver structured classes. Features include a Moves Database (synced from Notion), Combo Builder with drag-and-drop, AI Class Generator, Class Templates, Class Summary export, and a Share Combo feature. Full-stack: React/TypeScript frontend + Atoms Cloud (FastAPI/Python) backend with Notion API integration.

## Key Decisions
| Date | Decision | By | Rationale |
|------|----------|-----|-----------|
| 2026-05-05 | Use Atoms Cloud backend with Notion API | Team | Notion is the instructor's existing data source; Atoms Cloud provides auth, DB, edge functions |
| 2026-05-07 | Remove Notion sync UI, make moves endpoint public | Team | Simplify UX — moves are fetched automatically; public endpoint enables unauthenticated access |
| 2026-05-08 | Add drag-and-drop to Combo Builder | Team | Instructors need intuitive reordering of moves in combos |
| 2026-05-08 | Implement Share Combo via unique links | Team | Enable instructors to share combos with students/peers without login |
| 2026-05-09 | Rebuild Moves Database & Combo Builder for live Notion data | Team | All pages must use live data from Notion instead of hardcoded moves |
| 2026-05-16 | Rebrand to PoleClass Pro Brand Guide (Barlow/DM Sans/DM Mono, #662490/#BF1E6E/#140B26) | Alex | AAA ADA compliance; consistent brand identity across all pages |

## Constraints
- **Active theme**: PoleClass Pro — Movement Intelligence Platform v2 ("NASA + Sunset Sherbet")
- **Typography**: Murecho (800 Extra Bold for titles, 700 Bold for headings, 600 Semibold for subheadings), IBM Plex Sans (400/500/600 for body), IBM Plex Mono (400/500 for code/labels)
- **Color palette (dark-first)**: Midnight Navy #151A22 (base), Deep Surface #1E2530, Secondary Surface #283241, Card Surface #313D4D, Warm Ivory #FAF8F5, Text Primary #F7F4EF, Text Secondary #B8C0CC
- **Accent colors**: Ocean #73D9D6 (primary/active), Coral #FF8F7A (beginner/CTA), Sherbet Gold #FFC870 (highlight), Lavender #B8B3FF (intermediate)
- **Logo lockup**: "PoleClass" (Murecho 800, Warm Ivory #F7F4EF) + "Pro" (Murecho 600, Ocean #73D9D6) with node-graph mark (connected circles in brand accent colors)
- **Micro-interactions**: card-hover (translateY -2px + ocean border glow), animate-node-pulse (3s ease-in-out infinite scale/opacity)
- **Brand voice**: "Structured Visual Movement Education™" — educational authority + optimism
- **Visual language**: Node graph / constellation motifs, pathway color coding (Coral=Beginner, Lavender=Intermediate, Ocean=Advanced, Gold=Expert)
- **Data source**: External Supabase (https://aszxnzbrbhqxzxvtjqyn.supabase.co) — `public.pole_moves` table (554 rows, read-only via anon key). Frontend uses `@supabase/supabase-js` directly. Notion API has been fully removed.
- **Max code files**: 8 per task
- **Pending**: User will upload color-graded studio photos (pole students, teacher, b-roll) later


