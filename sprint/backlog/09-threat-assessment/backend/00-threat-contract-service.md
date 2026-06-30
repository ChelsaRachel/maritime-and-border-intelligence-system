# Task 00 — Deliver Threat Assessment Contract

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes

## Goal

Deliver F-M7-01–F-M7-07 contracts for deterministic scores, area risk, trends, vulnerability, comparison, forecast, entity profiles, and simulation versions.

## Contract delivered

Every score/result carries period, scope, factors, evidence, confidence, completeness, model/rule version, approval, and operational-vs-simulation label.

## Files to touch

- `apps/be/supabase/migrations/0016_threat.sql` — domain
- `apps/be/service/threat.py` — scoring/trend/simulation persistence
- `apps/be/router/threat.py` and `dto/threat.py` — operations/types

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — backend patterns

## TODOs

- [ ] Implement seven feature slices with versioned deterministic live scores.
- [ ] Implement 7/30/90-day trends and period comparison.
- [ ] Implement forecast/simulation result storage separate from live state.
- [ ] Test insufficient-data and model-version cases.

## Done when

F-M7-01–F-M7-07 pass and missing domain data never produces a false safe zero.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Operational scores are reproducible.
