import type { IMenu } from '@/types/menu'

const shared = {
  idParent: '', show: true, search: true, enabled: true, group: 'application' as const, type: 'menu' as const,
  seo: { title: 'MBIS', description: 'Maritime & Border Intelligence System' }, privileges: null,
}

export const APP_MENU: IMenu[] = [
  { ...shared, id: 'nmp001', display: 'National Maritime Picture', name: 'national-maritime-picture', path: '/', icon: 'globe-hemisphere-west', tactical: true },
  { ...shared, id: 'bdr002', display: 'Border Intelligence', name: 'border-intelligence', path: '/border-intelligence', icon: 'map-trifold', tactical: true },
  { ...shared, id: 'vsl003', display: 'Vessel Intelligence', name: 'vessel-intelligence', path: '/vessel-intelligence', icon: 'boat', tactical: true },
  { ...shared, id: 'air004', display: 'Aircraft Intelligence', name: 'aircraft-intelligence', path: '/aircraft-intelligence', icon: 'airplane-tilt', tactical: true },
  { ...shared, id: 'anm005', display: 'Anomaly Detection', name: 'anomaly-detection', path: '/anomaly-detection', icon: 'warning-diamond', tactical: true },
  { ...shared, id: 'ewc006', display: 'Early Warning Center', name: 'early-warning', path: '/early-warning', icon: 'siren', tactical: true },
  { ...shared, id: 'thr007', display: 'Threat Assessment', name: 'threat-assessment', path: '/threat-assessment', icon: 'crosshair', tactical: true },
  { ...shared, id: 'rpt008', display: 'Intelligence Reporting', name: 'intelligence-reporting', path: '/intelligence-reporting', icon: 'file-text', tactical: true },
  { ...shared, id: 'dat009', display: 'Data Management', name: 'data-management', path: '/data-management', icon: 'database', tactical: true },
  { ...shared, id: 'adm010', display: 'Administration', name: 'administration', path: '/administration', icon: 'gear-six', tactical: true },
]
