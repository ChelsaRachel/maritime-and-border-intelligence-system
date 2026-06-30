# Task 00 — Deliver Border Domain Contract

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes

## Goal

Deliver F-M2-01–F-M2-07 contracts and services for posts, informal routes, activities, risk points, incidents, immigration summaries, and timelines.

## Contract delivered

Versioned geometry, evidence, confidence, activity aggregates, incident states, role-aware edits, source freshness, and audit references.

## Files to touch

- `apps/be/supabase/migrations/0011_border.sql` — border domain
- `apps/be/dto/border.py` — types
- `apps/be/service/border.py` and `router/border.py` — operations

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — backend conventions

## TODOs

- [ ] Implement all seven feature slices with Indonesian fixtures.
- [ ] Implement route-version review and incident lifecycle.
- [ ] Enforce PII minimization and role gates.
- [ ] Test stale immigration and geometry audit.

## Done when

F-M2-01–F-M2-07 contract tests pass and unauthorized route edits fail and are audited.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Source geometry is never overwritten without a new version.
