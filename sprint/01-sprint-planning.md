# MBIS Sprint Planning

Project slug: `maritime_border_intelligence`  
Blueprint: [`../brief/00_OVERVIEW.md`](../brief/00_OVERVIEW.md)  
Rule: only one sprint may be active at a time.

## Frontend-first execution override — 2026-06-29

Sprint 12 was executed strictly frontend-only and is now archived; there is no active sprint. Every backend, agent, MCP, mobile, database, Supabase, ingestion, and server-side task in Sprint 00–11 remains `📋 Planned` and was not used as a dependency for the local-fixture frontend. Production integration contracts remain documented for later execution.

## Sprint registry

| Sprint | Status | Scope | Location |
|---|---|---|---|
| 00 — Workforce Scaffold | 📋 Planned | agent, backend, frontend | [`backlog/00-workforce-scaffold`](backlog/00-workforce-scaffold/sprint.md) |
| 01 — Platform Shell & Auth | 📋 Planned | frontend, backend | [`backlog/01-platform-shell-auth`](backlog/01-platform-shell-auth/sprint.md) |
| 02 — Data Integration | 📋 Planned | frontend, backend, agent, MCP | [`backlog/02-data-integration`](backlog/02-data-integration/sprint.md) |
| 03 — National Maritime Picture | 📋 Planned | frontend, backend, agent | [`backlog/03-national-maritime-picture`](backlog/03-national-maritime-picture/sprint.md) |
| 04 — Border Intelligence | 📋 Planned | frontend, backend, agent | [`backlog/04-border-intelligence`](backlog/04-border-intelligence/sprint.md) |
| 05 — Vessel Intelligence | 📋 Planned | frontend, backend, agent | [`backlog/05-vessel-intelligence`](backlog/05-vessel-intelligence/sprint.md) |
| 06 — Aircraft Intelligence | 📋 Planned | frontend, backend, agent | [`backlog/06-aircraft-intelligence`](backlog/06-aircraft-intelligence/sprint.md) |
| 07 — Anomaly Detection | 📋 Planned | frontend, backend, agent | [`backlog/07-anomaly-detection`](backlog/07-anomaly-detection/sprint.md) |
| 08 — Early Warning | 📋 Planned | frontend, backend, agent | [`backlog/08-early-warning`](backlog/08-early-warning/sprint.md) |
| 09 — Threat Assessment | 📋 Planned | frontend, backend, agent | [`backlog/09-threat-assessment`](backlog/09-threat-assessment/sprint.md) |
| 10 — Intelligence Reporting | 📋 Planned | frontend, backend, agent | [`backlog/10-intelligence-reporting`](backlog/10-intelligence-reporting/sprint.md) |
| 11 — Hardening & UAT | 📋 Planned | frontend, backend, agent | [`backlog/11-hardening-uat`](backlog/11-hardening-uat/sprint.md) |
| 12 — Frontend Application | ✅ Completed | frontend only | [`archive/12-frontend-application`](archive/12-frontend-application/sprint.md) |

## Execution order

Sprint 12 replaced cross-stack dependencies with typed local JSON services for frontend acceptance and is now complete. Sprint 00–11 remain planned and may be revised and executed in dependency order only when the user authorizes non-frontend work.
