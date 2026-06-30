# Task 01 — Build Full-Map National COP

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-nmp-contract-service.md`](../backend/00-nmp-contract-service.md), [`../../01-platform-shell-auth/frontend/03-mapbox-tactical-foundation.md`](../../01-platform-shell-auth/frontend/03-mapbox-tactical-foundation.md)

## Goal

Implement the NMP landing screen as a viewport-locked map with glass overlay panels.

## Files to touch

- `apps/fe/src/pages/NationalMaritimePicture.*` — screen
- `apps/fe/src/features/nmp/` — layers, widgets, controls

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — frontend implementation

## TODOs

- [ ] Render all F-M1 layers and search on the shared globe map.
- [ ] Overlay weather, fusion, KPI, alert, legend, and replay panels.
- [ ] Implement entity/chokepoint/module navigation.
- [ ] Implement stale/error/empty states without losing the map.

## Done when

The page visually matches the mockup and all F-M1-01–F-M1-08 interactions work with fixtures.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Map is the background, never a contained card.
