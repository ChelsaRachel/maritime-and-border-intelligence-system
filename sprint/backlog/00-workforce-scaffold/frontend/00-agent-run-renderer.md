# Task 00 — Build Agent Run Renderer

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes

## Goal

Provide typed run controls and a safe renderer for progress, structured output, validation, failure, and escalation.

## Contract delivered

Frontend types cover run ID, agent role, status, progress, output blocks, evidence references, validation state, error, and escalation.

## Files to touch

- `apps/fe/types/agent.d.ts` — shared types
- `apps/fe/hooks/useAgentRun.*` — lifecycle hook
- `apps/fe/components/agent/AgentOutputRenderer.*` — safe renderer

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — frontend orientation

## TODOs

- [ ] Implement typed lifecycle and cancellation.
- [ ] Render progress, evidence, validation, failure, and escalation states.
- [ ] Prevent raw HTML/secret rendering.
- [ ] Add component and hook tests.

## Done when

Fixture runs render every state accessibly without leaking untrusted markup or secrets.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Foundation for feature-specific agent UIs.
