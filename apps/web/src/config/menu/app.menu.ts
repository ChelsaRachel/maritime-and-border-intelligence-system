import type { IMenu } from '@/types/menu'

const shared = {
  idParent: '', show: true, search: true, enabled: true, group: 'application' as const, type: 'menu' as const,
  seo: { title: 'MBIS', description: 'Maritime & Border Intelligence System' }, privileges: null,
}

export const APP_MENU: IMenu[] = [
  { ...shared, id: 'nmp001', display: 'National Maritime Picture', subtitle: 'Gambaran Situasi Maritim Nasional', name: 'national-maritime-picture', path: '/', icon: 'globe-hemisphere-west', tactical: true },
  { ...shared, id: 'bdr002', display: 'Border Intelligence', subtitle: 'Pemantauan perbatasan darat nasional', name: 'border-intelligence', path: '/border-intelligence', icon: 'map-trifold', tactical: true },
  { ...shared, id: 'vsl003', display: 'Vessel Intelligence', subtitle: 'Investigasi kapal dan jejak pelayaran', name: 'vessel-intelligence', path: '/vessel-intelligence', icon: 'boat', tactical: true },
  { ...shared, id: 'air004', display: 'Aircraft Intelligence', subtitle: 'Pemantauan penerbangan dan FIR nasional', name: 'aircraft-intelligence', path: '/aircraft-intelligence', icon: 'airplane-tilt', tactical: true },
  { ...shared, id: 'anm005', display: 'Anomaly Detection', subtitle: 'Deteksi anomali lintas-domain berbasis AI', name: 'anomaly-detection', path: '/anomaly-detection', icon: 'warning-diamond', tactical: true },
  { ...shared, id: 'ewc006', display: 'Early Warning Center', subtitle: 'Peringatan dini dan manajemen insiden', name: 'early-warning', path: '/early-warning', icon: 'siren', tactical: true },
  { ...shared, id: 'thr007', display: 'Threat Assessment', subtitle: 'Analisis ancaman strategis dan kelautan', name: 'threat-assessment', path: '/threat-assessment', icon: 'crosshair', tactical: true },
  { ...shared, id: 'rpt008', display: 'Intelligence Reporting', subtitle: 'Pembuatan dan distribusi produk intelijen', name: 'intelligence-reporting', path: '/intelligence-reporting', icon: 'file-text', tactical: true },
  { ...shared, id: 'dat009', display: 'Data Management', subtitle: 'Kesehatan sumber dan kualitas data fixture', name: 'data-management', path: '/data-management', icon: 'database', tactical: true },
  { ...shared, id: 'adm010', display: 'Administration', subtitle: 'Kontrol akses, kebijakan, dan audit sistem', name: 'administration', path: '/administration', icon: 'gear-six', tactical: true },
]
