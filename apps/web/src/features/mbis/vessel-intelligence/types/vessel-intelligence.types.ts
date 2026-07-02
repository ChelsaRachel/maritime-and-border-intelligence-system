export type TVesselRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type TVesselOperationalStatus = 'AKTIF' | 'WATCHLIST' | 'UNDER_REVIEW'

export interface IVesselFlag {
  country: string
  emoji: string
}

export interface IVesselPosition {
  datetime: string
  latitude: string
  longitude: string
  location: string
  sog: string
  cog: string
  coordinates: [number, number]
}

export interface IVesselProfile {
  id: string
  name: string
  mmsi: string
  imo: string
  callSign: string
  flag: IVesselFlag
  status: TVesselOperationalStatus
  type: string
  gt: number
  dwt: number
  lengthMeter: number
  beamMeter: number
  builtYear: number
  operator: string
  manager: string
  image: string
  areaOperation: string
  dataBasis: 'public-reference' | 'synthetic-enriched'
  lastKnownPosition: IVesselPosition
}

export interface IVoyageHistory {
  periodDays: number
  distanceNm: number
  portsVisited: number
  countriesVisited: number
  averageSpeedKn: number
  timeAtSea: string
  track: [number, number][]
}

export interface IRiskFactor {
  id: string
  label: string
  description: string
  severity: TVesselRiskLevel
  evidence: string
}

export interface IPortCall {
  date: string
  port: string
  country: string
  arrival: string
  departure: string
  duration: string
}

export interface IOwnershipRecord {
  period: string
  owner: string
  operator: string
  role: string
}

export interface IFlagChangeRecord {
  period: string
  flag: IVesselFlag
  note: string
}

export interface IAisGapRecord {
  id: string
  start: string
  end: string
  duration: string
  location: string
  status: string
}

export interface IEvidenceRecord {
  source: string
  count: number
  latest: string
  verification: string
  status: string
}

export interface IRelatedIncident {
  id: string
  date: string
  type: string
  location: string
  description: string
  riskLevel: TVesselRiskLevel
}

export interface IVesselIntelligenceRecord {
  vesselProfile: IVesselProfile
  voyageHistory: IVoyageHistory
  riskScoreAI: {
    score: number
    level: TVesselRiskLevel
    updatedAt: string
    modelVersion: string
  }
  riskFactors: IRiskFactor[]
  portHistory: { periodDays: number; calls: IPortCall[] }
  ownershipOperatorHistory: IOwnershipRecord[]
  flagChangeHistory: IFlagChangeRecord[]
  intelligenceGraph: {
    ports: Array<{ name: string; relation: string }>
    organizations: Array<{ name: string; relation: string }>
    vessels: Array<{ name: string; relation: string }>
  }
  aisGapLogs: { periodDays: number; total: number; records: IAisGapRecord[] }
  evidenceVerification: IEvidenceRecord[]
  analystNote: { author: string; updatedAt: string; note: string }
  relatedIncidents: { total: number; records: IRelatedIncident[] }
}

