# Task 01 — Build Data Management Screen

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/01-ingestion-health-service.md`](../backend/01-ingestion-health-service.md)

## Goal

Deliver source health, freshness, mode, last success, affected modules, conflict/quarantine, fixture controls, and manual intelligence review.

## Files to touch

- `apps/fe/src/pages/DataManagement.*` — screen
- `apps/fe/src/features/data-management/` — panels/hooks/tests

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — frontend patterns

## TODOs

- [ ] Render source health and stale/outage timelines.
- [ ] Render conflict/quarantine and manual-input review.
- [ ] Gate fixture reset/source test by role.
- [ ] Test degraded/offline/stale/recovery states.

## Done when

Administrator can diagnose fixtures and other roles see only permitted read/review actions.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Provider secrets are never rendered.
