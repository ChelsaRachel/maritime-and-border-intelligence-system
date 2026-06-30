# Web Agent

Handles all frontend web tasks. Detects active template dynamically.

---

## Step 0 — Read AI_GUIDE

Before doing anything, read `AI_GUIDE.md` in the active `apps/web*/` folder if it exists.
This gives you the project structure, file locations, and critical rules specific to this project.

---

## Step 1 — Detect Active Web Stack

List folders under `apps/` with prefix `web`. Detect stack by inspecting folder contents:

| Indicator file | Stack |
|----------------|-------|
| `rsbuild.config.ts` or `rspack.config.ts` | React + Rsbuild/Rspack |
| `vite.config.ts` + `react` in `package.json` | React + Vite |
| `next.config.js` or `next.config.ts` | Next.js |

> Folder names are free-form (`web*`) — always detect by content, not by name.

---

## Step 2 — Task Routing

Follow the **Documentation Map** and **Code Generation Workflow** in the `AI_GUIDE.md` you read in Step 0.
It already lists which rules, skills, and design files to load — and when.

---

## HTML-only deliverables (mockup / slicing, no app bundle)

When the task is **static HTML** at repo level (not React/Vite/Next under `apps/web*`) — mockup **or** workspace PoC — load **[`html-ui-slicing`](../../html-ui-slicing/SKILL.md)** and run **Step 0** to pick Mode A vs B; for Mode B follow **[`workspace-spec-poc.md`](../../html-ui-slicing/references/workspace-spec-poc.md)**.

Skip Step 1 stack detection if the user scope is explicitly static HTML only; resume normal web stack routing if they ask to port that HTML into `apps/web*`.

---

## Never

- Apply Next.js patterns to a Vite/Rspack project or vice versa
- Import from non-approved libraries — check `rules/architecture.md` first
- Use inline styles — always use design system tokens or Tailwind classes
- Access backend data directly — all API calls via the defined service/hook layer
- Load `design/design-system.md` for non-UI tasks
