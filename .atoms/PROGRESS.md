# Requirements & Progress

## Requirements Overview
PoleClass Pro — pole dance instructor class planning platform. Current phase: branding rework to PoleClass Pro Brand Guide with AAA ADA compliance.

## User Stories
- As an instructor, I can browse a live Moves Database synced from Notion
- As an instructor, I can build combos with drag-and-drop from live move data
- As an instructor, I can generate AI-powered class plans
- As an instructor, I can use pre-built class templates
- As an instructor, I can share combos via unique links
- As a user, I see correct brand fonts, colors, and the official logo with AAA contrast

## Task Breakdown
- [x] (Legacy) All previous branding and data migration tasks completed
- [x] Brand v2: Update index.css — NASA + Sunset Sherbet palette, Murecho + IBM Plex Sans + IBM Plex Mono fonts, dark-first design
- [x] Brand v2: Update tailwind.config.ts — new font families and brand color tokens
- [x] Brand v2: Rewrite Logo.tsx — node-graph mark + "PoleClass Pro" text lockup (Murecho, Ocean accent)
- [x] Brand v2: Rewrite Index.tsx — dark hero, constellation visual, "Structured Visual Movement Education™", educational authority positioning
- [x] Brand v2: Update Navigation.tsx — dark navy, Warm Ivory text, Ocean active states
- [x] Brand v2: Update MoveCard.tsx — dark card surfaces, pathway color coding
- [x] Brand v2: Update Dashboard.tsx and MovesDatabase.tsx — dark surface hierarchy, accent color system
- [x] Brand v2: Run lint/build validation

## Progress Log
- 2026-05-05: Initial project setup — React/Vite frontend + Atoms Cloud backend
- 2026-05-07: Notion API integration, AI Class Generator, class templates, dashboard features, font/color updates
- 2026-05-08: Combo Builder with drag-and-drop, Share Combo feature, logo added across app, AI class plan parsing
- 2026-05-09: Moves Database rebuilt with live Notion data, public moves endpoint, Notion integration and drag fixes
- 2026-05-16: Full branding overhaul — Barlow/DM Sans/DM Mono fonts, #662490/#BF1E6E/#140B26 colors, official SVG logo with variants
- 2026-05-16: Fixed ComboBuilder crash (getLevelBadgeClasses null guard for undefined level)
- 2026-07-12: Migrated data source from Notion API to external Supabase (public.pole_moves, 554 rows, read-only via anon key)