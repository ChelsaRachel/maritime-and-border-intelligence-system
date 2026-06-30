# Task 00 — Enable Agent Management

**Stack:** backend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** no — one-time platform enablement after bootstrap

## Goal

Enable the in-process agent management plane, scheduler, registry, webhook, retry, and DLQ contracts.

## Contract delivered

Agent records expose identity, role, autonomy, status, schedule, run state, retry count, escalation target, and audit timestamps; health is available at `/agent-mgmt/healthz`.

## Files to touch

- `apps/be/supabase/migrations/0008_agent_mgmt.sql` — apply/verify management structures
- `apps/be/main.py` — register router and scheduler lifespan
- `apps/be/.env` — populate `INTERNAL_API_TOKEN`

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — backend orientation
- `/home/chelsa/.agents/skills/agent-builder/SKILL.md` — management contract

## TODOs

- [ ] Apply and verify the agent-management migration.
- [ ] Enable registry, runs, schedules, webhooks, retry, and DLQ routes.
- [ ] Start the scheduler tick in application lifespan.
- [ ] Verify internal-token authentication and health response.

## Done when

The backend starts on its configured port and agent-management health, registry, run, schedule, and DLQ smoke tests pass.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Backend changelog updated

## Notes

No standalone agent-management service is allowed.
