# Task 01 — Implement Auth and Session Service

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`./00-auth-contract.md`](./00-auth-contract.md)

## Goal

Implement login, MFA challenge, session refresh/logout/timeout, authorization guards, and audit recording.

## Files to touch

- `apps/be/router/auth.py` — authentication operations
- `apps/be/service/auth.py` — session/MFA policy
- `apps/be/middleware/authorization.py` — role/clearance enforcement

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — service structure

## TODOs

- [ ] Implement valid/invalid login and environment-scoped MFA.
- [ ] Implement idle expiry, logout, refresh, and revocation.
- [ ] Enforce role/clearance and record successful/denied actions.
- [ ] Add auth, authorization, timeout, and audit tests.

## Done when

All five accounts authenticate in demo, production requires MFA, and unauthorized cross-role access is denied and audited.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Never log credentials or MFA secrets.
