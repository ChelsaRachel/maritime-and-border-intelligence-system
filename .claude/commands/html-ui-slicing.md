# /html-ui-slicing

Static HTML from the design system: **mockup packages** (`mockup/`) or **workspace spec PoC** (single file under `<cwd>/design/`).

Trigger the [`html-ui-slicing`](../skills/html-ui-slicing/SKILL.md) skill and run **Step 0** to choose Mode A vs Mode B.

## Usage

```
/html-ui-slicing
/html-ui-slicing slice dashboard ke mockup web-html
/html-ui-slicing Mode B: HTML satu file dari spec di <cwd>/sprint
```

## Action

1. Open `.claude/skills/html-ui-slicing/SKILL.md`.
2. Follow **Step 0**:
   - **Mode A** — mockup under `mockup/{web|mobile}-html/`, copy `css/`, Tailwind v4 browser CDN, `data-ui` rules.
   - **Mode B** — read `.claude/skills/html-ui-slicing/references/workspace-spec-poc.md` in full; spec/brief → one inlined HTML under `<cwd>/design/{slug}.html`, mock data only.

For Mode B, design references are **only** `<cwd>/design/**/{DESIGN.md,tailwind.css,variable.css}` (or `varaible.css`) — do not use `design-token.json` as a visual source.

## Next step

After HTML is ready, continue with `/bootstrap-project` or `/sprint-builder` as needed, or port into `apps/web*` per web stack rules.
