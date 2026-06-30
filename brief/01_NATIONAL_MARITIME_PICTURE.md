# Modul National Maritime Picture

**Mockup utama:** [`national_maritime_picture.png`](../design/national_maritime_picture.png)

## 1. Gambaran Umum

National Maritime Picture (NMP) adalah landing page setelah login sekaligus Common Operational Picture maritim nasional. Peta satelit memenuhi seluruh workspace dan mempertahankan konteks Indonesia dalam satu viewport; panel KPI, pencarian, cuaca-laut, layer control, fusion status, alert, dan replay mengambang sebagai lapisan glassmorphism.

### 1.1 Tujuan dan Pengguna

| Tujuan | Outcome |
|---|---|
| Situational awareness nasional | Analis memahami posisi, arus, risiko, dan chokepoint tanpa membuka sistem terpisah |
| Deteksi fokus perhatian | Entitas dan area berisiko terlihat melalui warna, alert, heatmap, dan hotspot |
| Investigasi cepat | Peta menjadi pintu masuk ke Vessel, Aircraft, Anomaly, dan Early Warning |
| Rekonstruksi aktivitas | Analis dapat replay 24 jam untuk melihat urutan kejadian |

| Pengguna | Kebutuhan |
|---|---|
| Analis | Pencarian, layer control, replay, drill-down, dan bukti posisi |
| Supervisor | Ringkasan status, chokepoint, alert aktif, dan data-source fusion |
| Pimpinan | Gambaran singkat kondisi nasional dan akses ke alert strategis |
| Auditor | Read-only terhadap snapshot, replay, dan audit interaksi |

## 2. Fitur Utama dan Traceability

| ID | Fitur | Perilaku dan Komponen Visual |
|---|---|---|
| F-M1-01 | Real-time Vessel Map | Simbol kapal berorientasi course, warna risk level, cluster adaptif, pencarian nama/MMSI/IMO/callsign, detail ringkas saat dipilih |
| F-M1-02 | Shipping Lane Overlay | Jalur pelayaran resmi sebagai garis neon putus-putus dengan legenda dan toggle independen |
| F-M1-03 | Chokepoint Monitoring | Selat Malaka, Sunda, Lombok, dan Makassar memiliki status, label callout, traffic, dan risk state |
| F-M1-04 | EEZ Boundary Layer | Batas ZEE Indonesia tampil sebagai garis cyan dengan label dan tooltip sumber |
| F-M1-05 | Disputed Zone Highlight | Area sengketa menggunakan arsiran taktis dan status perhatian, tanpa menutupi citra satelit |
| F-M1-06 | Activity Hotspot Heatmap | Kepadatan aktivitas dapat difilter periode/domain dan dibaca bersama kapal/pesawat |
| F-M1-07 | 24-Hour Activity Replay | Timeline 24 jam, play/pause, lompat, scrub, dan kecepatan 1x/5x/10x |
| F-M1-08 | Multi-layer Toggle | Panel layer untuk AIS, ADS-B, EEZ, chokepoint, hotspot, cuaca-laut, SAR, dan disputed zone |

### 2.1 Komposisi Layar

| Komponen | Tipe | Data | Update |
|---|---|---|---|
| Peta Indonesia | Peta lokasi interaktif full-background | Kapal, pesawat, batas, jalur, hotspot, area risiko | Real-time |
| Search bar | Pencarian global | Lokasi, MMSI, IMO, callsign, nama entitas | On-demand |
| Chokepoint callout | Indikator status warna | Traffic dan level risiko per selat | Per menit |
| Kondisi cuaca-laut | Panel ringkas | Hujan, gelombang, angin, visibility | Per jam |
| KPI strip | Kartu ringkasan | Total kapal, risiko tinggi, anomali, chokepoint, pesawat, aktivitas, alert terakhir | Real-time |
| Replay | Linimasa kronologis | Kepadatan event dan posisi pada waktu terpilih | On-demand |
| Layer/fusion control | Panel kontrol | Visibility dan health sumber | Real-time |

**Aturan layout mutlak:** tidak ada vertical scrolling pada halaman; peta mengisi seluruh area di belakang panel; sidebar collapsed secara default; panel boleh berpindah ke drawer atau mengurangi kepadatan pada viewport sempit tetapi body tetap terkunci.

## 3. Navigasi & Interaksi

| Dari | Aksi | Menuju | Context |
|---|---|---|---|
| Simbol kapal | Klik kapal | Vessel Intelligence | Vessel ID, posisi, waktu, risk level |
| Simbol pesawat | Klik pesawat | Aircraft Intelligence | Aircraft ID, track, waktu |
| Callout chokepoint | Klik detail | Threat Assessment | Area ID, traffic window, risk level |
| Kartu anomali aktif | Klik | Anomaly Detection | Status aktif dan domain maritim |
| Alert terakhir | Klik | Early Warning Center | Alert ID |
| Replay | Pilih event | Panel detail peta | Timestamp dan entitas pada frame |
| Fusion status | Klik detail | Data Integration & Management | Daftar sumber dan health |

Decision branch: jika data entitas stale, detail tetap dapat dibuka tetapi diberi banner waktu observasi terakhir; aksi investigasi memakai snapshot tersebut dan tidak boleh menyamarkannya sebagai posisi live.

Navigasi masuk berasal dari Vessel (`Lacak di Peta`), Early Warning (`Lihat Lokasi`), Threat Assessment (`Buka Konteks Area`), dan Reporting (`Edit Peta Situasi`) dengan layer serta timestamp tetap terjaga.

## 4. Alur Bisnis

### 4.1 Pemantauan Shift

```text
Analis login → NMP terbuka → cek status sumber dan chokepoint
     → filter layer/domain → pilih entitas berisiko
     → buka profil atau anomali → catat/eskalasi temuan
```

### 4.2 Replay Kejadian

1. Analis memilih rentang 24 jam dan menekan play.
2. Sistem menggerakkan posisi dan event sesuai timestamp sambil memperbarui KPI frame.
3. Analis memilih hotspot atau entitas pada frame tertentu.
4. Sistem menahan replay dan membuka detail dengan timestamp yang sama.

### 4.3 Edge Case — Feed AIS Terputus

```text
Monitor mendeteksi AIS stale → banner sumber tampil
     ├─ snapshot tersedia → peta tetap tampil + label "terakhir diperbarui"
     └─ snapshot tidak ada → layer AIS nonaktif + alasan dan health detail
Analis dapat lanjut ke data lain; sistem mencatat acknowledgment banner.
```

## 5. Data yang Dikelola

NMP tidak menjadi pemilik data posisi. Modul mengelola konfigurasi tampilan pengguna, layer aktif, filter, camera state, replay state, serta snapshot agregasi KPI. Posisi, profil, anomaly, dan alert tetap dimiliki modul sumber.

| Field | Deskripsi | Contoh |
|---|---|---|
| User Role | Role penentu konfigurasi default | Analis |
| Active Layers | Lapisan yang terlihat | AIS, EEZ, Chokepoint, Hotspot |
| Time Mode | Live atau replay | Replay 09:42 WIB |
| Camera Context | Area yang sedang dilihat | Indonesia / Selat Malaka |
| Data Freshness | Waktu paling lama dari sumber aktif | AIS 3 menit lalu |

## 6. Kebutuhan Data Eksternal

- AIS nasional untuk posisi kapal.
- ADS-B untuk overlay pesawat.
- batas ZEE, chokepoint, dan wilayah sengketa yang telah disahkan.
- cuaca-laut, SAR, serta geospatial reference.
- Mapbox Satellite Streets v12 sebagai basemap live.

Mode fixture harus menggunakan geografi Indonesia dan provenance `SYNTHETIC`; data fixture tidak boleh menyerupai data classified operasional.

## 7. Stack Agent Modul

| Agent | Peran | Trigger | Output |
|---|---|---|---|
| Reporting Agent | Menyiapkan agregasi KPI dan layer state untuk konsumsi manusia | Manual / scheduled | Snapshot COP dan ringkasan |
| Orchestrator Agent | Meminta context lintas modul saat pengguna drill-down atau alert kritis | System-level | Routing dan context bundle |
| Monitoring Agent | Mengawasi freshness seluruh sumber yang tampil | Continuous | Health/stale event |

NMP tidak melakukan analisis risiko sendiri; skor dan anomali berasal dari modul pemilik dan selalu membawa provenance.

## 8. Konfigurasi Alert

| Kondisi | Tampilan | Aksi |
|---|---|---|
| Normal | Hijau/cyan, tanpa callout dominan | Monitoring |
| Risiko sedang | Kuning, callout dan KPI highlight | Masuk daftar perhatian |
| Risiko tinggi | Oranye, prioritas di layer dan feed | Tawarkan investigasi |
| Kritis | Merah, callout paling atas dan pulse singkat | Buka alert/insiden dan eskalasi sesuai role |

## 9. Standar Layanan

Halaman harus terasa cepat, pembaruan posisi otomatis, interaksi peta responsif, dan fungsi live tersedia 24/7. Kegagalan satu sumber tidak boleh mengosongkan keseluruhan COP. Seluruh status memiliki ikon/teks selain warna.

## 10. Use Case

**Happy path:** Analis membuka NMP, melihat Selat Malaka merah, memilih callout, menemukan kapal berisiko, lalu masuk ke Vessel Intelligence dengan konteks tetap.  
**Edge case:** AIS stale saat replay; sistem mempertahankan snapshot, membedakan track observed dan predicted, serta membuka Data Source Health saat diminta.

## 11. Acceptance dan Referensi

- Seluruh perairan Indonesia tampil dalam satu viewport pada resolusi target.
- Semua layer dapat digunakan bersamaan tanpa kehilangan kontrol atau legenda.
- Replay mendukung 1x, 5x, dan 10x.
- Style peta, projection, overlay tactical, logo, font, collapsed sidebar, full-background map, glass panels, dan no-scroll memenuhi kontrak overview.
- Referensi: FRD Section 3.1; mockup lokal di atas; ITU-R M.1371; standar geospasial BIG; Mapbox Satellite Streets.

---

*Modul 01 | Versi 1.0.0*
