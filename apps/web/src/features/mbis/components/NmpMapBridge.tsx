import { nmpLayerPaint, tacticalPaint } from '@/config/map/layer-paint.config'
import { MAP_DEFAULTS, MAP_PROJECTION, MAP_STYLE } from '@/config/map/map-styles.config'
import { NMP_LAYER_REGISTRY, NMP_SOURCES, type TNmpLayerGroup } from '@/features/mbis/config/nmp-layers.config'
import type { INmpAlert, INmpCurrentEntity, INmpGeographyFixture, TCoordinates } from '@/features/mbis/types/nmp.types'
import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'

interface INmpMapBridgeProps {
  geography: INmpGeographyFixture
  entities: INmpCurrentEntity[]
  activeAlerts: INmpAlert[]
  visibility: Record<TNmpLayerGroup, boolean>
  selectedId: string | null
  focusTarget: { coordinates: TCoordinates; sequence: number } | null
  onSelectEntity: (id: string) => void
  onSelectAlert: (id: string) => void
}

interface IMarkerHandle {
  marker: mapboxgl.Marker
  root: Root
}

interface INmpRuntimeAudit {
  style: string
  projection: string
  sourceFeatureCounts: Record<string, number>
  activeLayerIds: string[]
  operationalLayerOrder: string[]
  renderedInViewport: {
    shippingRoutes: number
    vesselRoutes: number
    vesselTrails: number
    aircraftRoutes: number
    aircraftTrails: number
    entityMarkers: number
    routeArrows: number
    aircraftRouteArrows: number
  }
}

declare global {
  interface Window {
    __MBIS_NMP_MAP_AUDIT__?: INmpRuntimeAudit
  }
}

const emptyFeatureCollection = () => ({ type: 'FeatureCollection', features: [] })
const collection = (features: unknown[]) => ({ type: 'FeatureCollection', features })
const NMP_CAMERA_PADDING = { top: 110, right: 260, bottom: 155, left: 310 }
const pointFeature = (coordinates: TCoordinates, properties: Record<string, unknown>, id?: string) => ({ type: 'Feature', id, geometry: { type: 'Point', coordinates }, properties })
const lineFeature = (coordinates: TCoordinates[], properties: Record<string, unknown>, id?: string) => ({ type: 'Feature', id, geometry: { type: 'LineString', coordinates }, properties })
const polygonFeature = (coordinates: TCoordinates[][], properties: Record<string, unknown>, id?: string) => ({ type: 'Feature', id, geometry: { type: 'Polygon', coordinates }, properties })

function bearingBetween(start: TCoordinates, end: TCoordinates) {
  const startLat = start[1] * Math.PI / 180
  const endLat = end[1] * Math.PI / 180
  const deltaLng = (end[0] - start[0]) * Math.PI / 180
  const y = Math.sin(deltaLng) * Math.cos(endLat)
  const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(deltaLng)
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
}

function arrowPointFeatures(coordinates: TCoordinates[], properties: Record<string, unknown>, prefix: string, spacingDegrees: number) {
  const features: unknown[] = []
  coordinates.slice(0, -1).forEach((start, segmentIndex) => {
    const end = coordinates[segmentIndex + 1]
    const meanLat = (start[1] + end[1]) * 0.5 * Math.PI / 180
    const distance = Math.hypot((end[0] - start[0]) * Math.cos(meanLat), end[1] - start[1])
    const count = Math.max(1, Math.floor(distance / spacingDegrees))
    for (let index = 1; index <= count; index += 1) {
      const progress = index / (count + 1)
      const point: TCoordinates = [
        start[0] + (end[0] - start[0]) * progress,
        start[1] + (end[1] - start[1]) * progress,
      ]
      features.push(pointFeature(point, { ...properties, bearing: bearingBetween(start, end) }, `${prefix}-${segmentIndex}-${index}`))
    }
  })
  return features
}

function gridData() {
  const features: unknown[] = []
  for (let lng = 92.5; lng <= 142.5; lng += 2.5) features.push(lineFeature([[lng, -13], [lng, 11]], { axis: 'longitude' }))
  for (let lat = -12.5; lat <= 10; lat += 2.5) features.push(lineFeature([[92, lat], [143, lat]], { axis: 'latitude' }))
  return collection(features)
}

function hatchData(geography: INmpGeographyFixture) {
  const features: unknown[] = []
  geography.watchAreas.forEach((area) => {
    const ring = area.coordinates[0]
    const lngs = ring.map((coordinate) => coordinate[0])
    const lats = ring.map((coordinate) => coordinate[1])
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const width = maxLng - minLng
    for (let offset = -0.4; offset <= 1.4; offset += 0.17) {
      const startLng = clamp(minLng + width * offset, minLng, maxLng)
      const endLng = clamp(minLng + width * (offset + 0.42), minLng, maxLng)
      if (endLng > startLng) features.push(lineFeature([[startLng, minLat], [endLng, maxLat]], { severity: area.severity ?? 'HIGH', areaId: area.id }))
    }
  })
  return collection(features)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function arrowCanvas(kind: 'vessel' | 'aircraft', color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext('2d')
  if (!context) return new ImageData(64, 64)
  context.translate(32, 32)
  context.shadowColor = color
  context.shadowBlur = 14
  context.fillStyle = color
  context.strokeStyle = 'rgba(1, 9, 16, .95)'
  context.lineWidth = 3
  context.beginPath()
  if (kind === 'vessel') {
    context.moveTo(0, -25)
    context.lineTo(12, 20)
    context.lineTo(0, 14)
    context.lineTo(-12, 20)
  } else {
    context.moveTo(0, -27)
    context.lineTo(6, -5)
    context.lineTo(24, 5)
    context.lineTo(23, 12)
    context.lineTo(5, 6)
    context.lineTo(4, 20)
    context.lineTo(11, 25)
    context.lineTo(10, 29)
    context.lineTo(0, 25)
    context.lineTo(-10, 29)
    context.lineTo(-11, 25)
    context.lineTo(-4, 20)
    context.lineTo(-5, 6)
    context.lineTo(-23, 12)
    context.lineTo(-24, 5)
    context.lineTo(-6, -5)
  }
  context.closePath()
  context.fill()
  context.stroke()
  return context.getImageData(0, 0, canvas.width, canvas.height)
}

function routeChevronCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = 48
  canvas.height = 48
  const context = canvas.getContext('2d')
  if (!context) return new ImageData(48, 48)
  context.translate(24, 24)
  context.fillStyle = 'white'
  context.beginPath()
  context.moveTo(0, -20)
  context.lineTo(13, 8)
  context.lineTo(5, 5)
  context.lineTo(5, 18)
  context.lineTo(-5, 18)
  context.lineTo(-5, 5)
  context.lineTo(-13, 8)
  context.closePath()
  context.fill()
  return context.getImageData(0, 0, canvas.width, canvas.height)
}

function registerMapIcons(map: mapboxgl.Map) {
  const colors = tacticalPaint()
  const entries = { critical: colors.red, high: colors.red, medium: colors.orange, low: colors.green, normal: colors.cyan }
  Object.entries(entries).forEach(([severity, color]) => {
    ;(['vessel', 'aircraft'] as const).forEach((kind) => {
      const id = `nmp-${kind}-${severity}`
      if (!map.hasImage(id)) map.addImage(id, arrowCanvas(kind, color), { pixelRatio: 2 })
    })
  })
  if (!map.hasImage('nmp-route-chevron')) map.addImage('nmp-route-chevron', routeChevronCanvas(), { pixelRatio: 2, sdf: true })
}

function geographySourceData(geography: INmpGeographyFixture) {
  const routeArrowPoints = geography.shippingRoutes.flatMap((route) => arrowPointFeatures(
    route.coordinates,
    { id: route.id, routeId: route.id, label: route.name, kind: route.kind, severity: route.kind === 'RISK_CORRIDOR' ? 'HIGH' : 'NORMAL' },
    `route-arrow-${route.id}`,
    2.6,
  ))
  return {
    [NMP_SOURCES.dim]: collection([polygonFeature([[[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]]], {})]),
    [NMP_SOURCES.grid]: gridData(),
    [NMP_SOURCES.routes]: collection(geography.shippingRoutes.map((route) => lineFeature(route.coordinates, { id: route.id, label: route.name, kind: route.kind, status: route.status, severity: route.kind === 'RISK_CORRIDOR' ? 'HIGH' : 'NORMAL' }, route.id))),
    [NMP_SOURCES.routeArrowPoints]: collection(routeArrowPoints),
    [NMP_SOURCES.eez]: collection([lineFeature(geography.eezBoundary.coordinates, { id: geography.eezBoundary.id, label: geography.eezBoundary.name }, geography.eezBoundary.id)]),
    [NMP_SOURCES.patrol]: collection(geography.patrolZones.map((area) => polygonFeature(area.coordinates, { id: area.id, label: area.name, status: area.status, severity: 'LOW' }, area.id))),
    [NMP_SOURCES.watch]: collection(geography.watchAreas.map((area) => polygonFeature(area.coordinates, { id: area.id, label: area.name, category: area.category, severity: area.severity ?? 'HIGH' }, area.id))),
    [NMP_SOURCES.hatch]: hatchData(geography),
    [NMP_SOURCES.ports]: collection(geography.ports.map((port) => pointFeature(port.coordinates, { id: port.id, label: port.name, status: port.status, category: 'PORT' }, port.id))),
    [NMP_SOURCES.sensors]: collection(geography.sensors.map((sensor) => pointFeature(sensor.coordinates, { id: sensor.id, label: sensor.name, status: sensor.status, category: sensor.type }, sensor.id))),
    [NMP_SOURCES.labels]: collection(geography.maritimeLabels.map((label) => pointFeature(label.coordinates, { id: label.id, label: label.label }, label.id))),
  }
}

function dynamicSourceData(entities: INmpCurrentEntity[], activeAlerts: INmpAlert[], selectedId: string | null) {
  const vessels = entities.filter((entity) => entity.category === 'VESSEL')
  const aircraft = entities.filter((entity) => entity.category === 'AIRCRAFT')
  const visibleVesselRoutes = vessels.filter((entity, index) => index % 6 === 0 && entity.route.length > 1)
  const visibleVesselTrails = vessels.filter((entity, index) => index % 3 === 0 && entity.trail.length > 1)
  const visibleAircraftRoutes = aircraft.filter((entity, index) => index % 2 === 0 && entity.route.length > 1)
  const aircraftRouteArrowPoints = visibleAircraftRoutes.flatMap((entity) => arrowPointFeatures(
    entity.route,
    { id: entity.id, entityId: entity.id, severity: entity.severity, category: entity.category },
    `air-route-arrow-${entity.id}`,
    4.5,
  ))
  return {
    [NMP_SOURCES.vessels]: collection(vessels.map((entity) => pointFeature(entity.coordinates, { id: entity.id, label: entity.label, heading: entity.heading, speed: entity.speed, severity: entity.severity, category: entity.category, selected: entity.id === selectedId }, entity.id))),
    [NMP_SOURCES.aircraft]: collection(aircraft.map((entity) => pointFeature(entity.coordinates, { id: entity.id, label: entity.label, heading: entity.heading, speed: entity.speed, severity: entity.severity, category: entity.category, selected: entity.id === selectedId }, entity.id))),
    [NMP_SOURCES.vesselRoutes]: collection(visibleVesselRoutes.map((entity) => lineFeature(entity.route, { id: entity.id, severity: entity.severity, category: entity.category }, `vessel-route-${entity.id}`))),
    [NMP_SOURCES.vesselTrails]: collection(visibleVesselTrails.map((entity) => lineFeature(entity.trail, { id: entity.id, severity: entity.severity, category: entity.category }, `vessel-trail-${entity.id}`))),
    [NMP_SOURCES.aircraftTrails]: collection(aircraft.filter((entity) => entity.trail.length > 1).map((entity) => lineFeature(entity.trail, { id: entity.id, severity: entity.severity, category: entity.category }, `aircraft-trail-${entity.id}`))),
    [NMP_SOURCES.airRoutes]: collection(visibleAircraftRoutes.map((entity) => lineFeature(entity.route, { id: entity.id, severity: entity.severity, category: entity.category }, `air-route-${entity.id}`))),
    [NMP_SOURCES.aircraftRouteArrowPoints]: collection(aircraftRouteArrowPoints),
    [NMP_SOURCES.alerts]: collection(activeAlerts.map((alert) => pointFeature(alert.coordinates, { id: alert.id, label: alert.title, severity: alert.severity, entityId: alert.entityId, timestamp: alert.timestamp, source: alert.source, confidence: alert.confidence, suggestedAction: alert.suggestedAction }, alert.id))),
    [NMP_SOURCES.activity]: collection([
      ...activeAlerts.map((alert) => pointFeature(alert.coordinates, { id: alert.id, weight: alert.severity === 'CRITICAL' ? 100 : alert.severity === 'HIGH' ? 82 : 58, severity: alert.severity }, alert.id)),
      ...entities.filter((_, index) => index % 5 === 0).map((entity) => pointFeature(entity.coordinates, { id: `activity-${entity.id}`, weight: entity.severity === 'CRITICAL' ? 92 : entity.severity === 'HIGH' ? 70 : 38, severity: entity.severity })),
    ]),
  }
}

function setSourceData(map: mapboxgl.Map, data: Record<string, unknown>) {
  Object.entries(data).forEach(([sourceId, sourceData]) => {
    const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined
    source?.setData(sourceData as any)
  })
}

function featureCount(sourceData: unknown) {
  if (!sourceData || typeof sourceData !== 'object' || !('features' in sourceData)) return 0
  const features = (sourceData as { features?: unknown[] }).features
  return Array.isArray(features) ? features.length : 0
}

function renderedUniqueCount(map: mapboxgl.Map, layerIds: string[]) {
  const layers = layerIds.filter((layerId) => map.getLayer(layerId))
  if (!layers.length) return 0
  try {
    const keys = new Set(map.queryRenderedFeatures({ layers }).map((feature, index) => String(feature.id ?? feature.properties?.id ?? `${feature.layer?.id ?? 'feature'}-${index}`)))
    return keys.size
  } catch {
    return 0
  }
}

function publishRuntimeAudit(map: mapboxgl.Map, sourceData: Record<string, unknown>) {
  const activeLayerIds = NMP_LAYER_REGISTRY
    .filter((entry) => map.getLayer(entry.id) && map.getLayoutProperty(entry.id, 'visibility') !== 'none')
    .map((entry) => entry.id)
  const mapLayerIds = new Set(NMP_LAYER_REGISTRY.map((entry) => entry.id))
  const operationalLayerOrder = (map.getStyle().layers ?? []).map((layer) => layer.id).filter((layerId) => mapLayerIds.has(layerId))
  const audit: INmpRuntimeAudit = {
    style: MAP_STYLE,
    projection: map.getProjection()?.name ?? MAP_PROJECTION,
    sourceFeatureCounts: Object.fromEntries(Object.entries(sourceData).map(([sourceId, data]) => [sourceId, featureCount(data)])),
    activeLayerIds,
    operationalLayerOrder,
    renderedInViewport: {
      shippingRoutes: renderedUniqueCount(map, ['mbis-nmp-alki-core', 'mbis-nmp-commercial-core', 'mbis-nmp-risk-route-core', 'mbis-nmp-surveillance-route-core']),
      vesselRoutes: renderedUniqueCount(map, ['mbis-nmp-vessel-route-core']),
      vesselTrails: renderedUniqueCount(map, ['mbis-nmp-vessel-trail-core']),
      aircraftRoutes: renderedUniqueCount(map, ['mbis-nmp-air-route-core']),
      aircraftTrails: renderedUniqueCount(map, ['mbis-nmp-aircraft-trail-core']),
      entityMarkers: renderedUniqueCount(map, ['mbis-nmp-vessel-symbol', 'mbis-nmp-aircraft-symbol']),
      routeArrows: renderedUniqueCount(map, ['mbis-nmp-route-arrow-symbol']),
      aircraftRouteArrows: renderedUniqueCount(map, ['mbis-nmp-aircraft-route-arrow-symbol']),
    },
  }
  window.__MBIS_NMP_MAP_AUDIT__ = audit
  window.dispatchEvent(new CustomEvent('mbis:nmp-map-audit', { detail: audit }))
}

export function NmpMapBridge({ geography, entities, activeAlerts, visibility, selectedId, focusTarget, onSelectEntity, onSelectAlert }: INmpMapBridgeProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const onSelectRef = useRef(onSelectEntity)
  const onSelectAlertRef = useRef(onSelectAlert)
  const markersRef = useRef<IMarkerHandle[]>([])
  const animationRef = useRef<number | null>(null)
  const auditTimerRef = useRef<number | null>(null)
  const geographySourceDataRef = useRef<Record<string, unknown>>({})
  const dynamicSourceDataRef = useRef<Record<string, unknown>>({})
  const [loaded, setLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN ?? ''

  const scheduleRuntimeAudit = (map: mapboxgl.Map) => {
    if (auditTimerRef.current !== null) window.clearTimeout(auditTimerRef.current)
    auditTimerRef.current = window.setTimeout(() => {
      if (mapRef.current === map) publishRuntimeAudit(map, { ...geographySourceDataRef.current, ...dynamicSourceDataRef.current })
    }, 900)
  }

  useEffect(() => { onSelectRef.current = onSelectEntity }, [onSelectEntity])
  useEffect(() => { onSelectAlertRef.current = onSelectAlert }, [onSelectAlert])

  useEffect(() => {
    if (!hostRef.current || mapRef.current || !accessToken) return
    mapboxgl.accessToken = accessToken
    const colors = tacticalPaint()
    const paint = nmpLayerPaint()

    try {
      const map = new mapboxgl.Map({
        container: hostRef.current,
        style: MAP_STYLE,
        projection: MAP_PROJECTION,
        center: MAP_DEFAULTS.center,
        zoom: 3.55,
        minZoom: MAP_DEFAULTS.minZoom,
        maxZoom: MAP_DEFAULTS.maxZoom,
        pitch: 0,
        bearing: 0,
        attributionControl: false,
        antialias: true,
      })
      mapRef.current = map
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')
      map.addControl(new mapboxgl.NavigationControl({ showCompass: true, showZoom: true }), 'bottom-right')
      map.addControl(new mapboxgl.ScaleControl({ unit: 'nautical', maxWidth: 90 }), 'bottom-left')
      map.getCanvas().setAttribute('aria-label', 'National Maritime Picture dengan Mapbox Satellite Streets v12, globe projection, dan tactical overlay')

      map.on('error', (event) => {
        const message = event.error?.message ?? ''
        if (/token|webgl|unauthorized|forbidden/i.test(message)) setMapError('Mapbox tidak dapat dimuat. Periksa token publik dan dukungan WebGL browser.')
      })

      map.on('load', () => {
        // Pastikan globe projection benar-benar aktif setelah style termuat (bukan mercator flat).
        map.setProjection(MAP_PROJECTION)
        map.jumpTo({
          center: [118.5, -2.2],
          zoom: 3.75,
          padding: NMP_CAMERA_PADDING,
          bearing: 0,
          pitch: 0,
        })
        map.setFog({ color: colors.ink, 'high-color': colors.cyan, 'horizon-blend': 0.08, 'space-color': colors.ink, 'star-intensity': 0.08 })
        registerMapIcons(map)
        const sourceIds = [...Object.values(NMP_SOURCES)]
        sourceIds.forEach((sourceId) => map.addSource(sourceId, { type: 'geojson', data: emptyFeatureCollection() as any }))
        NMP_LAYER_REGISTRY.forEach((entry) => {
          const lineLayout = entry.type === 'line' ? { 'line-cap': 'round', 'line-join': 'round' } : {}
          map.addLayer({
            id: entry.id,
            source: entry.source,
            type: entry.type,
            ...(entry.minzoom === undefined ? {} : { minzoom: entry.minzoom }),
            ...(entry.maxzoom === undefined ? {} : { maxzoom: entry.maxzoom }),
            ...(entry.filter === undefined ? {} : { filter: entry.filter }),
            layout: { visibility: entry.defaultVisible ? 'visible' : 'none', ...lineLayout, ...(entry.layout ?? {}) },
            paint: paint[entry.paintPreset],
          } as any)
          if (entry.interaction) {
            map.on('mouseenter', entry.id, () => { map.getCanvas().style.cursor = 'pointer' })
            map.on('mouseleave', entry.id, () => { map.getCanvas().style.cursor = '' })
            map.on('click', entry.id, (event) => {
              const id = event.features?.[0]?.properties?.id
              if (!id) return
              if (entry.interaction === 'alert') onSelectAlertRef.current(String(id))
              else onSelectRef.current(String(id))
            })
          }
        })
        // Populate native GeoJSON sources in the same style-load transaction. React
        // effects continue to update these sources for replay, but first paint is never blank.
        geographySourceDataRef.current = geographySourceData(geography)
        dynamicSourceDataRef.current = dynamicSourceData(entities, activeAlerts, selectedId)
        setSourceData(map, geographySourceDataRef.current)
        setSourceData(map, dynamicSourceDataRef.current)
        scheduleRuntimeAudit(map)
        setLoaded(true)
      })

      const observer = new ResizeObserver(() => map.resize())
      observer.observe(hostRef.current)

      let previousFrame = -1
      const animate = (time: number) => {
        const frame = Math.floor(time / 180) % 8
        if (frame !== previousFrame && map.isStyleLoaded()) {
          previousFrame = frame
          // Bold marching-ants flow — dash stays long enough to read as a solid neon lane while it animates.
          const alkiDash = [[3, 1.5], [2.85, 1.65], [2.7, 1.8], [2.55, 1.95], [2.7, 1.8], [2.85, 1.65], [3, 1.5], [3.15, 1.35]][frame]
          const commercialDash = [[2.2, 1.6], [2.05, 1.75], [1.9, 1.9], [1.75, 2.05], [1.9, 1.9], [2.05, 1.75], [2.2, 1.6], [2.35, 1.45]][frame]
          if (map.getLayer('mbis-nmp-alki-core')) map.setPaintProperty('mbis-nmp-alki-core', 'line-dasharray', alkiDash)
          if (map.getLayer('mbis-nmp-commercial-core')) map.setPaintProperty('mbis-nmp-commercial-core', 'line-dasharray', commercialDash)
          if (map.getLayer('mbis-nmp-risk-route-core')) map.setPaintProperty('mbis-nmp-risk-route-core', 'line-dasharray', [2, 1.2 + (frame % 4) * 0.12])
          if (map.getLayer('mbis-nmp-surveillance-route-core')) map.setPaintProperty('mbis-nmp-surveillance-route-core', 'line-dasharray', [0.8, 1.35 + (frame % 4) * 0.1])
          if (map.getLayer('mbis-nmp-vessel-route-core')) map.setPaintProperty('mbis-nmp-vessel-route-core', 'line-dasharray', [1.8, 1.15 + (frame % 4) * 0.1])
          if (map.getLayer('mbis-nmp-vessel-trail-core')) map.setPaintProperty('mbis-nmp-vessel-trail-core', 'line-dasharray', [1.4, 1.05 + (frame % 4) * 0.1])
          if (map.getLayer('mbis-nmp-air-route-core')) map.setPaintProperty('mbis-nmp-air-route-core', 'line-dasharray', [0.8, 1.35 + (frame % 4) * 0.1])
          if (map.getLayer('mbis-nmp-aircraft-trail-core')) map.setPaintProperty('mbis-nmp-aircraft-trail-core', 'line-dasharray', [0.8, 1.05 + (frame % 4) * 0.1])
          if (map.getLayer('mbis-nmp-alert-halo')) {
            map.setPaintProperty('mbis-nmp-alert-halo', 'circle-radius', 21 + frame * 3.6)
            map.setPaintProperty('mbis-nmp-alert-halo', 'circle-opacity', 0.18 - frame * 0.018)
          }
          if (map.getLayer('mbis-nmp-alert-outer')) {
            map.setPaintProperty('mbis-nmp-alert-outer', 'circle-radius', 13 + frame * 1.8)
            map.setPaintProperty('mbis-nmp-alert-outer', 'circle-stroke-opacity', 0.9 - frame * 0.09)
          }
          if (map.getLayer('mbis-nmp-sensor-pulse')) map.setPaintProperty('mbis-nmp-sensor-pulse', 'circle-opacity', 0.035 + (frame % 4) * 0.018)
        }
        animationRef.current = window.requestAnimationFrame(animate)
      }
      animationRef.current = window.requestAnimationFrame(animate)

      return () => {
        observer.disconnect()
        if (animationRef.current !== null) window.cancelAnimationFrame(animationRef.current)
        if (auditTimerRef.current !== null) window.clearTimeout(auditTimerRef.current)
        markersRef.current.forEach(({ marker, root }) => { root.unmount(); marker.remove() })
        markersRef.current = []
        map.remove()
        mapRef.current = null
      }
    } catch {
      setMapError('Mapbox gagal diinisialisasi. Verifikasi dukungan WebGL dan konfigurasi MAPBOX_ACCESS_TOKEN.')
    }
  }, [accessToken])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded) return
    geographySourceDataRef.current = geographySourceData(geography)
    setSourceData(map, geographySourceDataRef.current)
    scheduleRuntimeAudit(map)
  }, [geography, loaded])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded) return
    dynamicSourceDataRef.current = dynamicSourceData(entities, activeAlerts, selectedId)
    setSourceData(map, dynamicSourceDataRef.current)
    scheduleRuntimeAudit(map)
  }, [activeAlerts, entities, loaded, selectedId])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded) return
    NMP_LAYER_REGISTRY.forEach((entry) => {
      if (entry.group === 'always' || !map.getLayer(entry.id)) return
      map.setLayoutProperty(entry.id, 'visibility', visibility[entry.group] ? 'visible' : 'none')
    })
    scheduleRuntimeAudit(map)
  }, [loaded, visibility])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded) return
    markersRef.current.forEach(({ marker, root }) => { root.unmount(); marker.remove() })
    markersRef.current = []
    if (!visibility.labels) return
    const primaryChokepoints = new Set(['CP-MALAKA', 'CP-SUNDA', 'CP-LOMBOK', 'CP-MAKASSAR'])
    markersRef.current = geography.chokepoints.filter((chokepoint) => primaryChokepoints.has(chokepoint.id)).map((chokepoint) => {
      const element = document.createElement('div')
      element.className = `nmp-chokepoint nmp-chokepoint--${chokepoint.risk.toLowerCase()}`
      const root = createRoot(element)
      root.render(
        <button type="button" onClick={() => map.easeTo({ center: chokepoint.coordinates, zoom: 5.5, duration: 900 })} aria-label={`Fokus ke ${chokepoint.name}`}>
          <span>{chokepoint.name}</span>
          <strong>{chokepoint.traffic}</strong>
          <small>RISIKO {chokepoint.risk}</small>
        </button>,
      )
      const marker = new mapboxgl.Marker({ element, anchor: 'bottom', offset: [0, -12] }).setLngLat(chokepoint.coordinates).addTo(map)
      return { marker, root }
    })
    return () => {
      markersRef.current.forEach(({ marker, root }) => { root.unmount(); marker.remove() })
      markersRef.current = []
    }
  }, [geography.chokepoints, loaded, visibility.labels])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded || !selectedId) return
    const selected = entities.find((entity) => entity.id === selectedId)
    if (selected) map.easeTo({ center: selected.coordinates, zoom: Math.max(map.getZoom(), 5.3), duration: 850 })
  }, [entities, loaded, selectedId])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded || !focusTarget) return
    map.easeTo({ center: focusTarget.coordinates, zoom: Math.max(map.getZoom(), 5.3), duration: 850 })
  }, [focusTarget, loaded])

  if (!accessToken) {
    return <div className="map-fallback" role="status"><i className="ph ph-map-trifold" /><strong>MAPBOX TOKEN REQUIRED</strong><span>Konfigurasikan MAPBOX_ACCESS_TOKEN pada root .env lalu jalankan ulang frontend.</span></div>
  }

  return (
    <div className="tactical-map tactical-map--nmp" role="region" aria-label="Peta taktis National Maritime Picture">
      <div ref={hostRef} className="tactical-map__canvas" />
      <div className={`tactical-map__neon-grid ${visibility.grid ? '' : 'is-hidden'}`} aria-hidden="true" />
      <div className="tactical-map__scan" aria-hidden="true" />
      <div className="tactical-map__sweep" aria-hidden="true" />
      <div className="map-contract-chip"><span>SATELLITE STREETS V12</span><span>GLOBE</span><span>TACTICAL OVERLAY</span></div>
      {mapError && <div className="map-error" role="alert">{mapError}</div>}
    </div>
  )
}
