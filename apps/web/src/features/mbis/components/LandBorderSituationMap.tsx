import { MAP_PROJECTION, MAP_STYLE } from '@/config/map/map-styles.config'
import mapboxgl from 'mapbox-gl'
import { useEffect, useMemo, useRef, useState } from 'react'

type TLayerKey = 'posts' | 'informal' | 'hotspots' | 'patrols' | 'incidents'

const LAYER_CONTROLS: Array<{ key: TLayerKey; label: string; icon: string }> = [
  { key: 'posts', label: 'Pos Lintas Batas Resmi', icon: 'check-square' },
  { key: 'informal', label: 'Jalur Tikus (Informal)', icon: 'path' },
  { key: 'hotspots', label: 'Titik Rawan / Penyelundupan', icon: 'target' },
  { key: 'patrols', label: 'Rute Patroli', icon: 'route' },
  { key: 'incidents', label: 'Insiden Perbatasan', icon: 'warning-diamond' },
]

const SECTOR_CAMERA: Record<string, { center: [number, number]; zoom: number }> = {
  'Semua Sektor': { center: [124.5, -2.7], zoom: 4.15 },
  'Kalimantan Barat': { center: [110.8, 1.25], zoom: 6.25 },
  'Kalimantan Utara': { center: [116.3, 4.0], zoom: 6.1 },
  'Nusa Tenggara Timur': { center: [124.82, -9.35], zoom: 7.0 },
  Papua: { center: [140.9, -3.4], zoom: 6.0 },
  'Papua Selatan': { center: [140.85, -7.45], zoom: 6.0 },
}

const DEFAULT_SECTOR = 'Kalimantan Barat'

const collection = (features: unknown[]) => ({ type: 'FeatureCollection', features })
const point = (item: any) => ({ type: 'Feature', id: item.id, geometry: { type: 'Point', coordinates: item.coordinates }, properties: { ...item, coordinates: undefined, sourceFusion: undefined } })
const line = (item: any) => ({ type: 'Feature', id: item.id, geometry: { type: 'LineString', coordinates: item.coordinates }, properties: { ...item, coordinates: undefined } })

function formatUpdate(timestamp: string) {
  return new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(timestamp))
}

function belongsToSector(province: string, sector: string) {
  if (sector === 'Semua Sektor') return true
  if (sector === 'Papua Selatan' && province === 'Papua') return false
  return province === sector
}

export function LandBorderSituationMap({ data }: { data: any }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const popupRef = useRef<mapboxgl.Popup | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [sector, setSector] = useState(DEFAULT_SECTOR)
  const [mapError, setMapError] = useState<string | null>(null)
  const [visibility, setVisibility] = useState<Record<TLayerKey, boolean>>({ posts: true, informal: true, hotspots: true, patrols: true, incidents: true })
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN ?? ''

  const filtered = useMemo(() => ({
    posts: data.officialPosts.filter((item: any) => belongsToSector(item.province, sector)),
    informal: data.informalRoutes.filter((item: any) => belongsToSector(item.province, sector)),
    hotspots: data.hotspots.filter((item: any) => belongsToSector(item.province, sector)),
    patrols: data.patrolRoutes.filter((item: any) => belongsToSector(item.province, sector)),
    incidents: data.incidents.filter((item: any) => belongsToSector(item.province, sector)),
    borders: data.borderLines.filter((item: any) => belongsToSector(item.province, sector) || (sector === 'Papua Selatan' && item.province === 'Papua')),
    labels: data.areaLabels.filter((item: any) => belongsToSector(item.province, sector)),
  }), [data, sector])

  useEffect(() => {
    if (!accessToken || !hostRef.current || mapRef.current) return
    mapboxgl.accessToken = accessToken
    try {
      const map = new mapboxgl.Map({ container: hostRef.current, style: MAP_STYLE, projection: MAP_PROJECTION, center: SECTOR_CAMERA[DEFAULT_SECTOR].center, zoom: SECTOR_CAMERA[DEFAULT_SECTOR].zoom, minZoom: 2.8, maxZoom: 11, pitch: 0, bearing: 0, attributionControl: false, antialias: true })
      mapRef.current = map
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-left')
      map.addControl(new mapboxgl.ScaleControl({ unit: 'metric', maxWidth: 110 }), 'bottom-left')
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')
      map.getCanvas().setAttribute('aria-label', 'Peta situasi perbatasan darat Indonesia')

      map.on('error', (event) => {
        if (/token|unauthorized|forbidden|webgl/i.test(event.error?.message ?? '')) setMapError('Mapbox tidak dapat dimuat. Periksa token dan dukungan WebGL.')
      })

      map.on('load', () => {
        map.setProjection(MAP_PROJECTION)
        map.setFog({ color: '#020b12', 'high-color': '#082936', 'horizon-blend': 0.04, 'space-color': '#01060a', 'star-intensity': 0.03 })
        map.getStyle().layers?.forEach((layer) => {
          if (layer.type === 'raster') {
            map.setPaintProperty(layer.id, 'raster-saturation', -0.62)
            map.setPaintProperty(layer.id, 'raster-contrast', 0.18)
            map.setPaintProperty(layer.id, 'raster-brightness-max', 0.58)
          }
        })

        ;['border', 'posts', 'informal', 'hotspots', 'patrols', 'incidents', 'labels'].forEach((id) => map.addSource(`land-${id}`, { type: 'geojson', data: collection([]) as any }))

        map.addLayer({ id: 'land-border-glow', type: 'line', source: 'land-border', paint: { 'line-color': '#86d9e8', 'line-width': 6, 'line-blur': 5, 'line-opacity': 0.2 } })
        map.addLayer({ id: 'land-border-core', type: 'line', source: 'land-border', paint: { 'line-color': '#b5e7ef', 'line-width': 1.5, 'line-opacity': 0.78, 'line-dasharray': [4, 2] } })
        map.addLayer({ id: 'land-informal-glow', type: 'line', source: 'land-informal', paint: { 'line-color': '#ff9f1c', 'line-width': 7, 'line-blur': 5, 'line-opacity': 0.16 } })
        map.addLayer({ id: 'land-informal-core', type: 'line', source: 'land-informal', paint: { 'line-color': '#ff9f1c', 'line-width': 2.1, 'line-opacity': 0.85, 'line-dasharray': [1.2, 1.8] } })
        map.addLayer({ id: 'land-patrol-glow', type: 'line', source: 'land-patrols', paint: { 'line-color': '#48df8b', 'line-width': 6, 'line-blur': 4, 'line-opacity': 0.12 } })
        map.addLayer({ id: 'land-patrol-core', type: 'line', source: 'land-patrols', paint: { 'line-color': '#48df8b', 'line-width': 1.8, 'line-opacity': 0.82, 'line-dasharray': [3, 2] } })
        map.addLayer({ id: 'land-hotspot-halo', type: 'circle', source: 'land-hotspots', paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 8, 8, 15], 'circle-color': '#ffbf3f', 'circle-opacity': 0.14, 'circle-blur': 0.55 } })
        map.addLayer({ id: 'land-hotspot-core', type: 'circle', source: 'land-hotspots', paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 3.2, 8, 6], 'circle-color': '#ffbf3f', 'circle-stroke-color': '#241604', 'circle-stroke-width': 1.5, 'circle-opacity': 0.94 } })
        map.addLayer({ id: 'land-post-halo', type: 'circle', source: 'land-posts', paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 8, 8, 14], 'circle-color': '#21d8ff', 'circle-opacity': 0.14, 'circle-blur': 0.45 } })
        map.addLayer({ id: 'land-post-symbol', type: 'symbol', source: 'land-posts', layout: { 'text-field': '▣', 'text-size': ['interpolate', ['linear'], ['zoom'], 3, 15, 8, 23], 'text-allow-overlap': true }, paint: { 'text-color': '#27dcff', 'text-halo-color': '#031019', 'text-halo-width': 2 } })
        map.addLayer({ id: 'land-post-label', type: 'symbol', source: 'land-posts', layout: { 'text-field': ['get', 'name'], 'text-size': ['interpolate', ['linear'], ['zoom'], 3, 10, 8, 14], 'text-offset': [0, 1.35], 'text-anchor': 'top', 'text-allow-overlap': false }, paint: { 'text-color': '#bcefff', 'text-halo-color': '#020b12', 'text-halo-width': 2 } })
        map.addLayer({ id: 'land-incident-halo', type: 'circle', source: 'land-incidents', paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 8, 8, 14], 'circle-color': '#ff4250', 'circle-opacity': 0.16, 'circle-blur': 0.45 } })
        map.addLayer({ id: 'land-incident-symbol', type: 'symbol', source: 'land-incidents', layout: { 'text-field': '◆', 'text-size': ['interpolate', ['linear'], ['zoom'], 3, 13, 8, 20], 'text-allow-overlap': true }, paint: { 'text-color': '#ff5260', 'text-halo-color': '#210307', 'text-halo-width': 2 } })
        map.addLayer({ id: 'land-incident-label', type: 'symbol', source: 'land-incidents', minzoom: 5, layout: { 'text-field': ['get', 'name'], 'text-size': 11, 'text-offset': [0, 1.25], 'text-anchor': 'top' }, paint: { 'text-color': '#ff9ba3', 'text-halo-color': '#020b12', 'text-halo-width': 2 } })
        map.addLayer({ id: 'land-area-label', type: 'symbol', source: 'land-labels', layout: { 'text-field': ['get', 'name'], 'text-size': ['interpolate', ['linear'], ['zoom'], 3, 12, 7, 17], 'text-letter-spacing': 0.12, 'text-allow-overlap': false }, paint: { 'text-color': '#8eaeb7', 'text-halo-color': '#020b12', 'text-halo-width': 2 } })

        const openPostPopup = (event: mapboxgl.MapLayerMouseEvent) => {
          const feature = event.features?.[0]
          if (!feature) return
          const properties = feature.properties as any
          const wrapper = document.createElement('div')
          wrapper.className = 'land-border-popup'
          const heading = document.createElement('strong'); heading.textContent = properties.name
          const sectorText = document.createElement('span'); sectorText.textContent = `${properties.province} · ${properties.sector}`
          const status = document.createElement('b'); status.textContent = properties.status
          const activity = document.createElement('small'); activity.textContent = `${Number(properties.people24h).toLocaleString('id-ID')} pelintas / 24 jam · ${properties.activity}`
          wrapper.append(heading, sectorText, status, activity)
          popupRef.current?.remove()
          popupRef.current = new mapboxgl.Popup({ closeButton: true, closeOnClick: true, offset: 14 }).setLngLat(event.lngLat).setDOMContent(wrapper).addTo(map)
        }
        ;['land-post-symbol', 'land-post-label'].forEach((layerId) => {
          map.on('mouseenter', layerId, () => { map.getCanvas().style.cursor = 'pointer' })
          map.on('mouseleave', layerId, () => { map.getCanvas().style.cursor = '' })
          map.on('click', layerId, openPostPopup)
        })
        setLoaded(true)
      })

      const observer = new ResizeObserver(() => map.resize())
      observer.observe(hostRef.current)
      return () => { observer.disconnect(); popupRef.current?.remove(); map.remove(); mapRef.current = null }
    } catch {
      setMapError('Mapbox gagal diinisialisasi untuk peta perbatasan darat.')
    }
  }, [accessToken])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded) return
    const sourceData: Record<string, unknown> = {
      'land-posts': collection(filtered.posts.map(point)),
      'land-informal': collection(filtered.informal.map(line)),
      'land-hotspots': collection(filtered.hotspots.map(point)),
      'land-patrols': collection(filtered.patrols.map(line)),
      'land-incidents': collection(filtered.incidents.map(point)),
      'land-border': collection(filtered.borders.map(line)),
      'land-labels': collection(filtered.labels.map(point)),
    }
    Object.entries(sourceData).forEach(([id, value]) => (map.getSource(id) as mapboxgl.GeoJSONSource | undefined)?.setData(value as any))
    const camera = SECTOR_CAMERA[sector]
    map.easeTo({ center: camera.center, zoom: camera.zoom, pitch: 0, bearing: 0, duration: 850 })
  }, [filtered, loaded, sector])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded) return
    const groups: Record<TLayerKey, string[]> = {
      posts: ['land-post-halo', 'land-post-symbol', 'land-post-label'],
      informal: ['land-informal-glow', 'land-informal-core'],
      hotspots: ['land-hotspot-halo', 'land-hotspot-core'],
      patrols: ['land-patrol-glow', 'land-patrol-core'],
      incidents: ['land-incident-halo', 'land-incident-symbol', 'land-incident-label'],
    }
    Object.entries(groups).forEach(([key, layerIds]) => layerIds.forEach((id) => map.getLayer(id) && map.setLayoutProperty(id, 'visibility', visibility[key as TLayerKey] ? 'visible' : 'none')))
  }, [loaded, visibility])

  if (!accessToken) return <div className="map-fallback"><strong>MAPBOX TOKEN REQUIRED</strong><span>Konfigurasikan MAPBOX_ACCESS_TOKEN pada root .env.</span></div>

  return (
    <div className="land-border-map">
      <div ref={hostRef} className="land-border-map__canvas" />
      <div className="land-border-map__controls glass-panel">
        {LAYER_CONTROLS.map((control) => <button key={control.key} type="button" className={visibility[control.key] ? 'is-active' : ''} onClick={() => setVisibility((current) => ({ ...current, [control.key]: !current[control.key] }))} aria-pressed={visibility[control.key]}><i className={`ph ph-${control.icon}`} /><span>{control.label}</span></button>)}
      </div>
      <label className="land-border-map__sector glass-panel"><span>Sektor peta</span><select value={sector} onChange={(event) => setSector(event.target.value)}>{Object.keys(SECTOR_CAMERA).map((item) => <option key={item}>{item}</option>)}</select><i className="ph ph-caret-down" /></label>
      <div className="land-border-map__updated glass-panel"><i />Update terakhir: {formatUpdate(data.lastUpdated)} WIB</div>
      {mapError && <div className="map-error" role="alert">{mapError}</div>}
    </div>
  )
}
