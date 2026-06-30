# Task 01 — Configure NMP Reporting and Orchestration

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-nmp-contract-service.md`](../backend/00-nmp-contract-service.md)

## Goal

Configure reporting aggregation and PM routing for NMP snapshots and critical drill-down context.

## Files to touch

- `apps/agents/reporter/skills/nmp/` — NMP reporting behavior
- `apps/agents/pm/skills/nmp/` — cross-module routing

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — role extension

## TODOs

- [ ] Produce structured COP summary from backend data only.
- [ ] Route vessel/aircraft/anomaly/alert context without losing timestamp.
- [ ] Validate stale-data disclosure and classification.

## Done when

A fixture COP summary cites source IDs/times and a critical drill-down routes to the correct module context.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

The agent does not invent missing map features.
