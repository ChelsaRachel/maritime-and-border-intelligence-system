# Task 00 — Deliver Reporting and Approval Contract

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes

## Goal

Deliver F-M8-01–F-M8-07 contracts for reports, snapshots, blocks, versions, templates, approval, classification, distribution, and archive.

## Contract delivered

States DRAFT/REVIEW_SUPERVISOR/APPROVAL_PIMPINAN/DISTRIBUTED/ARCHIVED/REJECTED; immutable approved versions; clearance-aware recipients; delivery/download audit.

## Files to touch

- `apps/be/supabase/migrations/0017_reporting.sql` — domain
- `apps/be/service/reporting.py` — snapshot/version/approval/distribution
- `apps/be/router/reporting.py` and `dto/reporting.py` — operations/types

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — backend patterns

## TODOs

- [ ] Implement seven feature slices and report templates.
- [ ] Implement immutable snapshots/versions and approval state.
- [ ] Enforce classification, clearance, recipient, and download audit.
- [ ] Test regenerate, reject, retry, revoke, and stale-source branches.

## Done when

F-M8-01–F-M8-07 pass and approved report bytes/content cannot change without a new version.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Live source changes never mutate approved products.
