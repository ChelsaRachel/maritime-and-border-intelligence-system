# Modul Vessel Intelligence

**Mockup utama:** [`vessel_intelligence.png`](../design/vessel_intelligence.png)

## 1. Gambaran Umum

Vessel Intelligence adalah workspace investigasi kapal yang menggabungkan identitas, voyage, port call, perubahan bendera, kepemilikan/operator, AIS gap, evidence, insiden, dan graf relasi. Skor risiko 0–100 dihitung secara deterministik dari bobot FRD; sistem menjelaskan faktor pembentuk skor dan tidak membiarkan output AI mengubah nilai tanpa aturan yang dapat diaudit.

### Tujuan dan Pengguna

| Tujuan | Outcome |
|---|---|
| Profil terpadu | Satu identitas kapal menghubungkan registry, AIS, OSINT, operator, dan insiden |
| Risiko transparan | Skor, bobot, data pendukung, dan waktu hitung dapat ditelusuri |
| Investigasi kronologis | Voyage, port call, flag change, dan AIS gap dapat dibandingkan |
| Pemantauan berkelanjutan | Watchlist memicu notifikasi pada area/kondisi yang ditetapkan |

Pengguna utama: Analis Maritim; Supervisor meninjau temuan; Pimpinan membaca ringkasan; Auditor read-only; Administrator mengelola referensi risiko.

## 2. Fitur Utama dan Traceability

| ID | Fitur | Perilaku dan Komponen |
|---|---|---|
| F-M3-01 | Vessel Profile Card | Nama, foto, MMSI, IMO, callsign, bendera, tipe, dimensi, operator, status, posisi terakhir |
| F-M3-02 | Voyage History | Peta rute 90 hari, jarak, negara, port call, speed, sea time, actual/predicted segment |
| F-M3-03 | Flag Change History | Timeline perubahan bendera dengan periode dan alasan/source |
| F-M3-04 | Ownership & Operator | Riwayat pemilik/operator dan relationship graph |
| F-M3-05 | Port Call History | Tanggal, pelabuhan, negara, arrival/departure, durasi, risk marker |
| F-M3-06 | AIS Gap Log | Waktu hilang/pulih, durasi, last/next position, status review |
| F-M3-07 | Vessel Risk Score | Gauge 0–100, severity, faktor, kontribusi bobot, data freshness, explanation |
| F-M3-08 | Vessel Search & Filter | Nama, MMSI, IMO, callsign, bendera, tipe, operator, area operasi |
| F-M3-09 | Vessel Watchlist | Add/remove watchlist, alasan, area/condition, recipient, dan notification history |

### Business Rule Skor Risiko

| Faktor | Bobot | Sumber |
|---|---:|---|
| Frekuensi AIS Gap | 25% | AIS gap log |
| Riwayat anomali | 25% | Anomaly Detection |
| Bendera berisiko tinggi | 20% | Referensi risiko yang disahkan |
| Pola rute mencurigakan | 20% | Voyage dan shipping lane |
| Riwayat port call | 10% | Port call dan watch reference |

Skor dihitung hanya dari data yang memiliki freshness dan provenance. Missing factor tidak otomatis dianggap aman; UI menampilkan confidence/data completeness secara terpisah.

## 3. Navigasi & Interaksi

| Dari | Aksi | Menuju | Context |
|---|---|---|---|
| Search result | Pilih kapal | Workspace profile | Vessel ID |
| Profile | `Lacak di Peta` | National Maritime Picture | Vessel ID, posisi, time mode |
| Voyage point | Klik | Port/AIS segment detail | Timestamp dan coordinate |
| AIS gap row | Klik | Anomaly Detection | Gap ID, vessel ID, track context |
| Risk factor | Klik | Evidence drawer | Faktor, evidence IDs, score version |
| Related incident | Klik | Early Warning Center | Incident ID |
| Export laporan | Klik | Intelligence Reporting | Vessel, period, selected evidence |

Navigasi masuk berasal dari NMP, Anomaly, Early Warning, Threat entity profile, dan Report archive.

## 4. Alur Bisnis

### 4.1 Investigasi Kapal Mencurigakan

```text
Analis pilih vessel alert → profil + risk score terbuka
 → cek voyage/port/flag/ownership/AIS gap
 → verifikasi evidence lintas-sumber
 → catat temuan
    ├─ bukti cukup → kaitkan/eskalasi insiden
    └─ bukti tidak cukup → tandai perlu observasi
```

### 4.2 Watchlist

1. Analis memilih `Tambah ke Watchlist` dan mengisi alasan serta kondisi pemicu.
2. Supervisor menyetujui jika klasifikasi atau cakupan notifikasi memerlukannya.
3. Sistem memantau event posisi/anomali.
4. Event tervalidasi memicu notifikasi dan tersimpan pada history.

### 4.3 Edge Case — Registry Tidak Cocok

```text
MMSI cocok tetapi IMO/operator berbeda → conflict flag
 → data tidak digabung diam-diam
 → analis membandingkan sumber dan waktu
    ├─ resolved → identity version baru + audit
    └─ unresolved → profile berlabel conflict; score confidence turun
```

## 5. Data yang Dikelola

| Entity | Field Utama | Contoh |
|---|---|---|
| Vessel | Vessel ID, MMSI, IMO, callsign, flag, type, dimensions, build year | EVER GIVEN, 353136000, 9811000 |
| Voyage segment | Start/end, coordinates, speed, course, observed/predicted | Laut Arab → Selat Malaka |
| Port call | Port, country, arrival, departure, duration | Port Tanjung, 9j 33m |
| Ownership record | Owner/operator, period, source | Shoei Kisen Kaisha Ltd., 2019–now |
| AIS gap | Lost/resumed time, location, duration, review state | 2j 23m, high risk waters |
| Risk assessment | Score, level, factor contributions, completeness, version | 72/100, tinggi |
| Watchlist entry | Reason, condition, area, recipients, status | Entry Natuna, active |

## 6. Kebutuhan Data Eksternal

- AIS feed dan vessel registry.
- port reference, shipping lanes, risk-country/port reference yang disahkan.
- OSINT dan internal intelligence sebagai supporting evidence.
- Mapbox untuk voyage dan position context.

## 7. Stack Agent Modul

| Agent | Peran | Trigger | Output |
|---|---|---|---|
| Analysis Agent | Menjelaskan pola voyage, gap, dan relasi berdasarkan data tervalidasi | Event / on-demand | Structured explanation dan evidence links |
| Validation/Guardrail Agent | Memastikan explanation dan escalation sesuai evidence | Post-process | Verified/flagged assessment |
| Notification Agent | Mengirim watchlist event yang tervalidasi | Event-driven | Delivery record |
| Reporting Agent | Menyusun profile brief untuk Intelligence Reporting | Manual | Vessel intelligence brief |

Skor dasar tetap dihitung deterministik; Analysis Agent tidak mengubah bobot atau threshold.

## 8. Alert

| Level | Contoh Kondisi | Aksi |
|---|---|---|
| Rendah | Data lengkap, tanpa deviation signifikan | Monitoring |
| Sedang | Satu AIS gap/risk-port visit | Review |
| Tinggi | Gap berulang, rute mencurigakan, flag risk | Prioritaskan investigasi |
| Kritis | Kombinasi dark vessel, restricted zone, atau transfer mencurigakan | Early Warning |

## 9. Standar Layanan

Search dan profile terasa cepat; posisi dan gap diperbarui otomatis; histori 5 tahun dapat ditelusuri; layanan investigasi 24/7; conflict dan stale data selalu terlihat.

## 10. Use Case

**Happy path:** Analis membuka alert dark vessel, menemukan gap berulang dan route deviation, memverifikasi registry serta OSINT, lalu membuat vessel brief.  
**Edge case:** MMSI reuse/identity conflict; sistem menahan merge, menurunkan confidence, dan meminta resolusi sumber.

## 11. Acceptance dan Referensi

- Semua elemen F-M3-01–F-M3-09 tersedia dan terhubung.
- Skor 0–100 mengikuti bobot FRD dan dapat direproduksi dari factor values.
- Watchlist tidak mengirim notifikasi dari raw/unvalidated event.
- Referensi: FRD Section 3.3; mockup lokal; ITU-R M.1371; vessel registry source yang disetujui.

---

*Modul 03 | Versi 1.0.0*
