# Task 00 — Lock Auth, RBAC, and Audit Contract

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** no — one-time security contract

## Goal

Lock the five roles, clearance, session, MFA, immutable audit, and demo seed contracts.

## Contract delivered

Roles: Administrator, Pimpinan, Supervisor, Analis, Auditor. Sessions expose user, role, clearance, MFA state, expiry, and permissions. Audit events expose actor, action, target, result, time, classification, and immutable before/after references.

## Files to touch

- `apps/be/supabase/migrations/0009_auth_rbac_audit.sql` — auth-domain structures and policies
- `apps/be/dto/auth.py` — auth/session types
- `apps/be/seed/demo_users.*` — hashed demo accounts

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — backend conventions

## TODOs

- [ ] Encode the strict role matrix from the overview.
- [ ] Define production MFA and 30-minute inactivity behavior.
- [ ] Seed five case-sensitive demo users with hashed passwords.
- [ ] Lock clearance and immutable audit policy.

## Done when

Contract tests prove every role/permission mapping and no seed password is stored plaintext.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Demo MFA bypass is environment-scoped and must fail closed in production.
