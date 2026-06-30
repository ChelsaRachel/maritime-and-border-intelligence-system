export type TNmpLayerGroup = 'grid' | 'routes' | 'boundaries' | 'zones' | 'activity' | 'vessels' | 'aircraft' | 'ports' | 'sensors' | 'labels'

export const NMP_SOURCES = {
  dim: 'mbis-nmp-dim-source',
  grid: 'mbis-nmp-grid-source',
  routes: 'mbis-nmp-routes-source',
  routeArrowPoints: 'mbis-nmp-route-arrow-points-source',
  vesselRoutes: 'mbis-nmp-vessel-routes-source',
  airRoutes: 'mbis-nmp-air-routes-source',
  aircraftRouteArrowPoints: 'mbis-nmp-aircraft-route-arrow-points-source',
  eez: 'mbis-nmp-eez-source',
  patrol: 'mbis-nmp-patrol-source',
  watch: 'mbis-nmp-watch-source',
  hatch: 'mbis-nmp-hatch-source',
  activity: 'mbis-nmp-activity-source',
  vesselTrails: 'mbis-nmp-vessel-trails-source',
  aircraftTrails: 'mbis-nmp-aircraft-trails-source',
  vessels: 'mbis-nmp-vessels-source',
  aircraft: 'mbis-nmp-aircraft-source',
  alerts: 'mbis-nmp-alerts-source',
  ports: 'mbis-nmp-ports-source',
  sensors: 'mbis-nmp-sensors-source',
  labels: 'mbis-nmp-labels-source',
} as const

export type TNmpPaintPreset =
  | 'dimFill' | 'gridLine'
  | 'alkiGlow' | 'alkiCasing' | 'alkiCore'
  | 'commercialGlow' | 'commercialCasing' | 'commercialCore'
  | 'riskRouteGlow' | 'riskRouteCasing' | 'riskRouteCore'
  | 'surveillanceRouteGlow' | 'surveillanceRouteCasing' | 'surveillanceRouteCore'
  | 'vesselRouteGlow' | 'vesselRouteCasing' | 'vesselRouteCore'
  | 'routeArrows' | 'airRouteArrows'
  | 'boundaryGlow' | 'boundaryCasing' | 'boundaryCore' | 'patrolFill' | 'patrolLine'
  | 'watchFill' | 'watchLine' | 'hatchLine' | 'activityHeat'
  | 'vesselTrailGlow' | 'vesselTrailCasing' | 'vesselTrailCore'
  | 'airRouteGlow' | 'airRouteCasing' | 'airRouteCore'
  | 'airTrailGlow' | 'airTrailCasing' | 'airTrailCore'
  | 'vesselGlow' | 'aircraftGlow' | 'entitySymbol'
  | 'alertHalo' | 'alertOuter' | 'alertInner' | 'portCircle' | 'portLabel'
  | 'sensorPulse' | 'sensorCore' | 'maritimeLabel'

export interface INmpLayerRegistryEntry {
  id: string
  source: string
  type: 'fill' | 'line' | 'circle' | 'symbol' | 'heatmap'
  group: TNmpLayerGroup | 'always'
  paintPreset: TNmpPaintPreset
  defaultVisible: boolean
  minzoom?: number
  maxzoom?: number
  layout?: Record<string, unknown>
  filter?: unknown[]
  interaction?: 'entity' | 'alert' | 'focus'
}

const alkiFilter = ['==', ['get', 'kind'], 'ARCHIPELAGIC_SEA_LANE']
const commercialFilter = ['==', ['get', 'kind'], 'COMMERCIAL_CORRIDOR']
const riskFilter = ['==', ['get', 'kind'], 'RISK_CORRIDOR']
const surveillanceFilter = ['==', ['get', 'kind'], 'AIR_SURVEILLANCE_CORRIDOR']

// Registry order is the render order. Operational lines are deliberately separated
// by pass (all glow -> all casing -> all core), so a later glow can never wash out
// another category's neon core at route intersections.
export const NMP_LAYER_REGISTRY: INmpLayerRegistryEntry[] = [
  // 1. Basemap is supplied by Mapbox. The tint/grid sit immediately above it and below all operational data.
  { id: 'mbis-nmp-dim', source: NMP_SOURCES.dim, type: 'fill', group: 'always', paintPreset: 'dimFill', defaultVisible: true },
  { id: 'mbis-nmp-grid', source: NMP_SOURCES.grid, type: 'line', group: 'grid', paintPreset: 'gridLine', defaultVisible: true },

  // 2. Restricted/watch/patrol areas.
  { id: 'mbis-nmp-patrol-fill', source: NMP_SOURCES.patrol, type: 'fill', group: 'zones', paintPreset: 'patrolFill', defaultVisible: true },
  { id: 'mbis-nmp-watch-fill', source: NMP_SOURCES.watch, type: 'fill', group: 'zones', paintPreset: 'watchFill', defaultVisible: true },

  // 3. Activity heat stays below every route and trail pass.
  { id: 'mbis-nmp-activity-heat', source: NMP_SOURCES.activity, type: 'heatmap', group: 'activity', paintPreset: 'activityHeat', defaultVisible: true, maxzoom: 9 },
  { id: 'mbis-nmp-patrol-line', source: NMP_SOURCES.patrol, type: 'line', group: 'zones', paintPreset: 'patrolLine', defaultVisible: true },
  { id: 'mbis-nmp-watch-hatch', source: NMP_SOURCES.hatch, type: 'line', group: 'zones', paintPreset: 'hatchLine', defaultVisible: true },
  { id: 'mbis-nmp-watch-line', source: NMP_SOURCES.watch, type: 'line', group: 'zones', paintPreset: 'watchLine', defaultVisible: true },

  // 4-5. EEZ/boundary glow -> casing -> core.
  { id: 'mbis-nmp-eez-glow', source: NMP_SOURCES.eez, type: 'line', group: 'boundaries', paintPreset: 'boundaryGlow', defaultVisible: true },
  { id: 'mbis-nmp-eez-casing', source: NMP_SOURCES.eez, type: 'line', group: 'boundaries', paintPreset: 'boundaryCasing', defaultVisible: true },
  { id: 'mbis-nmp-eez-core', source: NMP_SOURCES.eez, type: 'line', group: 'boundaries', paintPreset: 'boundaryCore', defaultVisible: true },

  // 6. Route glows.
  { id: 'mbis-nmp-alki-glow', source: NMP_SOURCES.routes, type: 'line', group: 'routes', paintPreset: 'alkiGlow', defaultVisible: true, filter: alkiFilter },
  { id: 'mbis-nmp-commercial-glow', source: NMP_SOURCES.routes, type: 'line', group: 'routes', paintPreset: 'commercialGlow', defaultVisible: true, filter: commercialFilter },
  { id: 'mbis-nmp-risk-route-glow', source: NMP_SOURCES.routes, type: 'line', group: 'routes', paintPreset: 'riskRouteGlow', defaultVisible: true, filter: riskFilter },
  { id: 'mbis-nmp-surveillance-route-glow', source: NMP_SOURCES.routes, type: 'line', group: 'routes', paintPreset: 'surveillanceRouteGlow', defaultVisible: true, filter: surveillanceFilter },
  { id: 'mbis-nmp-vessel-route-glow', source: NMP_SOURCES.vesselRoutes, type: 'line', group: 'vessels', paintPreset: 'vesselRouteGlow', defaultVisible: true },

  // 7. Route dark casings.
  { id: 'mbis-nmp-alki-casing', source: NMP_SOURCES.routes, type: 'line', group: 'routes', paintPreset: 'alkiCasing', defaultVisible: true, filter: alkiFilter },
  { id: 'mbis-nmp-commercial-casing', source: NMP_SOURCES.routes, type: 'line', group: 'routes', paintPreset: 'commercialCasing', defaultVisible: true, filter: commercialFilter },
  { id: 'mbis-nmp-risk-route-casing', source: NMP_SOURCES.routes, type: 'line', group: 'routes', paintPreset: 'riskRouteCasing', defaultVisible: true, filter: riskFilter },
  { id: 'mbis-nmp-surveillance-route-casing', source: NMP_SOURCES.routes, type: 'line', group: 'routes', paintPreset: 'surveillanceRouteCasing', defaultVisible: true, filter: surveillanceFilter },
  { id: 'mbis-nmp-vessel-route-casing', source: NMP_SOURCES.vesselRoutes, type: 'line', group: 'vessels', paintPreset: 'vesselRouteCasing', defaultVisible: true },

  // 8. Route neon cores.
  { id: 'mbis-nmp-alki-core', source: NMP_SOURCES.routes, type: 'line', group: 'routes', paintPreset: 'alkiCore', defaultVisible: true, filter: alkiFilter },
  { id: 'mbis-nmp-commercial-core', source: NMP_SOURCES.routes, type: 'line', group: 'routes', paintPreset: 'commercialCore', defaultVisible: true, filter: commercialFilter },
  { id: 'mbis-nmp-risk-route-core', source: NMP_SOURCES.routes, type: 'line', group: 'routes', paintPreset: 'riskRouteCore', defaultVisible: true, filter: riskFilter },
  { id: 'mbis-nmp-surveillance-route-core', source: NMP_SOURCES.routes, type: 'line', group: 'routes', paintPreset: 'surveillanceRouteCore', defaultVisible: true, filter: surveillanceFilter },
  { id: 'mbis-nmp-vessel-route-core', source: NMP_SOURCES.vesselRoutes, type: 'line', group: 'vessels', paintPreset: 'vesselRouteCore', defaultVisible: true },

  // 9-11. Replay trails: glow -> casing -> neon core.
  { id: 'mbis-nmp-vessel-trail-glow', source: NMP_SOURCES.vesselTrails, type: 'line', group: 'vessels', paintPreset: 'vesselTrailGlow', defaultVisible: true },
  { id: 'mbis-nmp-aircraft-trail-glow', source: NMP_SOURCES.aircraftTrails, type: 'line', group: 'aircraft', paintPreset: 'airTrailGlow', defaultVisible: true },
  { id: 'mbis-nmp-vessel-trail-casing', source: NMP_SOURCES.vesselTrails, type: 'line', group: 'vessels', paintPreset: 'vesselTrailCasing', defaultVisible: true },
  { id: 'mbis-nmp-aircraft-trail-casing', source: NMP_SOURCES.aircraftTrails, type: 'line', group: 'aircraft', paintPreset: 'airTrailCasing', defaultVisible: true },
  { id: 'mbis-nmp-vessel-trail-core', source: NMP_SOURCES.vesselTrails, type: 'line', group: 'vessels', paintPreset: 'vesselTrailCore', defaultVisible: true },
  { id: 'mbis-nmp-aircraft-trail-core', source: NMP_SOURCES.aircraftTrails, type: 'line', group: 'aircraft', paintPreset: 'airTrailCore', defaultVisible: true },

  // 12-14. Aircraft planned route: glow -> casing -> dotted neon core.
  { id: 'mbis-nmp-air-route-glow', source: NMP_SOURCES.airRoutes, type: 'line', group: 'aircraft', paintPreset: 'airRouteGlow', defaultVisible: true },
  { id: 'mbis-nmp-air-route-casing', source: NMP_SOURCES.airRoutes, type: 'line', group: 'aircraft', paintPreset: 'airRouteCasing', defaultVisible: true },
  { id: 'mbis-nmp-air-route-core', source: NMP_SOURCES.airRoutes, type: 'line', group: 'aircraft', paintPreset: 'airRouteCore', defaultVisible: true },

  // 15. Native Mapbox symbol arrows backed by point sources and an addImage SDF chevron.
  { id: 'mbis-nmp-route-arrow-symbol', source: NMP_SOURCES.routeArrowPoints, type: 'symbol', group: 'routes', paintPreset: 'routeArrows', defaultVisible: true, layout: { 'icon-image': 'nmp-route-chevron', 'icon-size': ['interpolate', ['linear'], ['zoom'], 2, 0.52, 7, 0.82], 'icon-rotate': ['get', 'bearing'], 'icon-rotation-alignment': 'map', 'icon-pitch-alignment': 'map', 'icon-allow-overlap': true, 'icon-ignore-placement': true } },
  { id: 'mbis-nmp-aircraft-route-arrow-symbol', source: NMP_SOURCES.aircraftRouteArrowPoints, type: 'symbol', group: 'aircraft', paintPreset: 'airRouteArrows', defaultVisible: true, layout: { 'icon-image': 'nmp-route-chevron', 'icon-size': ['interpolate', ['linear'], ['zoom'], 2, 0.44, 7, 0.68], 'icon-rotate': ['get', 'bearing'], 'icon-rotation-alignment': 'map', 'icon-pitch-alignment': 'map', 'icon-allow-overlap': true, 'icon-ignore-placement': true } },

  // 16-17. Entity marker glow and heading-rotated icons.
  { id: 'mbis-nmp-vessel-glow', source: NMP_SOURCES.vessels, type: 'circle', group: 'vessels', paintPreset: 'vesselGlow', defaultVisible: true },
  { id: 'mbis-nmp-aircraft-glow', source: NMP_SOURCES.aircraft, type: 'circle', group: 'aircraft', paintPreset: 'aircraftGlow', defaultVisible: true },
  { id: 'mbis-nmp-vessel-symbol', source: NMP_SOURCES.vessels, type: 'symbol', group: 'vessels', paintPreset: 'entitySymbol', defaultVisible: true, interaction: 'entity', layout: { 'icon-image': ['concat', 'nmp-vessel-', ['downcase', ['get', 'severity']]], 'icon-size': ['interpolate', ['linear'], ['zoom'], 2, 0.66, 7, 0.96], 'icon-rotate': ['get', 'heading'], 'icon-rotation-alignment': 'map', 'icon-allow-overlap': true, 'icon-ignore-placement': true } },
  { id: 'mbis-nmp-aircraft-symbol', source: NMP_SOURCES.aircraft, type: 'symbol', group: 'aircraft', paintPreset: 'entitySymbol', defaultVisible: true, interaction: 'entity', layout: { 'icon-image': ['concat', 'nmp-aircraft-', ['downcase', ['get', 'severity']]], 'icon-size': ['interpolate', ['linear'], ['zoom'], 2, 0.7, 7, 1.02], 'icon-rotate': ['get', 'heading'], 'icon-rotation-alignment': 'map', 'icon-allow-overlap': true, 'icon-ignore-placement': true } },

  // 18-19. Alerts, ports, sensors, and operational labels.
  { id: 'mbis-nmp-alert-halo', source: NMP_SOURCES.alerts, type: 'circle', group: 'activity', paintPreset: 'alertHalo', defaultVisible: true },
  { id: 'mbis-nmp-alert-outer', source: NMP_SOURCES.alerts, type: 'circle', group: 'activity', paintPreset: 'alertOuter', defaultVisible: true },
  { id: 'mbis-nmp-alert-inner', source: NMP_SOURCES.alerts, type: 'circle', group: 'activity', paintPreset: 'alertInner', defaultVisible: true, interaction: 'alert' },
  { id: 'mbis-nmp-port-circle', source: NMP_SOURCES.ports, type: 'circle', group: 'ports', paintPreset: 'portCircle', defaultVisible: true, minzoom: 3.25, interaction: 'focus' },
  { id: 'mbis-nmp-sensor-pulse', source: NMP_SOURCES.sensors, type: 'circle', group: 'sensors', paintPreset: 'sensorPulse', defaultVisible: true },
  { id: 'mbis-nmp-sensor-core', source: NMP_SOURCES.sensors, type: 'circle', group: 'sensors', paintPreset: 'sensorCore', defaultVisible: true, interaction: 'focus' },
  { id: 'mbis-nmp-port-label', source: NMP_SOURCES.ports, type: 'symbol', group: 'ports', paintPreset: 'portLabel', defaultVisible: true, minzoom: 4.2, layout: { 'text-field': ['get', 'label'], 'text-size': 9, 'text-offset': [0, 1.1], 'text-anchor': 'top', 'text-allow-overlap': false } },
  { id: 'mbis-nmp-maritime-label', source: NMP_SOURCES.labels, type: 'symbol', group: 'labels', paintPreset: 'maritimeLabel', defaultVisible: true, layout: { 'text-field': ['get', 'label'], 'text-size': 11, 'text-letter-spacing': 0.18, 'text-font': ['Open Sans Italic'], 'text-allow-overlap': false } },
]

export const DEFAULT_NMP_LAYER_VISIBILITY: Record<TNmpLayerGroup, boolean> = {
  grid: true,
  routes: true,
  boundaries: true,
  zones: true,
  activity: true,
  vessels: true,
  aircraft: true,
  ports: true,
  sensors: true,
  labels: true,
}
