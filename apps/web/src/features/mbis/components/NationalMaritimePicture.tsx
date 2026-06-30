import { DataState } from '@/components/common/DataState'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { TacticalMap } from '@/features/tactical/components/TacticalMap'
import { useMbisStore } from '@/stores/useMbisStore'
import type { IMapPoint, IMapRoute } from '@/types/mbis'
import { useMemo, useState } from 'react'

const MONITORING_ZONES = [
  { id: 'ZN-NATUNA', name: 'Natuna Strategic Monitoring Area', severity: 'CRITICAL', coordinates: [[[106.5, 2.2], [110.8, 2.2], [110.8, 6.5], [106.5, 6.5], [106.5, 2.2]]] as [number, number][][] },
  { id: 'ZN-AMBALAT', name: 'Ambalat Monitoring Sector', severity: 'HIGH', coordinates: [[[117.2, 3.2], [119.5, 3.2], [119.5, 5.3], [117.2, 5.3], [117.2, 3.2]]] as [number, number][][] },
  { id: 'ZN-ARAFURA', name: 'Arafura Activity Buffer', severity: 'MEDIUM', coordinates: [[[132.1, -9.5], [138.9, -9.5], [138.9, -5.2], [132.1, -5.2], [132.1, -9.5]]] as [number, number][][] },
]

const LAYERS = [
  ['vessels', 'Kapal / AIS', 'boat'], ['aircraft', 'Pesawat / ADS-B', 'airplane-tilt'], ['routes', 'Jalur pelayaran', 'path'], ['zones', 'Zona pemantauan', 'polygon'], ['activity', 'Heatmap aktivitas', 'fire'],
] as const

export function NationalMaritimePicture() {
  const overview = useMbisStore((state) => state.overview)
  const loading = useMbisStore((state) => state.loading)
  const error = useMbisStore((state) => state.error)
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({ vessels: true, aircraft: true, routes: true, zones: true, activity: true })
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const mapPoints = useMemo<IMapPoint[]>(() => {
    if (!overview) return []
    const vessels = activeLayers.vessels ? overview.vessels.map((item: any) => ({ ...item, severity: item.status })) : []
    const aircraft = activeLayers.aircraft ? overview.aircraft.map((item: any) => ({ ...item, name: item.callSign, type: 'Aircraft', severity: item.status })) : []
    const chokepoints = overview.chokepoints.map((item: any) => ({ ...item, severity: item.risk, type: 'Chokepoint' }))
    return [...vessels, ...aircraft, ...chokepoints]
  }, [activeLayers.aircraft, activeLayers.vessels, overview])

  const selected = mapPoints.find((item) => item.id === selectedId)
  const searchResults = search.length > 1 ? mapPoints.filter((item) => String(item.name ?? item.callSign ?? '').toLowerCase().includes(search.toLowerCase())).slice(0, 5) : []

  return (
    <DataState loading={loading} error={error} ready={Boolean(overview)}>
      {overview && (
        <div className="nmp-screen">
          <TacticalMap id="nmp" points={mapPoints} routes={activeLayers.routes ? overview.shippingRoutes as IMapRoute[] : []} zones={activeLayers.zones ? MONITORING_ZONES : []} onSelectPoint={setSelectedId} />
          <div className="nmp-vignette" aria-hidden="true" />

          <div className="nmp-search glass-panel">
            <i className="ph ph-magnifying-glass" />
            <input aria-label="Cari entitas" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari vessel, MMSI, call sign, atau area…" />
            <kbd>⌘ K</kbd>
            {searchResults.length > 0 && <div className="search-results">{searchResults.map((result) => <button key={result.id} type="button" onClick={() => { setSelectedId(result.id); setSearch('') }}><strong>{String(result.name ?? result.callSign)}</strong><span>{String(result.type ?? 'ENTITY')} · {result.id}</span></button>)}</div>}
          </div>

          <div className="nmp-weather glass-panel">
            <header><span>SEA STATE / WEATHER</span><i className="ph ph-cloud-rain" /></header>
            <div>{overview.weather.slice(0, 3).map((item: any) => <article key={item.area}><span>{item.area}</span><strong>{item.waveHeight} m</strong><small>{item.condition} · {item.windKnots} kt</small></article>)}</div>
          </div>

          <aside className="nmp-layers glass-panel">
            <header><div><span>TACTICAL OVERLAY</span><strong>Layer control</strong></div><i className="ph ph-stack" /></header>
            {LAYERS.map(([key, label, icon]) => <button type="button" key={key} onClick={() => setActiveLayers((state) => ({ ...state, [key]: !state[key] }))} className={activeLayers[key] ? 'is-on' : ''}><i className={`ph ph-${icon}`} /><span>{label}</span><b>{activeLayers[key] ? 'ON' : 'OFF'}</b></button>)}
            <div className="layer-legend"><span><i className="legend-dot legend-dot--critical" />Critical</span><span><i className="legend-dot legend-dot--high" />High</span><span><i className="legend-dot legend-dot--medium" />Medium</span><span><i className="legend-dot legend-dot--normal" />Normal</span></div>
            <div className="source-fusion"><span>FUSION CONFIDENCE</span><strong>{overview.summary.sourceFusion}%</strong><progress max="100" value={overview.summary.sourceFusion} /></div>
          </aside>

          {selected && <div className="nmp-selection glass-panel"><button type="button" onClick={() => setSelectedId(null)} aria-label="Tutup detail"><i className="ph ph-x" /></button><span>ENTITY FOCUS</span><strong>{String(selected.name ?? selected.callSign)}</strong><small>{selected.id} · {String(selected.type ?? 'TRACKED ENTITY')}</small><SeverityBadge value={String(selected.severity ?? 'NORMAL')} /></div>}

          <section className="nmp-bottom">
            <div className="nmp-metrics glass-panel">
              <article><span>TRACKED VESSELS</span><strong>{overview.summary.trackedVessels.toLocaleString('id-ID')}</strong><small className="text-low">▲ 12.4%</small></article>
              <article><span>HIGH RISK VESSELS</span><strong className="text-critical">{overview.summary.highRiskVessels}</strong><small className="text-critical">▲ 8.7%</small></article>
              <article><span>ACTIVE ANOMALIES</span><strong className="text-high">{overview.summary.activeAnomalies}</strong><small className="text-high">▲ 15.0%</small></article>
              <article><span>CHOKEPOINT STATUS</span><strong>{overview.chokepoints.filter((item: any) => item.risk === 'CRITICAL').length} / 4</strong><small>Elevated watch</small></article>
              <article><span>AIRCRAFT MONITORED</span><strong>{overview.summary.monitoredAircraft}</strong><small className="text-low">▲ 6.1%</small></article>
              <article><span>LATEST ALERT</span><strong className="text-critical">{overview.alerts[0].time}</strong><small>{overview.alerts[0].entity}</small></article>
            </div>
            <div className="nmp-replay glass-panel">
              <button type="button" aria-label="Putar replay"><i className="ph-fill ph-play" /></button>
              <div><header><span>24 HOUR ACTIVITY REPLAY</span><strong>09:42:18 WIB · LIVE</strong></header><div className="replay-bars" aria-label="Grafik replay aktivitas">{overview.replay.map((value: number, index: number) => <i key={index} style={{ height: `${Math.max(12, value / 2.4)}%` }} />)}</div></div>
            </div>
          </section>
        </div>
      )}
    </DataState>
  )
}
