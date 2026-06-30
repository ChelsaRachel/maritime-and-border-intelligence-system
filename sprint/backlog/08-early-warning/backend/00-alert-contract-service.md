# Task 00 — Deliver Alert, Incident, and SLA Contract

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes

## Goal

Deliver F-M6-01–F-M6-08 contracts for alert generation/dedupe, severity, incident state, SLA, escalation, delivery, briefing, and history.

## Contract delivered

States BARU/DALAM_VERIFIKASI/DITINDAKLANJUTI/DIESKALASI/DISELESAIKAN; severity-specific timers; idempotency; recipient/classification; delivery attempts; immutable transitions.

## Files to touch

- `apps/be/supabase/migrations/0015_early_warning.sql` — domain
- `apps/be/service/early_warning.py` — state/SLA/dedupe
- `apps/be/router/early_warning.py` and `dto/early_warning.py` — operations/types

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — backend patterns

## TODOs

- [ ] Implement eight features and FRD 15m/1h/4h/24h response matrix.
- [ ] Implement dedupe, timers, escalation, briefing, and history.
- [ ] Enforce classification/recipient and role transitions.
- [ ] Test clock, retry, duplicate, and failure cases.

## Done when

F-M6-01–F-M6-08 pass and an unacknowledged critical fixture escalates once at the correct deadline.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Use an authoritative clock and idempotency keys.
