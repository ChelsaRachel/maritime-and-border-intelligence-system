# Task 02 — Build Data Processor Agent

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`./01-data-collector.md`](./01-data-collector.md), [`../backend/01-ingestion-health-service.md`](../backend/01-ingestion-health-service.md)

## Goal

Normalize, validate, deduplicate, enrich, quarantine, and publish canonical domain events.

## Files to touch

- `apps/agents/data_processor/` — processing agent

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — structured-output agent

## TODOs

- [ ] Implement domain-specific normalization and quality output.
- [ ] Link registry/area references and preserve provenance.
- [ ] Quarantine conflicts and reject invalid coordinates/times.
- [ ] Test valid, duplicate, conflict, malformed, and stale fixtures.

## Done when

Canonical fixtures are reproducible and every rejected record has an auditable reason.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

No analysis before validation.
