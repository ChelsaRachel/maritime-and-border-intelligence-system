# Task 01 — Verify Security, Performance, and Resilience

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`./00-frd-acceptance-matrix.md`](./00-frd-acceptance-matrix.md)

## Goal

Prove the FRD security, performance, retention, backup/recovery, concurrency, failover, and 72-hour stability requirements.

## Files to touch

- `tests/performance/` — dashboard, alert, report, concurrency tests
- `tests/security/` — auth/RBAC/MFA/session/audit/classification tests
- `tests/resilience/` — provider/failover/recovery/soak tests

## Skills to consult

- `apps/be/skills/testing/SKILL.md` — after bootstrap

## TODOs

- [ ] Verify dashboard ≤3s LAN, map payload readiness ≤2s, alert ≤60s, report ≤30s, and 50 users.
- [ ] Verify MFA production, TLS policy, at-rest protection, 30-minute timeout, RBAC, immutable audit, and no critical findings.
- [ ] Verify provider isolation, retries, failover, backups, RTO/RPO, retention, and 72-hour soak.
- [ ] Attach reproducible evidence to the matrix.

## Done when

All FRD NFR gates pass or have explicit release-blocking findings assigned to owning tasks.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

Do not weaken acceptance thresholds to make tests pass.
