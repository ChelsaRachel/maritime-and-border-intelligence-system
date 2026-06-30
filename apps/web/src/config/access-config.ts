import type { TUserRole } from '@/types/mbis'

export const ROUTE_ACCESS: Record<string, TUserRole[]> = {
  '/': ['Administrator', 'Pimpinan', 'Supervisor', 'Analis', 'Auditor'],
  '/border-intelligence': ['Administrator', 'Pimpinan', 'Supervisor', 'Analis', 'Auditor'],
  '/vessel-intelligence': ['Administrator', 'Pimpinan', 'Supervisor', 'Analis', 'Auditor'],
  '/aircraft-intelligence': ['Administrator', 'Pimpinan', 'Supervisor', 'Analis', 'Auditor'],
  '/anomaly-detection': ['Administrator', 'Pimpinan', 'Supervisor', 'Analis', 'Auditor'],
  '/early-warning': ['Administrator', 'Pimpinan', 'Supervisor', 'Analis', 'Auditor'],
  '/threat-assessment': ['Administrator', 'Pimpinan', 'Supervisor', 'Analis', 'Auditor'],
  '/intelligence-reporting': ['Administrator', 'Pimpinan', 'Supervisor', 'Analis', 'Auditor'],
  '/data-management': ['Administrator', 'Supervisor', 'Analis', 'Auditor'],
  '/administration': ['Administrator'],
}
