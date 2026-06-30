# Task 01 — Build Reporter Workflow

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-report-contract-service.md`](../backend/00-report-contract-service.md)

## Goal

Generate daily, weekly, auto-brief, and custom narrative blocks from validated structured snapshots.

## Files to touch

- `apps/agents/reporter/` — reporting agent
- `apps/agents/reporter/skills/mbis_reports/` — product templates

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — structured-output/reporting agent

## TODOs

- [ ] Implement daily/weekly schedules and on-demand auto brief.
- [ ] Cite source snapshots, evidence, freshness, and limitations.
- [ ] Validate completeness/classification before approval.
- [ ] Test success, stale source, missing section, and retry/idempotency.

## Done when

Fixture daily/weekly/auto briefs match the required structure and contain no unsupported claim.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Reporting formats existing insight; it does not invent analysis.
