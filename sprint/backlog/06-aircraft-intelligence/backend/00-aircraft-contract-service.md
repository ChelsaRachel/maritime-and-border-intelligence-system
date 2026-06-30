# Task 00 — Deliver Aircraft Contract and Rules

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes

## Goal

Deliver F-M4-01–F-M4-07 contracts, observed/predicted tracks, flight-plan matching, route-deviation, unscheduled-flight, strategic area, and border logs.

## Contract delivered

Aircraft/flight/plan/track/zone/deviation/crossing types carry source time, observation status, confidence, evidence, and deterministic rule version.

## Files to touch

- `apps/be/supabase/migrations/0013_aircraft.sql` — domain
- `apps/be/service/aircraft.py` — rules/history/profile
- `apps/be/router/aircraft.py` and `dto/aircraft.py` — operations/types

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — backend patterns

## TODOs

- [ ] Implement all seven feature slices with QTR9832 fixtures.
- [ ] Implement flight-plan match/deviation and unscheduled rules.
- [ ] Separate observed and predicted track segments.
- [ ] Test source gaps, tolerance, zones, and authorization.

## Done when

F-M4-01–F-M4-07 pass and predicted-only segments cannot confirm a deviation.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Rules are deterministic and versioned.
