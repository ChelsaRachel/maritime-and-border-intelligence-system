# Task 02 — Verify Threat Workflows

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`./01-threat-assessment-center.md`](./01-threat-assessment-center.md)

## Goal

Test seven features, trends, scoring traceability, incomplete data, simulation isolation, role gates, maps, and visual fidelity.

## Files to touch

- `apps/fe/tests/e2e/threat.*` — workflows
- `apps/fe/tests/visual/threat.*` — snapshots

## Skills to consult

- `apps/fe/skills/testing/SKILL.md` — after bootstrap

## TODOs

- [ ] Cover F-M7-01–F-M7-07 and evidence drill-down.
- [ ] Cover incomplete/stale domain behavior.
- [ ] Assert simulation cannot update live score.
- [ ] Compare snapshot to mockup and test keyboard flow.

## Done when

All threat assertions pass and scores remain traceable to versioned inputs.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Test `insufficient data` distinctly from zero risk.
