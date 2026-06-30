# Task 01 — Build Alert Automation and Notification

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-alert-contract-service.md`](../backend/00-alert-contract-service.md)

## Goal

Coordinate validated trigger intake, SLA escalation, briefing validation, and notification delivery.

## Files to touch

- `apps/agents/pm/skills/early_warning/` — orchestration
- `apps/agents/notifier/skills/early_warning/` — delivery
- `apps/agents/validator/skills/early_warning/` — briefing policy

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — agent extensions

## TODOs

- [ ] Trigger only from validated anomaly/authorized internal events.
- [ ] Implement severity routing and autonomous overdue escalation.
- [ ] Validate briefing completeness/classification.
- [ ] Test in-app success, external retry, failure, and duplicate events.

## Done when

The critical fixture follows the expected state/timer/recipient path with one delivery record per idempotency key.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

External channels remain feature-gated.
