# Modul Border Intelligence

**Mockup utama:** [`border_intelligence_dashboard.png`](../design/border_intelligence_dashboard.png)

## 1. Gambaran Umum

Border Intelligence menyajikan situasi perbatasan darat nasional melalui peta sektor, feed aktivitas, status pos, jalur informal, titik penyelundupan, timeline insiden, dan integrasi imigrasi. Layar mengikuti mockup berupa peta dominan dengan ringkasan sektoral dan alat analisis, tetapi seluruh peta tetap memakai kontrak Mapbox tactical bersama.

### Tujuan dan Pengguna

| Tujuan | Outcome |
|---|---|
| Memahami aktivitas lintas batas | Orang, barang, insiden, dan pelanggaran terlihat per sektor |
| Menemukan jalur berisiko | Jalur informal dan titik penyelundupan dapat ditinjau bersama histori |
| Menjaga readiness pos/patroli | Status pos, beacon, dan cakupan rute terlihat |
| Mendokumentasikan insiden | Bukti, lokasi, waktu, dan tindak lanjut terjaga |

Pengguna utama: Analis Perbatasan dan Supervisor; Pimpinan memakai ringkasan; Administrator mengelola source/geofence; Auditor read-only.

## 2. Fitur Utama dan Traceability

| ID | Fitur | Perilaku dan Komponen |
|---|---|---|
| F-M2-01 | Border Crossing Map | Pos lintas batas resmi, status operasional, sektor, dan ringkasan aktivitas |
| F-M2-02 | Informal Route Mapping | Jalur tikus sebagai garis oranye putus-putus; role berwenang dapat mengusulkan/edit jalur dengan audit |
| F-M2-03 | Cross-border Activity Feed | Feed orang, barang, dan insiden real-time dengan filter serta detail |
| F-M2-04 | Smuggling Risk Point | Titik rawan berwarna berdasarkan risk level, histori, evidence, dan rekomendasi observasi |
| F-M2-05 | Illegal Activity Log | Daftar aktivitas ilegal, lokasi, entitas, evidence, assignment, dan status |
| F-M2-06 | Immigration Data Integration | Ringkasan perlintasan orang/barang, dokumen diproses, cekal, dan health integrasi |
| F-M2-07 | Border Incident Timeline | Timeline tujuh hari dan riwayat insiden dengan drill-down |

### Komponen Visual

| Komponen | Tipe | Data | Update |
|---|---|---|---|
| Peta situasi border | Peta interaktif | Pos, jalur informal, risk point, patrol route, incident | Per jam/real-time |
| Activity feed | Feed berfilter | Orang, barang, insiden, geofence | Real-time |
| KPI strip | Kartu ringkasan | Pos, jalur, titik rawan, insiden, patroli | Per jam |
| Impact level | Indikator status | Sektor rendah/sedang/tinggi | Per jam |
| Incident timeline | Linimasa | Jumlah dan severity tujuh hari | Per jam |
| Immigration summary | Panel ringkasan | Perlintasan, dokumen, cekal, source health | Per jam |
| Analysis tools | Action tiles | Tulis baca, verifikasi, edit jalur, upload evidence, geofence, laporan cepat | On-demand |

## 3. Navigasi & Interaksi

| Dari | Aksi | Menuju | Context |
|---|---|---|---|
| Pos pada peta | Klik | Panel detail pos | Pos ID, sektor, status, aktivitas 24 jam |
| Jalur informal | Klik/edit | Modal jalur | Route ID, geometri, evidence, revision history |
| Feed aktivitas | Klik item | Detail aktivitas/insiden | Activity ID dan sumber |
| Risk point | Klik | Anomaly Detection | Lokasi, rule, evidence |
| Timeline | Klik titik tanggal | Illegal Activity Log | Tanggal dan sektor |
| Incident | Eskalasi | Early Warning Center | Incident ID, severity, assignment |
| Laporan cepat | Klik | Intelligence Reporting | Area, periode, evidence terpilih |

Navigasi masuk berasal dari NMP callout area, Anomaly detail, Early Warning alert, dan Threat Assessment area risk.

## 4. Alur Bisnis

### 4.1 Monitoring Perbatasan

```text
Analis pilih sektor → tinjau pos dan activity feed
 → pilih aktivitas mencurigakan → validasi sumber/evidence
 → buat catatan atau insiden → assign/eskalasi
```

### 4.2 Pemutakhiran Jalur Informal

1. Analis berwenang memilih `Edit Jalur` atau menggambar usulan.
2. Sistem meminta alasan, sumber, tingkat keyakinan, dan bukti.
3. Supervisor meninjau perubahan.
4. Setelah disetujui, versi baru aktif dan versi lama tetap di audit history.

### 4.3 Edge Case — API Imigrasi Stale

```text
Data > batas freshness → status STALE
  ├─ snapshot ada → summary tetap tampil dengan timestamp
  └─ snapshot kosong → panel unavailable, data lapangan tetap dapat digunakan
Monitor menjadwalkan retry dan membuat source-health event.
```

## 5. Data yang Dikelola

| Entity | Field Bisnis Utama | Contoh |
|---|---|---|
| Pos lintas batas | Nama, koordinat, sektor, status, jam operasi | PLBN Entikong, operasional |
| Jalur informal | Nama, geometri, status, confidence, sumber | Jalur Tikus Nanga Badau, terverifikasi |
| Aktivitas lintas batas | Waktu, tipe, orang/barang, pos/jalur, sumber | 02:11, resmi, 12 orang |
| Insiden border | Jenis, lokasi, severity, evidence, status, assignment | Geofence breach, tinggi |
| Patrol route | Geometri, unit, periode, coverage | Rute Kalbar, 98% |

Sample fixture: aktivitas resmi Entikong; aktivitas mencurigakan Nanga Badau; pelanggaran geofence Merauke. Semua diberi label synthetic.

## 6. Kebutuhan Data Eksternal

- Pos lintas batas dan batas administratif yang disahkan.
- API imigrasi/perlintasan dan daftar cegah/cekal sesuai izin.
- Laporan lapangan, patroli, geofence, serta evidence internal.
- Mapbox basemap dan layer tactical.

Akses data individu dibatasi role dan classification; tampilan ringkasan Pimpinan tidak membuka PII yang tidak diperlukan.

## 7. Stack Agent Modul

| Agent | Peran | Trigger | Output |
|---|---|---|---|
| Analysis Agent | Menilai pola perlintasan dan titik rawan dari data tervalidasi | Event / batch | Risk indicator dan candidate anomaly |
| Validation/Guardrail Agent | Memeriksa bukti sebelum insiden/alert memengaruhi keputusan | Post-process | Verified/flagged assessment |
| Workflow/State Agent | Menjaga status insiden dan review jalur | Event-driven | Current state dan transition history |
| Notification Agent | Meneruskan insiden tervalidasi sesuai severity | Event-driven | Delivery record |

## 8. Alert

| Level | Kondisi | Aksi |
|---|---|---|
| Rendah | Aktivitas normal atau deviation kecil | Monitoring |
| Sedang | Pola berulang/jalur perlu perhatian | Review analis |
| Tinggi | Pelanggaran jalur/geofence tervalidasi | Assignment Supervisor |
| Kritis | Aktivitas ilegal terkoordinasi/ancaman langsung | Eskalasi Early Warning |

## 9. Standar Layanan

Peta dan feed terasa cepat; data imigrasi diperbarui minimal per jam; jalur informal hanya berubah melalui review; layanan monitoring 24/7; snapshot terakhir tetap tersedia ketika sumber eksternal gagal.

## 10. Use Case

**Happy path:** Analis memilih sektor Kalbar, melihat activity feed merah pada jalur informal, memeriksa bukti, membuat insiden, lalu Supervisor mengeskalasi.  
**Edge case:** Imigrasi stale; sistem tidak menghapus aktivitas lapangan dan menjaga perbedaan antara data resmi lama dan laporan baru.

## 11. Acceptance dan Referensi

- Seluruh pos resmi dapat ditampilkan dengan koordinat yang memenuhi FRD.
- Jalur informal dapat ditandai/diedit hanya oleh role berwenang dan selalu diaudit.
- Data imigrasi menunjukkan freshness serta fallback.
- Referensi: FRD Section 3.2; mockup lokal; standar geospasial BIG; kebijakan sumber data klien.

---

*Modul 02 | Versi 1.0.0*
