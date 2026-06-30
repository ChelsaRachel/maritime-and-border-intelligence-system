# Task 02 — Verify Aircraft Workflows

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`./01-aircraft-dashboard.md`](./01-aircraft-dashboard.md)

## Goal

Test all aircraft features, deviation/unscheduled branches, map projection, role gates, source failure, and visual fidelity.

## Files to touch

- `apps/fe/tests/e2e/aircraft.*` — workflows
- `apps/fe/tests/visual/aircraft.*` — snapshots

## Skills to consult

- `apps/fe/skills/testing/SKILL.md` — after bootstrap

## TODOs

- [ ] Cover F-M4-01–F-M4-07.
- [ ] Cover observed/predicted behavior and source outage.
- [ ] Cover role actions and cross-module context.
- [ ] Compare snapshot to mockup.

## Done when

Every F-M4 ID has automated coverage and all visual/map assertions pass.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Include keyboard operation for filters and alert list.
