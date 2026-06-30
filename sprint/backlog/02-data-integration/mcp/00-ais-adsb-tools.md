# Task 00 — Build AIS and ADS-B MCP Tools

**Stack:** mcp  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes  
**Depends on:** [`../backend/00-canonical-data-contract.md`](../backend/00-canonical-data-contract.md)

## Goal

Expose typed fixture/live AIS and ADS-B collection tools through the project MCP hub.

## Contract delivered

Tools return bounded batches/cursors of source records, source timestamp, provider mode, provenance, and health; no domain analysis occurs in MCP.

## Files to touch

- `apps/mcp/ais-feed/` — AIS MCP server
- `apps/mcp/adsb-feed/` — ADS-B MCP server
- `mcp-hub` registration — project group entries

## Skills to consult

- `/home/chelsa/.agents/skills/mcp-builder/SKILL.md` — server and hub registration

## TODOs

- [ ] Lock tool signatures and error shapes.
- [ ] Implement synthetic Indonesian fixtures and live adapter boundaries.
- [ ] Register both servers in `maritime_border_intelligence`.
- [ ] Test pagination, outage, malformed record, and secret redaction.

## Done when

Both MCP servers return canonical-compatible fixtures and typed provider errors through the hub.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Live credentials are optional rollout inputs.
