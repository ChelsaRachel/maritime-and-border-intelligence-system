# Task 01 — Build Border Analysis Workflow

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-border-contract-service.md`](../backend/00-border-contract-service.md)

## Goal

Analyze validated crossing patterns and risk points, validate evidence, and trigger state/notification only when supported.

## Files to touch

- `apps/agents/anomaly_analyst/skills/border/` — analysis rules
- `apps/agents/validator/skills/border/` — evidence policy

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — agent extension

## TODOs

- [ ] Analyze unusual frequency, informal route, and geofence fixtures.
- [ ] Cite border activity/evidence IDs and source freshness.
- [ ] Route verified findings to incident state/notifier.
- [ ] Reject source-outage mass candidates.

## Done when

Positive/negative fixtures produce supported results with no unsupported PII or claims.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Deterministic rule output remains authoritative.
