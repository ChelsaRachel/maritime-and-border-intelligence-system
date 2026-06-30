# Task 02 — Scaffold Monitor

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-agent-mgmt-enabled.md`](../backend/00-agent-mgmt-enabled.md)

## Goal

Continuously detect stalled runs, unhealthy agents, exhausted retries, and later source-health failures.

## Files to touch

- `apps/agents/monitor/` — monitoring agent

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — scheduled tool-calling agent

## TODOs

- [ ] Scaffold and register the monitor.
- [ ] Add schedule and stall/retry/DLQ rules.
- [ ] Emit validated escalation events to notifier.
- [ ] Test healthy, stalled, and exhausted-retry fixtures.

## Done when

The schedule runs automatically and creates one deduplicated escalation for a stalled fixture run.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

No human log-review runbook.
