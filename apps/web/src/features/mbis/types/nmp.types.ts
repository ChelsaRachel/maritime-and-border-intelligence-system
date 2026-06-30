import type { TSeverity } from '@/types/mbis'

export type TCoordinates = [number, number]

export interface INmpTrackPoint {
  timestamp: string
  coordinates: TCoordinates
  heading: number
  speed: number
}

export interface INmpVessel {
  id: string
  name: string
  mmsi: string
  imo: string
  callSign: string
  type: string
  flag: string
  severity: TSeverity
  navigationalStatus: string
  lengthM: number
  draughtM: number
  destination: string
  eta: string
  provenance: string
  track: INmpTrackPoint[]
}

export interface INmpAircraft {
  id: string
  callSign: string
  icao24: string
  registration: string
  type: string
  operator: string
  severity: TSeverity
  altitudeFt: number
  verticalRateFpm: number
  origin: string
  destination: string
  provenance: string
  track: INmpTrackPoint[]
}

export interface INmpCurrentEntity {
  id: string
  label: string
  category: 'VESSEL' | 'AIRCRAFT'
  severity: TSeverity
  coordinates: TCoordinates
  heading: number
  speed: number
  trail: TCoordinates[]
  route: TCoordinates[]
  detail: INmpVessel | INmpAircraft
}

export interface INmpPort {
  id: string
  name: string
  region: string
  coordinates: TCoordinates
  status: string
  vesselsAlongside: number
  anchorageCount: number
}

export interface INmpChokepoint {
  id: string
  name: string
  coordinates: TCoordinates
  risk: TSeverity
  traffic: string
  vesselsPerDay: number
  trendPercent: number
}

export interface INmpRoute {
  id: string
  name: string
  kind: string
  status: string
  coordinates: TCoordinates[]
}

export interface INmpPolygonArea {
  id: string
  name: string
  coordinates: TCoordinates[][]
  status?: string
  category?: string
  severity?: TSeverity
  directive?: string
  assignedAssetCount?: number
}

export interface INmpSensor {
  id: string
  name: string
  type: string
  coordinates: TCoordinates
  status: string
  coverageNm: number
  confidence: number
}

export interface INmpAlert {
  id: string
  timestamp: string
  title: string
  severity: TSeverity
  entityId: string
  entityName: string
  coordinates: TCoordinates
  source: string
  confidence: number
  suggestedAction: string
  status: string
}

export interface INmpIntelligenceRecord {
  id: string
  timestamp: string
  title: string
  severity?: TSeverity
  coordinates?: TCoordinates
  [key: string]: unknown
}

export interface INmpReplayFrame {
  index: number
  timestamp: string
  vesselCount: number
  aircraftCount: number
  eventCount: number
  alertCount: number
  activity: number
}

export interface INmpWeather {
  area: string
  condition: string
  waveHeightM: number
  waveClass: string
  windKnots: number
  visibilityNm: number
  currentKnots: number
}

export interface INmpSourceHealth {
  id: string
  name: string
  status: string
  confidence: number
  latencySeconds: number
}

export interface INmpEntitiesFixture {
  vessels: INmpVessel[]
  aircraft: INmpAircraft[]
}

export interface INmpGeographyFixture {
  ports: INmpPort[]
  chokepoints: INmpChokepoint[]
  shippingRoutes: INmpRoute[]
  patrolZones: INmpPolygonArea[]
  watchAreas: INmpPolygonArea[]
  sensors: INmpSensor[]
  eezBoundary: { id: string; name: string; disclaimer: string; coordinates: TCoordinates[] }
  maritimeLabels: Array<{ id: string; label: string; coordinates: TCoordinates }>
}

export interface INmpIntelligenceFixture {
  events: INmpIntelligenceRecord[]
  anomalies: INmpIntelligenceRecord[]
  earlyWarnings: INmpIntelligenceRecord[]
  threatAssessments: INmpIntelligenceRecord[]
  reports: INmpIntelligenceRecord[]
  alerts: INmpAlert[]
}

export interface INmpReplayFixture {
  replayFrames: INmpReplayFrame[]
  weather: INmpWeather[]
  sourceHealth: INmpSourceHealth[]
  liveTimestamp: string
}
