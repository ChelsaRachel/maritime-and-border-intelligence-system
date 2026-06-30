# Task 03 — Build Mapbox Tactical Foundation

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** yes  
**Autonomous:** yes  
**Depends on:** [`./00-port-design-tokens.md`](./00-port-design-tokens.md)

## Goal

Create the reusable map contract for every MBIS route.

## Contract delivered

Every map uses `mapbox://styles/mapbox/satellite-streets-v12`, `globe`, root token `MAPBOX_ACCESS_TOKEN`, standard symbol/line/fill/circle/heatmap tactical layers, common controls, legends, stale/error states, and context persistence.

## Files to touch

- `.env.example` — exact Mapbox placeholder
- `apps/fe/src/map/` — map wrapper, layer registry, controls, types
- `apps/fe/src/styles/map.css` — tactical overlays

## Skills to consult

- `/home/chelsa/.agents/skills/bootstrap-project/SKILL.md` — frontend integration

## TODOs

- [ ] Configure style URL, globe projection, atmosphere, and token handling.
- [ ] Implement standard tactical sources/layers and layer lifecycle.
- [ ] Implement missing-token, load-error, stale, and empty states.
- [ ] Add unit/integration tests for config and layer registry.

## Done when

The test map reports globe projection, the mandated style, interactive tactical layers, and safe missing-token behavior.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Do not use a WebGL `type: custom` layer because it conflicts with the required globe projection.
