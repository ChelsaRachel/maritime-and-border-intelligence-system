# Task 01 — Verify Visual and Accessibility Acceptance

**Stack:** frontend  
**Sprint:** [`../sprint.md`](../sprint.md)  
**Status:** 📋 Planned  
**Foundation:** no  
**Autonomous:** yes  
**Depends on:** [`../backend/00-frd-acceptance-matrix.md`](../backend/00-frd-acceptance-matrix.md)

## Goal

Prove tactical neon fidelity, logo/fonts, collapsed sidebar, glass panels, map contract, viewport behavior, keyboard access, and non-color status cues.

## Files to touch

- `apps/fe/tests/visual/` — eight screen and login baselines
- `apps/fe/tests/accessibility/` — automated/manual keyboard checks
- `docs/acceptance/visual-evidence/` — target viewport captures

## Skills to consult

- `apps/fe/skills/testing/SKILL.md` — after bootstrap

## TODOs

- [ ] Compare all eight routes to local mockups at 1920×1080 and 2560×1440.
- [ ] Verify logo/favicon, exact font link, tactical tokens, glass, and severity semantics.
- [ ] Verify every map uses style v12, globe, and standard tactical layers.
- [ ] Verify NMP no-scroll and full-background map; run keyboard/accessibility checks.

## Done when

All absolute visual rules pass with approved screenshots and no critical accessibility defect.

## Closing checklist

- [ ] All TODOs are checked
- [ ] Done-when verified
- [ ] Header reads `✅ Done`
- [ ] Web changelog updated

## Notes

Visual differences caused by absolute rules are documented as intentional overrides.
