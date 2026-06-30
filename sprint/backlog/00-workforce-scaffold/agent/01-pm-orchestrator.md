# Task 01 — Scaffold PM Orchestrator

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-agent-mgmt-enabled.md`](../backend/00-agent-mgmt-enabled.md)

## Goal

Register `pm` as the system-level orchestrator for routing, dependency checks, and escalation.

## Files to touch

- `apps/agents/pm/` — standalone agent project
- `apps/agents/pm/.env` — hub group and internal token

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — scaffold and registration

## TODOs

- [ ] Scaffold the tool-calling orchestrator variant.
- [ ] Configure `MCP_HUB_GROUP=maritime_border_intelligence`.
- [ ] Register capabilities, escalation target, and health.
- [ ] Test routing and a failed dependency escalation.

## Done when

The registered PM agent routes a fixture request and records a complete run/escalation trace.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

PM never bypasses role or classification policy.
