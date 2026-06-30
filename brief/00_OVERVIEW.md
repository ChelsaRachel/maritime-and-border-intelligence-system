# Maritime & Border Intelligence System — Dokumentasi Implementasi

**Project slug:** `maritime_border_intelligence`  
**Pemilik kebutuhan:** Deputi I Badan Intelijen Negara  
**Status brief:** `ready_for_execution`  
**Sumber utama:** `FRD_Maritime_Border_Intelligence_System.md` dan delapan mockup di `design/`

## Ringkasan Eksekutif

Maritime & Border Intelligence System (MBIS) adalah platform intelijen terpadu untuk membentuk Common Operational Picture nasional pada domain maritim, perbatasan darat, dan ruang udara Indonesia. Sistem menyatukan data posisi, profil entitas, laporan lapangan, OSINT, anomali, alert, penilaian ancaman, dan produk intelijen agar analis dapat bergerak dari pemantauan menuju investigasi dan eskalasi tanpa berpindah platform.

National Maritime Picture menjadi landing page setelah login. Peta memenuhi seluruh workspace sebagai background operasional; KPI, cuaca, kontrol lapisan, alert, dan replay berada di atas peta sebagai panel glassmorphism. Tata visual mengikuti karakter tactical intelligence yang gelap, clean, padat informasi, dan menggunakan sinyal neon secara terukur—bukan dashboard korporat generik.

## 1. Visi, Misi, dan Outcome

### 1.1 Visi

Menyediakan gambaran situasi nasional yang terpadu, dapat dipercaya, dan selalu siap dipakai untuk deteksi dini, peringatan dini, investigasi, serta penyusunan keputusan strategis maritim dan perbatasan.

### 1.2 Tujuan Utama

| Tujuan | Outcome yang Diharapkan |
|---|---|
| Satu gambaran operasional | Data maritim, border, dan udara dapat dipahami dari satu sistem dengan konteks sumber yang jelas |
| Mengurangi information overload | Aktivitas normal dipisahkan dari entitas dan kejadian yang membutuhkan perhatian |
| Mempercepat deteksi dan eskalasi | Anomali tervalidasi berubah menjadi alert, insiden, dan briefing tanpa pemindahan data manual |
| Memperkuat analisis lintas-domain | Anomali yang berdekatan secara spasial, temporal, atau relasional dapat dikorelasikan |
| Menjaga akuntabilitas | Setiap akses, perubahan status, approval, dan distribusi produk intelijen tercatat |

### 1.3 KPI Bisnis

| Dimensi | Indikator |
|---|---|
| Awareness | Cakupan entitas dan wilayah yang memiliki status data mutakhir |
| Detection | Proporsi anomali uji yang terdeteksi dan tingkat false positive |
| Response | Kecepatan alert kritis diterima, diverifikasi, dan dieskalasi |
| Intelligence quality | Persentase penilaian dan laporan yang lolos validasi serta approval |
| Reliability | Ketersediaan sumber, transparansi data stale, dan kelengkapan audit trail |

## 2. Konteks Operasional

### 2.1 Wilayah dan Cadence

- **Area of interest:** seluruh wilayah perairan, ruang udara, dan perbatasan darat Republik Indonesia, termasuk ZEE, chokepoint, wilayah sengketa, dan area sensitif.
- **Cadence:** pemantauan 24/7; morning intelligence brief harian; strategic assessment mingguan; analisis ad-hoc saat insiden.
- **Decision authority:** Pimpinan/decision maker Deputi I BIN.
- **Execution units:** analis maritim, analis perbatasan, analis penerbangan, supervisor intelijen, administrator, dan auditor.

### 2.2 Pain Point yang Diselesaikan

1. Data tersebar di feed dan aplikasi terpisah sehingga konteks sulit dibentuk.
2. Volume data tinggi membuat analis berisiko melewatkan pola penting.
3. Korelasi lintas-domain lambat dan bergantung pada pekerjaan manual.
4. Belum ada COP terpadu untuk pimpinan dan tim analisis.
5. Produk intelijen membutuhkan proses berulang untuk mengumpulkan peta, grafik, dan bukti.

### 2.3 Storyline Utama

**Morning intelligence brief:** Analis masuk pada awal shift → landing di National Maritime Picture → menilai status chokepoint, anomali, dan alert → membuka kejadian prioritas → memverifikasi bukti → menyusun daily intelligence summary → Supervisor mereview → Pimpinan menerima briefing.

**Investigasi kapal mencurigakan:** Alert kapal dipilih → profil kapal, voyage, AIS gap, kepemilikan, port call, relasi, dan bukti lintas-sumber diperiksa → skor risiko dijelaskan → analis mencatat temuan atau menandai false positive → insiden diteruskan ke Early Warning bila tervalidasi.

**Penilaian ancaman:** Pimpinan membuka Threat Assessment → membandingkan domain dan area → menelusuri driver serta entitas berisiko → menjalankan skenario → meminta briefing ringkas dengan konteks dan klasifikasi yang sesuai.

## 3. Prinsip Pengalaman dan Identitas Visual

### 3.1 Tactical Intelligence Theme

- Latar dark ocean/near-black dengan garis batas tipis bercahaya.
- Cyan dan teal untuk navigasi, selection, data normal, serta interaksi primer.
- Hijau, kuning, oranye, dan merah hanya untuk status/severity agar sinyal operasional tetap bermakna.
- Panel glassmorphism mempertahankan konteks peta di belakangnya.
- `Inter` untuk teks antarmuka; `JetBrains Mono` untuk koordinat, waktu, callsign, kode insiden, dan angka operasional.
- `design/logo.svg` wajib menjadi favicon dan brand mark kiri atas.

Font aplikasi wajib memuat:

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### 3.2 Shell dan Landing Page

- Sidebar memulai setiap sesi dalam keadaan collapsed selebar 72px dan hanya menampilkan logo serta ikon; pengguna dapat expand menjadi 248px.
- Landing setelah login adalah `National Maritime Picture`, bukan dashboard KPI terpisah.
- Pada 1920×1080 dan 2560×1440, landing page memenuhi satu viewport tanpa vertical scrolling.
- Peta memenuhi seluruh workspace; seluruh widget menggunakan positioning overlay dan panel internal boleh scroll bila konten panjang.
- Semua layar yang memakai peta menggunakan Mapbox Satellite Streets v12, Globe Projection, dan Custom Tactical Overlay.
- Overlay tactical dibentuk dari lapisan simbol, garis, area, titik, dan heatmap agar konsisten pada seluruh modul.

### 3.3 Login dan Akses

Halaman login full-viewport menggunakan radar-grid tactical tanpa peta dekoratif. Akun development/demo berikut wajib tersedia dan password disimpan sebagai hash, bukan plaintext aplikasi:

| Role | Username | Password | Akses Utama |
|---|---|---|---|
| Administrator | `Administrator` | `Administrator123` | Pengguna, sumber data, threshold, konfigurasi, dan seluruh modul |
| Pimpinan | `Pimpinan` | `Pimpinan123` | Read/decision, approval, distribusi, dan briefing |
| Supervisor | `Supervisor` | `Supervisor123` | Assignment, review, validasi, dan approval operasional |
| Analis | `Analis` | `Analis123` | Investigasi, watchlist, catatan, draft laporan, dan alert yang ditugaskan |
| Auditor | `Auditor` | `Auditor123` | Read-only, arsip, ekspor terkendali, dan audit trail |

MFA dilewati hanya pada development/demo. Production selalu mewajibkan MFA, auto-logout setelah 30 menit tidak aktif, akses berbasis role, label `TERBATAS`, `RAHASIA`, dan `SANGAT RAHASIA`, serta audit log yang tidak dapat diubah pengguna.

## 4. Modul Sistem

| No | Modul | Peran | Prioritas |
|---|---|---|---|
| 1 | National Maritime Picture | COP maritim nasional dan landing page | Must |
| 2 | Border Intelligence | Situasi perbatasan darat, jalur informal, dan insiden | Must |
| 3 | Vessel Intelligence | Investigasi profil, riwayat, relasi, dan risiko kapal | Must |
| 4 | Aircraft Intelligence | Pelacakan dan investigasi aktivitas penerbangan | Must |
| 5 | Anomaly Detection | Deteksi, korelasi, review, dan false-positive management | Must |
| 6 | Early Warning Center | Konsolidasi alert, incident workflow, dan eskalasi | Must |
| 7 | Threat Assessment | Risk scoring, trend, vulnerability, dan proyeksi | Must |
| 8 | Intelligence Reporting | Pembuatan, approval, distribusi, dan arsip laporan | Must |
| 9 | Data Integration & Management | Ingest, validasi, enrichment, health, pengguna, dan konfigurasi | Must |

### 4.1 Integrasi Antar Modul

```text
AIS / ADS-B / Border / Registry / OSINT / Intel Internal
                         │
                         ▼
            DATA INTEGRATION & VALIDATION
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
  MARITIME/VESSEL     BORDER          AIRCRAFT
        └────────────────┼────────────────┘
                         ▼
              ANOMALY DETECTION
                         ▼
              EARLY WARNING CENTER
                         ▼
              THREAT ASSESSMENT
                         ▼
           INTELLIGENCE REPORTING
```

## 5. Konsolidasi Data dan Provider

Build pertama menggunakan Mapbox live. Feed intelijen lain memiliki mode `fixture` dan `live`; fixture realistis menjadi acceptance baseline sampai akses provider tersedia.

| Sumber | Modul Konsumen | Data | Frekuensi yang Diharapkan |
|---|---|---|---|
| AIS nasional | 1, 3, 5, 7 | Posisi, course, speed, status navigasi kapal | Real-time, toleransi pembaruan sampai 5 menit |
| ADS-B | 1, 4, 5, 7 | Posisi, altitude, speed, callsign, flight track | Real-time |
| API keimigrasian/border | 2, 5, 7 | Perlintasan orang/barang dan pos resmi | Per jam |
| Vessel registry | 3, 5, 7 | Identitas, bendera, operator, kepemilikan | Harian/on-demand |
| OSINT | 3, 5, 7, 8 | Berita dan konteks entitas/kejadian | Setiap 15 menit |
| Intel internal | Semua modul analitik | Laporan lapangan, dokumen, evidence, catatan | On-demand |
| Mapbox | Semua layar berpeta | Satellite Streets v12 dan geospatial rendering | Saat layar dibuka |

Setiap data menyimpan waktu observasi, waktu ingest, sumber/provenance, kualitas, serta status sumber `ONLINE`, `DEGRADED`, `OFFLINE`, atau `STALE`. Saat sumber gagal, layar tetap menampilkan snapshot terakhir dengan label waktu yang jelas.

## 6. Workforce Manifest

| Workforce | Kategori | Tanggung Jawab | Trigger |
|---|---|---|---|
| `pm` | Orchestrator Agent | Mengarahkan pipeline lintas-agent dan eskalasi | System-level |
| `monitor` | Monitoring Agent | Memantau health, stall, retry, dan sumber data | Continuous |
| `validator` | Validation/Guardrail Agent | Memvalidasi output yang memengaruhi keputusan | Post-process |
| `notifier` | Notification Agent | Mengirim alert dan produk yang sudah tervalidasi | Event-driven |
| `data_collector` | Data Collection Agent | Mengambil feed melalui tool integrasi | Scheduler + on-demand |
| `data_processor` | Data Processing Agent | Normalisasi, deduplikasi, enrichment, dan quality flag | Event (post-collection) |
| `anomaly_analyst` | Analysis Agent | Menilai dan mengorelasikan kandidat anomali | Event / batch |
| `threat_analyst` | Analysis + Simulation Agent | Menyusun risk assessment dan skenario | Event / on-demand |
| `reporter` | Reporting Agent | Menyusun daily brief, weekly assessment, dan auto brief | Manual / scheduled |
| `be_service` | Application service | Menjaga state bisnis dan kontrak lintas-stack | Request / event |
| `fe_shell` | User interface | Menyajikan COP, investigasi, dan keputusan | User-triggered |

Skor risiko dan threshold kritis tetap deterministik. Agent dipakai untuk korelasi, penjelasan, validasi, orkestrasi, dan reporting; agent tidak boleh menggantikan business rule terukur.

## 7. Prioritas MoSCoW

### Must-have

- Login, lima role, audit, MFA production, label klasifikasi, dan session timeout.
- Seluruh fitur berprioritas Tinggi pada FRD, dua feed inti AIS/ADS-B, serta sembilan modul di Section 4.
- Sepuluh tipe anomali, alert lifecycle, threat assessment, dan daily intelligence summary.
- Tactical neon shell, logo, font wajib, sidebar collapsed, serta landing map satu viewport.
- Mapbox Satellite Streets v12, Globe Projection, dan Custom Tactical Overlay pada setiap peta.

### Should-have

- Disputed zone, hotspot, replay, immigration integration, vessel watchlist, strategic aviation monitoring.
- False-positive feedback, escalation matrix, alert history/template, comparative/predictive threat, custom report builder, report archive, enrichment, dan source health.

### Could-have

- Kanal SMS/email live, model pembelajaran berbasis feedback jangka panjang, dan konektor provider tambahan setelah akses disetujui.

### Won't-have v1

- Integrasi sistem senjata, kontrol platform operasional, pengadaan radar/sonar/sensor, native mobile, dan portal publik.

## 8. Standar Layanan

| Aspek | Standar Diharapkan |
|---|---|
| Pengalaman | Halaman dan interaksi terasa cepat; status loading/stale/error selalu eksplisit |
| Aktualisasi | Posisi dan alert real-time; border per jam; laporan terjadwal harian/mingguan |
| Ketersediaan | Fungsi monitoring dan alert 24/7 dengan toleransi downtime rendah |
| Keamanan | Jaringan tertutup/private, enkripsi standar industri, MFA production, RBAC ketat, immutable audit |
| Aksesibilitas | Fungsi utama dapat dioperasikan dengan keyboard dan status tidak bergantung pada warna saja |
| Retensi | Riwayat intelijen dipertahankan untuk analisis jangka panjang sesuai FRD dan kebijakan klasifikasi |

## 9. Roadmap Implementasi

1. **Fondasi:** bootstrap aplikasi, workforce management, auth/RBAC, tactical shell, shared map contract.
2. **Data:** kontrak domain, provider fixture/live, integrasi AIS/ADS-B, source health.
3. **Situational awareness:** National Maritime Picture, Border, Vessel, Aircraft.
4. **Intelligence automation:** Anomaly Detection, Early Warning, Threat Assessment.
5. **Product intelligence:** Reporting, approval, distribution, archive.
6. **Hardening:** performance, accessibility, security, observability, visual regression, dan UAT.

Detail urutan dan dependency ada di `../sprint/01-sprint-planning.md`.

## 10. Struktur dan Traceability Dokumen

| File | FRD Feature ID | Jumlah | Mockup |
|---|---|---:|---|
| `01_NATIONAL_MARITIME_PICTURE.md` | F-M1-01–F-M1-08 | 8 | `national_maritime_picture.png` |
| `02_BORDER_INTELLIGENCE.md` | F-M2-01–F-M2-07 | 7 | `border_intelligence_dashboard.png` |
| `03_VESSEL_INTELLIGENCE.md` | F-M3-01–F-M3-09 | 9 | `vessel_intelligence.png` |
| `04_AIRCRAFT_INTELLIGENCE.md` | F-M4-01–F-M4-07 | 7 | `aircraft_intelligence.png` |
| `05_ANOMALY_DETECTION.md` | F-M5-01–F-M5-06; AN-01–AN-10 | 6 + 10 rules | `anomaly_detection_engine.png` |
| `06_EARLY_WARNING_CENTER.md` | F-M6-01–F-M6-08 | 8 | `early_warning_center.png` |
| `07_THREAT_ASSESSMENT.md` | F-M7-01–F-M7-07 | 7 | `threat_assessment_center.png` |
| `08_INTELLIGENCE_REPORTING.md` | F-M8-01–F-M8-07 | 7 | `intelligence_reporting_center.png` |
| `09_DATA_INTEGRATION_MANAGEMENT.md` | F-DI-01–F-DI-07 | 7 | Shell `Data Management`/`Administration` pada delapan mockup |

**Total:** 66 feature requirements + 10 anomaly rules.

## 11. Blind Spot Review

### 11.1 Gap Teridentifikasi

- Nama provider dan kontrak komersial AIS/ADS-B belum tersedia.
- Jalur akses dan izin data keimigrasian, vessel registry, OSINT, serta intel internal belum diberikan.
- Daftar wilayah sengketa, zona terlarang, watchlist, dan negara/bendera berisiko perlu disahkan pemilik data.
- Prosedur MFA production dan kanal notifikasi eksternal perlu diselaraskan dengan lingkungan jaringan BIN.

### 11.2 Asumsi Tertandai

| Asumsi | Dampak Jika Salah |
|---|---|
| Build pertama memakai fixture untuk feed intelijen non-Mapbox | Acceptance dan jadwal integrasi live berubah bila semua provider diwajibkan sejak awal |
| Lima akun fixed hanya untuk development/demo | Risiko keamanan tinggi bila akun tersebut diizinkan pada production |
| Pimpinan melakukan approval akhir; Supervisor approval operasional | Alur laporan dan escalation matrix perlu diubah bila struktur kewenangan berbeda |
| Aplikasi v1 desktop web | Layout, navigasi, dan sprint bertambah bila native mobile ikut masuk |
| Mapbox Satellite Streets v12 tetap diwajibkan meskipun berstatus classic | Perlu revisi desain bila style dihentikan oleh provider |

### 11.3 Risiko

- Dependency feed eksternal dapat memblokir real-time acceptance.
- Kepadatan visual mockup berisiko mengurangi keterbacaan pada layar kecil; layout didesain untuk 1920×1080 dan 2560×1440.
- Hasil AI yang memengaruhi keputusan harus selalu memperlihatkan bukti, confidence, provenance, dan hasil validasi.
- Data classified tidak boleh bocor melalui log, export, fixture, notifikasi, atau agent trace.

### 11.4 Confidence dan Status

**Confidence:** high. FRD mendefinisikan modul, pengguna, feature ID, acceptance, dan NFR secara rinci; seluruh mockup selaras dengan feature decomposition. Risiko tersisa terutama berupa akses provider dan kebijakan keamanan lingkungan deployment.

**Status:** `ready_for_execution`

---

*Versi 1.0.0 — 29 Juni 2026*
