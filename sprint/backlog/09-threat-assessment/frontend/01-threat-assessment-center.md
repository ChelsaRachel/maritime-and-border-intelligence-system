# Task 01 — Build Threat Assessment Center

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-threat-contract-service.md`](../backend/00-threat-contract-service.md), [`../agent/01-threat-analysis.md`](../agent/01-threat-analysis.md), [`../../01-platform-shell-auth/frontend/03-mapbox-tactical-foundation.md`](../../01-platform-shell-auth/frontend/03-mapbox-tactical-foundation.md)

## Goal

Implement domain/national scores, risk and vulnerability maps, trends, comparison, drivers, entities, forecast, confidence, and simulation.

## Files to touch

- `apps/fe/src/pages/ThreatAssessment.*` — screen
- `apps/fe/src/features/threat/` — components/tests

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — frontend patterns

## TODOs

- [ ] Render all F-M7 feature areas from the mockup.
- [ ] Show factors, evidence, completeness, confidence, and versions.
- [ ] Implement 7/30/90-day and period comparisons.
- [ ] Label simulation distinctly and wire entity/map/report navigation.

## Done when

F-M7-01–F-M7-07 work with fixtures and operational/simulation states cannot be confused.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

All threat maps use the shared globe contract.
