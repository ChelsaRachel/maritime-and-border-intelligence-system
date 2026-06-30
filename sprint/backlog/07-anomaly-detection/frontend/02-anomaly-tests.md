# Task 02 — Verify Anomaly Coverage

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`./01-anomaly-workspace.md`](./01-anomaly-workspace.md)

## Goal

Verify ten rules, six features, state transitions, threshold audit, false positives, outage protection, map contract, and visual fidelity.

## Files to touch

- `apps/fe/tests/e2e/anomaly.*` — workflows
- `apps/fe/tests/visual/anomaly.*` — snapshots

## Skills to consult

- `apps/fe/skills/testing/SKILL.md` — after bootstrap

## TODOs

- [ ] Add positive and negative assertion for AN-01–AN-10.
- [ ] Cover F-M5-01–F-M5-06 and all allowed/denied state actions.
- [ ] Assert source outage suppression and stale disclosure.
- [ ] Compare snapshot to mockup.

## Done when

Automated traceability shows 10/10 anomaly rules and 6/6 feature IDs covered.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Include Auditor read-only assertions.
