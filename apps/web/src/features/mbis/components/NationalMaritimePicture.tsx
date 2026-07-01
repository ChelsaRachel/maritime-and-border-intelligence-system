import { DataState } from '@/components/common/DataState'
import { NmpMapBridge } from '@/features/mbis/components/NmpMapBridge'
import { NmpTacticalPopup } from '@/features/mbis/components/NmpTacticalPopup'
import { DEFAULT_NMP_LAYER_VISIBILITY, type TNmpLayerGroup } from '@/features/mbis/config/nmp-layers.config'
import { useNmpReplay, type TNmpReplaySpeed } from '@/features/mbis/hooks/useNmpReplay'
import type { INmpAlert, TCoordinates } from '@/features/mbis/types/nmp.types'
import { useMbisStore } from '@/stores/useMbisStore'
import { useEffect, useMemo, useRef, useState } from 'react'

const LAYER_CONTROLS: Array<{ key: TNmpLayerGroup; label: string; icon: string }> = [
  { key: 'vessels', label: 'Posisi Kapal', icon: 'boat' },
  { key: 'routes', label: 'Jalur Pelayaran Resmi', icon: 'path' },
  { key: 'aircraft', label: 'Pesawat / ADS-B', icon: 'airplane-tilt' },
  { key: 'boundaries', label: 'Batas ZEE', icon: 'bounding-box' },
  { key: 'zones', label: 'Zona Sengketa', icon: 'polygon' },
  { key: 'activity', label: 'Heatmap & alert', icon: 'fire' },
  { key: 'ports', label: 'Pelabuhan', icon: 'anchor' },
  { key: 'labels', label: 'Label taktis', icon: 'tag' },
]

interface ISearchResult {
  id: string
  label: string
  detail: string
  coordinates: TCoordinates
  entityId?: string
}

function formatReplayTime(timestamp: string) {
  return new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(timestamp))
}

function formatShortTime(timestamp: string) {
  return new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(timestamp))
}

export function NationalMaritimePicture() {
  const nmpEntities = useMbisStore((state) => state.nmpEntities)
  const nmpGeography = useMbisStore((state) => state.nmpGeography)
  const nmpIntelligence = useMbisStore((state) => state.nmpIntelligence)
  const nmpReplay = useMbisStore((state) => state.nmpReplay)
  const loading = useMbisStore((state) => state.loading)
  const error = useMbisStore((state) => state.error)
  const [visibility, setVisibility] = useState({ ...DEFAULT_NMP_LAYER_VISIBILITY })
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focusTarget, setFocusTarget] = useState<{ coordinates: TCoordinates; sequence: number } | null>(null)
  const [weatherExpanded, setWeatherExpanded] = useState(false)
  const [sourceExpanded, setSourceExpanded] = useState(false)
  const [layersCollapsed, setLayersCollapsed] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const ready = Boolean(nmpEntities && nmpGeography && nmpIntelligence && nmpReplay)

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  return (
    <DataState loading={loading} error={error} ready={ready}>
      {nmpEntities && nmpGeography && nmpIntelligence && nmpReplay && (
        <NmpOperationalSurface
          entitiesFixture={nmpEntities}
          geography={nmpGeography}
          intelligence={nmpIntelligence}
          replayFixture={nmpReplay}
          visibility={visibility}
          setVisibility={setVisibility}
          search={search}
          setSearch={setSearch}
          searchRef={searchRef}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          focusTarget={focusTarget}
          setFocusTarget={setFocusTarget}
          weatherExpanded={weatherExpanded}
          setWeatherExpanded={setWeatherExpanded}
          sourceExpanded={sourceExpanded}
          setSourceExpanded={setSourceExpanded}
          layersCollapsed={layersCollapsed}
          setLayersCollapsed={setLayersCollapsed}
        />
      )}
    </DataState>
  )
}

type TSurfaceProps = {
  entitiesFixture: NonNullable<ReturnType<typeof useMbisStore.getState>['nmpEntities']>
  geography: NonNullable<ReturnType<typeof useMbisStore.getState>['nmpGeography']>
  intelligence: NonNullable<ReturnType<typeof useMbisStore.getState>['nmpIntelligence']>
  replayFixture: NonNullable<ReturnType<typeof useMbisStore.getState>['nmpReplay']>
  visibility: Record<TNmpLayerGroup, boolean>
  setVisibility: React.Dispatch<React.SetStateAction<Record<TNmpLayerGroup, boolean>>>
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  searchRef: React.RefObject<HTMLInputElement>
  selectedId: string | null
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>
  focusTarget: { coordinates: TCoordinates; sequence: number } | null
  setFocusTarget: React.Dispatch<React.SetStateAction<{ coordinates: TCoordinates; sequence: number } | null>>
  weatherExpanded: boolean
  setWeatherExpanded: React.Dispatch<React.SetStateAction<boolean>>
  sourceExpanded: boolean
  setSourceExpanded: React.Dispatch<React.SetStateAction<boolean>>
  layersCollapsed: boolean
  setLayersCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

function NmpOperationalSurface(props: TSurfaceProps) {
  const replay = useNmpReplay(props.entitiesFixture, props.replayFixture, props.intelligence.alerts)
  const selected = replay.currentEntities.find((entity) => entity.id === props.selectedId) ?? null
  const [selectedAlert, setSelectedAlert] = useState<INmpAlert | null>(null)
  const highRiskCount = props.entitiesFixture.vessels.filter((vessel) => vessel.severity === 'CRITICAL' || vessel.severity === 'HIGH').length
  const sourceFusion = props.replayFixture.sourceHealth.reduce((sum, source) => sum + source.confidence, 0) / props.replayFixture.sourceHealth.length
  const latestAlert = replay.activeAlerts[0] ?? props.intelligence.alerts[props.intelligence.alerts.length - 1]

  useEffect(() => {
    if (selectedAlert && !replay.activeAlerts.some((alert) => alert.id === selectedAlert.id)) setSelectedAlert(null)
  }, [replay.activeAlerts, selectedAlert])

  const allSearchTargets = useMemo<ISearchResult[]>(() => [
    ...replay.currentEntities.map((entity) => ({
      id: entity.id,
      entityId: entity.id,
      label: entity.label,
      detail: entity.category === 'VESSEL'
        ? `AIS · ${(entity.detail as any).mmsi} · ${(entity.detail as any).destination}`
        : `ADS-B · ${(entity.detail as any).registration} · ${(entity.detail as any).destination}`,
      coordinates: entity.coordinates,
    })),
    ...props.geography.chokepoints.map((item) => ({ id: item.id, label: item.name, detail: `CHOKE POINT · ${item.traffic}`, coordinates: item.coordinates })),
    ...props.geography.ports.map((item) => ({ id: item.id, label: `Pelabuhan ${item.name}`, detail: `PORT · ${item.region}`, coordinates: item.coordinates })),
    ...props.geography.sensors.map((item) => ({ id: item.id, label: item.name, detail: `SENSOR · ${item.status}`, coordinates: item.coordinates })),
  ], [props.geography.chokepoints, props.geography.ports, props.geography.sensors, replay.currentEntities])

  const searchResults = useMemo(() => {
    const query = props.search.trim().toLocaleLowerCase('id-ID')
    if (query.length < 2) return []
    return allSearchTargets.filter((target) => `${target.label} ${target.detail} ${target.id}`.toLocaleLowerCase('id-ID').includes(query)).slice(0, 8)
  }, [allSearchTargets, props.search])

  const selectMapFeature = (id: string) => {
    const entity = replay.currentEntities.find((item) => item.id === id)
    if (entity) {
      setSelectedAlert(null)
      props.setSelectedId(id)
      props.setFocusTarget({ coordinates: entity.coordinates, sequence: Date.now() })
      return
    }
    const target = allSearchTargets.find((item) => item.id === id)
    if (target) props.setFocusTarget({ coordinates: target.coordinates, sequence: Date.now() })
  }

  const selectAlert = (id: string) => {
    const alert = replay.activeAlerts.find((item) => item.id === id)
    if (!alert) return
    props.setSelectedId(null)
    setSelectedAlert(alert)
    props.setFocusTarget({ coordinates: alert.coordinates, sequence: Date.now() })
  }

  const selectSearchResult = (result: ISearchResult) => {
    props.setSearch('')
    if (result.entityId) props.setSelectedId(result.entityId)
    props.setFocusTarget({ coordinates: result.coordinates, sequence: Date.now() })
  }

  return (
    <div className="nmp-screen">
      <NmpMapBridge
        geography={props.geography}
        entities={replay.currentEntities}
        activeAlerts={replay.activeAlerts}
        visibility={props.visibility}
        selectedId={props.selectedId}
        focusTarget={props.focusTarget}
        onSelectEntity={selectMapFeature}
        onSelectAlert={selectAlert}
      />
      <div className="nmp-vignette" aria-hidden="true" />

      <div className="nmp-search glass-panel">
        <i className="ph ph-magnifying-glass" />
        <input ref={props.searchRef} aria-label="Cari target atau area" value={props.search} onChange={(event) => props.setSearch(event.target.value)} placeholder="Cari vessel, MMSI, IMO, callsign, area…" />
        {props.search ? <button type="button" onClick={() => props.setSearch('')} aria-label="Bersihkan pencarian"><i className="ph ph-x" /></button> : <kbd>⌘ K</kbd>}
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result) => <button key={result.id} type="button" onClick={() => selectSearchResult(result)}><strong>{result.label}</strong><span>{result.detail}</span></button>)}
          </div>
        )}
      </div>

      <div className="nmp-alert-ticker glass-panel" aria-live="polite">
        <i className="ph-fill ph-warning" />
        <span>{latestAlert.severity}</span>
        <button type="button" onClick={() => selectAlert(latestAlert.id)}>{latestAlert.title} · {latestAlert.entityName}</button>
        <time>{formatShortTime(latestAlert.timestamp)} WIB</time>
      </div>

      <section className={`nmp-weather glass-panel ${props.weatherExpanded ? 'is-expanded' : ''}`}>
        <header><span>KONDISI CUACA · LAUT</span><i className="ph ph-cloud-rain" /></header>
        <div className="nmp-weather__primary">
          {props.replayFixture.weather.slice(0, 4).map((item) => <article key={item.area}><span>{item.area}</span><strong>{item.waveHeightM} m</strong><small>{item.condition} · {item.windKnots} kt</small></article>)}
        </div>
        {props.weatherExpanded && <div className="nmp-weather__detail">{props.replayFixture.weather.map((item) => <span key={item.area}><b>{item.area}</b><small>Arus {item.currentKnots} kt · Vis {item.visibilityNm} nm · {item.waveClass}</small></span>)}</div>}
        <button type="button" onClick={() => props.setWeatherExpanded((value) => !value)}>{props.weatherExpanded ? 'Tutup detail' : 'Detail cuaca & laut'} <i className={`ph ph-caret-${props.weatherExpanded ? 'up' : 'right'}`} /></button>
      </section>

      {props.layersCollapsed ? (
        <button className="nmp-layers-restore glass-panel" type="button" onClick={() => props.setLayersCollapsed(false)} aria-label="Buka kontrol lapisan"><i className="ph ph-stack" /><span>LAYER</span></button>
      ) : (
        <aside className="nmp-layers glass-panel">
          <header><div><span>KONTROL LAPISAN</span><strong>TACTICAL OVERLAY</strong></div><button type="button" onClick={() => props.setLayersCollapsed(true)} aria-label="Tutup kontrol lapisan"><i className="ph ph-caret-right" /></button></header>
          <div className="nmp-layers__list">
            {LAYER_CONTROLS.map((layer) => (
              <button type="button" key={layer.key} onClick={() => props.setVisibility((state) => ({ ...state, [layer.key]: !state[layer.key] }))} className={props.visibility[layer.key] ? 'is-on' : ''} aria-pressed={props.visibility[layer.key]}>
                <i className={`ph ph-${layer.icon}`} /><span>{layer.label}</span><b><i /></b>
              </button>
            ))}
          </div>
          <div className="layer-legend"><span><i className="legend-dot legend-dot--critical" />Risiko tinggi</span><span><i className="legend-dot legend-dot--high" />Risiko sedang</span><span><i className="legend-dot legend-dot--low" />Risiko rendah</span><span><i className="legend-dot legend-dot--normal" />Aman / normal</span></div>
          <div className={`source-fusion ${props.sourceExpanded ? 'is-expanded' : ''}`}>
            <span>masih</span><strong>{sourceFusion.toFixed(1)}%</strong><progress max="100" value={sourceFusion} />
            {props.sourceExpanded && <div>{props.replayFixture.sourceHealth.map((source) => <small key={source.id}><i className={`source-dot source-dot--${source.status.toLowerCase()}`} />{source.name}<b>{source.status}</b></small>)}</div>}
            <button type="button" onClick={() => props.setSourceExpanded((value) => !value)}>{props.sourceExpanded ? 'Ringkas fusi' : 'Lihat detail fusi'} <i className={`ph ph-caret-${props.sourceExpanded ? 'up' : 'right'}`} /></button>
          </div>
        </aside>
      )}

      <NmpTacticalPopup entity={selected} alert={selectedAlert} onClose={() => { props.setSelectedId(null); setSelectedAlert(null) }} />

      <aside className="nmp-metrics glass-panel" aria-label="Ringkasan operasional National Maritime Picture">
        <article><span>TOTAL KAPAL · AIS</span><strong>{props.entitiesFixture.vessels.length.toLocaleString('id-ID')}</strong><small className="text-low">▲ 12.4% vs baseline</small><i className="metric-spark metric-spark--cyan" /></article>
        <article><span>KAPAL RISIKO TINGGI</span><strong className="text-critical">{highRiskCount}</strong><small className="text-critical">▲ 8.7% dalam 24 jam</small><i className="metric-spark metric-spark--red" /></article>
        <article><span>ANOMALI AKTIF</span><strong className="text-high">{props.intelligence.anomalies.length}</strong><small className="text-high">{replay.frame.eventCount} pada frame aktif</small><i className="metric-spark metric-spark--orange" /></article>
        <article><span>STATUS CHOKE POINT</span><strong>{props.geography.chokepoints.filter((item) => item.risk === 'CRITICAL').length} / {props.geography.chokepoints.length}</strong><small>Pengawasan diperketat</small><i className="metric-ring" /></article>
        <article><span>PESAWAT TERDETEKSI</span><strong>{props.entitiesFixture.aircraft.length}</strong><small className="text-low">{replay.frame.aircraftCount} aktif pada frame</small><i className="metric-spark metric-spark--green" /></article>
        <article><span>AKTIVITAS PERAIRAN</span><strong>{replay.frame.activity}</strong><small>{replay.frame.vesselCount} target bergerak</small><i className="metric-spark metric-spark--cyan" /></article>
        <article><span>ALERT TERAKHIR</span><strong className="text-critical">{formatShortTime(latestAlert.timestamp)} WIB</strong><small>{latestAlert.entityName}</small><i className="ph ph-bell-ringing" /></article>
      </aside>

      <div className="nmp-map-legend glass-panel" aria-label="Legenda peta taktis">
        <span><i className="legend-arrow legend-arrow--critical" />Kapal risiko tinggi</span>
        <span><i className="legend-arrow legend-arrow--medium" />Kapal risiko sedang</span>
        <span><i className="legend-arrow legend-arrow--low" />Kapal risiko rendah</span>
        <span><i className="ph-fill ph-airplane-tilt" />Pesawat</span>
        <span><i className="legend-heat" />Hotspot aktivitas</span>
        <span><i className="legend-line legend-line--route" />Jalur ALKI</span>
        <span><i className="legend-line" />Batas ZEE</span>
        <span><i className="legend-hatch" />Restricted / disputed</span>
      </div>

      <section className={`nmp-bottom ${props.layersCollapsed ? 'nmp-bottom--wide' : ''}`}>
        <div className="nmp-replay glass-panel">
          <div className="nmp-replay__heading"><span>REPLAY AKTIVITAS 24 JAM TERAKHIR</span><i /><strong>{formatReplayTime(replay.frame.timestamp)} WIB</strong><button type="button" className={replay.isLive ? 'is-live' : 'is-replay'} onClick={replay.goLive}><i className="ph-fill ph-circle" />{replay.isLive ? 'Live Sekarang' : 'Replay Mode · Kembali Live'}</button></div>
          <div className="nmp-replay__body">
            <div className="nmp-replay__controls">
              <button type="button" onClick={replay.playPause} aria-label={replay.isPlaying ? 'Jeda replay' : 'Putar replay'}><i className={`ph-fill ph-${replay.isPlaying ? 'pause' : 'play'}`} /></button>
              <button type="button" onClick={replay.stepBackward} aria-label="Mundur satu frame"><i className="ph-fill ph-skip-back" /></button>
              <button type="button" onClick={replay.stepForward} aria-label="Maju satu frame"><i className="ph-fill ph-skip-forward" /></button>
              <label><span>Kecepatan replay</span><select value={replay.speed} onChange={(event) => replay.setSpeed(Number(event.target.value) as TNmpReplaySpeed)} aria-label="Kecepatan replay"><option value="1">1x</option><option value="2">2x</option><option value="4">4x</option></select></label>
            </div>
            <div className="nmp-replay__timeline">
              <div className="nmp-replay__histogram" aria-hidden="true">
                {props.replayFixture.replayFrames.map((frame, index) => <i key={frame.timestamp} className={index === replay.currentIndex ? 'is-current' : index < replay.currentIndex ? 'is-past' : ''} style={{ height: `${Math.max(16, frame.activity)}%` }} />)}
              </div>
              <input type="range" min="0" max={props.replayFixture.replayFrames.length - 1} value={replay.currentIndex} onChange={(event) => replay.seek(Number(event.target.value))} aria-label="Scrub timeline replay 24 jam" />
              <div className="nmp-replay__labels"><span>-24:00</span><span>-20:00</span><span>-16:00</span><span>-12:00</span><span>-08:00</span><span>-04:00</span><span>Sekarang</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
