# Task 02 — Verify Roles and Cross-Navigation

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`./01-visual-accessibility-uat.md`](./01-visual-accessibility-uat.md)

## Goal

Verify five accounts, all role permissions, session/MFA states, and context-preserving navigation among every module.

## Files to touch

- `apps/fe/tests/e2e/roles.*` — role matrix
- `apps/fe/tests/e2e/cross-navigation.*` — module transitions

## Skills to consult

- `apps/fe/skills/testing/SKILL.md` — after bootstrap

## TODOs

- [ ] Test valid/invalid login, production MFA, timeout, logout, and new-session collapsed sidebar.
- [ ] Test every allowed/denied role action and Auditor read-only behavior.
- [ ] Test map/entity/anomaly/alert/threat/report context transitions and back navigation.
- [ ] Attach evidence to the acceptance matrix.

## Done when

No route/action bypass exists and every cross-module transition preserves IDs, filters, area, period, and timestamp.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Backend denial is authoritative even when UI hides an action.
