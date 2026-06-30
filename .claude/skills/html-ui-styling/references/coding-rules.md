# Coding Rules

## Tailwind Classes

- Use **only** semantic Tailwind classes from the active theme — never raw hex, never default Tailwind palette (`bg-blue-500`, `text-gray-900`), never arbitrary values like `bg-[#fff]`.
- Never use numeric scale classes (`primary-500`, `primary-300`, `text-gray-900`, `bg-blue-400`) — only alias names defined in `@theme` (e.g. `primary-base`, `primary-soft`, `primary-bold`).
- Token chain: `variable.css` base tokens → semantic tokens → `tailwind.css @theme` → Tailwind classes.
- Follow all DESIGN.md component contracts (card, sidebar, table, form, button, panel).

## Layout

- Dashboard shell: `h-12` topbar · `w-[220px]` sidebar · `p-6` main content.
- Responsive: flex/grid only, no fixed full-page widths. Stack to single column on mobile.

## Typography

- Use only custom scale classes: `text-display`, `text-h1`…`text-h6`, `text-p16`, `text-p14`, `text-p12`.
- Never use `text-sm`, `text-base`, `text-lg`, or arbitrary sizes.
- Sensor/coordinate values: `font-mono text-p12` or `font-mono text-p14`.

## Icons

> ⛔ **MANDATORY**: All icons MUST use Phosphor Icons — no other library permitted.

- Always: `<i class="ph ph-{icon-name}"></i>`
- Script required on every page: `<script src="https://unpkg.com/@phosphor-icons/web"></script>`
- Size via text class: `text-p12` (16px) · `text-p14` (20px) · `text-h6` (24px).
- Color via text class: `text-font-secondary` (default) · `text-primary-500` (active) · `text-font-disabled` (disabled).
- Weight variants when needed: `<i class="ph-bold ph-{icon-name}"></i>`

## Charts (ECharts)

> ⛔ **MANDATORY**: Any chart feature MUST use ECharts — no placeholders, no CSS fakes, no other library.

- Uncomment ECharts CDN whenever any chart is needed.
- Read `references/echarts.md` before writing any chart config — do NOT invent from memory.
- Initialize inside `DOMContentLoaded` using `getComputedStyle` to read CSS variable colors — never hardcode hex.
- Always add `window.addEventListener('resize', () => chart.resize())` per chart instance.
- Do NOT use ECharts on metric cards, status panels, or tables.
- **Always use `containLabel: true`** in `grid` config — `containLabel: false` causes axis labels to render outside the container and overflow the page.
- **Scatter / bubble charts**: always set `xAxis.max` slightly above the largest data value (e.g. `max: dataMax + 10`), add `clip: true` on series, and `overflow: hidden` on the chart div — bubble radius extends beyond the plot point and will overflow without these guards.
- **Multi-column grid with charts**: never use `%` columns alongside `gap` — use `fr` units (`3fr 2fr` not `60% 40%`). Percentage columns + CSS gap = total > 100% → right overflow.

## Scrollbars (Perfect Scrollbar)

> ⛔ **MANDATORY**: Any styled scrollable container MUST use Perfect Scrollbar — no `:-webkit-scrollbar` hacks.

- Container requirements: `position: relative` + `overflow-hidden` + explicit height.
- Uncomment Perfect Scrollbar CDN (CSS + JS) when any scrollable container is present.
- Inject theme override CSS block (uses `var(--color-*)` tokens) inside inline `<style>`.
- Call `ps.update()` after any dynamic content change inside a PS container.
- See `references/scrollbar.md` for full setup.

## Maps (Mapbox)

- Include Mapbox GL JS **only** when the feature explicitly needs a geographic map.
- Always use the project Mapbox public token (see `references/mapbox.md`).
- Map container must have explicit height: e.g., `style="height: 480px"`.
- See `references/mapbox.md` for full integration pattern.
