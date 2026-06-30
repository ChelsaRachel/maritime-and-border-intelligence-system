# Task 01 — Verify Autonomous Cross-Module Flow

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-frd-acceptance-matrix.md`](../backend/00-frd-acceptance-matrix.md)

## Goal

Prove fixture ingest → validation → anomaly → review → alert/escalation → threat assessment → report approval, including failures and retries.

## Files to touch

- `tests/e2e/agent_pipeline/` — cross-agent scenarios
- `docs/acceptance/agent-evidence/` — sanitized run evidence

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — run/validation evidence

## TODOs

- [ ] Run the happy path for maritime, border, and aircraft fixtures.
- [ ] Run stale source, unsupported claim, duplicate event, delivery failure, and DLQ cases.
- [ ] Verify evidence/provenance/classification through every hop.
- [ ] Verify monitor detects stalls and no human maintenance step is required.

## Done when

All scenarios finish deterministically with complete sanitized run/state/audit evidence.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

No classified fixture may enter logs or evidence bundles.
