import { Panel } from '@/components/common/Panel'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'

interface IImmigrationSummary {
  peopleCrossings24h: number
  peopleCrossingsDelta: number
  goodsCrossings24h: number
  goodsCrossingsDelta: number
  entryRefusals: number
  entryRefusalsDelta: number
  documentsProcessed: number
  documentsProcessedDelta: number
  watchlistHits: number
  activeIntegrations: { immigration: string; customs: string }
}

interface IImmigrationCheckpoint {
  id: string
  name: string
  province: string
  border: string
  people: number
  goods: number
  documents: number
  refusals: number
  sync: string
}

interface IImmigrationAgency {
  id: string
  name: string
  unit: string
  status: string
  lastUpdate: string
  latency: string
}

interface IImmigrationEvent {
  id: string
  time: string
  location: string
  title: string
  type: string
  severity: string
}

export interface IImmigrationIntegration {
  summary: IImmigrationSummary
  checkpoints: IImmigrationCheckpoint[]
  agencyStatus: IImmigrationAgency[]
  relatedEvents: IImmigrationEvent[]
  operationalNotes: { risingArea: string; topVolume: string; recommendation: string }
  lastSync: string
  dataLatency: string
}

const idNumber = (value: number) => value.toLocaleString('id-ID')

function DeltaCard({ label, value, delta }: { label: string; value: number; delta: number }) {
  return (
    <article className="imm-card">
      <span className="imm-card__label">{label}</span>
      <strong className="imm-card__value">{idNumber(value)}</strong>
      <span className="imm-card__delta"><i className="ph-bold ph-arrow-up" aria-hidden="true" />{delta}%<small>vs kemarin</small></span>
    </article>
  )
}

function syncTone(sync: string) {
  return sync === 'SINKRON' ? 'low' : sync === 'TERTUNDA' ? 'medium' : 'high'
}

export function ImmigrationIntegrationSummary({ data }: { data: IImmigrationIntegration }) {
  const [open, setOpen] = useState(false)
  const s = data.summary
  const syncTime = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(data.lastSync))

  return (
    <Panel
      title="Ringkasan Integrasi Imigrasi"
      eyebrow="Integrasi lintas instansi · diperbarui berkala"
      className="span-8 immigration-panel"
      action={<button type="button" className="imm-more-btn" onClick={() => setOpen(true)}>Selengkapnya <i className="ph ph-arrow-up-right" aria-hidden="true" /></button>}
    >
      <div className="imm-cards">
        <DeltaCard label="PERLINTASAN ORANG (24 JAM)" value={s.peopleCrossings24h} delta={s.peopleCrossingsDelta} />
        <DeltaCard label="PERLINTASAN BARANG (24 JAM)" value={s.goodsCrossings24h} delta={s.goodsCrossingsDelta} />
        <DeltaCard label="PENOLAKAN MASUK" value={s.entryRefusals} delta={s.entryRefusalsDelta} />
        <DeltaCard label="DOKUMEN DIPERIKSA" value={s.documentsProcessed} delta={s.documentsProcessedDelta} />
        <article className="imm-card">
          <span className="imm-card__label">DAFTAR CEGAH CEKAL</span>
          <strong className="imm-card__value text-critical">{idNumber(s.watchlistHits)}</strong>
          <span className="imm-card__hit"><i className="ph-fill ph-warning-octagon" aria-hidden="true" />Hit</span>
        </article>
        <article className="imm-card imm-card--integration">
          <span className="imm-card__label">INTEGRASI AKTIF</span>
          <div className="imm-integration">
            <div><span className="imm-integration__name">Imigrasi</span><span className="imm-integration__status"><i className="status-dot status-dot--online" />Online</span></div>
            <span className="imm-integration__divider" aria-hidden="true" />
            <div><span className="imm-integration__name">BC</span><span className="imm-integration__status"><i className="status-dot status-dot--online" />Online</span></div>
          </div>
        </article>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="immigration-modal">
          <DialogTitle className="immigration-modal__title">Detail Integrasi Imigrasi</DialogTitle>
          <DialogDescription className="immigration-modal__subtitle">Pola perlintasan orang dan barang pada pos lintas batas resmi</DialogDescription>

          <div className="immigration-modal__scroll">
            <section className="imm-detail-section">
              <h3>Ringkasan 24 Jam</h3>
              <div className="imm-detail-summary">
                <div><span>Perlintasan orang</span><strong>{idNumber(s.peopleCrossings24h)}</strong><em className="is-up">▲ {s.peopleCrossingsDelta}%</em></div>
                <div><span>Perlintasan barang</span><strong>{idNumber(s.goodsCrossings24h)}</strong><em className="is-up">▲ {s.goodsCrossingsDelta}%</em></div>
                <div><span>Dokumen diperiksa</span><strong>{idNumber(s.documentsProcessed)}</strong><em className="is-up">▲ {s.documentsProcessedDelta}%</em></div>
                <div><span>Penolakan masuk</span><strong>{idNumber(s.entryRefusals)}</strong><em className="is-up">▲ {s.entryRefusalsDelta}%</em></div>
                <div><span>Daftar cegah cekal</span><strong className="text-critical">{idNumber(s.watchlistHits)}</strong><em>Hit</em></div>
              </div>
            </section>

            <section className="imm-detail-section">
              <h3>Breakdown per PLBN</h3>
              <div className="imm-table-wrap">
                <table className="imm-table">
                  <thead>
                    <tr><th>PLBN</th><th>Provinsi</th><th className="is-num">Orang</th><th className="is-num">Barang</th><th className="is-num">Dokumen</th><th className="is-num">Tolak</th><th>Sinkronisasi</th></tr>
                  </thead>
                  <tbody>
                    {data.checkpoints.map((cp) => (
                      <tr key={cp.id}>
                        <td><strong>{cp.name}</strong><small>{cp.border}</small></td>
                        <td>{cp.province}</td>
                        <td className="is-num">{idNumber(cp.people)}</td>
                        <td className="is-num">{idNumber(cp.goods)}</td>
                        <td className="is-num">{idNumber(cp.documents)}</td>
                        <td className="is-num">{cp.refusals}</td>
                        <td><span className={`imm-sync imm-sync--${syncTone(cp.sync)}`}><i className="status-dot" />{cp.sync}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="imm-detail-section">
              <h3>Status Integrasi Instansi</h3>
              <div className="imm-agency-grid">
                {data.agencyStatus.map((agency) => (
                  <article key={agency.id} className="imm-agency">
                    <header><span className="status-dot status-dot--online" /><strong>{agency.name}</strong><b>{agency.status}</b></header>
                    <small>{agency.unit}</small>
                    <footer><span>Update {agency.lastUpdate}</span><span>Latensi {agency.latency}</span></footer>
                  </article>
                ))}
              </div>
              <p className="imm-sync-note">Sinkronisasi terakhir {syncTime} WIB · latensi rata-rata {data.dataLatency}</p>
            </section>

            <section className="imm-detail-section">
              <h3>Peristiwa Terkait</h3>
              <div className="imm-events">
                {data.relatedEvents.map((event) => (
                  <article key={event.id} className="imm-event">
                    <time>{event.time}</time>
                    <div><strong>{event.title}</strong><small>{event.type} · {event.location}</small></div>
                    <SeverityBadge value={event.severity} compact />
                  </article>
                ))}
              </div>
            </section>

            <section className="imm-detail-section">
              <h3>Catatan Operasional</h3>
              <ul className="imm-notes">
                <li><i className="ph ph-trend-up" aria-hidden="true" /><span><b>Kenaikan aktivitas.</b> {data.operationalNotes.risingArea}</span></li>
                <li><i className="ph ph-chart-bar" aria-hidden="true" /><span><b>Volume tertinggi.</b> {data.operationalNotes.topVolume}</span></li>
                <li><i className="ph ph-target" aria-hidden="true" /><span><b>Rekomendasi.</b> {data.operationalNotes.recommendation}</span></li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </Panel>
  )
}
