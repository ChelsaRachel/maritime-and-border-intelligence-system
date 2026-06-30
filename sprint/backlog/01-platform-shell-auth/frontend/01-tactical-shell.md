# Task 01 — Build Tactical Application Shell

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`./00-port-design-tokens.md`](./00-port-design-tokens.md)

## Goal

Build the authenticated shell with logo/favicon, top status rail, and a 72px collapsed/248px expanded sidebar.

## Files to touch

- `apps/fe/src/components/shell/` — sidebar/header/layout
- `apps/fe/public/` — favicon generated from `design/logo.svg`
- `apps/fe/src/navigation/` — route and role navigation

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — frontend orientation

## TODOs

- [ ] Use `design/logo.svg` for brand and favicon.
- [ ] Default to collapsed on every new authenticated session.
- [ ] Implement accessible expand/collapse and role-filtered navigation.
- [ ] Add top time, real-time state, notifications, and user menu.

## Done when

The shell matches all eight mockups, starts collapsed, persists expansion only within the session, and is keyboard-operable.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Expanded sidebar overlays content rather than permanently shrinking map-heavy screens.
