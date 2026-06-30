# Modul Aircraft Intelligence

**Mockup utama:** [`aircraft_intelligence.png`](../design/aircraft_intelligence.png)

## 1. Gambaran Umum

Aircraft Intelligence menyediakan live flight picture dan workspace investigasi untuk penerbangan yang menyimpang, tidak terjadwal, atau memasuki area sensitif. Peta menampilkan actual track, flight-plan corridor, restricted/sensitive zones, status kategori pesawat, serta replay; panel kanan memperlihatkan alert dan alasan kecurigaan dengan confidence serta evidence.

### Tujuan dan Pengguna

| Tujuan | Outcome |
|---|---|
| Monitoring ruang udara | Aktivitas nasional dan border crossing terlihat real-time |
| Deteksi penyimpangan | Rute aktual dibandingkan flight plan dan area sensitif |
| Identifikasi unscheduled flight | Pesawat tanpa flight plan diprioritaskan untuk verifikasi |
| Investigasi dapat dijelaskan | Alasan, confidence, track, dan source status tersedia |

Pengguna: Analis Penerbangan dan Supervisor; Pimpinan memakai threat summary; Auditor read-only; Administrator mengelola zone/source configuration.

## 2. Fitur Utama dan Traceability

| ID | Fitur | Perilaku dan Komponen |
|---|---|---|
| F-M4-01 | Live Flight Tracking | Pesawat berwarna berdasarkan status/kategori, actual trail, altitude/speed/heading, source time |
| F-M4-02 | Flight History | Riwayat rute, altitude/speed chart, replay, origin/destination, waypoint dan alert |
| F-M4-03 | Route Deviation Alert | Jarak deviation dari corridor, waktu mulai, zone proximity, severity, evidence |
| F-M4-04 | Unscheduled Flight Detection | Cross-check flight plan; daftar tidak terjadwal dengan callsign/registration/route/status |
| F-M4-05 | Strategic Aviation Monitoring | Militer, cargo, private/non-commercial pada sensitive area dengan compliance summary |
| F-M4-06 | Aircraft Profile | Registration, type, operator, country, status, latest scan, flight history |
| F-M4-07 | Border Crossing Flight Log | Entry/exit time, origin/destination FIR, altitude, status, dan alert |

### Komponen Visual

| Komponen | Tipe | Data | Update |
|---|---|---|---|
| Live air map | Peta tactical | Aircraft, route, zones, corridor, airport, FIR | Real-time |
| Selected aircraft | Profile panel | Registration, operator, route, telemetry | Real-time |
| Alert feed | Daftar prioritas | Route deviation/unscheduled/sensitive area | Real-time |
| Suspicion analysis | Evidence panel | Reason, confidence, recommendation | Event-driven |
| Unscheduled/border logs | Tabel | Flight plan match dan border events | Real-time |
| Flight history/replay | Grafik + peta | Altitude, speed, track, waypoint | On-demand |
| Data-source status | Gauge/status | ADS-B, flight plan, exchange | Real-time |

## 3. Navigasi & Interaksi

| Dari | Aksi | Menuju | Context |
|---|---|---|---|
| Aircraft symbol | Klik | Selected aircraft panel | Aircraft ID dan timestamp |
| `Lihat Detail` | Klik | Aircraft profile workspace | Aircraft ID |
| Deviation alert | Klik | Anomaly Detection | Alert candidate, actual/planned track |
| `Lacak` | Klik | NMP | Aircraft ID dan camera area |
| Sensitive area | Klik | Threat Assessment | Zone ID dan activity window |
| Border log | Klik | Flight detail/replay | Crossing ID |
| Export | Klik | Intelligence Reporting | Aircraft, period, selected evidence |

## 4. Alur Bisnis

### 4.1 Investigasi Route Deviation

```text
Track keluar corridor → deterministic rule membuat candidate
 → data source/flight plan divalidasi → analyst detail terbuka
 → cek actual track, zone, komunikasi, history
    ├─ legitimate → close dengan alasan
    └─ suspicious → anomaly + alert
```

### 4.2 Unscheduled Flight

1. Flight track tidak menemukan flight plan aktif.
2. Sistem memeriksa callsign, registration, sumber cadangan, dan toleransi waktu.
3. Candidate masuk daftar `Tidak Terjadwal`.
4. Analis meninjau dan menentukan false match, observasi, atau eskalasi.

### 4.3 Edge Case — ADS-B Track Terfragmentasi

```text
Gap telemetry terdeteksi → track observed diputus
 → predicted segment ditandai berbeda dan confidence turun
    ├─ source pulih → reconcile tanpa menghapus gap
    └─ tetap gagal → source-health alert, tidak menyimpulkan deviation dari prediksi saja
```

## 5. Data yang Dikelola

| Entity | Field Utama | Contoh |
|---|---|---|
| Aircraft | Registration, callsign, type, operator, country | A7-BCS, QTR9832, B777-300ER |
| Flight track | Time, coordinate, altitude, speed, heading, source | 09:42 WIB, 34,000 ft |
| Flight plan | Origin, destination, corridor, waypoints, schedule | Doha → Denpasar |
| Route deviation | Start, distance, zone, confidence, review | 15.8 NM, tinggi |
| Border crossing | Time, entry/exit FIR, altitude, status | 09:41, Doha FIR → Jakarta FIR |
| Sensitive zone | Boundary, category, access rule, source | Natuna North, non-access |

## 6. Kebutuhan Data Eksternal

- ADS-B nasional dan data exchange.
- flight plan/airspace reference, FIR, airport, restricted/sensitive zone.
- aircraft registry dan internal intelligence.
- Mapbox untuk live, history, dan replay maps.

## 7. Stack Agent Modul

| Agent | Peran | Trigger | Output |
|---|---|---|---|
| Analysis Agent | Menjelaskan deviation dan pola penerbangan dari input terstruktur | Event / on-demand | Suspicion factors dan evidence links |
| Validation/Guardrail Agent | Mencegah predicted track/raw gap menjadi keputusan tanpa validasi | Post-process | Verified/flagged result |
| Notification Agent | Mengirim alert route/unscheduled yang tervalidasi | Event-driven | Delivery record |
| Reporting Agent | Membentuk aircraft intelligence brief | Manual | Report-ready summary |

## 8. Alert

| Level | Kondisi | Aksi |
|---|---|---|
| Rendah | Minor deviation dalam toleransi | Monitor |
| Sedang | Deviation/validity issue memerlukan review | Queue analis |
| Tinggi | Unscheduled atau masuk area sensitif | Supervisor + Early Warning |
| Kritis | Pola strategis/ancaman langsung tervalidasi | Eskalasi Pimpinan |

## 9. Standar Layanan

Live track dan alert diperbarui otomatis; peta/replay terasa cepat; source status transparan; monitoring 24/7; data predicted selalu dibedakan dari observed.

## 10. Use Case

**Happy path:** QTR9832 keluar corridor, analis membandingkan flight plan, history, dan sensitive zone, lalu mengeskalasi anomaly dengan evidence.  
**Edge case:** ADS-B gap menghasilkan predicted track; sistem tidak membuat route-deviation verdict sebelum track observed/secondary source tersedia.

## 11. Acceptance dan Referensi

- Seluruh F-M4-01–F-M4-07 tersedia dan saling terhubung.
- Route deviation dan unscheduled candidate dapat direproduksi dari data input/rule.
- Referensi: FRD Section 3.4; mockup lokal; ICAO Annex 10/ADS-B; airspace reference resmi.

---

*Modul 04 | Versi 1.0.0*
