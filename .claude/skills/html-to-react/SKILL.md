---
name: html-to-react
description: Convert an HTML mockup file (from mockup/web-html/ or mockup/mobile-html/) into a fully structured React feature. Extracts HTML content, custom CSS classes, interactive JS functions, static mock data, third-party dependencies, ECharts configs, Mapbox configs and GeoJSON layers, CSS keyframe animations, marker/popup factories, and data-ui attribute mappings — then hands off to reactjs-ui-styling skill for final React/TypeScript implementation. Use when asked to "convert HTML to React", "implement from mockup", "slice HTML ke React", or "buatkan feature dari HTML".
---

# Skill — HTML to React Converter

Analyses an HTML mockup and extracts all artefacts needed before implementation. After extraction, hand off to **`reactjs-ui-styling`** skill (and sub-skills as needed) to build the final React/TypeScript feature.

---

## Step 1 — Read the HTML file

Read the full HTML file the user points to (e.g. `mockup/web-html/*.html`).

---

## Step 2 — Extract Artefacts

Run through each extraction category below and produce a structured summary. Skip categories not present in the file.

### 2.1 HTML Content (layout-stripped)
- Strip the outer layout shell: `<header data-ui="header">`, `<aside data-ui="sidebar">`, and any global wrapper already provided by `AppLayout`
- Keep only the **inner page/feature content** — the region that will live inside `{Name}Feature.tsx`
- Note every `id` attribute that JS or ECharts references

### 2.2 Custom CSS Classes → styled-components
**Every** class defined in `<style>` that is applied to any element in the HTML **must** become a named `styled-component`. No exceptions — even simple single-property classes.

For each class, note:
- Class name and CSS properties
- Whether it needs JS-driven dynamic props (typed styled-component)
- Whether it uses `var(--...)` CSS tokens (keep as-is inside styled-component)

> Inline `style=""` attributes from the HTML also become styled-components — never carry over raw `style={{}}` props.

### 2.3 Interactive JS Functions → React State/Hooks
List every JavaScript function and `setInterval` / `addEventListener`. Map each to a React pattern:

| HTML pattern | React equivalent |
|---|---|
| `function toggleX()` modifying classList | `useState` + conditional className |
| `setInterval(...)` | `useEffect` with cleanup |
| `function filterType()` iterating DOM | `useState` filter value + derived list |
| `function focusVessel(name)` calling map API | callback prop or zustand action |
| `function pbControl()` playback timer | `useRef` timer + `useState` slider value |
| `function toggleLayer()` + `map.setLayoutProperty` | Mapbox store action (see `reactjs-map`) |
| `function updatePlayback(v)` | controlled `<input type="range">` onChange |

### 2.4 Static Mock Data → TypeScript Types + Data File
Identify every hardcoded data array / config object. For each:
- Define a TypeScript interface
- Extract to `features/{name}/data/mock-{entity}.ts`
- Infer field names and value types from the data

### 2.5 Third-party Dependencies
Map each CDN library to its npm package:

| CDN | npm package | Notes |
|---|---|---|
| `mapbox-gl@3.3.0` | `mapbox-gl` | load `reactjs-map` |
| `echarts@5` | `echarts` | load `reactjs-chart` |
| `@phosphor-icons/web` | already in project | `<i class="ph ...">` — no change |
| `perfect-scrollbar` | use `react-perfect-scrollbar` (already in project) | `<PerfectScrollbar>` |

Flag any library not already in `apps/web/package.json` as **needs install**.

### 2.6 ECharts Chart Configs → Custom Hooks
For each `echarts.init(...)` block:
- Identify chart id and chart type (pie, gauge, scatter, line, etc.)
- Extract full `setOption({...})` config
- Map to `use{ChartName}Chart.ts` hook inside `features/{name}/hooks/`
- Note CSS vars resolved via `resolveColor()` — become `useChartColors()` hook inputs
- Load `reactjs-chart` skill when implementing

### 2.7 Mapbox Config + GeoJSON Layer Definitions
If a Mapbox map is present:
- Extract: `center`, `zoom`, `pitchWithRotate`, map style URLs (dark/light)
- Extract every `addSource` + `addLayer` block → `config/layers.config.ts`
- Extract vessel/marker data → `config/markers.config.ts`
- `createVesselMarker()` → React component rendered to DOM node for custom marker
- `popupHTML()` → `renderToStaticMarkup(<VesselPopup vessel={v} />)` pattern
- Access token → `VITE_MAPBOX_ACCESS_TOKEN` in `.env`
- Load `reactjs-map` skill when implementing

### 2.8 CSS Keyframe Animations
For every `@keyframes` block: define as `styled-components` `keyframes` helper and use inside the styled-component that references it. Never move keyframes to `index.css`.

### 2.9 `data-ui` Attribute Mapping → shadcn/ui Components
Map every `data-ui="..."` to its shadcn primitive:

| `data-ui` value | shadcn component |
|---|---|
| `button` | `Button` from `@/components/ui/button` |
| `badge` | `Badge` from `@/components/ui/badge` |
| `card` | `Card`, `CardContent` from `@/components/ui/card` |
| `input` | `Input` from `@/components/ui/input` |
| `sidebar` | Existing `AppSidebar` — do NOT create new sidebar |
| `header` | Existing `AppHeader` — do NOT recreate |

---

## Step 3 — Hand-off to reactjs-ui-styling

After extraction is complete:

1. Load `reactjs-ui-styling` skill
2. Load sub-skills as needed:
   - Map present → `reactjs-map`
   - Charts present → `reactjs-chart`
   - New feature → `reactjs-features`
3. Implement following the standard reactjs-ui-styling workflow (Steps 1–6)

**Constraints carried forward from extraction:**
- All styled-components from §2.2 must be implemented — no raw `style={{}}` props
- All mock data from §2.4 goes into `data/` — never inline in component
- All ECharts configs from §2.6 go into `hooks/` — never inline in JSX
- All Mapbox layer definitions from §2.7 go into `config/` — never inline in component
- Keyframe animations from §2.8 must use styled-components `keyframes` — never `index.css`, never inline

---

## Output Format

Present extraction results as a markdown report with one section per category **before writing any code**. Get user confirmation if any section is unclear, especially around mock data types and component split.
