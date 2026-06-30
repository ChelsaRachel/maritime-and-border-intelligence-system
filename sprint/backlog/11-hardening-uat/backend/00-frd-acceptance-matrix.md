# Task 00 — Lock FRD Acceptance Matrix

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** no — one-time release evidence contract

## Goal

Create an executable traceability matrix for 66 feature IDs, 10 anomaly rules, eight mockups, NFRs, and all absolute user rules.

## Contract delivered

Each requirement maps to owning brief, sprint task, automated/manual test, expected evidence, status, and blocker; missing/duplicate IDs fail CI.

## Files to touch

- `tests/acceptance/traceability.*` — machine-readable matrix/check
- `docs/acceptance/MBIS_UAT_MATRIX.md` — human evidence index

## Skills to consult

- `/home/chelsa/.agents/skills/sprint-builder/SKILL.md` — traceability and closure rules

## TODOs

- [ ] Map 66 feature IDs and 10 anomaly rules.
- [ ] Map eight mockups and eight absolute rule groups.
- [ ] Add CI checks for missing/duplicate/orphan requirements.
- [ ] Define evidence owners and release blocker severity.

## Done when

CI reports exactly 66 features, 10 anomaly rules, 8 mockups, and no orphan acceptance item.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Foundation for all final evidence tasks.
