export type TSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NORMAL'
export type TUserRole = 'Administrator' | 'Pimpinan' | 'Supervisor' | 'Analis' | 'Auditor'

export interface IMockEnvelope<T> {
  metaData: {
    status: boolean
    title: string
    generatedAt: string
    classification: string
    synthetic: boolean
    referenceBasis: string[]
  }
  data: T[]
}

export interface IUserSession {
  username: string
  role: TUserRole
  displayName: string
  unit: string
  readOnly: boolean
}

export interface IMapPoint {
  id: string
  coordinates: [number, number]
  name?: string
  callSign?: string
  title?: string
  type?: string
  status?: string
  severity?: string
  risk?: string
  [key: string]: unknown
}

export interface IMapRoute {
  id: string
  name: string
  coordinates: [number, number][]
  status?: string
  kind?: string
  risk?: string
}

export type TFixtureRecord = Record<string, any>

export interface IMbisFixtureState {
  overview: TFixtureRecord | null
  border: TFixtureRecord | null
  entities: TFixtureRecord | null
  operations: TFixtureRecord | null
}
