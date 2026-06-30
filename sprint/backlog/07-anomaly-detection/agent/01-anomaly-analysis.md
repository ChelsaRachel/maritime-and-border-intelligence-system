# Task 01 — Build Anomaly Analysis Pipeline

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-anomaly-contract-service.md`](../backend/00-anomaly-contract-service.md)

## Goal

Analyze rule candidates, generate explainable factors/correlation candidates, and submit them to validation.

## Files to touch

- `apps/agents/anomaly_analyst/` — domain agent
- `apps/agents/anomaly_analyst/server.py` — typed tool surface

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — specialist agent

## TODOs

- [ ] Scaffold/register the domain analysis agent.
- [ ] Consume only canonical validated inputs and rule candidates.
- [ ] Emit factors, evidence IDs, correlation, confidence, and limitations.
- [ ] Test all ten fixture types and source-outage rejection.

## Done when

Each rule fixture yields structured supported analysis and no unsupported candidate reaches downstream state.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

This agent cannot change thresholds.
