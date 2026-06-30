# Task 03 — Scaffold Validator

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-agent-mgmt-enabled.md`](../backend/00-agent-mgmt-enabled.md)

## Goal

Provide shared post-process validation for evidence, provenance, confidence, classification, and unsupported claims.

## Files to touch

- `apps/agents/validator/` — structured-output validation agent

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — structured-output agent

## TODOs

- [ ] Define verified/rejected/needs-review output.
- [ ] Add evidence, freshness, provenance, and classification policies.
- [ ] Register the agent and contract tests.

## Done when

The validator accepts a supported fixture, rejects an unsupported claim, and flags stale evidence.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Validation is a sandwich step, never a standalone source of facts.
