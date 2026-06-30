# Task 02 — Build Administration Screen

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/01-ingestion-health-service.md`](../backend/01-ingestion-health-service.md), [`../../01-platform-shell-auth/backend/01-auth-session-service.md`](../../01-platform-shell-auth/backend/01-auth-session-service.md)

## Goal

Deliver user/role/clearance, threshold versions, recipient directory, classification policy, and immutable audit explorer.

## Files to touch

- `apps/fe/src/pages/Administration.*` — administration screen
- `apps/fe/src/features/administration/` — editors and audit viewer

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — frontend patterns

## TODOs

- [ ] Implement role/clearance-aware editors.
- [ ] Implement threshold proposal/version/approval views.
- [ ] Implement read-only audit explorer and recipient directory.
- [ ] Test Administrator, Supervisor, Analis, Pimpinan, Auditor permissions.

## Done when

Every role sees exactly its permitted actions and no UI path can mutate audit history.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Backend authorization remains authoritative.
