# Task 01 — Build Data Collector Agent

**Stack:** agent  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-canonical-data-contract.md`](../backend/00-canonical-data-contract.md), [`../mcp/00-ais-adsb-tools.md`](../mcp/00-ais-adsb-tools.md), [`../mcp/01-border-registry-tools.md`](../mcp/01-border-registry-tools.md), [`../mcp/02-osint-internal-tools.md`](../mcp/02-osint-internal-tools.md)

## Goal

Schedule and invoke provider MCP tools with cursors, retries, idempotency, and source-level isolation.

## Files to touch

- `apps/agents/data_collector/` — collection agent

## Skills to consult

- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — tool-calling agent

## TODOs

- [ ] Scaffold/register collector and schedules.
- [ ] Implement per-source cursor, retry, and idempotency.
- [ ] Emit raw batch or source-health event.
- [ ] Test one source failure without blocking other sources.

## Done when

Scheduled fixture collection writes source-attributed batches and isolates an injected provider outage.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Collection never invents missing data.
