import { tacticalPaint } from '@/config/map/layer-paint.config'
import { MAP_DEFAULTS, MAP_PROJECTION, MAP_STYLE } from '@/config/map/map-styles.config'
import type { IMapPoint, IMapRoute } from '@/types/mbis'
import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'

interface IMapZone {
  id: string
  name: string
  coordinates: [number, number][][]
  severity?: string
}

interface ITacticalMapProps {
  id: string
  points?: IMapPoint[]
  routes?: IMapRoute[]
  zones?: IMapZone[]
  center?: [number, number]
  zoom?: number
  compact?: boolean
  onSelectPoint?: (id: string) => void
}

const EMPTY_POINTS: IMapPoint[] = []
const EMPTY_ROUTES: IMapRoute[] = []
const EMPTY_ZONES: IMapZone[] = []

function severityColorExpression(colors: ReturnType<typeof tacticalPaint>): any {
  return [
    'match', ['get', 'severity'],
    'CRITICAL', colors.red,
    'HIGH', colors.orange,
    'MEDIUM', colors.yellow,
    'LOW', colors.green,
    'NORMAL', colors.cyan,
    colors.teal,
  ]
}

export function TacticalMap({ id, points = EMPTY_POINTS, routes = EMPTY_ROUTES, zones = EMPTY_ZONES, center = MAP_DEFAULTS.center, zoom = MAP_DEFAULTS.zoom, compact = false, onSelectPoint }: ITacticalMapProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN ?? ''

  useEffect(() => {
    if (!hostRef.current || mapRef.current || !accessToken) return
    mapboxgl.accessToken = accessToken
    const colors = tacticalPaint()
    const prefix = `mbis-${id}`
    const pointData = {
      type: 'FeatureCollection',
      features: points.map((point) => ({
        type: 'Feature',
        id: point.id,
        geometry: { type: 'Point', coordinates: point.coordinates },
        properties: {
          id: point.id,
          label: point.name ?? point.callSign ?? point.title ?? point.id,
          severity: point.severity ?? point.risk ?? point.status ?? 'NORMAL',
          category: point.type ?? 'ENTITY',
        },
      })),
    }
    const routeData = {
      type: 'FeatureCollection',
      features: routes.map((route) => ({
        type: 'Feature',
        id: route.id,
        geometry: { type: 'LineString', coordinates: route.coordinates },
        properties: { id: route.id, label: route.name, severity: route.risk ?? route.status ?? 'NORMAL', kind: route.kind ?? 'ROUTE' },
      })),
    }
    const zoneData = {
      type: 'FeatureCollection',
      features: zones.map((zone) => ({
        type: 'Feature', id: zone.id,
        geometry: { type: 'Polygon', coordinates: zone.coordinates },
        properties: { id: zone.id, label: zone.name, severity: zone.severity ?? 'HIGH' },
      })),
    }

    try {
      const map = new mapboxgl.Map({
        container: hostRef.current,
        style: MAP_STYLE,
        projection: MAP_PROJECTION,
        center,
        zoom,
        minZoom: MAP_DEFAULTS.minZoom,
        maxZoom: MAP_DEFAULTS.maxZoom,
        pitch: compact ? 0 : 18,
        bearing: 0,
        attributionControl: false,
      })
      mapRef.current = map
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')
      map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'bottom-right')
      map.getCanvas().setAttribute('aria-label', 'Peta taktis MBIS dengan proyeksi globe')

      map.on('error', (event) => {
        if (event.error?.message) setMapError('Peta tidak dapat memuat tile. Periksa koneksi atau token Mapbox.')
      })

      map.on('load', () => {
        map.setFog({ color: colors.ink, 'high-color': colors.cyan, 'horizon-blend': 0.08, 'space-color': colors.ink, 'star-intensity': 0.12 })
        map.addSource(`${prefix}-zones-source`, { type: 'geojson', data: zoneData as any })
        map.addLayer({ id: `${prefix}-zones-fill`, type: 'fill', source: `${prefix}-zones-source`, paint: { 'fill-color': severityColorExpression(colors), 'fill-opacity': 0.16 } })
        map.addLayer({ id: `${prefix}-zones-line`, type: 'line', source: `${prefix}-zones-source`, paint: { 'line-color': severityColorExpression(colors), 'line-width': 1.6, 'line-dasharray': [2, 2] } })

        map.addSource(`${prefix}-routes-source`, { type: 'geojson', data: routeData as any })
        map.addLayer({ id: `${prefix}-routes-line`, type: 'line', source: `${prefix}-routes-source`, paint: { 'line-color': severityColorExpression(colors), 'line-width': 1.7, 'line-opacity': 0.9, 'line-dasharray': [3, 2] } })

        map.addSource(`${prefix}-points-source`, { type: 'geojson', data: pointData as any })
        map.addLayer({ id: `${prefix}-points-heat`, type: 'heatmap', source: `${prefix}-points-source`, maxzoom: 8, paint: { 'heatmap-weight': 0.65, 'heatmap-intensity': 0.8, 'heatmap-radius': 22, 'heatmap-opacity': 0.48, 'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0,0,0,0)', 0.25, colors.cyan, 0.55, colors.yellow, 0.8, colors.orange, 1, colors.red] } })
        map.addLayer({ id: `${prefix}-points-circle`, type: 'circle', source: `${prefix}-points-source`, paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 3.5, 8, 7], 'circle-color': severityColorExpression(colors), 'circle-stroke-color': colors.ink, 'circle-stroke-width': 1.4, 'circle-opacity': 0.95 } })
        map.addLayer({ id: `${prefix}-points-symbol`, type: 'symbol', source: `${prefix}-points-source`, minzoom: compact ? 5 : 4, layout: { 'text-field': ['get', 'label'], 'text-size': 10, 'text-offset': [0, 1.3], 'text-anchor': 'top', 'text-allow-overlap': false }, paint: { 'text-color': colors.cyan, 'text-halo-color': colors.ink, 'text-halo-width': 1.5 } })

        map.on('mouseenter', `${prefix}-points-circle`, () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', `${prefix}-points-circle`, () => { map.getCanvas().style.cursor = '' })
        map.on('click', `${prefix}-points-circle`, (event) => {
          const selectedId = event.features?.[0]?.properties?.id
          if (selectedId) onSelectPoint?.(String(selectedId))
        })
      })

      const observer = new ResizeObserver(() => map.resize())
      observer.observe(hostRef.current)
      return () => {
        observer.disconnect()
        map.remove()
        mapRef.current = null
      }
    } catch {
      setMapError('Mapbox gagal diinisialisasi. Verifikasi dukungan WebGL browser dan token publik.')
    }
  }, [accessToken, center, compact, id, onSelectPoint, points, routes, zones, zoom])

  if (!accessToken) {
    return (
      <div className="map-fallback" role="status">
        <i className="ph ph-map-trifold" aria-hidden="true" />
        <strong>MAPBOX TOKEN REQUIRED</strong>
        <span>Tambahkan MAPBOX_ACCESS_TOKEN di root .env lalu jalankan ulang frontend.</span>
      </div>
    )
  }

  return (
    <div className="tactical-map" role="region" aria-label="Peta situasi taktis">
      <div ref={hostRef} className="tactical-map__canvas" />
      <div className="tactical-map__scan" aria-hidden="true" />
      <div className="map-contract-chip"><span>MAPBOX SATELLITE STREETS V12</span><span>GLOBE</span><span>TACTICAL OVERLAY</span></div>
      {mapError && <div className="map-error" role="alert">{mapError}</div>}
    </div>
  )
}
