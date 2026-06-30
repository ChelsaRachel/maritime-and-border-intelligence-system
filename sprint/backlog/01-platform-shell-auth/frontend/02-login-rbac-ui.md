# Task 02 — Build Login and RBAC UI

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/01-auth-session-service.md`](../backend/01-auth-session-service.md), [`./00-port-design-tokens.md`](./00-port-design-tokens.md)

## Goal

Deliver the full-viewport radar-grid login, MFA challenge, session handling, and role-aware states.

## Files to touch

- `apps/fe/src/pages/Login.*` — login and MFA
- `apps/fe/src/auth/` — session provider and guards
- `apps/fe/src/pages/AccessDenied.*` — denied/expired states

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — app patterns

## TODOs

- [ ] Build tactical login with logo and no map.
- [ ] Wire invalid credentials, production MFA, timeout, and logout.
- [ ] Land every valid role on National Maritime Picture.
- [ ] Hide/disable actions according to permissions and test all roles.

## Done when

Five valid accounts work in demo, invalid credentials fail safely, production shows MFA, and route/action guards match the matrix.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Do not display passwords as hints in production mode.
