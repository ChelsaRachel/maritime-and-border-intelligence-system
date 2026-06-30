# Task 02 — Build OSINT and Internal-Intelligence MCP Tools

**Stack:** mcp  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes  
**Depends on:** [`../backend/00-canonical-data-contract.md`](../backend/00-canonical-data-contract.md)

## Goal

Expose source-attributed OSINT retrieval and authorized internal-intelligence lookup/upload tools.

## Contract delivered

Outputs always carry source/reference, publish/observation time, classification, checksum/evidence reference, and access decision.

## Files to touch

- `apps/mcp/osint-feed/` — OSINT server
- `apps/mcp/internal-intelligence/` — classified internal tool server
- `mcp-hub` registration — group entries

## Skills to consult

- `/home/chelsa/.agents/skills/mcp-builder/SKILL.md` — secure MCP patterns

## TODOs

- [ ] Define retrieval/upload signatures and access errors.
- [ ] Implement fixtures and security boundaries.
- [ ] Add provenance, checksum, classification, and redaction tests.
- [ ] Register tools with least-privilege visibility.

## Done when

Authorized fixtures work and unauthorized/classification-mismatched calls fail closed and are audited.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Never put classified content in ordinary agent logs.
