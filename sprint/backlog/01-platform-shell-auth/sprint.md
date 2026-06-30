# Sprint 01 — Platform Shell & Auth

**Status:** 📋 Planned  
**Created At:** 2026-06-29  
**Started At:** -  
**Completed At:** -

## Goal

Deliver the recognizable MBIS tactical shell, secure login, strict role access, immutable audit, and shared Mapbox foundation.

## Acceptance

All five demo accounts land on NMP with the correct access; production mode requires MFA; logo, favicon, fonts, neon tokens, collapsed sidebar, routes, and common map contract match the blueprint.

## Scope

- [x] frontend
- [x] backend
- [ ] agent
- [ ] mcp
- [ ] mobile

## Workforce members touched

`be_service`, `fe_shell`.

## Cross-stack dependencies

`backend/00-auth-contract.md` locks roles, sessions, MFA, and audit types before login/UI wiring. `frontend/00-port-design-tokens.md` locks the design contract.

## Notes

Root `.env.example` must contain exactly `MAPBOX_ACCESS_TOKEN=xxx`.

## Outcome

Filled when archived.
