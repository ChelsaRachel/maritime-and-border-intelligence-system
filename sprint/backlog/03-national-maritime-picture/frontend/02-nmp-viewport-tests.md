# Task 02 — Verify NMP Viewport and Replay

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`./01-full-map-cop.md`](./01-full-map-cop.md)

## Goal

Lock visual, viewport, projection, layer, replay, keyboard, and cross-navigation acceptance.

## Files to touch

- `apps/fe/tests/e2e/nmp.*` — interaction/viewport tests
- `apps/fe/tests/visual/nmp.*` — screenshots

## Skills to consult

- `apps/fe/skills/testing/SKILL.md` — after bootstrap

## TODOs

- [ ] Assert no body vertical scroll at 1920×1080 and 2560×1440.
- [ ] Assert Satellite Streets v12, globe, tactical layers, and collapsed sidebar.
- [ ] Test 1x/5x/10x replay and timestamp-preserving navigation.
- [ ] Compare visual snapshot to the source mockup.

## Done when

All automated assertions pass and panel overlap never blocks map controls or critical alerts.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Panel internals may scroll; the page body may not.
