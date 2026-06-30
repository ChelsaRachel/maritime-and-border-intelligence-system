# Task 00 — Deliver NMP Aggregation Contract

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes

## Goal

Deliver typed NMP aggregation for F-M1-01–F-M1-08: entities, layers, chokepoints, weather, KPI, fusion health, and 24-hour replay frames.

## Contract delivered

Responses preserve entity/source IDs, event time, freshness, severity, GeoJSON-compatible geometry, layer metadata, and replay cursors.

## Files to touch

- `apps/be/dto/nmp.py` — contracts
- `apps/be/service/nmp.py` — aggregation/replay
- `apps/be/router/nmp.py` — read operations

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — backend patterns

## TODOs

- [ ] Implement all eight feature contracts with fixture data.
- [ ] Add role-safe detail and source freshness.
- [ ] Add replay cursors for 1x/5x/10x.
- [ ] Test stale/partial-source aggregation.

## Done when

Contract tests cover F-M1-01–F-M1-08 and a source outage preserves a labeled partial COP.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

No risk scoring is performed here.
