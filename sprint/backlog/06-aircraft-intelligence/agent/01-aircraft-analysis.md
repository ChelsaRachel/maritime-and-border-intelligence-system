# Task 01 — Build Aircraft Analysis and Briefing

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-aircraft-contract-service.md`](../backend/00-aircraft-contract-service.md)

## Goal

Explain validated route/schedule/sensitive-area findings and produce report-ready aircraft context.

## Files to touch

- `apps/agents/anomaly_analyst/skills/aircraft/` — analysis
- `apps/agents/validator/skills/aircraft/` — evidence policy
- `apps/agents/reporter/skills/aircraft/` — briefing

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — role extension

## TODOs

- [ ] Explain supported suspicion factors with evidence IDs.
- [ ] Flag fragmented/predicted-only data.
- [ ] Route only validated findings to notifier/EWC.
- [ ] Produce a structured aircraft brief.

## Done when

Positive and source-gap fixtures produce correct verified/needs-review outcomes.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Agent output cannot rewrite track history.
