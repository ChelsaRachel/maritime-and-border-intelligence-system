import type { IUserSession, TUserRole } from '@/types/mbis'

interface IDemoAccount extends IUserSession {
  password: string
}

const DEMO_ACCOUNTS: Record<TUserRole, IDemoAccount> = {
  Administrator: { username: 'Administrator', password: 'Administrator123', role: 'Administrator', displayName: 'Administrator MBIS', unit: 'System Operations', readOnly: false },
  Pimpinan: { username: 'Pimpinan', password: 'Pimpinan123', role: 'Pimpinan', displayName: 'Pimpinan Operasi', unit: 'Strategic Command', readOnly: false },
  Supervisor: { username: 'Supervisor', password: 'Supervisor123', role: 'Supervisor', displayName: 'Supervisor Intelijen', unit: 'Operations Review', readOnly: false },
  Analis: { username: 'Analis', password: 'Analis123', role: 'Analis', displayName: 'Analis Maritime', unit: 'Intelligence Analysis', readOnly: false },
  Auditor: { username: 'Auditor', password: 'Auditor123', role: 'Auditor', displayName: 'Auditor Sistem', unit: 'Governance & Audit', readOnly: true },
}

export const demoAccountRoles = Object.keys(DEMO_ACCOUNTS) as TUserRole[]

export const authService = {
  login: (username: string, password: string): IUserSession | null => {
    const account = Object.values(DEMO_ACCOUNTS).find((item) => item.username === username && item.password === password)
    if (!account) return null
    return {
      username: account.username,
      role: account.role,
      displayName: account.displayName,
      unit: account.unit,
      readOnly: account.readOnly,
    }
  },
  credentialsFor: (role: TUserRole) => ({ username: DEMO_ACCOUNTS[role].username, password: DEMO_ACCOUNTS[role].password }),
}
