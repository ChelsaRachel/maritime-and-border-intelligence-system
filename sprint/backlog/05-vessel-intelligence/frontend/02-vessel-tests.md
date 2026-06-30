# Task 02 — Verify Vessel Workflows

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`./01-vessel-workspace.md`](./01-vessel-workspace.md)

## Goal

Test all vessel features, risk reproducibility, conflict handling, watchlist, map contract, and visual fidelity.

## Files to touch

- `apps/fe/tests/e2e/vessel.*` — workflows
- `apps/fe/tests/visual/vessel.*` — snapshots

## Skills to consult

- `apps/fe/skills/testing/SKILL.md` — after bootstrap

## TODOs

- [ ] Assert each F-M3 feature and exact risk factor contributions.
- [ ] Test watchlist validation and role gates.
- [ ] Test identity conflict and stale registry.
- [ ] Compare the desktop snapshot to the mockup.

## Done when

Every F-M3 ID has automated coverage and cross-module context is preserved.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Include Auditor read-only coverage.
