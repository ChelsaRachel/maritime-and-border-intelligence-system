import { Panel } from '@/components/common/Panel'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { VesselToolbar } from '@/features/mbis/vessel-intelligence/components/VesselToolbar'
import { useVesselFilters } from '@/features/mbis/vessel-intelligence/hooks/useVesselFilters'
import type { IVesselIntelligenceRecord } from '@/features/mbis/vessel-intelligence/types/vessel-intelligence.types'
import { TacticalMap } from '@/features/tactical/components/TacticalMap'
import type { CSSProperties } from 'react'

function formatNumber(value: number) {
  return value.toLocaleString('id-ID')
}

export function VesselIntelligenceWorkspace({ vessels }: { vessels: IVesselIntelligenceRecord[] }) {
  const filters = useVesselFilters(vessels)
  const vessel = filters.selected

  const exportReport = () => {
    if (!vessel) return
    const blob = new Blob([JSON.stringify(vessel, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `MBIS-${vessel.vesselProfile.name.replace(/\s+/g, '-').toLowerCase()}-report.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="vessel-intelligence">
      <VesselToolbar filters={filters} onExport={exportReport} />

      {!filters.filtered.length || !vessel ? (
        <div className="vessel-empty-state">
          <i className="ph ph-magnifying-glass-minus" aria-hidden="true" />
          <strong>Tidak ada kapal sesuai filter</strong>
          <span>Ubah kata pencarian atau reset filter untuk menampilkan kembali profil kapal.</span>
          <button type="button" onClick={filters.reset}>Reset Semua Filter</button>
        </div>
      ) : (
        <div className="vessel-dashboard">
          <Panel title="Profil Kapal" eyebrow={`${filters.filtered.length} kapal sesuai filter`} className="vessel-profile-panel span-3">
            <div className="vessel-profile-card">
              <img src={vessel.vesselProfile.image} alt={`Profil ${vessel.vesselProfile.name}`} />
              <div className="vessel-profile-card__heading">
                <div><h2>{vessel.vesselProfile.name}</h2><span>{vessel.vesselProfile.flag.emoji} {vessel.vesselProfile.flag.country}</span></div>
                <SeverityBadge value={filters.watchlistIds.has(vessel.vesselProfile.id) ? 'WATCHLIST' : vessel.vesselProfile.status} compact />
              </div>
              <dl>
                <div><dt>MMSI</dt><dd>{vessel.vesselProfile.mmsi}</dd></div>
                <div><dt>IMO</dt><dd>{vessel.vesselProfile.imo}</dd></div>
                <div><dt>Call Sign</dt><dd>{vessel.vesselProfile.callSign}</dd></div>
                <div><dt>Tipe</dt><dd>{vessel.vesselProfile.type}</dd></div>
                <div><dt>GT / DWT</dt><dd>{formatNumber(vessel.vesselProfile.gt)} / {formatNumber(vessel.vesselProfile.dwt)}</dd></div>
                <div><dt>Dimensi</dt><dd>{vessel.vesselProfile.lengthMeter} × {vessel.vesselProfile.beamMeter} m</dd></div>
                <div><dt>Dibangun</dt><dd>{vessel.vesselProfile.builtYear}</dd></div>
                <div><dt>Operator</dt><dd>{vessel.vesselProfile.operator}</dd></div>
                <div><dt>Manager</dt><dd>{vessel.vesselProfile.manager}</dd></div>
              </dl>
              <div className="vessel-position">
                <span>POSISI TERAKHIR · {vessel.vesselProfile.lastKnownPosition.datetime}</span>
                <strong>{vessel.vesselProfile.lastKnownPosition.latitude}, {vessel.vesselProfile.lastKnownPosition.longitude}</strong>
                <small>{vessel.vesselProfile.lastKnownPosition.location} · SOG {vessel.vesselProfile.lastKnownPosition.sog} · COG {vessel.vesselProfile.lastKnownPosition.cog}</small>
              </div>
            </div>
          </Panel>

          <Panel title="Riwayat Pelayaran" eyebrow={`${vessel.voyageHistory.periodDays} hari terakhir`} className="vessel-voyage-panel span-4 map-panel">
            <div className="vessel-voyage-map">
              <TacticalMap
                id={`vessel-intelligence-${vessel.vesselProfile.id}`}
                points={[{ id: vessel.vesselProfile.id, name: vessel.vesselProfile.name, coordinates: vessel.vesselProfile.lastKnownPosition.coordinates, severity: vessel.riskScoreAI.level }]}
                routes={[{ id: `route-${vessel.vesselProfile.id}`, name: `${vessel.vesselProfile.name} 90d`, coordinates: vessel.voyageHistory.track, risk: vessel.riskScoreAI.level }]}
                center={vessel.vesselProfile.lastKnownPosition.coordinates}
                zoom={4.2}
                compact
              />
            </div>
            <div className="voyage-metrics">
              <article><span>Jarak Tempuh</span><strong>{formatNumber(vessel.voyageHistory.distanceNm)} <small>NM</small></strong></article>
              <article><span>Pelabuhan</span><strong>{vessel.voyageHistory.portsVisited}</strong></article>
              <article><span>Negara</span><strong>{vessel.voyageHistory.countriesVisited}</strong></article>
              <article><span>Kecepatan</span><strong>{vessel.voyageHistory.averageSpeedKn} <small>kn</small></strong></article>
              <article><span>Waktu di Laut</span><strong>{vessel.voyageHistory.timeAtSea}</strong></article>
            </div>
          </Panel>

          <Panel title="Skor Risiko AI" eyebrow={vessel.riskScoreAI.modelVersion} className="vessel-risk-panel span-2">
            <div className={`vessel-risk-gauge vessel-risk-gauge--${vessel.riskScoreAI.level.toLowerCase()}`} style={{ '--risk-score': vessel.riskScoreAI.score } as CSSProperties}>
              <div><strong>{vessel.riskScoreAI.score}</strong><span>/100</span></div>
            </div>
            <b>{vessel.riskScoreAI.level}</b>
            <small>Diperbarui {vessel.riskScoreAI.updatedAt}</small>
          </Panel>

          <Panel title="Faktor Risiko" eyebrow="Explainable assessment" className="vessel-risk-factor-panel span-3">
            <div className="vessel-risk-factors">
              {vessel.riskFactors.map((factor) => (
                <article key={factor.id} className={`risk-factor risk-factor--${factor.severity.toLowerCase()}`}>
                  <i className={factor.id === 'AIS_GAP' ? 'ph ph-warning' : factor.id === 'ROUTE' ? 'ph ph-path' : factor.id === 'FLAG' ? 'ph ph-flag' : 'ph ph-link'} aria-hidden="true" />
                  <div><strong>{factor.label}</strong><span>{factor.description}</span><small>{factor.evidence}</small></div>
                  <SeverityBadge value={factor.severity} compact />
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Riwayat Pelabuhan" eyebrow={`${vessel.portHistory.periodDays} hari terakhir`} className="span-4 vessel-table-panel">
            <div className="vessel-table-wrap"><table className="vessel-table"><thead><tr><th>Tanggal</th><th>Pelabuhan</th><th>Negara</th><th>Kedatangan</th><th>Keberangkatan</th><th>Durasi</th></tr></thead><tbody>{vessel.portHistory.calls.map((call) => <tr key={`${call.date}-${call.port}`}><td>{call.date}</td><td>{call.port}</td><td>{call.country}</td><td>{call.arrival}</td><td>{call.departure}</td><td>{call.duration}</td></tr>)}</tbody></table></div>
          </Panel>

          <Panel title="Kepemilikan & Operator" eyebrow="Riwayat registry" className="span-3 vessel-table-panel">
            <div className="vessel-history-list">{vessel.ownershipOperatorHistory.map((record) => <article key={record.period}><i /><span>{record.period}</span><div><strong>{record.owner}</strong><small>{record.operator} · {record.role}</small></div></article>)}</div>
          </Panel>

          <Panel title="Perubahan Bendera" eyebrow="Flag history" className="span-2 vessel-table-panel">
            <div className="vessel-flag-history">{vessel.flagChangeHistory.map((record) => <article key={record.period}><span>{record.period}</span><strong>{record.flag.emoji} {record.flag.country}</strong><small>{record.note}</small></article>)}</div>
          </Panel>

          <Panel title="Graf Intelijen" eyebrow="Relationship" className="span-3 vessel-graph-panel">
            <div className="vessel-graph">
              <div className="vessel-graph__column">{vessel.intelligenceGraph.ports.map((item) => <article key={item.name}><i className="ph ph-anchor" /><span><strong>{item.name}</strong><small>{item.relation}</small></span></article>)}</div>
              <div className="vessel-graph__core"><i className="ph ph-boat" /><strong>{vessel.vesselProfile.name}</strong><small>IMO {vessel.vesselProfile.imo}</small></div>
              <div className="vessel-graph__column">{[...vessel.intelligenceGraph.organizations, ...vessel.intelligenceGraph.vessels].slice(0, 3).map((item) => <article key={`${item.name}-${item.relation}`}><i className="ph ph-buildings" /><span><strong>{item.name}</strong><small>{item.relation}</small></span></article>)}</div>
            </div>
          </Panel>

          <Panel title="Log AIS Gap" eyebrow={`${vessel.aisGapLogs.periodDays} hari · ${vessel.aisGapLogs.total} kejadian`} className="span-4 vessel-table-panel">
            <div className="vessel-table-wrap"><table className="vessel-table"><thead><tr><th>#</th><th>Mulai</th><th>Selesai</th><th>Durasi</th><th>Lokasi</th><th>Status</th></tr></thead><tbody>{vessel.aisGapLogs.records.map((gap, index) => <tr key={gap.id}><td>{index + 1}</td><td>{gap.start}</td><td>{gap.end}</td><td>{gap.duration}</td><td>{gap.location}</td><td><SeverityBadge value={gap.status} compact /></td></tr>)}</tbody></table></div>
          </Panel>

          <Panel title="Evidence & Verifikasi" eyebrow={vessel.vesselProfile.dataBasis === 'public-reference' ? 'Public-reference anchor' : 'Realistic synthetic profile'} className="span-5 vessel-evidence-panel">
            <div className="vessel-evidence-grid">{vessel.evidenceVerification.map((evidence) => <article key={evidence.source}><i className={evidence.source === 'AIS' ? 'ph ph-broadcast' : evidence.source === 'SATELLITE' ? 'ph ph-crosshair' : 'ph ph-files'} /><span>{evidence.source}</span><strong>{evidence.count} bukti</strong><small>{evidence.verification}</small><em>{evidence.latest}</em></article>)}</div>
            <div className="vessel-analyst-note"><span>CATATAN ANALIS</span><p>{vessel.analystNote.note}</p><small>— {vessel.analystNote.author} · {vessel.analystNote.updatedAt}</small></div>
          </Panel>

          <Panel title="Insiden Terkait" eyebrow={`${vessel.relatedIncidents.total} correlated records`} className="span-3 vessel-table-panel">
            {vessel.relatedIncidents.records.length ? <div className="vessel-incident-list">{vessel.relatedIncidents.records.map((incident) => <article key={incident.id}><header><time>{incident.date}</time><SeverityBadge value={incident.riskLevel} compact /></header><strong>{incident.type}</strong><span><i className="ph ph-map-pin" />{incident.location}</span><p>{incident.description}</p></article>)}</div> : <div className="vessel-panel-empty"><i className="ph ph-shield-check" /><span>Tidak ada insiden terkait aktif.</span></div>}
          </Panel>
        </div>
      )}
    </div>
  )
}
