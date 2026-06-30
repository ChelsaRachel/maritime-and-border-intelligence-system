# MBIS — Maritime & Border Intelligence System

Frontend-first implementation of a tactical maritime and border intelligence workspace. The current execution scope is the React application only; backend, database, Supabase, ingestion, agent, MCP, and server-side authentication remain deferred in the sprint backlog.

## What is implemented

- Tactical-neon login and role-aware browser session for Administrator, Pimpinan, Supervisor, Analis, and Auditor.
- Collapsed-by-default 72px navigation rail, expandable to 248px.
- National Maritime Picture as the post-login landing view, locked to one viewport with a full-workspace Mapbox background and glass overlays.
- Border, vessel, aircraft, anomaly, early warning, threat assessment, reporting, data management, and administration workspaces.
- Mapbox Satellite Streets v12, Globe Projection, and standard tactical GeoJSON overlays on every map.
- Research-backed synthetic fixture data loaded exclusively from `apps/web/public/data/`.

## Run locally

Prerequisites: Node.js 20 and the real Mapbox token in the root `.env`:

```env
MAPBOX_ACCESS_TOKEN=your_public_mapbox_token
```

```bash
cd apps/web
npm ci
npm start
```

Validation:

```bash
npm run typecheck
npm run build:prod
```

## Development accounts

| Role | Username | Password |
|---|---|---|
| Administrator | `Administrator` | `Administrator123` |
| Pimpinan | `Pimpinan` | `Pimpinan123` |
| Supervisor | `Supervisor` | `Supervisor123` |
| Analis | `Analis` | `Analis123` |
| Auditor | `Auditor` | `Auditor123` |

These are frontend demo identities, not production authentication. Production MFA, password storage, session enforcement, and immutable server audit remain planned.

## Project references

- Brief: [`brief/00_OVERVIEW.md`](brief/00_OVERVIEW.md)
- Active frontend sprint: [`sprint/active/12-frontend-application/sprint.md`](sprint/active/12-frontend-application/sprint.md)
- Fixture provenance: [`apps/web/public/data/SOURCES.md`](apps/web/public/data/SOURCES.md)
- Frontend source: [`apps/web/src/`](apps/web/src/)
