import { useMemo, useState } from 'react'

export interface IBorderActivityItem {
  id: string
  category: 'orang' | 'barang' | 'insiden'
  title: string
  location: string
  time: string
  primaryValue: string
  primaryUnitOrLabel: string
  secondaryValue?: string
  secondaryLabel: string
  status: string
  iconType: string
}

type TFilter = 'semua' | 'orang' | 'barang' | 'insiden'

const TABS: Array<{ key: TFilter; label: string }> = [
  { key: 'semua', label: 'Semua' },
  { key: 'orang', label: 'Orang' },
  { key: 'barang', label: 'Barang' },
  { key: 'insiden', label: 'Insiden' },
]

// Semantic iconType → Phosphor glyph. Keeps the fixture free of framework-specific icon names.
const ICON_GLYPH: Record<string, string> = {
  person: 'ph-users-three',
  goods: 'ph-package',
  geofence: 'ph-map-pin-line',
  alert: 'ph-warning',
  seizure: 'ph-seal-warning',
}

function iconGlyph(iconType: string) {
  return ICON_GLYPH[iconType] ?? 'ph-dot-outline'
}

export function BorderActivityFeed({ items }: { items: IBorderActivityItem[] }) {
  const [filter, setFilter] = useState<TFilter>('semua')

  const counts = useMemo(() => {
    const base: Record<TFilter, number> = { semua: items.length, orang: 0, barang: 0, insiden: 0 }
    items.forEach((item) => { base[item.category] += 1 })
    return base
  }, [items])

  const filtered = useMemo(
    () => (filter === 'semua' ? items : items.filter((item) => item.category === filter)),
    [filter, items],
  )

  return (
    <div className="activity-feed">
      <div className="activity-feed__tabs" role="tablist" aria-label="Filter aktivitas perbatasan">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={filter === tab.key}
            className={filter === tab.key ? 'is-active' : ''}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            <b>{counts[tab.key]}</b>
          </button>
        ))}
      </div>

      <div className="activity-feed__list">
        {filtered.map((item) => (
          <article key={item.id} className={`activity-row activity-row--${item.category}`}>
            <span className={`activity-row__icon activity-row__icon--${item.status.toLowerCase()}`}>
              <i className={`ph-fill ${iconGlyph(item.iconType)}`} />
            </span>
            <div className="activity-row__body">
              <div className="activity-row__head">
                <time>{item.time}</time>
                <strong>{item.title}</strong>
              </div>
              <small>{item.location}</small>
            </div>
            <div className={`activity-row__meta activity-row__meta--${item.status.toLowerCase()}`}>
              <b>{item.primaryValue}{item.primaryUnitOrLabel && <span> {item.primaryUnitOrLabel}</span>}</b>
              <small>{item.secondaryValue ? `${item.secondaryValue} · ` : ''}{item.secondaryLabel}</small>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
