export interface IBorderMetrics {
  officialPosts: number
  postsNonOperational: number
  informalRoutes: number
  informalRoutesDelta: number
  vulnerablePoints: number
  vulnerablePointsDelta: number
  incidents24h: number
  incidents24hDelta: number
  activePatrolRoutes: number
  patrolCoverage: number
}

type TTone = 'safe' | 'warning' | 'critical' | 'info' | 'patrol'
type TValue = { value: string | number; label: string }

interface IKpiCard {
  key: string
  tone: TTone
  icon: string
  title: string
  values: TValue[]
  delta?: number
  deltaLabel?: string
}

function buildCards(m: IBorderMetrics): IKpiCard[] {
  return [
    {
      key: 'posts',
      tone: 'safe',
      icon: 'shield-check',
      title: 'Pos Lintas Batas Resmi',
      values: [
        { value: m.officialPosts, label: 'Operasional' },
        { value: m.postsNonOperational, label: 'Non-Operasional' },
      ],
    },
    {
      key: 'informal',
      tone: 'warning',
      icon: 'shield-warning',
      title: 'Jalur Tikus Terdeteksi',
      values: [{ value: m.informalRoutes, label: 'Titik lintas' }],
      delta: m.informalRoutesDelta,
      deltaLabel: 'vs kemarin',
    },
    {
      key: 'vulnerable',
      tone: 'critical',
      icon: 'first-aid',
      title: 'Titik Rawan / Penyelundupan',
      values: [{ value: m.vulnerablePoints, label: 'Sektor' }],
      delta: m.vulnerablePointsDelta,
      deltaLabel: 'vs kemarin',
    },
    {
      key: 'incidents',
      tone: 'info',
      icon: 'drop',
      title: 'Insiden Perbatasan (24 Jam)',
      values: [{ value: m.incidents24h, label: 'Kejadian' }],
      delta: m.incidents24hDelta,
      deltaLabel: 'vs kemarin',
    },
    {
      key: 'patrol',
      tone: 'patrol',
      icon: 'path',
      title: 'Rute Patroli Aktif',
      values: [
        { value: m.activePatrolRoutes, label: 'Rute' },
        { value: `${m.patrolCoverage}%`, label: 'Cakupan' },
      ],
    },
  ]
}

export function BorderKpiStrip({ metrics }: { metrics: IBorderMetrics }) {
  const cards = buildCards(metrics)
  return (
    <div className="border-kpi span-12">
      {cards.map((card) => (
        <article key={card.key} className={`border-kpi__card border-kpi__card--${card.tone}`}>
          <header>
            <span className="border-kpi__icon"><i className={`ph-fill ph-${card.icon}`} aria-hidden="true" /></span>
            <span className="border-kpi__title">{card.title}</span>
          </header>
          <div className={`border-kpi__values ${card.values.length > 1 ? 'is-dual' : ''}`}>
            {card.values.map((entry) => (
              <div key={entry.label} className="border-kpi__value">
                <strong>{entry.value}</strong>
                <small>{entry.label}</small>
              </div>
            ))}
            {card.delta !== undefined && (
              <div className="border-kpi__delta">
                <span className={card.delta >= 0 ? 'is-up' : 'is-down'}>
                  <i className={`ph-bold ph-caret-${card.delta >= 0 ? 'up' : 'down'}`} aria-hidden="true" />
                  {Math.abs(card.delta)}%
                </span>
                <small>{card.deltaLabel}</small>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
