# Task 00 — Deliver Vessel Contract and Risk Service

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes

## Goal

Deliver F-M3-01–F-M3-09 domain contracts and a reproducible 25/25/20/20/10 risk calculator.

## Contract delivered

Vessel identity/version, voyage, port, flag, ownership, AIS gap, evidence, relationship, incident, risk factor/version, completeness, and watchlist event types.

## Files to touch

- `apps/be/supabase/migrations/0012_vessel.sql` — vessel domain
- `apps/be/service/vessel.py` — profile/search/risk/watchlist
- `apps/be/router/vessel.py` and `dto/vessel.py` — operations/types

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — backend conventions

## TODOs

- [ ] Implement all nine feature slices and fixture vessel data.
- [ ] Implement exact weighted score with version/completeness.
- [ ] Implement identity conflicts and validated watchlist events.
- [ ] Add formula, state, and authorization tests.

## Done when

F-M3-01–F-M3-09 pass and the same factor inputs always reproduce the expected score.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Missing factors reduce completeness; they are not treated as safe zeros.
