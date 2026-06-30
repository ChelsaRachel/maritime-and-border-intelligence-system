# MBIS Web

React 18 + TypeScript + Rspack frontend for the Maritime & Border Intelligence System.

The app loads only local static fixtures through `mock-client.ts`. The compatibility `api-client.ts` rejects all calls so no real API traffic can occur during Sprint 12.

```bash
npm ci
npm start
npm run typecheck
npm run build:prod
```

The bundler reads `MAPBOX_ACCESS_TOKEN` from `../../.env`. See the root [README](../../README.md) for accounts and scope.
