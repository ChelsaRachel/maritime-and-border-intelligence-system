# Task 01 — Build Threat Analyst and Simulation

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-threat-contract-service.md`](../backend/00-threat-contract-service.md)

## Goal

Build structured cross-domain threat analysis and clearly labeled scenario simulation.

## Files to touch

- `apps/agents/threat_analyst/` — specialist agent
- `apps/agents/threat_analyst/server.py` — analysis/simulation tool surface

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — structured-output agent

## TODOs

- [ ] Scaffold/register threat analyst.
- [ ] Generate drivers/trend/entity insight with evidence IDs.
- [ ] Generate scenario output with assumptions, horizon, version, confidence, and simulation label.
- [ ] Validate output before Pimpinan/reporting consumption.

## Done when

Fixture assessment and simulation are evidence-backed and simulation cannot mutate live threat state.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Agents explain; deterministic service owns live score.
