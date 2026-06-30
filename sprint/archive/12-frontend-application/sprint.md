# Sprint 12 — Frontend Application

**Status:** ✅ Completed  
**Created At:** 2026-06-29  
**Started At:** 2026-06-29  
**Completed At:** 2026-06-29

## Goal

Deliver the complete MBIS desktop frontend from the approved briefs and eight mockups using Mapbox and research-backed local static JSON only.

## Acceptance

All application routes are navigable after local demo login; every map uses Satellite Streets v12, Globe Projection, and tactical GeoJSON layers; the NMP fits one viewport; all screens are populated with credible data; build and frontend audits pass without any backend or server-side dependency.

## Scope

- [x] frontend
- [ ] backend — deferred/not started
- [ ] agent — deferred/not started
- [ ] mcp — deferred/not started
- [ ] mobile — out of v1 scope

## Foundation dependency

The React tactical boilerplate and root brief/design files. Cross-stack dependencies in Sprint 00–11 are deliberately replaced by local typed mock services during this sprint.

## Tasks

1. [`frontend/00-scaffold-orientation.md`](frontend/00-scaffold-orientation.md)
2. [`frontend/01-research-backed-mock-data.md`](frontend/01-research-backed-mock-data.md)
3. [`frontend/02-shell-login-rbac.md`](frontend/02-shell-login-rbac.md)
4. [`frontend/03-map-foundation-nmp.md`](frontend/03-map-foundation-nmp.md)
5. [`frontend/04-border-intelligence.md`](frontend/04-border-intelligence.md)
6. [`frontend/05-vessel-intelligence.md`](frontend/05-vessel-intelligence.md)
7. [`frontend/06-aircraft-intelligence.md`](frontend/06-aircraft-intelligence.md)
8. [`frontend/07-anomaly-detection.md`](frontend/07-anomaly-detection.md)
9. [`frontend/08-early-warning.md`](frontend/08-early-warning.md)
10. [`frontend/09-threat-assessment.md`](frontend/09-threat-assessment.md)
11. [`frontend/10-reporting-data-admin.md`](frontend/10-reporting-data-admin.md)
12. [`frontend/11-frontend-verification.md`](frontend/11-frontend-verification.md)

## FRD and design coverage

This sprint implements the frontend representation of F-M1-01 through F-A2-03 and references every image in `design/`. Server-enforced guarantees remain planned for later cross-stack sprints.

## Outcome

Delivered the complete MBIS frontend at `apps/web` with five local demo identities, role-aware navigation, ten application routes, four research-backed local fixture envelopes, Mapbox Satellite Streets v12/Globe/tactical layers, one-viewport NMP, and all eight mockup-derived operational workspaces. TypeScript and production Rspack build pass. No backend, database, Supabase, ingestion, agent, MCP, or server-side service was initialized.
