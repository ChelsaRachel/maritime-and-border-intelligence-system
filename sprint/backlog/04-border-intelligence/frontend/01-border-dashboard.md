# Task 01 — Build Border Intelligence Dashboard

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-border-contract-service.md`](../backend/00-border-contract-service.md), [`../../01-platform-shell-auth/frontend/03-mapbox-tactical-foundation.md`](../../01-platform-shell-auth/frontend/03-mapbox-tactical-foundation.md)

## Goal

Implement the border map, feed, KPI, impact, timeline, geofence, immigration, and analysis-tool layout from the mockup.

## Files to touch

- `apps/fe/src/pages/BorderIntelligence.*` — screen
- `apps/fe/src/features/border/` — map/lists/forms/tests

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — frontend patterns

## TODOs

- [ ] Render all F-M2 map layers and fixture sectors.
- [ ] Render feed, KPI, timeline, immigration, health, and tools.
- [ ] Implement audited route editing/review and evidence upload.
- [ ] Wire anomaly/EWC/reporting navigation.

## Done when

F-M2-01–F-M2-07 work with role-specific actions and the screen matches the mockup language/density.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

All border maps use the shared globe contract.
