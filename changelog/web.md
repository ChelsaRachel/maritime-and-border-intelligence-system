# Web Changelog

Tracks all frontend changes across sprints — screens added, components built, bugs fixed, design tokens applied.

Append-only. Newest entries at the top. Updated whenever a frontend task is created or completed.

---

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
