# Task 02 — Verify Alert and SLA Workflows

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`./01-early-warning-center.md`](./01-early-warning-center.md)

## Goal

Test eight features, four severity levels, five states, FRD timers, duplicate/failure handling, role gates, and visual fidelity.

## Files to touch

- `apps/fe/tests/e2e/early-warning.*` — workflows
- `apps/fe/tests/visual/early-warning.*` — snapshots

## Skills to consult

- `apps/fe/skills/testing/SKILL.md` — after bootstrap

## TODOs

- [ ] Cover F-M6-01–F-M6-08.
- [ ] Cover acknowledge, overdue escalation, resolve, and briefing approval.
- [ ] Cover delivery retry/failure/idempotency.
- [ ] Compare snapshot to mockup and verify keyboard access.

## Done when

All FRD alert scenarios pass with authoritative timer and audit assertions.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Use controllable test clocks.
