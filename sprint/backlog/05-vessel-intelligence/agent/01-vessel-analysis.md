# Task 01 — Build Vessel Analysis and Briefing

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-vessel-contract-service.md`](../backend/00-vessel-contract-service.md)

## Goal

Explain voyage/gap/relationship patterns, validate findings, notify watchlist events, and prepare a report-ready vessel brief.

## Files to touch

- `apps/agents/anomaly_analyst/skills/vessel/` — analysis
- `apps/agents/reporter/skills/vessel/` — vessel brief
- `apps/agents/validator/skills/vessel/` — evidence validation

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — role extension

## TODOs

- [ ] Cite factors, evidence, source times, and risk version.
- [ ] Detect identity conflict and avoid unsupported merge.
- [ ] Send only validated watchlist events to notifier.
- [ ] Produce a structured vessel brief fixture.

## Done when

Analysis explains but never changes the deterministic score, and unsupported evidence is flagged.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

No free-form risk override.
