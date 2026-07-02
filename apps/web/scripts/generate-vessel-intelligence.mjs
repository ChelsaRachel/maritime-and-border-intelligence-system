import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const generatedAt = '2026-07-02T09:30:00+07:00'
const output = resolve(process.cwd(), 'public/data/mbis-vessel-intelligence.json')

const publicAnchors = [
  { name: 'EVER GIVEN', imo: '9811000', mmsi: '353136000', callSign: 'H3RC', country: 'Panama', emoji: '🇵🇦', type: 'Container Ship', gt: 219079, dwt: 199489, length: 399.94, beam: 58.8, built: 2018, operator: 'Evergreen Marine', manager: 'Bernhard Schulte Shipmanagement', area: 'Malaka', basis: 'public-reference' },
  { name: 'PERTAMINA GALUNGGUNG', imo: '9455791', mmsi: '525108035', callSign: 'YDFZ4', country: 'Indonesia', emoji: '🇮🇩', type: 'Crude Oil Tanker', gt: 63005, dwt: 88322, length: 245, beam: 44, built: 2011, operator: 'Pertamina International Shipping', manager: 'PT Pertamina International Shipping', area: 'Makassar', basis: 'public-reference' },
  { name: 'PALU SIPAT', imo: '9106651', mmsi: '525004010', callSign: 'YHKS', country: 'Indonesia', emoji: '🇮🇩', type: 'Crude Oil Tanker', gt: 13964, dwt: 17957, length: 160, beam: 27, built: 2000, operator: 'Pertamina International Shipping', manager: 'PT Pertamina International Shipping', area: 'Laut Jawa', basis: 'public-reference' },
  { name: 'SINAR PENIDA', imo: '9827968', mmsi: '525109003', callSign: 'YCDQ2', country: 'Indonesia', emoji: '🇮🇩', type: 'Container Ship', gt: 6846, dwt: 8364, length: 117.1, beam: 21.8, built: 2018, operator: 'Samudera Shipping Line', manager: 'Samudera Indonesia Ship Management', area: 'Malaka', basis: 'public-reference' },
  { name: 'SINAR POMALAA', imo: '9827956', mmsi: '525109002', callSign: 'YCDP2', country: 'Indonesia', emoji: '🇮🇩', type: 'Container Ship', gt: 6846, dwt: 8337, length: 117.1, beam: 21.8, built: 2018, operator: 'Samudera Shipping Line', manager: 'Samudera Indonesia Ship Management', area: 'Malaka', basis: 'public-reference' },
  { name: 'KM KELUD', imo: '9139684', mmsi: '525005032', callSign: 'YFOZ', country: 'Indonesia', emoji: '🇮🇩', type: 'Passenger Ship', gt: 14665, dwt: 3175, length: 146.5, beam: 23.4, built: 1998, operator: 'PT PELNI', manager: 'PT PELNI Fleet Management', area: 'Malaka', basis: 'public-reference' },
  { name: 'KM DOBONSOLO', imo: '9032147', mmsi: '525005002', callSign: 'YEVX', country: 'Indonesia', emoji: '🇮🇩', type: 'Passenger Ship', gt: 14581, dwt: 3500, length: 146.5, beam: 23.7, built: 1993, operator: 'PT PELNI', manager: 'PT PELNI Fleet Management', area: 'Papua', basis: 'public-reference' },
  { name: 'KM DOROLONDA', imo: '9226487', mmsi: '525005046', callSign: 'YFCE', country: 'Indonesia', emoji: '🇮🇩', type: 'Passenger Ship', gt: 14685, dwt: 3175, length: 146.5, beam: 23.4, built: 2001, operator: 'PT PELNI', manager: 'PT PELNI Fleet Management', area: 'Papua', basis: 'public-reference' },
  { name: 'KM LAMBELU', imo: '9124548', mmsi: '525005030', callSign: 'YFOL', country: 'Indonesia', emoji: '🇮🇩', type: 'Passenger Ship', gt: 14649, dwt: 3685, length: 136, beam: 23.7, built: 1997, operator: 'PT PELNI', manager: 'PT PELNI Fleet Management', area: 'Makassar', basis: 'public-reference' },
  { name: 'GRIYA SUNDA', imo: '9269609', mmsi: '525701006', callSign: 'YBFP2', country: 'Indonesia', emoji: '🇮🇩', type: 'Product Tanker', gt: 23235, dwt: 39970, length: 182.9, beam: 32.2, built: 2003, operator: 'Humpuss Transportasi Kimia', manager: 'PT Humpuss Transportasi Kimia', area: 'Laut Jawa', basis: 'public-reference' },
]

const syntheticNames = [
  'NUSANTARA ARUNIKA', 'SAMUDRA NAWASENA', 'BINTANG MAHAKAM', 'TANJUNG MUTIARA', 'KARUNIA SERAM', 'LANGIT NATUNA',
  'MERIDIAN SULAWESI', 'ARAFURA SENTOSA', 'BANDA KIRANA', 'RAJA AMPAT JAYA', 'BORNEO CAKRAWALA', 'CELEBES HARMONI',
  'MALAKA PRIMA', 'KARIMATA INDAH', 'JAYAPURA BAHARI', 'FLORES MANDIRI', 'TIMOR LESTARI', 'AMBON PERKASA',
  'SENTOSA MANDALIKA', 'WAKATOBI EXPLORER', 'MAKASSAR VOYAGER', 'PAPUA NIRMALA', 'NATUNA GUARDIAN', 'JAWA OCEANIC',
  'SABANG MERIDIAN', 'SORONG VENTURE', 'KENDARI MAKMUR', 'BITUNG SEJAHTERA', 'TUAL NUSANTARA', 'MERAUKE PIONEER',
  'BALIKPAPAN ENERGY', 'DUMAI PETROSTAR', 'BELAWAN TRADER', 'CILACAP HORIZON', 'TARAKAN PROSPERITY', 'TERNATE MARINER',
  'KUPANG SAMUDRA', 'BENOA PACIFIC', 'BANJARMASIN CARRIER', 'PONTIANAK EXPRESS', 'BATAM NAVIGATOR', 'GRESIK BULKER',
]

const flags = [
  { country: 'Indonesia', emoji: '🇮🇩', mid: '525' }, { country: 'Panama', emoji: '🇵🇦', mid: '352' },
  { country: 'Liberia', emoji: '🇱🇷', mid: '636' }, { country: 'Singapore', emoji: '🇸🇬', mid: '563' },
  { country: 'Marshall Islands', emoji: '🇲🇭', mid: '538' }, { country: 'Malta', emoji: '🇲🇹', mid: '256' },
  { country: 'Hong Kong', emoji: '🇭🇰', mid: '477' }, { country: 'Philippines', emoji: '🇵🇭', mid: '548' },
]

const types = [
  { type: 'Container Ship', gt: 18500, dwt: 24800, length: 172, beam: 28 },
  { type: 'Crude Oil Tanker', gt: 42000, dwt: 73800, length: 228, beam: 38 },
  { type: 'Product Tanker', gt: 23500, dwt: 39800, length: 184, beam: 32 },
  { type: 'Bulk Carrier', gt: 35800, dwt: 61200, length: 199, beam: 32 },
  { type: 'General Cargo', gt: 9200, dwt: 12800, length: 138, beam: 22 },
  { type: 'Passenger Ship', gt: 14200, dwt: 3400, length: 146, beam: 24 },
  { type: 'Fishing Vessel', gt: 680, dwt: 420, length: 48, beam: 9 },
  { type: 'LPG Tanker', gt: 28500, dwt: 33800, length: 178, beam: 29 },
]

const operators = [
  ['PT Nusantara Shipping Lines', 'Nusantara Fleet Management'], ['Samudera Shipping Line', 'Samudera Indonesia Ship Management'],
  ['Pertamina International Shipping', 'PT Pertamina International Shipping'], ['Meridian Bahari Logistics', 'Meridian Marine Services'],
  ['Archipelago Bulk Carriers', 'Archipelago Ship Management'], ['Eastern Passage Maritime', 'Eastern Passage Management'],
  ['Blue Strait Navigation', 'Blue Strait Marine Services'], ['Pacific Inter-Island Lines', 'Pacific Inter-Island Management'],
  ['Borneo Energy Transport', 'Borneo Fleet Services'], ['Arafura Fisheries Cooperative', 'Arafura Vessel Management'],
]

const areas = {
  Natuna: { center: [108.2, 4.3], ports: [['Tanjung Priok', 'Indonesia'], ['Batam', 'Indonesia'], ['Singapore', 'Singapore'], ['Kijang', 'Indonesia'], ['Tanjung Pelepas', 'Malaysia']] },
  Malaka: { center: [101.8, 2.4], ports: [['Belawan', 'Indonesia'], ['Dumai', 'Indonesia'], ['Singapore', 'Singapore'], ['Port Klang', 'Malaysia'], ['Tanjung Pelepas', 'Malaysia']] },
  Makassar: { center: [118.6, -2.8], ports: [['Makassar', 'Indonesia'], ['Balikpapan', 'Indonesia'], ['Bitung', 'Indonesia'], ['Kendari', 'Indonesia'], ['Banjarmasin', 'Indonesia']] },
  Arafura: { center: [136.2, -7.2], ports: [['Tual', 'Indonesia'], ['Merauke', 'Indonesia'], ['Dobo', 'Indonesia'], ['Sorong', 'Indonesia'], ['Darwin', 'Australia']] },
  Papua: { center: [137.5, -2.8], ports: [['Jayapura', 'Indonesia'], ['Sorong', 'Indonesia'], ['Manokwari', 'Indonesia'], ['Biak', 'Indonesia'], ['Ambon', 'Indonesia']] },
  'Laut Jawa': { center: [111.5, -5.5], ports: [['Tanjung Priok', 'Indonesia'], ['Tanjung Perak', 'Indonesia'], ['Semarang', 'Indonesia'], ['Gresik', 'Indonesia'], ['Cirebon', 'Indonesia']] },
}

function imoNumber(seed) {
  const base = String(910000 + seed * 137).slice(-6)
  const check = [...base].reduce((sum, digit, index) => sum + Number(digit) * (7 - index), 0) % 10
  return `${base}${check}`
}

function syntheticVessels() {
  return syntheticNames.map((name, index) => {
    const flag = flags[index % flags.length]
    const vesselType = types[index % types.length]
    const [operator, manager] = operators[index % operators.length]
    const area = Object.keys(areas)[index % Object.keys(areas).length]
    return {
      name,
      imo: imoNumber(index + 61),
      mmsi: `${flag.mid}${String(140000 + index * 719).padStart(6, '0')}`,
      callSign: flag.country === 'Indonesia' ? `YC${String(4100 + index)}` : `${['3E', 'D5', '9V', 'V7', '9H', 'VR', 'DU'][index % 7]}${String(620 + index)}`,
      country: flag.country,
      emoji: flag.emoji,
      type: vesselType.type,
      gt: vesselType.gt + index * 137,
      dwt: vesselType.dwt + index * 211,
      length: Number((vesselType.length + (index % 6) * 2.4).toFixed(1)),
      beam: Number((vesselType.beam + (index % 4) * 0.7).toFixed(1)),
      built: 1996 + (index % 29),
      operator,
      manager,
      area,
      basis: 'synthetic-enriched',
    }
  })
}

const allVessels = [...publicAnchors, ...syntheticVessels()]

function riskFor(index, type) {
  const base = [22, 38, 54, 67, 76, 88][index % 6]
  const adjusted = type === 'Fishing Vessel' ? Math.min(96, base + 8) : base
  const level = adjusted >= 82 ? 'CRITICAL' : adjusted >= 65 ? 'HIGH' : adjusted >= 45 ? 'MEDIUM' : 'LOW'
  return { score: adjusted, level }
}

function statusFor(index, risk) {
  if (risk.level === 'CRITICAL' || index % 11 === 5) return 'WATCHLIST'
  if (risk.level === 'HIGH' || index % 7 === 0) return 'UNDER_REVIEW'
  return 'AKTIF'
}

function trackFor(area, index) {
  const [lon, lat] = areas[area].center
  return Array.from({ length: 10 }, (_, step) => [Number((lon - 2.7 + step * 0.58 + Math.sin(index + step) * 0.12).toFixed(4)), Number((lat - 0.9 + step * 0.19 + Math.cos(index * 0.7 + step) * 0.16).toFixed(4))])
}

function recordsFor(vessel, index) {
  const risk = riskFor(index, vessel.type)
  const status = statusFor(index, risk)
  const track = trackFor(vessel.area, index)
  const last = track.at(-1)
  const ports = areas[vessel.area].ports
  const portCalls = ports.map(([port, country], portIndex) => ({
    date: `${String(28 - portIndex * 4).padStart(2, '0')} Jun 2026`, port, country,
    arrival: `${String(3 + portIndex * 2).padStart(2, '0')}:${String(12 + index % 40).padStart(2, '0')}`,
    departure: `${String(11 + portIndex * 2).padStart(2, '0')}:${String(26 + index % 30).padStart(2, '0')}`,
    duration: `${8 + portIndex}j ${14 + (index * 3) % 40}m`,
  }))
  const gapCount = risk.level === 'CRITICAL' ? 6 : risk.level === 'HIGH' ? 4 : risk.level === 'MEDIUM' ? 2 : 1
  const gapRecords = Array.from({ length: Math.min(gapCount, 5) }, (_, gapIndex) => ({
    id: `AIS-${String(index + 1).padStart(3, '0')}-${gapIndex + 1}`,
    start: `${String(27 - gapIndex * 3).padStart(2, '0')} Jun 2026 ${String(2 + gapIndex * 3).padStart(2, '0')}:18`,
    end: `${String(27 - gapIndex * 3).padStart(2, '0')} Jun 2026 ${String(3 + gapIndex * 3).padStart(2, '0')}:42`,
    duration: `${1 + gapIndex}j ${18 + index % 27}m`,
    location: gapIndex % 2 === 0 ? vessel.area : `${vessel.area} — koridor pendekatan`,
    status: gapIndex === 0 && risk.level === 'CRITICAL' ? 'TAK WAJAR' : gapIndex < 2 && risk.score >= 65 ? 'MENCURIGAKAN' : 'TERJELASKAN',
  }))
  const incidentCount = risk.level === 'CRITICAL' ? 3 : risk.level === 'HIGH' ? 2 : risk.level === 'MEDIUM' ? 1 : 0
  const incidentTypes = ['Gangguan sinyal AIS', 'Deviasi koridor pelayaran', 'Rendezvous tanpa deklarasi', 'Anomali identitas registry']
  return {
    vesselProfile: {
      id: `VSL-${String(index + 1).padStart(3, '0')}`,
      name: vessel.name,
      mmsi: vessel.mmsi,
      imo: vessel.imo,
      callSign: vessel.callSign,
      flag: { country: vessel.country, emoji: vessel.emoji },
      status,
      type: vessel.type,
      gt: vessel.gt,
      dwt: vessel.dwt,
      lengthMeter: vessel.length,
      beamMeter: vessel.beam,
      builtYear: vessel.built,
      operator: vessel.operator,
      manager: vessel.manager,
      image: '/images/vessel-silhouette.svg',
      areaOperation: vessel.area,
      dataBasis: vessel.basis,
      lastKnownPosition: {
        datetime: `02 Jul 2026 ${String(8 + index % 2).padStart(2, '0')}:${String(10 + index % 48).padStart(2, '0')} WIB`,
        latitude: `${Math.abs(last[1]).toFixed(4)}° ${last[1] >= 0 ? 'N' : 'S'}`,
        longitude: `${Math.abs(last[0]).toFixed(4)}° E`,
        location: vessel.area,
        sog: `${(7.4 + index % 11 + (index % 4) * 0.3).toFixed(1)} kn`,
        cog: `${(37 + index * 23) % 360}°`,
        coordinates: last,
      },
    },
    voyageHistory: {
      periodDays: 90,
      distanceNm: 4680 + index * 173,
      portsVisited: ports.length + index % 5,
      countriesVisited: 2 + index % 5,
      averageSpeedKn: Number((9.1 + index % 8 + (index % 3) * 0.4).toFixed(1)),
      timeAtSea: `${18 + index % 23} hari ${4 + index % 17} jam`,
      track,
    },
    riskScoreAI: { score: risk.score, level: risk.level, updatedAt: '02 Jul 2026 09:24 WIB', modelVersion: 'MBIS-RISK-2.4' },
    riskFactors: [
      { id: 'AIS_GAP', label: 'Frekuensi AIS Gap', description: `${gapCount} kejadian dalam 90 hari`, severity: risk.level, evidence: `${gapRecords[0].duration} pada ${gapRecords[0].location}` },
      { id: 'ROUTE', label: 'Deviasi Rute', description: index % 3 === 0 ? 'Pola lintasan menyimpang dari koridor deklarasi' : 'Lintasan konsisten dengan koridor operasi', severity: index % 3 === 0 ? 'HIGH' : 'LOW', evidence: `${8 + index % 31} NM dari baseline rute` },
      { id: 'PORT', label: 'Panggilan Pelabuhan', description: `${ports.length} pelabuhan dianalisis`, severity: index % 5 === 0 ? 'MEDIUM' : 'LOW', evidence: `Panggilan terakhir ${ports[0][0]}, ${ports[0][1]}` },
      { id: 'FLAG', label: 'Riwayat Bendera', description: index % 4 === 0 ? 'Lebih dari satu perubahan registry' : 'Registry relatif stabil', severity: index % 4 === 0 ? 'MEDIUM' : 'LOW', evidence: `${1 + index % 4} entri perubahan bendera` },
      { id: 'INCIDENT', label: 'Keterkaitan Insiden', description: `${incidentCount} insiden terkait`, severity: incidentCount >= 3 ? 'HIGH' : incidentCount ? 'MEDIUM' : 'LOW', evidence: incidentCount ? incidentTypes[index % incidentTypes.length] : 'Tidak ada insiden aktif' },
    ],
    portHistory: { periodDays: 120, calls: portCalls },
    ownershipOperatorHistory: [
      { period: '2021–sekarang', owner: vessel.operator, operator: vessel.manager, role: 'Operator aktif' },
      { period: '2017–2021', owner: `${ports[1][0]} Maritime Holdings`, operator: vessel.operator, role: 'Pemilik sebelumnya' },
      { period: '2012–2017', owner: `${vessel.country} Oceanic Capital`, operator: `${vessel.country} Ship Services`, role: 'Registered owner' },
    ],
    flagChangeHistory: [
      { period: '2021–sekarang', flag: { country: vessel.country, emoji: vessel.emoji }, note: 'Bendera aktif' },
      ...(index % 4 === 0 ? [{ period: '2017–2021', flag: flags[(index + 1) % flags.length], note: 'Perubahan registry terdokumentasi' }] : []),
      ...(index % 8 === 0 ? [{ period: '2012–2017', flag: flags[(index + 3) % flags.length], note: 'Registry historis' }] : []),
    ],
    intelligenceGraph: {
      ports: ports.slice(0, 3).map(([name, country], graphIndex) => ({ name, relation: `${1 + (index + graphIndex) % 6} kunjungan · ${country}` })),
      organizations: [{ name: vessel.operator, relation: 'Operator' }, { name: vessel.manager, relation: 'Manager' }],
      vessels: syntheticNames.slice((index * 2) % 34, (index * 2) % 34 + 2).map((name, graphIndex) => ({ name, relation: `${1 + graphIndex + index % 3} encounter terverifikasi` })),
    },
    aisGapLogs: { periodDays: 90, total: gapCount, records: gapRecords },
    evidenceVerification: [
      { source: 'AIS', count: 14 + index % 19, latest: '02 Jul 2026 09:18 WIB', verification: 'Terverifikasi', status: 'ONLINE' },
      { source: 'REGISTRY', count: 4 + index % 6, latest: '01 Jul 2026 18:40 WIB', verification: vessel.basis === 'public-reference' ? 'Referensi publik' : 'Data sintetis tervalidasi', status: 'ONLINE' },
      { source: 'OSINT', count: 6 + index % 13, latest: '02 Jul 2026 07:31 WIB', verification: 'Terkorelasi', status: index % 7 === 0 ? 'DEGRADED' : 'ONLINE' },
      { source: 'SATELLITE', count: 2 + index % 5, latest: '02 Jul 2026 06:55 WIB', verification: 'Terverifikasi visual', status: 'ONLINE' },
    ],
    analystNote: {
      author: `Analis Maritim ${String.fromCharCode(65 + index % 6)}-${String(index % 9 + 1).padStart(2, '0')}`,
      updatedAt: '02 Jul 2026 09:26 WIB',
      note: risk.score >= 65 ? `Pertahankan pemantauan intensif pada koridor ${vessel.area}; verifikasi AIS gap dan korelasikan dengan jadwal pelabuhan berikutnya.` : `Pola operasi di ${vessel.area} masih konsisten dengan profil kapal. Lanjutkan pemantauan rutin dan validasi registry berkala.`,
    },
    relatedIncidents: {
      total: incidentCount,
      records: Array.from({ length: incidentCount }, (_, incidentIndex) => ({
        id: `INC-VSL-${String(index + 1).padStart(3, '0')}-${incidentIndex + 1}`,
        date: `${String(18 - incidentIndex * 4).padStart(2, '0')} Jun 2026`,
        type: incidentTypes[(index + incidentIndex) % incidentTypes.length],
        location: vessel.area,
        description: `${vessel.name} terdeteksi dalam korelasi multi-sumber yang memerlukan ${incidentIndex === 0 ? 'verifikasi analis' : 'pemantauan lanjutan'}.`,
        riskLevel: incidentIndex === 0 ? risk.level : risk.level === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
      })),
    },
  }
}

const data = allVessels.map(recordsFor)

const envelope = {
  metaData: {
    status: true,
    title: 'Vessel Intelligence — research-grounded local fixture',
    generatedAt,
    classification: 'INTERNAL // DEMONSTRATION',
    synthetic: true,
    referenceBasis: [
      'IMO ship identification and AIS guidance',
      'VesselFinder public vessel particulars for selected anchor profiles',
      'PELNI official fleet and route publications',
      'Samudera Indonesia official fleet list',
      'Global Fishing Watch AIS gap and vessel-risk methodology',
      'KKP Arafura transshipment enforcement and DIVA-TUNA registry context',
    ],
    counts: { vessels: data.length, publicReferenceProfiles: publicAnchors.length, syntheticEnrichedProfiles: syntheticNames.length },
  },
  data,
}

writeFileSync(output, `${JSON.stringify(envelope, null, 2)}\n`)
console.log(`Generated ${data.length} vessel profiles at ${output}`)
