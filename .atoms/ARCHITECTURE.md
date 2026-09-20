---
last_updated: 2026-05-16T23:40:57Z
---

# Architecture Design

## System Overview
Full-stack web application with frontend/backend separation. React SPA frontend communicates with Atoms Cloud (FastAPI) backend. Backend syncs move data from Notion API and exposes it via REST endpoints. Frontend fetches live data and renders interactive pages for class planning, combo building, and AI generation.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS 3, shadcn/ui, React Router 6, TanStack React Query, Recharts, Lucide icons
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic, Alembic (migrations), Atoms Cloud (auth, DB, edge functions)
- **External APIs**: Notion API (moves database)
- **Build/Dev**: pnpm, Vite, ESLint, vite-prerender-plugin, vite-plugin-sitemap

## Module Design
| Module | Responsibility | Key Files |
|--------|---------------|-----------|
| Homepage | Landing page with brand hero, features, benefits, CTA | pages/Index.tsx |
| Dashboard | Class builder with live Notion moves, search/filter | pages/Dashboard.tsx |
| Moves Database | Browse/filter all moves from Notion with detail modal | pages/MovesDatabase.tsx |
| Combo Builder | Drag-and-drop combo creation from live Notion moves | pages/ComboBuilder.tsx |
| AI Generator | AI-powered class plan generation with moves picker | pages/AIGenerator.tsx |
| Templates | Pre-built class plan templates matched to Notion moves | pages/Templates.tsx |
| Class Summary | Export/review class plan summary | pages/ClassSummary.tsx |
| Shared Combo | View shared combos via unique link | pages/SharedCombo.tsx |
| Navigation | App-wide nav bar with brand logo | components/Navigation.tsx |
| Logo | Official brand SVG with light/dark/purple variants | components/Logo.tsx |
| Moves Hook | Shared hook for fetching/caching moves from Supabase | hooks/useNotionMoves.ts |
| Supabase Client | Supabase-js client for external project | lib/supabaseClient.ts |
| Moves API | Data layer for public.pole_moves table | lib/movesApi.ts |
| Backend Routers | REST API endpoints (Notion sync, sharing) | backend/routers/ |
| Backend Services | Business logic (Notion sync, data mapping) | backend/services/ |

## Tech Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| UI Framework | React + shadcn/ui + Tailwind | Rapid development, consistent design system, accessible components |
| Data Source | External Supabase (public.pole_moves) via supabase-js | Direct client-side read with anon key; no backend proxy needed for moves |
| State Management | TanStack React Query | Automatic caching, refetching, loading states for API data |
| Routing | React Router v6 | Standard SPA routing with nested routes |
| Styling | Tailwind CSS + CSS variables | Brand theming via CSS variables, utility-first for rapid styling |
| Build Tool | Vite | Fast HMR, optimized builds, plugin ecosystem |
| Fonts | Barlow / DM Sans / DM Mono (Google Fonts) | Brand guide compliance, AAA ADA contrast |

## File Tree Plan
```
app/
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── routers/                 # API route handlers (notion, sharing)
│   ├── services/                # Business logic (notion_sync)
│   ├── schemas/                 # Pydantic models (notion.py)
│   ├── models/                  # SQLAlchemy models
│   ├── core/                    # Config, auth, database
│   └── dependencies/            # DI and auth middleware
└── frontend/
    ├── src/
    │   ├── pages/               # 8 page components (Index, Dashboard, Moves, Combo, AI, Templates, Summary, Shared)
    │   ├── components/          # Shared components (Navigation, Logo, MoveCard, ClassSection, UI)
    │   ├── hooks/               # Custom hooks (useNotionMoves)
    │   ├── lib/                 # API clients (notionApi)
    │   ├── data/                # Static data (classTemplates)
    │   ├── contexts/            # React contexts
    │   └── api/                 # API settings
    ├── index.css                # Global styles, CSS variables, font imports
    └── tailwind.config.ts       # Tailwind config with brand colors/fonts
```

## Implementation Guide
- All pages fetch moves via `useNotionMoves()` hook which calls `/api/v1/notion/moves`
- Brand colors defined as CSS variables in index.css and as Tailwind custom colors in tailwind.config.ts
- Logo component supports `variant` prop for different background contexts
- ComboBuilder uses HTML5 drag-and-drop with null guards for optional move properties
- SharedCombo page loads combo data via share ID from backend
- Blog routes exist for SEO content (vite-prerender-plugin handles prerendering)

