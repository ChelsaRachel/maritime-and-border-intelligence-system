# Task 01 — Implement Ingestion and Source Health

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`./00-canonical-data-contract.md`](./00-canonical-data-contract.md)

## Goal

Persist canonical observations, quarantine invalid/conflicting records, expose source health, and propagate stale state.

## Files to touch

- `apps/be/service/data_integration.py` — ingest/health/conflict logic
- `apps/be/router/data_integration.py` — data-management operations
- `apps/be/tests/data_integration/` — contract and failure tests

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — service conventions

## TODOs

- [ ] Implement idempotent ingest and conflict quarantine.
- [ ] Implement health/freshness and affected-module propagation.
- [ ] Implement manual-intelligence review and threshold version operations.
- [ ] Test outage, duplicate, invalid, stale, recovery, and audit scenarios.

## Done when

Fixture records flow end-to-end and provider outage produces one health transition without mass anomaly events.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Consumers always see source time and freshness.
