import { useVesselFilters } from '@/features/mbis/vessel-intelligence/hooks/useVesselFilters'
import { useState } from 'react'

type TVesselFilters = ReturnType<typeof useVesselFilters>

interface IVesselToolbarProps {
  filters: TVesselFilters
  onExport: () => void
}

function SelectControl({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="vessel-toolbar__select">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        <option value="ALL">{label}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <i className="ph ph-caret-down" aria-hidden="true" />
    </label>
  )
}

export function VesselToolbar({ filters, onExport }: IVesselToolbarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const selectedId = filters.selected?.vesselProfile.id ?? ''
  const isWatchlisted = selectedId ? filters.watchlistIds.has(selectedId) : false

  return (
    <div className="vessel-toolbar-shell">
      <div className="vessel-toolbar">
        <div className="vessel-toolbar__search">
          <i className="ph ph-magnifying-glass" aria-hidden="true" />
          <input
            value={filters.query}
            onChange={(event) => { filters.setQuery(event.target.value); setSearchOpen(true) }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Cari kapal (Nama, MMSI, IMO, Callsign)"
            aria-label="Cari kapal"
          />
          {filters.query && <button type="button" onClick={() => filters.setQuery('')} aria-label="Hapus pencarian"><i className="ph ph-x" /></button>}
          {searchOpen && filters.query && (
            <div className="vessel-search-results">
              <header><span>HASIL PENCARIAN</span><b>{filters.filtered.length} kapal</b></header>
              {filters.filtered.slice(0, 8).map((item) => (
                <button key={item.vesselProfile.id} type="button" onClick={() => { filters.setSelectedId(item.vesselProfile.id); setSearchOpen(false) }}>
                  <i className="ph ph-boat" aria-hidden="true" />
                  <span><strong>{item.vesselProfile.name}</strong><small>{item.vesselProfile.mmsi} · IMO {item.vesselProfile.imo} · {item.vesselProfile.flag.country}</small></span>
                  <em className={`risk-text risk-text--${item.riskScoreAI.level.toLowerCase()}`}>{item.riskScoreAI.level}</em>
                </button>
              ))}
              {!filters.filtered.length && <p>Tidak ada kapal yang cocok dengan pencarian dan filter aktif.</p>}
            </div>
          )}
        </div>

        <button type="button" className={showAdvanced ? 'vessel-toolbar__filter is-active' : 'vessel-toolbar__filter'} onClick={() => setShowAdvanced((value) => !value)}>
          <i className="ph ph-funnel" aria-hidden="true" />Filter{filters.activeFilterCount > 0 && <b>{filters.activeFilterCount}</b>}
        </button>
        <SelectControl label="Semua Tipe Kapal" value={filters.type} options={filters.options.types} onChange={filters.setType} />
        <SelectControl label="Semua Bendera" value={filters.flag} options={filters.options.flags} onChange={filters.setFlag} />
        <SelectControl label="Semua Operator" value={filters.operator} options={filters.options.operators} onChange={filters.setOperator} />

        <span className="vessel-toolbar__spacer" />
        <button type="button" className={isWatchlisted ? 'vessel-toolbar__action is-watchlisted' : 'vessel-toolbar__action'} disabled={!selectedId} onClick={() => filters.toggleWatchlist(selectedId)}>
          <i className={isWatchlisted ? 'ph-fill ph-star' : 'ph ph-plus'} aria-hidden="true" />{isWatchlisted ? 'Di Watchlist' : 'Tambah ke Watchlist'}
        </button>
        <button type="button" className="vessel-toolbar__action" disabled={!selectedId} onClick={onExport}><i className="ph ph-file-arrow-down" aria-hidden="true" />Ekspor Laporan</button>
        <div className="vessel-toolbar__more">
          <button type="button" onClick={() => setMoreOpen((value) => !value)} aria-label="Aksi lainnya"><i className="ph-bold ph-dots-three" /></button>
          {moreOpen && <div><button type="button" onClick={() => { filters.reset(); setMoreOpen(false) }}><i className="ph ph-arrow-counter-clockwise" />Reset semua filter</button><button type="button" onClick={() => { if (selectedId) navigator.clipboard?.writeText(selectedId); setMoreOpen(false) }}><i className="ph ph-copy" />Salin ID kapal</button></div>}
        </div>
      </div>

      {showAdvanced && (
        <div className="vessel-toolbar__advanced">
          <SelectControl label="Semua Risiko" value={filters.risk} options={['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']} onChange={(value) => filters.setRisk(value as typeof filters.risk)} />
          <SelectControl label="Semua Status" value={filters.status} options={['AKTIF', 'WATCHLIST', 'UNDER_REVIEW']} onChange={(value) => filters.setStatus(value as typeof filters.status)} />
          <SelectControl label="Semua Area" value={filters.area} options={filters.options.areas} onChange={filters.setArea} />
          <span>{filters.filtered.length} dari {filters.totalCount} kapal sesuai filter</span>
          <button type="button" onClick={filters.reset}><i className="ph ph-arrow-counter-clockwise" />Reset</button>
        </div>
      )}
    </div>
  )
}
