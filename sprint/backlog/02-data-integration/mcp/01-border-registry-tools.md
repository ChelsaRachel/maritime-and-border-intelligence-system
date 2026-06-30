# Task 01 — Build Border and Registry MCP Tools

**Stack:** mcp  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes  
**Depends on:** [`../backend/00-canonical-data-contract.md`](../backend/00-canonical-data-contract.md)

## Goal

Expose border/immigration and vessel/aircraft registry data through fixture/live tools.

## Contract delivered

Border tools return aggregate crossing/incident records; registry tools return versioned entity identity/ownership/operator records with validity and provenance.

## Files to touch

- `apps/mcp/border-feed/` — border server
- `apps/mcp/entity-registry/` — vessel/aircraft registry server
- `mcp-hub` registration — group entries

## Skills to consult

- `/home/chelsa/.agents/skills/mcp-builder/SKILL.md` — server standards

## TODOs

- [ ] Lock tool signatures and privacy-safe outputs.
- [ ] Implement fixtures, live boundaries, and health.
- [ ] Register and test identity conflicts and stale border data.

## Done when

Tools return canonical-compatible fixtures without exposing unapproved PII or secrets.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Executive consumers receive aggregates, not unnecessary personal data.
