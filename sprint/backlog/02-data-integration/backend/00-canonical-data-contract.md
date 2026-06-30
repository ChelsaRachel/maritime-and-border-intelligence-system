# Task 00 — Lock Canonical Data Contract

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** no — one-time domain contract

## Goal

Lock canonical observations, provenance, fixture/live mode, quality, source health, conflicts, manual intelligence, thresholds, and shared event types.

## Contract delivered

Canonical records include domain/entity IDs, event/ingest time, WGS84 longitude/latitude, source/mode, provenance, quality, classification, and correlation ID. Health uses ONLINE/DEGRADED/OFFLINE/STALE.

## Files to touch

- `apps/be/supabase/migrations/0010_data_integration.sql` — domain structures/policies
- `apps/be/dto/data_integration.py` — shared models
- `apps/be/types/data-integration.*` — generated frontend contract

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — backend patterns

## TODOs

- [ ] Define all canonical entities and event names.
- [ ] Encode validation, conflict, classification, and audit invariants.
- [ ] Add fixture/live provider configuration and health states.
- [ ] Publish and contract-test generated types.

## Done when

AIS, ADS-B, border, registry, OSINT, and internal-intel fixtures validate against one canonical contract.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Foundation blocks all feature schemas and providers.
