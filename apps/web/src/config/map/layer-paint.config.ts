function token(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

export function tacticalPaint() {
  return {
    cyan: token('--signal-cyan', 'rgb(0, 224, 255)'),
    cyanSoft: token('--signal-cyan-soft', 'rgb(99, 234, 255)'),
    blue: token('--signal-blue', 'rgb(46, 140, 255)'),
    teal: token('--signal-teal', 'rgb(0, 245, 196)'),
    green: token('--severity-low', 'rgb(61, 218, 135)'),
    yellow: token('--severity-medium', 'rgb(255, 213, 79)'),
    orange: token('--severity-high', 'rgb(255, 142, 43)'),
    red: token('--severity-critical', 'rgb(255, 66, 80)'),
    ink: token('--ocean-950', 'rgb(2, 10, 18)'),
    routeCyan: token('--route-neon-cyan', 'rgb(0, 234, 255)'),
    routeBlue: token('--route-neon-blue', 'rgb(34, 156, 255)'),
    routeOrange: token('--route-neon-orange', 'rgb(255, 159, 28)'),
    routeRed: token('--route-neon-red', 'rgb(255, 59, 79)'),
  }
}

export function nmpLayerPaint() {
  const colors = tacticalPaint()
  // Dark casing colour — sits directly under each neon core so the bright line separates
  // cleanly from busy/bright Satellite imagery (the single most important readability fix).
  const casing = 'rgba(2, 8, 14, 0.78)'
  const entitySeverity = [
    'match', ['get', 'severity'],
    'CRITICAL', colors.red,
    'HIGH', colors.red,
    'MEDIUM', colors.orange,
    'LOW', colors.green,
    'NORMAL', colors.cyan,
    colors.teal,
  ] as any
  const alertSeverity = [
    'match', ['get', 'severity'],
    'CRITICAL', colors.red,
    'HIGH', colors.orange,
    'MEDIUM', colors.yellow,
    'LOW', colors.cyan,
    colors.teal,
  ] as any

  return {
    // Light tactical tint only. It is the first custom layer, so it can never cover
    // routes/trails even when Satellite Streets contains bright cloud or coastline detail.
    dimFill: { 'fill-color': colors.ink, 'fill-opacity': 0.24 },
    gridLine: { 'line-color': colors.cyan, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.45, 7, 0.9], 'line-opacity': 0.22 },

    // ── ALKI: subtle reference visual — muted glow, thin casing, low-opacity core ────
    alkiGlow: { 'line-color': colors.routeCyan, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 4, 7, 6], 'line-opacity': 0.14, 'line-blur': 4 },
    alkiCasing: { 'line-color': casing, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 2, 7, 2.6], 'line-opacity': 0.55, 'line-blur': 0.1 },
    alkiCore: { 'line-color': colors.routeCyan, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1, 7, 1.4], 'line-opacity': 0.45, 'line-dasharray': [3, 1.5] },

    // ── Official commercial shipping route — light reference, not dominant ───
    commercialGlow: { 'line-color': colors.routeCyan, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 3, 7, 5], 'line-opacity': 0.1, 'line-blur': 3 },
    commercialCasing: { 'line-color': casing, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1.6, 7, 2.2], 'line-opacity': 0.45, 'line-blur': 0.1 },
    commercialCore: { 'line-color': colors.routeCyan, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.7, 7, 1.1], 'line-opacity': 0.38, 'line-dasharray': [2.2, 1.6] },

    // ── Risk corridor ─────────────────────────────────────────────────────────
    riskRouteGlow: { 'line-color': colors.routeRed, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 9, 7, 12], 'line-opacity': 0.38, 'line-blur': 6 },
    riskRouteCasing: { 'line-color': casing, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 4, 7, 5], 'line-opacity': 0.93, 'line-blur': 0.15 },
    riskRouteCore: { 'line-color': colors.routeOrange, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 2, 7, 2.8], 'line-opacity': 1, 'line-dasharray': [2, 1.2] },

    // ── Blue surveillance corridor (native sentinel + operational lane) ──────
    surveillanceRouteGlow: { 'line-color': colors.routeBlue, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 7, 7, 10], 'line-opacity': 0.32, 'line-blur': 5 },
    surveillanceRouteCasing: { 'line-color': casing, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 3, 7, 4], 'line-opacity': 0.9, 'line-blur': 0.15 },
    surveillanceRouteCore: { 'line-color': colors.routeBlue, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1.5, 7, 2.2], 'line-opacity': 1, 'line-dasharray': [0.8, 1.5] },

    // Planned vessel route is replay-aware and intentionally lighter than official lanes.
    vesselRouteGlow: { 'line-color': entitySeverity, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 4, 7, 6], 'line-opacity': 0.18, 'line-blur': 4 },
    vesselRouteCasing: { 'line-color': casing, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 2.3, 7, 3], 'line-opacity': 0.82, 'line-blur': 0.1 },
    vesselRouteCore: { 'line-color': entitySeverity, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1, 7, 1.6], 'line-opacity': 0.84, 'line-dasharray': [1.8, 1.3] },

    routeArrows: { 'icon-color': ['match', ['get', 'kind'], 'RISK_CORRIDOR', colors.routeOrange, 'AIR_SURVEILLANCE_CORRIDOR', colors.routeBlue, colors.routeCyan], 'icon-halo-color': colors.ink, 'icon-halo-width': 1.2, 'icon-halo-blur': 0.35, 'icon-opacity': 0.9 },
    airRouteArrows: { 'icon-color': ['match', ['get', 'severity'], 'CRITICAL', colors.routeRed, 'HIGH', colors.routeRed, 'MEDIUM', colors.routeOrange, colors.routeBlue], 'icon-halo-color': colors.ink, 'icon-halo-width': 1.1, 'icon-halo-blur': 0.35, 'icon-opacity': 0.88 },

    boundaryGlow: { 'line-color': colors.cyan, 'line-width': 4, 'line-opacity': 0.12, 'line-blur': 4 },
    boundaryCasing: { 'line-color': casing, 'line-width': 2, 'line-opacity': 0.5, 'line-blur': 0.15 },
    boundaryCore: { 'line-color': colors.cyan, 'line-width': 0.9, 'line-opacity': 0.6, 'line-dasharray': [8, 4] },
    patrolFill: { 'fill-color': colors.teal, 'fill-opacity': 0.045 },
    patrolLine: { 'line-color': colors.teal, 'line-width': 1.3, 'line-opacity': 0.6, 'line-dasharray': [4, 3] },
    watchFill: { 'fill-color': alertSeverity, 'fill-opacity': 0.16 },
    watchLine: { 'line-color': alertSeverity, 'line-width': 1.9, 'line-opacity': 1, 'line-dasharray': [1, 1.3] },
    hatchLine: { 'line-color': colors.red, 'line-width': 1.1, 'line-opacity': 0.66 },

    // Heatmap stays light so activity glow never blankets imagery or route lines.
    activityHeat: { 'heatmap-weight': ['interpolate', ['linear'], ['get', 'weight'], 0, 0, 100, 1], 'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 2, 0.6, 7, 1.2], 'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 2, 15, 7, 30], 'heatmap-opacity': 0.4, 'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0,0,0,0)', 0.2, colors.cyan, 0.42, colors.green, 0.64, colors.yellow, 0.83, colors.orange, 1, colors.red] },

    // ── Vessel trail: glow → dark casing → risk-coloured core ────────────────
    vesselTrailGlow: { 'line-color': entitySeverity, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 5, 7, 7], 'line-opacity': 0.24, 'line-blur': 5 },
    vesselTrailCasing: { 'line-color': casing, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 2.8, 7, 3.8], 'line-opacity': 0.88, 'line-blur': 0.12 },
    vesselTrailCore: { 'line-color': entitySeverity, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1.25, 7, 2], 'line-opacity': 0.94, 'line-dasharray': [1.4, 1.2] },

    // ── Aircraft route: glow → casing → blue dotted neon ─────────────────────
    airRouteGlow: { 'line-color': colors.routeBlue, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 5, 7, 8], 'line-opacity': 0.26, 'line-blur': 5 },
    airRouteCasing: { 'line-color': casing, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 2.6, 7, 3.6], 'line-opacity': 0.88, 'line-blur': 0.12 },
    airRouteCore: { 'line-color': colors.routeBlue, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1.2, 7, 2], 'line-opacity': 0.94, 'line-dasharray': [0.8, 1.5] },

    airTrailGlow: { 'line-color': entitySeverity, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 4.5, 7, 7], 'line-opacity': 0.22, 'line-blur': 5 },
    airTrailCasing: { 'line-color': casing, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 2.6, 7, 3.6], 'line-opacity': 0.86, 'line-blur': 0.12 },
    airTrailCore: { 'line-color': entitySeverity, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1.2, 7, 2], 'line-opacity': 0.92, 'line-dasharray': [0.8, 1.2] },

    vesselGlow: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, ['case', ['get', 'selected'], 10, 7], 7, ['case', ['get', 'selected'], 16, 12]], 'circle-color': entitySeverity, 'circle-opacity': ['case', ['get', 'selected'], 0.5, 0.3], 'circle-blur': 0.65, 'circle-stroke-color': entitySeverity, 'circle-stroke-width': ['case', ['get', 'selected'], 1.5, 0.6], 'circle-stroke-opacity': 0.72 },
    aircraftGlow: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, ['case', ['get', 'selected'], 11, 8], 7, ['case', ['get', 'selected'], 17, 13]], 'circle-color': entitySeverity, 'circle-opacity': ['case', ['get', 'selected'], 0.54, 0.32], 'circle-blur': 0.7, 'circle-stroke-color': entitySeverity, 'circle-stroke-width': ['case', ['get', 'selected'], 1.6, 0.7], 'circle-stroke-opacity': 0.76 },
    entitySymbol: { 'icon-opacity': 1 },
    alertHalo: { 'circle-radius': 28, 'circle-color': alertSeverity, 'circle-opacity': 0.14, 'circle-blur': 0.75 },
    alertOuter: { 'circle-radius': 18, 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-color': alertSeverity, 'circle-stroke-width': 2, 'circle-stroke-opacity': 0.95 },
    alertInner: { 'circle-radius': 5.5, 'circle-color': alertSeverity, 'circle-opacity': 0.98, 'circle-stroke-color': colors.ink, 'circle-stroke-width': 1.3 },
    portCircle: { 'circle-radius': 3.5, 'circle-color': colors.cyan, 'circle-opacity': 0.9, 'circle-stroke-color': colors.ink, 'circle-stroke-width': 1.2 },
    portLabel: { 'text-color': colors.cyan, 'text-halo-color': colors.ink, 'text-halo-width': 1.6, 'text-opacity': 0.9 },
    sensorPulse: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 8, 7, 18], 'circle-color': colors.teal, 'circle-opacity': 0.1, 'circle-stroke-color': colors.teal, 'circle-stroke-opacity': 0.44, 'circle-stroke-width': 1.2 },
    sensorCore: { 'circle-radius': 3.1, 'circle-color': colors.teal, 'circle-opacity': 0.98, 'circle-stroke-color': colors.ink, 'circle-stroke-width': 1.3 },
    maritimeLabel: { 'text-color': colors.cyan, 'text-halo-color': colors.ink, 'text-halo-width': 1.9, 'text-opacity': 0.7 },
  } as Record<string, Record<string, unknown>>
}
