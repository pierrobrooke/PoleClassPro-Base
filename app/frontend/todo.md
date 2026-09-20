# Pole Class Pro - Notion Integration & Drag Fix

## Design
- Use existing shadcn/ui design system with semantic CSS variables
- Consistent search/filter UI across pages using Input + Select components
- Drag-and-drop with visual feedback (opacity change, border highlight)

## Development Tasks
- [x] Create shared hook `useNotionMoves` for fetching and caching Notion moves
- [x] Rewrite ComboBuilder.tsx: Moves Library with search/filter from Notion, fix drag-and-drop
- [x] Update Dashboard.tsx (Class Builder): Replace hardcoded moves with Notion data
- [x] Update Templates.tsx: Match template moves by name from Notion data
- [x] Update AIGenerator.tsx: Add moves picker from Notion for AI context

## Files to Create/Modify
1. `/workspace/app/frontend/src/hooks/useNotionMoves.ts` (NEW) - Shared hook
2. `/workspace/app/frontend/src/pages/ComboBuilder.tsx` (REWRITE) - Notion integration + drag fix
3. `/workspace/app/frontend/src/pages/Dashboard.tsx` (MODIFY) - Use Notion data
4. `/workspace/app/frontend/src/pages/Templates.tsx` (MODIFY) - Use Notion data
5. `/workspace/app/frontend/src/pages/AIGenerator.tsx` (MODIFY) - Add moves picker