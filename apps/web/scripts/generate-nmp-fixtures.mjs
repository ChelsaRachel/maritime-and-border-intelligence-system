import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = resolve(root, 'public/data')
const BASE_TIME = new Date('2026-06-30T02:42:00.000Z')
const TRACK_INTERVAL_MS = 15 * 60 * 1000
const TRACK_POINTS = 97

let seed = 0x6d626973
function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 0x100000000
}

const pick = (items, index = Math.floor(random() * items.length)) => items[index % items.length]
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const round = (value, digits = 3) => Number(value.toFixed(digits))
const timestampAt = (index) => new Date(BASE_TIME.getTime() - (TRACK_POINTS - 1 - index) * TRACK_INTERVAL_MS).toISOString()
const envelope = (title, referenceBasis, data, counts) => ({
  metaData: {
    status: true,
    title,
    generatedAt: BASE_TIME.toISOString(),
    classification: 'INTERNAL // FRONTEND SIMULATION',
    synthetic: true,
    referenceBasis,
    counts,
  },
  data: [data],
})

const ports = [
  ['IDTPP', 'Tanjung Priok', 106.886, -6.104, 'Jakarta'],
  ['IDTPR', 'Tanjung Perak', 112.728, -7.196, 'Surabaya'],
  ['IDBLW', 'Belawan', 98.696, 3.787, 'Medan'],
  ['IDMAK', 'Makassar', 119.407, -5.115, 'Sulawesi Selatan'],
  ['IDSRG', 'Tanjung Emas', 110.422, -6.948, 'Semarang'],
  ['IDBIT', 'Bitung', 125.187, 1.445, 'Sulawesi Utara'],
  ['IDSOQ', 'Sorong', 131.244, -0.878, 'Papua Barat Daya'],
  ['IDBNO', 'Benoa', 115.213, -8.745, 'Bali'],
  ['IDBTH', 'Batu Ampar', 104.011, 1.178, 'Batam'],
  ['IDMRK', 'Merak', 105.997, -5.931, 'Banten'],
  ['IDBAK', 'Bakauheni', 105.756, -5.866, 'Lampung'],
  ['IDDUM', 'Dumai', 101.454, 1.677, 'Riau'],
  ['IDTBY', 'Teluk Bayur', 100.369, -1.003, 'Sumatra Barat'],
  ['IDPNJ', 'Panjang', 105.322, -5.466, 'Lampung'],
  ['IDCIW', 'Ciwandan', 105.957, -6.029, 'Banten'],
  ['IDPAT', 'Patimban', 107.901, -6.244, 'Jawa Barat'],
  ['IDCIR', 'Cirebon', 108.574, -6.713, 'Jawa Barat'],
  ['IDCIL', 'Tanjung Intan', 109.016, -7.733, 'Cilacap'],
  ['IDTRI', 'Trisakti', 114.55, -3.328, 'Banjarmasin'],
  ['IDPNK', 'Dwikora', 109.338, -0.023, 'Pontianak'],
  ['IDPLR', 'Palaran', 117.174, -0.598, 'Samarinda'],
  ['IDSEM', 'Semayang', 116.808, -1.269, 'Balikpapan'],
  ['IDTRK', 'Malundung', 117.591, 3.303, 'Tarakan'],
  ['IDTEN', 'Tenau', 123.529, -10.193, 'Kupang'],
  ['IDAMQ', 'Yos Sudarso', 128.174, -3.696, 'Ambon'],
  ['IDTTE', 'Ahmad Yani', 127.379, 0.775, 'Ternate'],
  ['IDDJJ', 'Jayapura', 140.72, -2.536, 'Papua'],
  ['IDMKQ', 'Merauke', 140.385, -8.493, 'Papua Selatan'],
  ['IDTIM', 'Pomako', 136.815, -4.831, 'Papua Tengah'],
  ['IDBIK', 'Biak', 136.093, -1.181, 'Papua'],
  ['IDMKW', 'Manokwari', 134.075, -0.871, 'Papua Barat'],
  ['IDKDI', 'Kendari', 122.58, -3.973, 'Sulawesi Tenggara'],
  ['IDPAP', 'Parepare', 119.615, -4.012, 'Sulawesi Selatan'],
  ['IDLEM', 'Lembar', 116.074, -8.73, 'Nusa Tenggara Barat'],
  ['IDTAN', 'Tanjung Wangi', 114.383, -8.126, 'Jawa Timur'],
  ['IDSAB', 'Sabang', 95.318, 5.889, 'Aceh'],
].map(([id, name, lng, lat, region], index) => ({
  id,
  name,
  region,
  coordinates: [lng, lat],
  status: index % 11 === 0 ? 'DEGRADED' : 'ONLINE',
  vesselsAlongside: 7 + (index * 13) % 46,
  anchorageCount: 4 + (index * 7) % 32,
}))

const chokepoints = [
  ['CP-MALAKA', 'SELAT MALAKA', 101.42, 2.61, 'CRITICAL', 'Traffic padat'],
  ['CP-SUNDA', 'SELAT SUNDA', 105.87, -5.88, 'HIGH', 'Traffic meningkat'],
  ['CP-LOMBOK', 'SELAT LOMBOK', 115.73, -8.55, 'HIGH', 'Traffic sedang'],
  ['CP-MAKASSAR', 'SELAT MAKASSAR', 118.73, -2.26, 'CRITICAL', 'Traffic padat'],
  ['CP-SINGAPURA', 'SELAT SINGAPURA', 103.83, 1.17, 'CRITICAL', 'Traffic sangat padat'],
  ['CP-KARIMATA', 'SELAT KARIMATA', 108.72, -1.91, 'MEDIUM', 'Traffic stabil'],
  ['CP-OMBAI', 'SELAT OMBAI', 124.12, -8.47, 'HIGH', 'Koridor ALKI III'],
  ['CP-WETAR', 'SELAT WETAR', 126.16, -8.18, 'MEDIUM', 'Koridor ALKI III'],
  ['CP-BALABAC', 'SELAT BALABAC', 117.09, 7.83, 'MEDIUM', 'Lintas perbatasan'],
  ['CP-TORRES', 'SELAT TORRES', 141.17, -10.12, 'HIGH', 'Perairan terbatas'],
  ['CP-SAPE', 'SELAT SAPE', 119.03, -8.64, 'MEDIUM', 'Ferry dan kargo'],
  ['CP-GASPAR', 'SELAT GASPAR', 107.2, -2.73, 'MEDIUM', 'Koridor Bangka'],
].map(([id, name, lng, lat, risk, traffic], index) => ({
  id,
  name,
  coordinates: [lng, lat],
  risk,
  traffic,
  vesselsPerDay: 180 + ((index * 347) % 2240),
  trendPercent: round(-3.4 + ((index * 23) % 94) / 10, 1),
}))

const shippingRoutes = [
  { id: 'ALKI-I', name: 'ALKI I · Natuna–Karimata–Sunda', kind: 'ARCHIPELAGIC_SEA_LANE', status: 'ACTIVE', coordinates: [[104.3, 6.4], [106.2, 2.7], [108.7, -1.7], [109.2, -4.4], [105.9, -6.1], [103.3, -9.8]] },
  { id: 'ALKI-IA', name: 'ALKI IA · Singapura–Natuna', kind: 'ARCHIPELAGIC_SEA_LANE', status: 'ACTIVE', coordinates: [[103.6, 1.1], [105.2, 2.2], [106.2, 2.7]] },
  { id: 'ALKI-II', name: 'ALKI II · Sulawesi–Makassar–Lombok', kind: 'ARCHIPELAGIC_SEA_LANE', status: 'ACTIVE', coordinates: [[119.2, 6.0], [118.9, 2.2], [118.7, -2.3], [117.8, -5.1], [115.8, -8.7], [113.7, -11.6]] },
  { id: 'ALKI-IIIA', name: 'ALKI III-A · Maluku–Banda–Ombai', kind: 'ARCHIPELAGIC_SEA_LANE', status: 'ACTIVE', coordinates: [[127.3, 5.0], [127.7, 0.2], [128.0, -3.8], [126.1, -6.0], [124.1, -8.5], [122.4, -11.4]] },
  { id: 'ALKI-IIIB', name: 'ALKI III-B · Seram–Leti', kind: 'ARCHIPELAGIC_SEA_LANE', status: 'MONITORED', coordinates: [[131.1, -2.0], [128.0, -3.8], [127.4, -6.8], [126.4, -8.4]] },
  { id: 'ALKI-IIIC', name: 'ALKI III-C · Banda–Arafura', kind: 'ARCHIPELAGIC_SEA_LANE', status: 'MONITORED', coordinates: [[128.0, -3.8], [130.9, -5.4], [134.5, -7.6], [138.0, -10.1]] },
  { id: 'COR-WEST', name: 'Koridor Samudra Hindia Barat', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[94.4, 7.8], [97.9, 3.6], [100.8, -1.4], [103.7, -6.2], [108.8, -10.6]] },
  { id: 'COR-NORTH', name: 'Koridor Laut Natuna Utara', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[101.3, 1.5], [108.1, 5.0], [114.7, 5.8], [120.2, 7.0], [125.8, 9.6]] },
  { id: 'COR-MALACCA-E', name: 'Traffic Lane Selat Malaka · Eastbound', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[97.2, 5.7], [99.1, 4.1], [101.0, 2.8], [103.2, 1.3], [104.1, 1.1]] },
  { id: 'COR-MALACCA-W', name: 'Traffic Lane Selat Malaka · Westbound', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[104.0, 1.0], [102.9, 1.5], [100.7, 2.9], [98.8, 4.3], [96.8, 6.0]] },
  { id: 'COR-SUNDA-E', name: 'Selat Sunda · Java Sea Approach', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[104.4, -8.8], [105.7, -6.5], [105.9, -5.8], [108.4, -5.2], [111.5, -5.1]] },
  { id: 'COR-SUNDA-W', name: 'Selat Sunda · Indian Ocean Approach', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[100.1, -7.6], [103.0, -7.0], [105.9, -5.8], [107.2, -4.9]] },
  { id: 'COR-LOMBOK-N', name: 'Selat Lombok · Northbound', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[113.7, -11.4], [115.6, -9.2], [115.8, -8.5], [116.8, -6.1], [118.0, -4.2]] },
  { id: 'COR-LOMBOK-S', name: 'Selat Lombok · Southbound', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[118.3, -4.0], [116.9, -6.2], [115.6, -8.6], [114.2, -10.9]] },
  { id: 'COR-MAKASSAR-E', name: 'Selat Makassar · Eastern Lane', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[119.5, 5.2], [119.2, 2.5], [119.0, -0.5], [118.8, -3.4], [119.8, -5.6]] },
  { id: 'COR-MAKASSAR-W', name: 'Selat Makassar · Western Lane', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[118.5, 5.1], [118.4, 2.1], [118.2, -1.0], [117.8, -4.1], [116.5, -6.0]] },
  { id: 'COR-NATUNA-W', name: 'Natuna–Singapore Commercial Link', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[103.7, 1.2], [105.8, 2.6], [108.2, 4.8], [110.4, 6.2]] },
  { id: 'COR-NATUNA-E', name: 'Natuna–Sulawesi Commercial Link', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[108.0, 5.2], [112.0, 4.5], [116.0, 3.4], [120.3, 2.0], [124.3, 3.8]] },
  { id: 'COR-JAVA-NORTH', name: 'Laut Jawa · Northern Main Lane', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[106.2, -4.8], [109.5, -4.5], [113.0, -4.7], [116.2, -4.6], [119.0, -5.3]] },
  { id: 'COR-JAVA-PORTS', name: 'Tanjung Priok–Tanjung Emas–Tanjung Perak', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[106.9, -6.1], [109.4, -5.9], [110.4, -6.9], [112.7, -7.2]] },
  { id: 'COR-JAVA-BORNEO', name: 'Laut Jawa · Borneo Feeder', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[108.0, -5.2], [110.4, -3.3], [112.7, -1.8], [114.5, -3.3]] },
  { id: 'COR-BANDA-W', name: 'Banda Sea Western Corridor', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[120.0, -5.8], [123.0, -6.1], [126.0, -5.3], [128.2, -4.4]] },
  { id: 'COR-BANDA-E', name: 'Banda Sea Eastern Corridor', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[127.8, -3.3], [130.0, -4.8], [132.0, -6.4], [134.0, -7.4]] },
  { id: 'COR-ARAFURA-W', name: 'Arafura Fisheries Transit West', kind: 'COMMERCIAL_CORRIDOR', status: 'MONITORED', coordinates: [[127.0, -8.2], [130.2, -8.4], [133.4, -8.2], [136.2, -8.4]] },
  { id: 'COR-ARAFURA-E', name: 'Arafura Fisheries Transit East', kind: 'COMMERCIAL_CORRIDOR', status: 'MONITORED', coordinates: [[132.0, -6.3], [135.0, -7.0], [138.0, -8.0], [140.4, -9.2]] },
  { id: 'COR-PAPUA-NORTH', name: 'Papua Northern Coastal Lane', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[131.5, 0.2], [134.8, -0.3], [138.0, -1.2], [140.8, -2.5]] },
  { id: 'COR-SULAWESI', name: 'Sulawesi Inter-Island Corridor', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[119.5, -5.0], [121.0, -3.2], [122.4, -1.1], [124.0, 1.5], [125.2, 3.4]] },
  { id: 'COR-TIMOR', name: 'Timor–Ombai Maritime Corridor', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[121.8, -10.6], [123.6, -9.6], [124.2, -8.5], [126.1, -8.1], [128.4, -7.3]] },
  { id: 'COR-MALUKU', name: 'Maluku–Halmahera Coastal Corridor', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[126.9, 2.3], [127.6, 0.7], [128.4, -1.3], [128.2, -3.7], [127.5, -5.4]] },
  { id: 'RISK-NATUNA', name: 'Natuna Elevated Identification Corridor', kind: 'RISK_CORRIDOR', status: 'ELEVATED', coordinates: [[106.5, 6.4], [108.5, 5.4], [110.5, 4.5], [112.8, 4.2]] },
  { id: 'RISK-MALACCA', name: 'Malacca Night Watch Corridor', kind: 'RISK_CORRIDOR', status: 'ELEVATED', coordinates: [[100.1, 3.7], [101.5, 2.7], [103.0, 1.6], [104.0, 1.2]] },
  { id: 'RISK-ARAFURA', name: 'Arafura IUU Watch Corridor', kind: 'RISK_CORRIDOR', status: 'ELEVATED', coordinates: [[132.0, -8.8], [134.0, -7.5], [136.2, -7.2], [138.5, -8.4]] },
  { id: 'RISK-AMBALAT', name: 'Ambalat Surveillance Corridor', kind: 'RISK_CORRIDOR', status: 'ELEVATED', coordinates: [[117.5, 4.8], [118.3, 4.1], [119.0, 3.3], [120.2, 3.7]] },
  { id: 'ALKI-IB', name: 'ALKI I-B · Karimata–Laut Jawa', kind: 'ARCHIPELAGIC_SEA_LANE', status: 'ACTIVE', coordinates: [[108.7, -1.7], [108.9, -3.2], [110.4, -4.6], [112.3, -5.3]] },
  { id: 'ALKI-IIB', name: 'ALKI II-B · Makassar–Flores', kind: 'ARCHIPELAGIC_SEA_LANE', status: 'ACTIVE', coordinates: [[118.6, -2.4], [118.2, -5], [119.4, -7.2], [120.8, -8.4]] },
  { id: 'COR-SINGAPORE-APPROACH', name: 'Selat Singapura · Eastern Approach', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[103.4, 1.2], [104.2, 1], [104.9, 1.7], [105.8, 2.5]] },
  { id: 'COR-KARIMATA', name: 'Selat Karimata · Through-Route', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[109, -1], [108.5, -2.6], [109.4, -4], [110.6, -5.2]] },
  { id: 'COR-BALI-STRAIT', name: 'Selat Bali · Java–Bali Feeder', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[114.4, -7.8], [114.6, -8.4], [115.1, -9], [115.9, -9.5]] },
  { id: 'COR-FLORES', name: 'Laut Flores · Inter-Island Lane', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[119.6, -7.6], [121.4, -8], [123, -8.4], [124.6, -8.6]] },
  { id: 'COR-CELEBES', name: 'Laut Sulawesi · Northbound Transit', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[120.4, 1.8], [122, 3], [123.6, 3.9], [125, 4.4]] },
  { id: 'COR-SULU', name: 'Laut Sulu · Tarakan–Mindanao Approach', kind: 'COMMERCIAL_CORRIDOR', status: 'MONITORED', coordinates: [[118.6, 3.4], [120.2, 4.4], [121.8, 5.4], [123.2, 6.1]] },
  { id: 'COR-SANGIHE', name: 'Sangihe–Talaud · Northern Feeder', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[125, 1.6], [125.4, 3], [126.4, 4.2], [127, 5]] },
  { id: 'COR-HALMAHERA', name: 'Laut Halmahera · Coastal Lane', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[127.4, 1.6], [128.2, 0.4], [128.6, -1], [129.4, -2.2]] },
  { id: 'COR-SERAM', name: 'Laut Seram · East–West Corridor', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[127.6, -2.8], [129, -3], [130.4, -3.1], [131.6, -3]] },
  { id: 'COR-CENDERAWASIH', name: 'Teluk Cenderawasih · Papua Lane', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[134, -1.4], [134.8, -2], [135.6, -2.6], [136.4, -2.4]] },
  { id: 'COR-PAPUA-SOUTH', name: 'Papua Selatan · Arafura Link', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[135, -4.6], [136.6, -6], [138.2, -7.4], [140.2, -8.2]] },
  { id: 'COR-TIMOR-SEA', name: 'Laut Timor · Offshore Transit', kind: 'COMMERCIAL_CORRIDOR', status: 'MONITORED', coordinates: [[123.6, -9.6], [125.6, -10.2], [127.6, -10.6], [129.6, -10.8]] },
  { id: 'COR-BANDA-CENTRAL', name: 'Laut Banda · Central Crossing', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[125.4, -5], [127.4, -5.6], [129.4, -6], [131.2, -6.2]] },
  { id: 'COR-JAVA-EAST', name: 'Laut Jawa Timur · Selat Madura Feeder', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[112.7, -6], [113.6, -6.4], [114.4, -6.9], [115.4, -7.3]] },
  { id: 'COR-BORNEO-EAST', name: 'Kalimantan Timur · Makassar Feeder', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[117.6, -1], [117.8, 0.4], [118.2, 1.6], [118.8, 2.6]] },
  { id: 'RISK-SULU', name: 'Sulu–Celebes IUU & Piracy Watch', kind: 'RISK_CORRIDOR', status: 'ELEVATED', coordinates: [[120, 3.4], [121.6, 4.4], [123, 5.2], [124.2, 5.6]] },
  { id: 'RISK-SULAWESI', name: 'Selat Makassar Smuggling Watch', kind: 'RISK_CORRIDOR', status: 'MONITORED', coordinates: [[118.6, -1.6], [118.2, -3], [118.6, -4.2], [119.2, -5]] },
  { id: 'RISK-TIMOR', name: 'Laut Timor Border Surveillance', kind: 'RISK_CORRIDOR', status: 'ELEVATED', coordinates: [[123.4, -9.2], [125.4, -9.8], [127.2, -10.2], [129, -10.4]] },
  // Operational audit corridors remain realistic and visible enough to verify native Mapbox rendering.
  { id: 'OPS-MALACCA-SUNDA', name: 'Malacca–Sunda Strategic Shipping Corridor', kind: 'COMMERCIAL_CORRIDOR', status: 'ACTIVE', coordinates: [[98.2, 5.5], [100.8, 3.1], [103.7, 1.1], [104.9, -2.4], [105.9, -5.9]] },
  { id: 'OPS-MAKASSAR-BANDA', name: 'Makassar–Banda Elevated Monitoring Corridor', kind: 'RISK_CORRIDOR', status: 'ELEVATED', coordinates: [[119.1, 2.1], [118.7, -1.4], [119.8, -5.3], [123.6, -6.2], [128.1, -4.4]] },
  { id: 'OPS-NATUNA-MAKASSAR', name: 'Natuna–Makassar Air Surveillance Corridor', kind: 'AIR_SURVEILLANCE_CORRIDOR', status: 'ACTIVE', coordinates: [[108.2, 5.4], [112.5, 4.6], [116.2, 2.7], [119.1, -1.2]] },
]

const routePoints = shippingRoutes.map((route) => route.coordinates)
const aircraftRoutes = [
  [[106.66, -6.12], [110.4, -6.7], [112.79, -7.38], [115.17, -8.75]],
  [[104.0, 1.36], [108.7, -1.2], [113.2, -3.2], [119.55, -5.06]],
  [[98.67, 3.64], [104.0, 1.36], [110.4, -6.7], [112.79, -7.38]],
  [[125.09, 1.55], [128.2, -2.9], [131.29, -0.89], [140.52, -2.58]],
  [[123.67, -10.17], [119.55, -5.06], [116.27, -3.44], [114.0, -1.27]],
  [[103.7, 1.35], [107.1, 2.0], [111.6, 4.1], [116.0, 6.9]],
  [[106.66, -6.12], [111.8, -4.9], [116.9, -5.0], [119.55, -5.06]],
  [[112.79, -7.38], [115.0, -4.8], [116.9, -2.2], [116.89, -1.27]],
  [[119.55, -5.06], [124.4, -3.8], [130.2, -2.2], [140.52, -2.58]],
  [[106.66, -6.12], [107.8, -2.4], [108.1, 2.1], [108.4, 5.2]],
  [[108.4, 5.2], [110.2, 6.2], [111.3, 4.7], [109.7, 3.4], [108.4, 5.2]],
  [[119.55, -5.06], [123.0, -6.6], [128.0, -7.2], [134.8, -7.4], [140.4, -8.5]],
  [[125.09, 1.55], [124.2, 3.2], [121.0, 4.2], [118.0, 3.8], [116.0, 5.1]],
  [[131.29, -0.89], [134.8, -1.8], [138.4, -3.0], [140.52, -2.58]],
]

function interpolateRoute(route, progress) {
  const segmentFloat = progress * (route.length - 1)
  const segment = Math.min(route.length - 2, Math.floor(segmentFloat))
  const local = segmentFloat - segment
  const start = route[segment]
  const end = route[segment + 1]
  return [start[0] + (end[0] - start[0]) * local, start[1] + (end[1] - start[1]) * local]
}

function headingBetween(a, b) {
  const y = Math.sin((b[0] - a[0]) * Math.PI / 180) * Math.cos(b[1] * Math.PI / 180)
  const x = Math.cos(a[1] * Math.PI / 180) * Math.sin(b[1] * Math.PI / 180) - Math.sin(a[1] * Math.PI / 180) * Math.cos(b[1] * Math.PI / 180) * Math.cos((b[0] - a[0]) * Math.PI / 180)
  return round((Math.atan2(y, x) * 180 / Math.PI + 360) % 360, 1)
}

function buildTrack(route, phase, speedBase, aircraft = false) {
  const reverse = phase % 2 === 1
  return Array.from({ length: TRACK_POINTS }, (_, index) => {
    let progress = (index / (TRACK_POINTS - 1) + phase * 0.071) % 1
    if (reverse) progress = 1 - progress
    const current = interpolateRoute(route, clamp(progress, 0, 1))
    const next = interpolateRoute(route, clamp(progress + (reverse ? -0.006 : 0.006), 0, 1))
    const crossTrack = Math.sin(index * 0.39 + phase) * (aircraft ? 0.055 : 0.025)
    const coordinates = [round(current[0] + crossTrack, 4), round(current[1] - crossTrack * 0.65, 4)]
    return {
      timestamp: timestampAt(index),
      coordinates,
      heading: headingBetween(current, next),
      speed: round(Math.max(aircraft ? 120 : 0.8, speedBase + Math.sin(index * 0.31 + phase) * (aircraft ? 24 : 1.8)), 1),
    }
  })
}

const vesselRoots = ['Arunika', 'Bahari', 'Bima Samudra', 'Cakrawala', 'Celebes', 'Dewata', 'Flores Raya', 'Gema Laut', 'Halmahera', 'Intan Natuna', 'Jala Nusantara', 'Karimata', 'Laut Banda', 'Mahakam', 'Nusa Tenggara', 'Ombak Timur', 'Pusaka Maritim', 'Rajawali Laut', 'Seram Indah', 'Tangguh Borneo', 'Ujung Kulon', 'Wakatobi', 'Yamdena', 'Zamrud Khatulistiwa']
const internationalRoots = ['Eastern Meridian', 'Pacific Orchid', 'Straits Pioneer', 'Ocean Reliance', 'Coral Venture', 'Blue Horizon', 'Golden Estuary', 'Southern Albatross', 'Silver Monsoon', 'Jade Current', 'Andaman Resolve', 'Borneo Crest']
const vesselTypes = ['Container', 'Bulk Carrier', 'Tanker', 'General Cargo', 'Ro-Ro', 'Passenger', 'Fishing', 'Tug', 'Research', 'Offshore Support']
const flags = ['Indonesia', 'Singapore', 'Malaysia', 'Panama', 'Liberia', 'Marshall Islands', 'Philippines', 'Vietnam', 'Japan', 'South Korea']
const prefixes = ['MV', 'MT', 'KM', 'FV', 'SV']
const severityCycle = ['NORMAL', 'NORMAL', 'NORMAL', 'LOW', 'NORMAL', 'MEDIUM', 'NORMAL', 'HIGH', 'NORMAL', 'CRITICAL']

const vessels = Array.from({ length: 360 }, (_, index) => {
  const type = vesselTypes[index % vesselTypes.length]
  const rootName = index % 4 === 0 ? internationalRoots[index % internationalRoots.length] : vesselRoots[index % vesselRoots.length]
  const prefix = type === 'Fishing' ? 'FV' : prefixes[index % prefixes.length]
  const name = `${prefix} ${rootName} ${String(17 + ((index * 19) % 81)).padStart(2, '0')}`
  const speedBase = type === 'Fishing' ? 4.8 : type === 'Tug' ? 7.3 : type === 'Passenger' ? 18.4 : 12.7
  const track = buildTrack(routePoints[index % routePoints.length], index, speedBase)
  const severity = severityCycle[(index * 7) % severityCycle.length]
  return {
    id: `VS-${String(index + 1).padStart(4, '0')}`,
    name,
    mmsi: String(525000000 + index * 7919).slice(0, 9),
    imo: String(9100000 + index * 1871).slice(0, 7),
    callSign: `YD${String.fromCharCode(65 + (index % 26))}${String.fromCharCode(65 + ((index * 5) % 26))}${(index * 7) % 10}`,
    type,
    flag: flags[index % flags.length],
    severity,
    navigationalStatus: type === 'Fishing' && index % 3 === 0 ? 'Engaged in fishing' : index % 13 === 0 ? 'Restricted manoeuvrability' : 'Under way using engine',
    lengthM: 34 + ((index * 17) % 286),
    draughtM: round(2.4 + ((index * 13) % 96) / 10, 1),
    destination: ports[(index * 7) % ports.length].name,
    eta: new Date(BASE_TIME.getTime() + (3 + (index % 46)) * 60 * 60 * 1000).toISOString(),
    provenance: index % 3 === 0 ? 'AIS terrestrial simulation' : index % 3 === 1 ? 'AIS satellite simulation' : 'AIS coastal fusion simulation',
    track,
  }
})

const aircraftTypes = ['B737-800', 'A320-200', 'ATR 72-600', 'B777-300ER', 'A330-900', 'Cessna 208B', 'C-130J', 'Gulfstream G550', 'CN-235', 'B787-9']
const operators = ['Garuda Indonesia', 'Batik Air', 'Citilink', 'Lion Air', 'Sriwijaya Air', 'Pelita Air', 'Indonesia AirAsia', 'TNI Angkatan Udara', 'Susi Air', 'Singapore Airlines', 'Malaysia Airlines', 'Qantas']
const airlineCodes = ['GIA', 'BTK', 'CTV', 'LNI', 'SJY', 'PAS', 'AWQ', 'TNI', 'SQS', 'SIA', 'MAS', 'QFA']
const aircraft = Array.from({ length: 72 }, (_, index) => {
  const track = buildTrack(aircraftRoutes[index % aircraftRoutes.length], index + 3, 390 + (index % 6) * 12, true)
  const severity = severityCycle[(index * 3) % severityCycle.length]
  return {
    id: `AC-${String(index + 1).padStart(3, '0')}`,
    callSign: `${airlineCodes[index % airlineCodes.length]}${204 + index * 7}`,
    icao24: (0x8a0000 + index * 1297).toString(16).slice(0, 6),
    registration: index % 8 === 0 ? `A-${1300 + index}` : `PK-${String.fromCharCode(65 + (index % 24))}${String.fromCharCode(65 + ((index * 7) % 24))}${String.fromCharCode(65 + ((index * 11) % 24))}`,
    type: aircraftTypes[index % aircraftTypes.length],
    operator: operators[index % operators.length],
    severity,
    altitudeFt: 9000 + ((index * 1700) % 31000),
    verticalRateFpm: index % 4 === 0 ? 1200 : index % 5 === 0 ? -900 : 0,
    origin: ports[(index * 3) % ports.length].region,
    destination: ports[(index * 11 + 5) % ports.length].region,
    provenance: 'ADS-B state-vector simulation',
    track,
  }
})

const patrolCenters = [
  ['Natuna Utara', 108.1, 5.0], ['Selat Malaka Utara', 99.2, 4.6], ['Selat Malaka Selatan', 103.0, 1.7], ['Selat Sunda', 105.8, -5.8],
  ['Selatan Jawa', 109.5, -9.1], ['Lombok', 115.8, -8.7], ['Makassar Utara', 119.1, 2.5], ['Makassar Selatan', 118.3, -4.2],
  ['Karimata', 108.7, -1.9], ['Sulawesi', 122.5, 1.2], ['Banda', 128.0, -4.3], ['Arafura Barat', 132.4, -7.7],
  ['Arafura Timur', 137.1, -7.7], ['Papua Utara', 138.0, 0.3], ['Timor', 124.2, -10.0], ['Ombai-Wetar', 125.3, -8.3],
  ['Sulu-Sulawesi', 121.2, 5.3], ['Batam-Bintan', 104.4, 1.1], ['Bangka-Belitung', 106.9, -2.7], ['Laut Jawa', 111.4, -5.1],
  ['Flores', 121.0, -7.2], ['Halmahera', 128.1, 1.4], ['Seram', 130.4, -2.5], ['Torres', 140.8, -9.7],
]
function boxPolygon(lng, lat, dx, dy) {
  return [[[round(lng - dx), round(lat - dy)], [round(lng + dx), round(lat - dy)], [round(lng + dx), round(lat + dy)], [round(lng - dx), round(lat + dy)], [round(lng - dx), round(lat - dy)]]]
}
const patrolZones = patrolCenters.map(([name, lng, lat], index) => ({
  id: `PZ-${String(index + 1).padStart(2, '0')}`,
  name: `Sektor Patroli ${name}`,
  coordinates: boxPolygon(lng, lat, 0.7 + (index % 3) * 0.22, 0.45 + (index % 4) * 0.11),
  status: index % 7 === 0 ? 'REINFORCED' : 'ACTIVE',
  assignedAssetCount: 2 + (index % 5),
}))

const watchCenters = [
  ['Natuna North Watch', 109.2, 5.5, 'DISPUTED'], ['Ambalat Surveillance', 118.2, 4.1, 'DISPUTED'], ['Malacca TSS Guard', 101.8, 2.5, 'RESTRICTED'],
  ['Singapore Strait Precaution', 104.0, 1.15, 'WATCH'], ['Sunda Separation Scheme', 105.9, -5.9, 'RESTRICTED'], ['Lombok Separation Scheme', 115.75, -8.55, 'RESTRICTED'],
  ['Arafura IUU Watch', 135.2, -8.0, 'WATCH'], ['Timor Offshore Watch', 124.8, -10.3, 'WATCH'], ['Sulu Transit Watch', 120.0, 6.2, 'WATCH'],
  ['Banda Exercise Buffer', 129.1, -5.2, 'RESTRICTED'], ['Papua Northern Approach', 139.2, 0.2, 'WATCH'], ['Karimata Traffic Buffer', 108.5, -2.0, 'WATCH'],
  ['Makassar Cable Protection', 118.7, -2.8, 'RESTRICTED'], ['Java Offshore Installation', 108.0, -5.7, 'RESTRICTED'], ['Sorong Port Security', 131.2, -1.0, 'RESTRICTED'],
  ['Batam Anchorage Control', 104.1, 1.2, 'WATCH'], ['Ombai Subsurface Watch', 124.1, -8.5, 'WATCH'], ['Torres Navigation Guard', 140.9, -10.0, 'RESTRICTED'],
]
const watchAreas = watchCenters.map(([name, lng, lat, category], index) => ({
  id: `WA-${String(index + 1).padStart(2, '0')}`,
  name,
  category,
  severity: index % 6 === 0 ? 'CRITICAL' : index % 3 === 0 ? 'HIGH' : 'MEDIUM',
  coordinates: boxPolygon(lng, lat, 0.6 + (index % 4) * 0.15, 0.35 + (index % 3) * 0.13),
  directive: category === 'RESTRICTED' ? 'Entry requires operational clearance' : 'Increase identification and reporting cadence',
}))

const sensorTypes = ['COASTAL_RADAR', 'AIS_RECEIVER', 'VTS', 'EO_IR', 'HF_RADAR', 'ADS_B_RECEIVER']
const sensors = patrolCenters.map(([name, lng, lat], index) => ({
  id: `SN-${String(index + 1).padStart(2, '0')}`,
  name: `${sensorTypes[index % sensorTypes.length].replaceAll('_', ' ')} ${name}`,
  type: sensorTypes[index % sensorTypes.length],
  coordinates: [lng, lat],
  status: index % 13 === 0 ? 'DEGRADED' : 'ONLINE',
  coverageNm: 42 + (index % 7) * 18,
  confidence: round(91.4 + (index % 8) * 0.9, 1),
}))

const eezBoundary = {
  id: 'EEZ-SIMPLIFIED-REFERENCE',
  name: 'Batas yurisdiksi maritim Indonesia · visualisasi indikatif',
  disclaimer: 'Simplified frontend visualization; not for navigation or legal boundary determination.',
  coordinates: [[94.0, 7.4], [98.2, 8.2], [104.6, 6.7], [111.2, 8.0], [118.0, 9.2], [125.1, 11.0], [131.8, 6.3], [141.8, 2.7], [143.3, -10.8], [136.0, -13.1], [128.2, -13.7], [119.0, -13.0], [111.4, -12.8], [103.2, -11.0], [96.4, -7.3], [92.8, -1.0], [94.0, 7.4]],
}

const maritimeLabels = [
  ['LAB-MALAKA', 'SELAT MALAKA', 101.2, 3.0], ['LAB-SUNDA', 'SELAT SUNDA', 105.6, -6.3], ['LAB-LOMBOK', 'SELAT LOMBOK', 115.5, -8.85],
  ['LAB-MAKASSAR', 'SELAT MAKASSAR', 118.4, -2.0], ['LAB-NATUNA', 'LAUT NATUNA UTARA', 108.5, 5.7], ['LAB-JAWA', 'LAUT JAWA', 111.2, -4.8],
  ['LAB-BANDA', 'LAUT BANDA', 128.1, -5.3], ['LAB-ARAFURA', 'LAUT ARAFURA', 136.0, -7.1], ['LAB-SULAWESI', 'LAUT SULAWESI', 122.7, 3.7],
  ['LAB-HINDIA', 'SAMUDRA HINDIA', 101.4, -8.7], ['LAB-FLORES', 'LAUT FLORES', 122.3, -6.6], ['LAB-SERAM', 'LAUT SERAM', 130.0, -1.9],
].map(([id, label, lng, lat]) => ({ id, label, coordinates: [lng, lat] }))

const eventTypes = ['AIS_GAP', 'ROUTE_DEVIATION', 'RENDEZVOUS', 'LOITERING', 'SPEED_ANOMALY', 'RESTRICTED_ENTRY', 'IDENTITY_MISMATCH', 'BORDER_CROSSING', 'WEATHER_HAZARD', 'DARK_ACTIVITY']
const eventTitles = {
  AIS_GAP: 'Transmisi AIS terputus di koridor aktif', ROUTE_DEVIATION: 'Deviasi dari jalur pelayaran terpantau', RENDEZVOUS: 'Pertemuan dua target di luar area labuh',
  LOITERING: 'Pola gerak berulang pada kecepatan rendah', SPEED_ANOMALY: 'Perubahan kecepatan tidak konsisten', RESTRICTED_ENTRY: 'Target memasuki zona pembatasan',
  IDENTITY_MISMATCH: 'Atribut identitas tidak konsisten', BORDER_CROSSING: 'Perlintasan garis pemantauan terdeteksi', WEATHER_HAZARD: 'Target memasuki sektor cuaca berisiko',
  DARK_ACTIVITY: 'Aktivitas tanpa korelasi identitas memadai',
}

const events = Array.from({ length: 140 }, (_, index) => {
  const type = eventTypes[index % eventTypes.length]
  const vessel = vessels[(index * 17) % vessels.length]
  const trackIndex = (index * 11) % 96
  return {
    id: `EV-${String(index + 1).padStart(4, '0')}`,
    timestamp: timestampAt(trackIndex),
    title: eventTitles[type],
    type,
    severity: severityCycle[(index * 9) % severityCycle.length],
    entityId: vessel.id,
    entityName: vessel.name,
    coordinates: vessel.track[trackIndex].coordinates,
    confidence: round(72 + (index % 27) * 0.9, 1),
    sourceFusion: pick(['AIS + radar pesisir', 'AIS + citra EO', 'AIS + pola historis', 'VTS + laporan patroli'], index),
  }
})

const anomalies = Array.from({ length: 64 }, (_, index) => {
  const event = events[(index * 2) % events.length]
  return {
    id: `AN-${String(index + 1).padStart(3, '0')}`,
    eventId: event.id,
    timestamp: event.timestamp,
    rule: event.type,
    title: event.title,
    entityId: event.entityId,
    entityName: event.entityName,
    coordinates: event.coordinates,
    severity: index % 7 === 0 ? 'CRITICAL' : index % 3 === 0 ? 'HIGH' : 'MEDIUM',
    score: 58 + ((index * 11) % 40),
    state: pick(['NEW', 'TRIAGED', 'INVESTIGATING', 'CORRELATED'], index),
    explanation: `Pola ${event.type.toLowerCase().replaceAll('_', ' ')} melampaui baseline sektor dan membutuhkan verifikasi analis.`,
  }
})

const earlyWarnings = Array.from({ length: 40 }, (_, index) => {
  const anomaly = anomalies[(index * 5) % anomalies.length]
  return {
    id: `EW-${String(index + 1).padStart(3, '0')}`,
    timestamp: anomaly.timestamp,
    title: `Peringatan dini · ${anomaly.title}`,
    severity: anomaly.severity,
    coordinates: anomaly.coordinates,
    sector: patrolZones[index % patrolZones.length].name,
    slaMinutes: anomaly.severity === 'CRITICAL' ? 10 : 30,
    status: pick(['ACTIVE', 'ACKNOWLEDGED', 'ESCALATED'], index),
    recommendedAction: pick(['Verifikasi identitas dan arah gerak', 'Tingkatkan cadence sensor sektor', 'Korelasikan dengan patroli terdekat', 'Siapkan briefing supervisor'], index),
  }
})

const threatAssessments = Array.from({ length: 36 }, (_, index) => ({
  id: `TA-${String(index + 1).padStart(3, '0')}`,
  timestamp: timestampAt((index * 7) % 96),
  title: `Penilaian risiko ${patrolZones[index % patrolZones.length].name}`,
  sector: patrolZones[index % patrolZones.length].name,
  coordinates: patrolCenters[index % patrolCenters.length].slice(1),
  domain: pick(['MARITIME_SECURITY', 'IUU_FISHING', 'SMUGGLING', 'TRAFFICKING', 'NAVIGATION_SAFETY', 'BORDER_INTEGRITY'], index),
  score: 41 + ((index * 17) % 57),
  level: index % 6 === 0 ? 'CRITICAL' : index % 3 === 0 ? 'HIGH' : 'MEDIUM',
  trend: pick(['RISING', 'STABLE', 'DECLINING'], index),
  confidence: round(78 + (index % 18) * 1.1, 1),
}))

const reportTopics = ['Situasi maritim harian', 'Pengawasan ALKI', 'Aktivitas kapal perikanan', 'Keselamatan choke point', 'Perlintasan udara strategis', 'Risiko perbatasan laut']
const reports = Array.from({ length: 60 }, (_, index) => ({
  id: `IR-${String(index + 1).padStart(4, '0')}`,
  timestamp: timestampAt((index * 13) % 96),
  title: `${reportTopics[index % reportTopics.length]} · Sektor ${patrolCenters[index % patrolCenters.length][0]}`,
  classification: index % 5 === 0 ? 'SECRET' : 'INTERNAL',
  status: pick(['DRAFT', 'IN_REVIEW', 'APPROVED', 'DISTRIBUTED'], index),
  authorRole: pick(['Analis Maritim', 'Analis Perbatasan', 'Supervisor Intelijen'], index),
  linkedEntityCount: 3 + (index % 14),
  findingCount: 2 + (index % 8),
}))

const alerts = Array.from({ length: 240 }, (_, index) => {
  const event = events[(index * 13) % events.length]
  const timeIndex = (index * 17) % 96
  const severity = index % 11 === 0 ? 'CRITICAL' : index % 4 === 0 ? 'HIGH' : index % 3 === 0 ? 'MEDIUM' : 'LOW'
  return {
    id: `AL-${String(index + 1).padStart(4, '0')}`,
    timestamp: timestampAt(timeIndex),
    title: event.title,
    severity,
    entityId: event.entityId,
    entityName: event.entityName,
    coordinates: event.coordinates,
    source: event.sourceFusion,
    confidence: round(Math.min(99.7, event.confidence + (index % 9) * 0.7), 1),
    suggestedAction: pick(['Verifikasi identitas dan korelasikan radar pesisir', 'Tingkatkan cadence sensor pada sektor terkait', 'Hubungi unsur patroli terdekat untuk observasi', 'Eskalasi ke supervisor dan siapkan briefing taktis'], index),
    status: index % 9 === 0 ? 'ESCALATED' : index % 4 === 0 ? 'ACKNOWLEDGED' : 'ACTIVE',
  }
}).sort((a, b) => a.timestamp.localeCompare(b.timestamp))

const replayFrames = Array.from({ length: 96 }, (_, index) => {
  const frameTimestamp = timestampAt(index + 1)
  const vesselCount = 286 + Math.round(48 * Math.sin(index * 0.23) + ((index * 17) % 39))
  const aircraftCount = 42 + Math.round(9 * Math.cos(index * 0.31) + ((index * 5) % 8))
  const frameAlerts = alerts.filter((alert) => alert.timestamp >= timestampAt(index) && alert.timestamp < frameTimestamp)
  const frameEvents = events.filter((event) => event.timestamp >= timestampAt(index) && event.timestamp < frameTimestamp)
  return {
    index,
    timestamp: frameTimestamp,
    vesselCount,
    aircraftCount,
    eventCount: Math.max(frameEvents.length, 1 + ((index * 7) % 6)),
    alertCount: Math.max(frameAlerts.length, index % 5),
    activity: clamp(Math.round(18 + vesselCount * 0.075 + aircraftCount * 0.16 + frameEvents.length * 3.6 + frameAlerts.length * 4.5), 28, 100),
  }
})

const weather = [
  { area: 'Selat Malaka', condition: 'Hujan ringan', waveHeightM: 1.2, waveClass: 'Rendah', windKnots: 11, visibilityNm: 9, currentKnots: 0.6 },
  { area: 'Laut Natuna Utara', condition: 'Berawan tebal', waveHeightM: 2.4, waveClass: 'Sedang', windKnots: 19, visibilityNm: 7, currentKnots: 0.9 },
  { area: 'Selat Makassar', condition: 'Cerah berawan', waveHeightM: 1.4, waveClass: 'Sedang', windKnots: 13, visibilityNm: 10, currentKnots: 0.7 },
  { area: 'Laut Arafura', condition: 'Hujan lokal', waveHeightM: 2.8, waveClass: 'Tinggi', windKnots: 23, visibilityNm: 5, currentKnots: 1.1 },
  { area: 'Selatan Jawa', condition: 'Berawan', waveHeightM: 3.2, waveClass: 'Tinggi', windKnots: 26, visibilityNm: 8, currentKnots: 1.4 },
]

const sourceHealth = [
  ['AIS NASIONAL', 'ONLINE', 99.4], ['ADS-B REGIONAL', 'ONLINE', 98.7], ['RADAR PESISIR', 'ONLINE', 97.8], ['VTS PELABUHAN', 'ONLINE', 98.9],
  ['EO / OPTICAL', 'DEGRADED', 92.4], ['CUACA MARITIM', 'ONLINE', 99.1], ['PATROLI SEKTOR', 'ONLINE', 96.8], ['INTELLIGENCE LOG', 'ONLINE', 99.7],
].map(([name, status, confidence], index) => ({ id: `SRC-${index + 1}`, name, status, confidence, latencySeconds: 2 + index * 3 }))

const entitiesFixture = envelope(
  'NMP moving entities and 24-hour tracks',
  ['IMO AIS field guidance', 'Global Fishing Watch vessel identity and presence methodology', 'OpenSky state-vector field model'],
  { vessels, aircraft },
  { vessels: vessels.length, aircraft: aircraft.length, vesselTrackPoints: vessels.reduce((sum, item) => sum + item.track.length, 0), aircraftTrackPoints: aircraft.reduce((sum, item) => sum + item.track.length, 0) },
)

const geographyFixture = envelope(
  'NMP tactical geography and infrastructure',
  ['UN Indonesian archipelagic sea-lane designation', 'BIG maritime boundary map references', 'Kemenhub Inaportnet port references', 'BMKG maritime area naming'],
  { ports, chokepoints, shippingRoutes, patrolZones, watchAreas, sensors, eezBoundary, maritimeLabels },
  { ports: ports.length, chokepoints: chokepoints.length, shippingRoutes: shippingRoutes.length, patrolZones: patrolZones.length, watchAreas: watchAreas.length, sensors: sensors.length },
)

const intelligenceFixture = envelope(
  'NMP maritime intelligence activity',
  ['IMO AIS behavior fields', 'Global Fishing Watch activity methodology', 'ReCAAP incident reporting patterns'],
  { events, anomalies, earlyWarnings, threatAssessments, reports, alerts },
  { events: events.length, anomalies: anomalies.length, earlyWarnings: earlyWarnings.length, threatAssessments: threatAssessments.length, reports: reports.length, alerts: alerts.length },
)

const replayFixture = envelope(
  'NMP 24-hour replay frames and environmental context',
  ['BMKG maritime forecast parameter model', 'OpenSky 24-hour state-vector dataset cadence', 'Global Fishing Watch hourly vessel-presence concept'],
  { replayFrames, weather, sourceHealth, liveTimestamp: timestampAt(96) },
  { replayFrames: replayFrames.length, weatherAreas: weather.length, sources: sourceHealth.length },
)

await mkdir(output, { recursive: true })
await Promise.all([
  writeFile(resolve(output, 'nmp-entities.json'), `${JSON.stringify(entitiesFixture)}\n`),
  writeFile(resolve(output, 'nmp-geography.json'), `${JSON.stringify(geographyFixture)}\n`),
  writeFile(resolve(output, 'nmp-intelligence.json'), `${JSON.stringify(intelligenceFixture)}\n`),
  writeFile(resolve(output, 'nmp-replay.json'), `${JSON.stringify(replayFixture)}\n`),
])

console.log(JSON.stringify({
  vessels: vessels.length,
  aircraft: aircraft.length,
  vesselTrackPoints: vessels.reduce((sum, item) => sum + item.track.length, 0),
  aircraftTrackPoints: aircraft.reduce((sum, item) => sum + item.track.length, 0),
  events: events.length,
  anomalies: anomalies.length,
  earlyWarnings: earlyWarnings.length,
  threatAssessments: threatAssessments.length,
  reports: reports.length,
  patrolZones: patrolZones.length,
  watchAreas: watchAreas.length,
  ports: ports.length,
  chokepoints: chokepoints.length,
  sensors: sensors.length,
  alerts: alerts.length,
  replayFrames: replayFrames.length,
}, null, 2))
