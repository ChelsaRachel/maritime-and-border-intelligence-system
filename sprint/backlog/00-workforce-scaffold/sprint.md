# Sprint 00 — Workforce Scaffold

**Status:** 📋 Planned  
**Created At:** 2026-06-29  
**Started At:** -  
**Completed At:** -

## Goal

Establish the agent management plane and shared UI contract required by all autonomous MBIS workflows.

## Acceptance

Agent management health is available; scheduler, run registry, retries, DLQ, PM orchestrator, monitor, validator, notifier, backend glue, and frontend run renderer work against one contract.

## Scope

- [x] frontend
- [x] backend
- [x] agent
- [ ] mcp
- [ ] mobile

## Workforce members touched

`pm`, `monitor`, `validator`, `notifier`, `be_service`, `fe_shell`.

## Cross-stack dependencies

`backend/00-agent-mgmt-enabled.md` is the foundation. All agent registration and backend glue depend on it; frontend renderer is an independent foundation for later feature UIs.

## Notes

Prerequisite: application boilerplates exist. Domain agents are scaffolded only after this sprint completes.

## Outcome

Filled when archived.
