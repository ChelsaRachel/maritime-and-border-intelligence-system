# Task 01 — Wire Agent Integration Glue

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes  
**Depends on:** [`./00-agent-mgmt-enabled.md`](./00-agent-mgmt-enabled.md)

## Goal

Expose one FE-facing agent service without HTTP loopback to the same backend.

## Contract delivered

Typed run, status, output, cancellation, schedule, and escalation DTOs use frontend-facing camelCase while calling agent management directly.

## Files to touch

- `apps/be/router/agent.py` — FE routes
- `apps/be/service/agent.py` — direct management calls
- `apps/be/dto/agent.py` — shared DTOs

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — integration conventions

## TODOs

- [ ] Wire run/status/output/cancel/schedule operations.
- [ ] Add internal authorization and classification-aware audit.
- [ ] Test direct service calls and error shapes.

## Done when

Backend integration tests prove there is no self-HTTP loopback and FE-facing agent operations return typed results.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Foundation for every agent-backed feature.
