# Task 04 — Scaffold Notifier

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-agent-mgmt-enabled.md`](../backend/00-agent-mgmt-enabled.md)

## Goal

Deliver deduplicated in-app notifications and feature-gated external deliveries from validated events.

## Files to touch

- `apps/agents/notifier/` — notification agent and delivery adapters

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — tool-calling notifier

## TODOs

- [ ] Define recipient, classification, idempotency, retry, and delivery outputs.
- [ ] Implement in-app delivery and disabled-by-default external adapters.
- [ ] Register and test success, retry, and permanent failure.

## Done when

Duplicate validated events produce one notification and failures produce auditable delivery states.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Raw events cannot trigger external delivery.
