# Task 01 — Build Early Warning Center

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-alert-contract-service.md`](../backend/00-alert-contract-service.md), [`../../01-platform-shell-auth/frontend/03-mapbox-tactical-foundation.md`](../../01-platform-shell-auth/frontend/03-mapbox-tactical-foundation.md)

## Goal

Implement severity KPI, charts/maps, incident list/state, SLA matrix, actions, notification feed, briefing composer, and history.

## Files to touch

- `apps/fe/src/pages/EarlyWarningCenter.*` — screen
- `apps/fe/src/features/early-warning/` — feature components

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — frontend patterns

## TODOs

- [ ] Render every F-M6 feature and FRD severity/SLA state.
- [ ] Implement assignment, acknowledgment, escalation, resolution, and briefing.
- [ ] Display due/overdue, delivery, retry, source, and classification.
- [ ] Wire domain map/anomaly/report navigation.

## Done when

F-M6-01–F-M6-08 work with role gates and the screen matches the mockup.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Severity always includes label and icon.
