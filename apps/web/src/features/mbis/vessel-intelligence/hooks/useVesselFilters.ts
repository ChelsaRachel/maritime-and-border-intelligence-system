import type { IVesselIntelligenceRecord, TVesselOperationalStatus, TVesselRiskLevel } from '@/features/mbis/vessel-intelligence/types/vessel-intelligence.types'
import { useEffect, useMemo, useState } from 'react'

const ALL = 'ALL'

export function useVesselFilters(vessels: IVesselIntelligenceRecord[]) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState(ALL)
  const [flag, setFlag] = useState(ALL)
  const [operator, setOperator] = useState(ALL)
  const [risk, setRisk] = useState<TVesselRiskLevel | typeof ALL>(ALL)
  const [status, setStatus] = useState<TVesselOperationalStatus | typeof ALL>(ALL)
  const [area, setArea] = useState(ALL)
  const [selectedId, setSelectedId] = useState(vessels[0]?.vesselProfile.id ?? '')
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(() => new Set(vessels.filter((item) => item.vesselProfile.status === 'WATCHLIST').map((item) => item.vesselProfile.id)))

  const options = useMemo(() => ({
    types: [...new Set(vessels.map((item) => item.vesselProfile.type))].sort(),
    flags: [...new Set(vessels.map((item) => item.vesselProfile.flag.country))].sort(),
    operators: [...new Set(vessels.flatMap((item) => [item.vesselProfile.operator, item.vesselProfile.manager]))].sort(),
    areas: [...new Set(vessels.map((item) => item.vesselProfile.areaOperation))].sort(),
  }), [vessels])

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('id-ID')
    return vessels.filter((item) => {
      const profile = item.vesselProfile
      const searchable = [profile.name, profile.mmsi, profile.imo, profile.callSign, profile.operator, profile.manager, profile.flag.country, profile.areaOperation].join(' ').toLocaleLowerCase('id-ID')
      const effectiveStatus = watchlistIds.has(profile.id) ? 'WATCHLIST' : profile.status
      return (!needle || searchable.includes(needle))
        && (type === ALL || profile.type === type)
        && (flag === ALL || profile.flag.country === flag)
        && (operator === ALL || profile.operator === operator || profile.manager === operator)
        && (risk === ALL || item.riskScoreAI.level === risk)
        && (status === ALL || effectiveStatus === status)
        && (area === ALL || profile.areaOperation === area)
    })
  }, [area, flag, operator, query, risk, status, type, vessels, watchlistIds])

  useEffect(() => {
    if (filtered.length && !filtered.some((item) => item.vesselProfile.id === selectedId)) setSelectedId(filtered[0].vesselProfile.id)
  }, [filtered, selectedId])

  const selected = vessels.find((item) => item.vesselProfile.id === selectedId) ?? filtered[0] ?? vessels[0]
  const activeFilterCount = [type, flag, operator, risk, status, area].filter((value) => value !== ALL).length + (query.trim() ? 1 : 0)

  const reset = () => {
    setQuery(''); setType(ALL); setFlag(ALL); setOperator(ALL); setRisk(ALL); setStatus(ALL); setArea(ALL)
  }

  const toggleWatchlist = (id: string) => setWatchlistIds((current) => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  return {
    query, setQuery, type, setType, flag, setFlag, operator, setOperator, risk, setRisk, status, setStatus, area, setArea,
    selectedId, setSelectedId, selected, filtered, options, activeFilterCount, reset, watchlistIds, toggleWatchlist,
    totalCount: vessels.length,
  }
}
