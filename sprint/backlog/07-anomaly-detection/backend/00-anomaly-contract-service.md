# Task 00 — Deliver Anomaly Rules and State Contract

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes

## Goal

Deliver AN-01–AN-10 and F-M5-01–F-M5-06 contracts for deterministic rules, evidence, factors, correlation, thresholds, review, and false positives.

## Contract delivered

Anomaly types, severity/state, evidence/provenance, factor contribution, rule/threshold version, investigation, correlation, and false-positive feedback with audited transitions.

## Files to touch

- `apps/be/supabase/migrations/0014_anomaly.sql` — domain
- `apps/be/service/anomaly.py` — rules/state/correlation
- `apps/be/router/anomaly.py` and `dto/anomaly.py` — operations/types

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — backend patterns

## TODOs

- [ ] Implement ten versioned deterministic rule evaluators.
- [ ] Implement review, investigation, false-positive, and correlation state.
- [ ] Guard threshold changes with role/reason/version.
- [ ] Add positive/negative/outage fixtures for every rule.

## Done when

All ten rules and six features pass, and source outages produce health events rather than mass candidates.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Original evidence and detections are immutable.
