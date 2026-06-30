# Task 04 — Wire Route Skeletons

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`./01-tactical-shell.md`](./01-tactical-shell.md), [`./02-login-rbac-ui.md`](./02-login-rbac-ui.md)

## Goal

Wire every blueprint screen and cross-module navigation target before feature implementation.

## Files to touch

- `apps/fe/src/routes/` — route definitions and lazy screen shells
- `apps/fe/src/navigation/` — transitions and context payloads

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — routing conventions

## TODOs

- [ ] Add login, NMP, border, vessel, aircraft, anomaly, EWC, threat, reporting, data-management, administration routes.
- [ ] Add role metadata and NMP default redirect.
- [ ] Add typed cross-module context payloads.
- [ ] Test direct navigation, back navigation, and denied routes.

## Done when

Every screen route renders inside the tactical shell and all blueprint transitions resolve without dead links.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Feature screens remain placeholders until their owning sprint.
