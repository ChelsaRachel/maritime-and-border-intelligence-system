# Web Changelog

Tracks all frontend changes across sprints — screens added, components built, bugs fixed, design tokens applied.

Append-only. Newest entries at the top. Updated whenever a frontend task is created or completed.

---

### 2026-06-30 · NMP replay discontinuity guard · COMPLETE

**Event:** Removed unrealistic closed-loop route geometry around Natuna
**Files:** `apps/web/src/features/mbis/hooks/useNmpReplay.ts`
> Split replay-derived vessel and aircraft route/trail geometry at implausible geographic jumps before publishing it to native Mapbox GeoJSON sources. This removes end-to-start track-wrap diamonds while preserving replay movement, short trails, route layers, Satellite Streets v12, and globe projection.

### 2026-06-30 · NMP native route hierarchy tuning · COMPLETE

**Event:** Mapbox operational route visibility and visual-density correction
**Files:** `apps/web/src/features/mbis/components/NmpMapBridge.tsx`, `apps/web/src/features/mbis/config/nmp-layers.config.ts`, `apps/web/src/config/map/layer-paint.config.ts`, `apps/web/public/data/nmp-geography.json`
> Corrected native Mapbox layer registration, introduced ordered glow/casing/core passes and native SDF direction arrows, then tuned line weight, glow opacity, trail sampling, and icon density against the NMP reference. Satellite Streets v12, globe projection, replay source updates, and frontend-only scope remain unchanged.

### 2026-06-30 · NMP neon operational layers · COMPLETE

**Event:** Tactical operational layer enhancement
**Files:** `apps/web/src/features/mbis/`, `apps/web/src/config/map/layer-paint.config.ts`, `apps/web/public/data/nmp-*.json`
> Strengthened neon AIS/ADS-B symbols, split vessel and aircraft route/trail families for exact toggle behavior, expanded Indonesia-focused corridors to 33, added animated alert/sensor pulses, four primary choke-point cards, tactical alert popup evidence, and a replay-aware no-WebGL vector fallback. Frontend-only scope remained intact.

### 2026-06-30 · National Maritime Picture tactical visual and replay · COMPLETE

**Event:** Frontend NMP rebuilt from the operational reference
**Files:** `apps/web/src/features/mbis/`, `apps/web/public/data/nmp-*.json`, `apps/web/src/styles/components.css`, `apps/web/public/data/SOURCES.md`
> Added a persistent Satellite Streets v12/Globe tactical map bridge, neon layer registry, moving vessel and aircraft tracks, 24-hour replay controls, alert-aware heatmap, ALKI/EEZ/watch-area overlays, functional panels, and deterministic research-backed local fixtures. Backend, agents, MCP, Supabase, database, and live APIs remain untouched.

### 2026-06-30 · Security cleanup · MAPBOX TOKEN DOCUMENTATION

**Event:** Secret reference cleanup  
**Files:** `.claude/skills/**/*.md`, `apps/web/skills/**/*.md`
> Removed every literal Mapbox token from Markdown, replaced it with an environment-only placeholder, tightened `.env` permissions, and removed the ignored generated build that contained the browser-injected token. Root `.env` is now the only stored value in the workspace.

### 2026-06-29 · [Sprint 12 — frontend-application](../sprint/archive/12-frontend-application/sprint.md) · COMPLETE

**Event:** Frontend application completed  
**Files:** `apps/web/src/`, `apps/web/public/data/`, `apps/web/index.html`, `apps/web/rspack.dev.ts`, `apps/web/rspack.prod.ts`
> Delivered tactical login/RBAC, collapsed shell, ten populated workspaces, local research-backed fixtures, Satellite Streets v12 Globe maps, tactical overlays, visual inspection, clean TypeScript, and a successful production build.

<!-- ENTRY FORMAT:
### YYYY-MM-DD · [Sprint NN — slug](../sprint/active/NN-slug/sprint.md) · Task: [task title](../sprint/.../frontend/NN-task.md) · STATUS

**Event:** Task created | Task completed | Files modified
**Files:** `path/to/file.tsx`, `path/to/style.css`
> One-line summary of what changed or was delivered.
-->
