import { Panel } from '@/components/common/Panel'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { PerfectScrollArea } from '@/components/wrappers/PerfectScrollArea'
import { useMemo, useState } from 'react'

type TWarningSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
type TSeverityFilter = 'ALL' | TWarningSeverity

interface IFeaturedGeofenceWarning {
  id: string
  title: string
  subtitle: string
  severity: TWarningSeverity
  count: number
  iconType: string
}

interface IGeofenceWarning {
  id: string
  timestamp: string
  location: string
  province: string
  borderSector: string
  category: string
  alertType: string
  severity: TWarningSeverity
  confidence: number
  count: number
  sourceFusion: string[]
  handlingStatus: string
  recommendation: string
  coordinates: [number, number]
  chronology: string
  relatedArea: string
  escalationStatus: string
}

const SEVERITIES: TSeverityFilter[] = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const CATEGORY_FILTERS = ['ALL', 'JALUR TIKUS', 'PENYELUNDUPAN', 'GEOFENCE', 'AKTIVITAS TIDAK DIKENAL']
const ICONS: Record<string, string> = { radar: 'crosshair', 'shield-warning': 'shield-warning', path: 'path' }

function formatWarningTime(timestamp: string) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(timestamp))
}

export function GeofenceWarnings({ featuredWarnings, warnings }: { featuredWarnings: IFeaturedGeofenceWarning[]; warnings: IGeofenceWarning[] }) {
  const [open, setOpen] = useState(false)
  const [severity, setSeverity] = useState<TSeverityFilter>('ALL')
  const [category, setCategory] = useState('ALL')
  const [selectedId, setSelectedId] = useState<string | null>(warnings[0]?.id ?? null)

  const counts = useMemo(() => ({
    total: warnings.length,
    CRITICAL: warnings.filter((item) => item.severity === 'CRITICAL').length,
    HIGH: warnings.filter((item) => item.severity === 'HIGH').length,
    MEDIUM: warnings.filter((item) => item.severity === 'MEDIUM').length,
    LOW: warnings.filter((item) => item.severity === 'LOW').length,
    investigating: warnings.filter((item) => item.handlingStatus === 'Dalam investigasi').length,
    escalated: warnings.filter((item) => item.handlingStatus === 'Sudah dieskalasi').length,
  }), [warnings])

  const filteredWarnings = useMemo(() => warnings.filter((item) => (
    (severity === 'ALL' || item.severity === severity)
    && (category === 'ALL' || item.category === category)
  )), [category, severity, warnings])

  const selected = warnings.find((item) => item.id === selectedId) ?? filteredWarnings[0] ?? null

  return (
    <>
      <Panel title="Geofence Warnings" eyebrow="Priority sectors" className="span-4 geofence-warning-panel">
        <div className="geofence-warning-list">
          {featuredWarnings.slice(0, 3).map((warning) => (
            <button key={warning.id} type="button" className={`geofence-warning geofence-warning--${warning.severity.toLowerCase()}`} onClick={() => { setSelectedId(warning.id); setOpen(true) }}>
              <i className={`ph ph-${ICONS[warning.iconType] ?? 'warning-diamond'}`} aria-hidden="true" />
              <span><strong>{warning.title}</strong><small>{warning.subtitle}</small></span>
              <b>{warning.count}</b>
            </button>
          ))}
        </div>
        <button type="button" className="geofence-warning-more" onClick={() => setOpen(true)}>Lihat Semua Peringatan <i className="ph ph-arrow-right" aria-hidden="true" /></button>
      </Panel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="geofence-modal">
          <DialogTitle className="geofence-modal__title">Semua Peringatan Geofence</DialogTitle>
          <DialogDescription className="geofence-modal__subtitle">Pelanggaran area, jalur tikus, dan titik rawan penyelundupan perbatasan</DialogDescription>

          <div className="geofence-summary" aria-label="Ringkasan peringatan geofence">
            <article><span>Aktif</span><strong>{counts.total}</strong></article>
            <article className="is-critical"><span>Critical</span><strong>{counts.CRITICAL}</strong></article>
            <article className="is-high"><span>High</span><strong>{counts.HIGH}</strong></article>
            <article className="is-medium"><span>Medium</span><strong>{counts.MEDIUM}</strong></article>
            <article className="is-low"><span>Low</span><strong>{counts.LOW}</strong></article>
            <article><span>Investigasi</span><strong>{counts.investigating}</strong></article>
            <article><span>Dieskalasi</span><strong>{counts.escalated}</strong></article>
          </div>

          <div className="geofence-filters">
            <div role="tablist" aria-label="Filter severity">
              {SEVERITIES.map((value) => <button key={value} type="button" role="tab" aria-selected={severity === value} className={severity === value ? 'is-active' : ''} onClick={() => setSeverity(value)}>{value === 'ALL' ? 'Semua' : value}<b>{value === 'ALL' ? counts.total : counts[value]}</b></button>)}
            </div>
            <div role="group" aria-label="Filter kategori">
              {CATEGORY_FILTERS.map((value) => <button key={value} type="button" className={category === value ? 'is-active' : ''} onClick={() => setCategory(value)}>{value === 'ALL' ? 'Semua Kategori' : value}</button>)}
            </div>
          </div>

          <div className="geofence-modal__body">
            <PerfectScrollArea className="geofence-table-scroll" options={{ wheelPropagation: false }}>
              <table className="geofence-table">
                <thead><tr><th>ID / Waktu</th><th>Lokasi / Sektor</th><th>Kategori</th><th>Severity</th><th>Confidence</th><th>Deteksi</th><th>Source Fusion</th><th>Status</th><th>Rekomendasi</th></tr></thead>
                <tbody>
                  {filteredWarnings.map((warning) => (
                    <tr key={warning.id} className={selected?.id === warning.id ? 'is-selected' : ''} onClick={() => setSelectedId(warning.id)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') setSelectedId(warning.id) }}>
                      <td><strong>{warning.id}</strong><small>{formatWarningTime(warning.timestamp)} WIB</small></td>
                      <td><strong>{warning.location}</strong><small>{warning.province} · {warning.borderSector}</small></td>
                      <td><span className="geofence-category">{warning.category}</span><small>{warning.alertType}</small></td>
                      <td><SeverityBadge value={warning.severity} compact /></td>
                      <td><b className="geofence-confidence">{warning.confidence}%</b></td>
                      <td>{warning.count}</td>
                      <td><small>{warning.sourceFusion.join(' · ')}</small></td>
                      <td>{warning.handlingStatus}</td>
                      <td><small>{warning.recommendation}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredWarnings.length === 0 && <p className="geofence-empty">Tidak ada peringatan untuk kombinasi filter ini.</p>}
            </PerfectScrollArea>

            {selected && (
              <aside className={`geofence-detail geofence-detail--${selected.severity.toLowerCase()}`}>
                <header><div><span>DETAIL PERINGATAN</span><strong>{selected.id}</strong></div><SeverityBadge value={selected.severity} /></header>
                <dl>
                  <div><dt>Lokasi</dt><dd>{selected.location}, {selected.province}</dd></div>
                  <div><dt>Koordinat</dt><dd>{selected.coordinates[1].toFixed(4)}, {selected.coordinates[0].toFixed(4)}</dd></div>
                  <div><dt>Area terkait</dt><dd>{selected.relatedArea}</dd></div>
                  <div><dt>Confidence</dt><dd>{selected.confidence}%</dd></div>
                  <div className="is-wide"><dt>Kronologi</dt><dd>{selected.chronology}</dd></div>
                  <div className="is-wide"><dt>Sumber data</dt><dd>{selected.sourceFusion.join(' · ')}</dd></div>
                  <div className="is-wide"><dt>Suggested action</dt><dd>{selected.recommendation}</dd></div>
                  <div className="is-wide"><dt>Status eskalasi</dt><dd>{selected.escalationStatus}</dd></div>
                </dl>
              </aside>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
