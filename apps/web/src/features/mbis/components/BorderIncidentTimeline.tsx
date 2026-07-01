import { SeverityBadge } from '@/components/common/SeverityBadge'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useMemo, useState } from 'react'

export type TIncidentLevel = 'rendah' | 'sedang' | 'tinggi'

export interface IBorderTimelinePoint {
  date: string
  iso: string
  total: number
  low: number
  medium: number
  high: number
  level: TIncidentLevel
}

export interface IBorderIncident {
  id: string
  iso: string
  date: string
  time: string
  location: string
  border: string
  type: string
  severity: string
  entities: string
  summary: string
  status: string
  source: string
}

const LEVEL_LABEL: Record<TIncidentLevel, string> = { rendah: 'Rendah', sedang: 'Sedang', tinggi: 'Tinggi' }

// Chart is drawn in a fixed 700×160 viewBox and scaled responsively; keeps geometry math simple.
const VB_W = 700
const VB_H = 160
const PAD_X = 46
const TOP_Y = 40
const BASE_Y = 96

function pointX(index: number, count: number) {
  if (count <= 1) return VB_W / 2
  return PAD_X + (index * (VB_W - PAD_X * 2)) / (count - 1)
}

export function BorderIncidentTimeline({ points, incidents }: { points: IBorderTimelinePoint[]; incidents: IBorderIncident[] }) {
  const [open, setOpen] = useState(false)
  const [activeIso, setActiveIso] = useState<string | null>(null)
  const [hoverIso, setHoverIso] = useState<string | null>(null)
  const [modalDay, setModalDay] = useState<string>('all')

  const maxTotal = useMemo(() => Math.max(...points.map((p) => p.total), 1), [points])

  // Higher total sits higher on the chart; keeps the poly readable within TOP_Y..BASE_Y.
  const coords = useMemo(
    () => points.map((point, index) => {
      const ratio = point.total / maxTotal
      const y = BASE_Y - ratio * (BASE_Y - TOP_Y)
      return { point, x: pointX(index, points.length), y }
    }),
    [points, maxTotal],
  )

  const modalIncidents = useMemo(
    () => (modalDay === 'all' ? incidents : incidents.filter((item) => item.iso === modalDay)),
    [incidents, modalDay],
  )

  const openDetail = () => {
    setModalDay(activeIso ?? 'all')
    setOpen(true)
  }

  const hovered = hoverIso ? points.find((p) => p.iso === hoverIso) : null
  const hoveredCoord = coords.find((c) => c.point.iso === hoverIso)

  return (
    <div className="incident-timeline">
      <div className="incident-timeline__chart">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" role="img" aria-label="Timeline insiden perbatasan 7 hari terakhir">
          {coords.slice(0, -1).map((from, index) => {
            const to = coords[index + 1]
            return (
              <line
                key={`seg-${from.point.iso}`}
                className={`incident-timeline__line incident-timeline__line--${to.point.level}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              />
            )
          })}
          {coords.map(({ point, x, y }) => {
            const isActive = activeIso === point.iso
            const isHover = hoverIso === point.iso
            return (
              <g
                key={point.iso}
                className={`incident-timeline__node incident-timeline__node--${point.level} ${isActive ? 'is-active' : ''}`}
                transform={`translate(${x} ${y})`}
                onMouseEnter={() => setHoverIso(point.iso)}
                onMouseLeave={() => setHoverIso((current) => (current === point.iso ? null : current))}
                onClick={() => setActiveIso((current) => (current === point.iso ? null : point.iso))}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActiveIso((current) => (current === point.iso ? null : point.iso)) } }}
                aria-label={`${point.date}: ${point.total} insiden, risiko ${LEVEL_LABEL[point.level]}`}
              >
                <text className="incident-timeline__count" y={-20} textAnchor="middle">{point.total}</text>
                {(isHover || isActive) && <circle className="incident-timeline__halo" r={13} />}
                <circle className="incident-timeline__dot" r={8} />
                <text className="incident-timeline__date" y={34} textAnchor="middle">{point.date}</text>
              </g>
            )
          })}
        </svg>

        {hovered && hoveredCoord && (
          <div
            className="incident-timeline__tooltip"
            style={{ left: `${(hoveredCoord.x / VB_W) * 100}%`, top: `${(hoveredCoord.y / VB_H) * 100}%` }}
            role="status"
          >
            <strong>{hovered.date}</strong>
            <span className={`incident-timeline__tip-level incident-timeline__tip-level--${hovered.level}`}>Risiko {LEVEL_LABEL[hovered.level]}</span>
            <small>{hovered.total} insiden · {hovered.low} rendah · {hovered.medium} sedang · {hovered.high} tinggi</small>
          </div>
        )}
      </div>

      <div className="incident-timeline__footer">
        <div className="incident-timeline__legend">
          <span><i className="incident-dot incident-dot--rendah" />Rendah</span>
          <span><i className="incident-dot incident-dot--sedang" />Sedang</span>
          <span><i className="incident-dot incident-dot--tinggi" />Tinggi</span>
        </div>
        <button type="button" className="incident-timeline__detail-btn" onClick={openDetail}>
          Lihat Detail Timeline <i className="ph ph-caret-right" aria-hidden="true" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-timeline-modal">
          <DialogTitle className="border-timeline-modal__title">Detail Timeline Insiden Perbatasan</DialogTitle>
          <DialogDescription className="border-timeline-modal__subtitle">Kronologi insiden wilayah perbatasan dalam 7 hari terakhir</DialogDescription>

          <div className="border-timeline-modal__filters" role="tablist" aria-label="Filter hari">
            <button type="button" role="tab" aria-selected={modalDay === 'all'} className={modalDay === 'all' ? 'is-active' : ''} onClick={() => setModalDay('all')}>Semua<b>{incidents.length}</b></button>
            {points.map((point) => {
              const count = incidents.filter((item) => item.iso === point.iso).length
              return (
                <button key={point.iso} type="button" role="tab" aria-selected={modalDay === point.iso} className={modalDay === point.iso ? 'is-active' : ''} onClick={() => setModalDay(point.iso)}>
                  {point.date}<b>{count}</b>
                </button>
              )
            })}
          </div>

          <div className="border-timeline-modal__list">
            {modalIncidents.map((item) => (
              <article key={item.id} className={`incident-log incident-log--${item.severity.toLowerCase()}`}>
                <div className="incident-log__rail"><span className="incident-log__marker" /></div>
                <div className="incident-log__body">
                  <header>
                    <time>{item.date} · {item.time}</time>
                    <SeverityBadge value={item.severity} compact />
                  </header>
                  <strong>{item.type}</strong>
                  <p className="incident-log__meta"><i className="ph ph-map-pin" aria-hidden="true" />{item.location}<span className="incident-log__border">· {item.border}</span></p>
                  <p className="incident-log__summary">{item.summary}</p>
                  <footer>
                    {item.entities !== '—' && <span className="incident-log__tag"><i className="ph ph-stack" aria-hidden="true" />{item.entities}</span>}
                    <span className="incident-log__tag"><i className="ph ph-shield-check" aria-hidden="true" />{item.status}</span>
                    <span className="incident-log__source"><i className="ph ph-broadcast" aria-hidden="true" />{item.source}</span>
                  </footer>
                </div>
              </article>
            ))}
            {modalIncidents.length === 0 && <p className="border-timeline-modal__empty">Tidak ada insiden tercatat pada hari ini.</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
