# Modul Early Warning Center

**Mockup utama:** [`early_warning_center.png`](../design/early_warning_center.png)

## 1. Gambaran Umum

Early Warning Center (EWC) mengkonsolidasikan anomaly/incident tervalidasi menjadi alert operasional dengan severity, assignment, SLA, escalation, notification, dan briefing ke Pimpinan. Layar memadukan KPI severity, tren, distribusi domain/wilayah, daftar insiden, status workflow, matriks SLA, quick actions, notification feed, briefing composer, dan history.

### Tujuan dan Pengguna

| Tujuan | Outcome |
|---|---|
| Satu pusat alert | Semua domain memakai lifecycle dan severity konsisten |
| Respons terukur | Waktu respons, resolusi, assignment, dan kepatuhan SLA terlihat |
| Eskalasi otomatis | Alert terlambat diteruskan sesuai matriks tanpa menunggu pemeriksaan manual |
| Briefing terkendali | Notifikasi Pimpinan membawa konteks, rekomendasi, klasifikasi, dan audit |

Pengguna: Analis, Supervisor, Pimpinan, Administrator escalation matrix, Auditor read-only.

## 2. Fitur Utama dan Traceability

| ID | Fitur | Perilaku dan Komponen |
|---|---|---|
| F-M6-01 | Alert Dashboard | Filter pusat operasi/domain/wilayah/periode, KPI severity, charts, incident list/history |
| F-M6-02 | Alert Generation Engine | Mengubah validated trigger menjadi alert terdeduplikasi dengan evidence bundle |
| F-M6-03 | Alert Priority Levels | KRITIS merah, TINGGI oranye, SEDANG kuning, RENDAH hijau plus ikon/label |
| F-M6-04 | Push Notification | In-app wajib; email/SMS opsional sesuai network/configuration |
| F-M6-05 | Incident Monitoring | Baru → verifikasi → ditindaklanjuti → selesai, dengan assignment dan notes |
| F-M6-06 | Escalation Matrix | Timer dan recipient berdasarkan severity; config terversi dan diaudit |
| F-M6-07 | Alert History Log | Search/filter seluruh alert, penerima, sumber, waktu, status, resolution |
| F-M6-08 | Threat Notification Template | Form briefing terstandar: recipient, urgency, title, summary, recommendation, attachment |

### Matriks Operasional FRD

| Severity | SLA Tindak Lanjut | Eskalasi | Kanal Awal |
|---|---|---|---|
| KRITIS | 15 menit | Pimpinan langsung | In-app + SMS bila diizinkan |
| TINGGI | 1 jam | Koordinator/Supervisor | In-app + email bila diizinkan |
| SEDANG | 4 jam | Supervisor | In-app |
| RENDAH | 24 jam | Tidak ada escalation default | In-app |

## 3. Navigasi & Interaksi

| Dari | Aksi | Menuju | Context |
|---|---|---|---|
| KPI severity | Klik | Incident list terfilter | Severity, period |
| Map distribution | Klik wilayah | NMP/Border/Aircraft map | Area, alert IDs |
| Incident row | Klik | Incident detail | Incident ID |
| Source/anomaly | Klik | Anomaly/domain workspace | Source ID dan evidence |
| `Assign` | Klik | Assignment modal | Incident, candidate users |
| `Eskalasi` | Klik | Escalation confirmation | Severity, recipient, reason |
| `Kirim Briefing` | Klik | Briefing composer | Selected incident/evidence |
| History row | Klik | Audit detail | Alert and delivery history |

## 4. Alur Bisnis

### 4.1 Alert Kritis

```text
Validated anomaly → alert KRITIS dibuat + dedupe
 → in-app notification + SLA timer → analyst/supervisor verify
    ├─ acknowledged → incident ditindaklanjuti
    └─ 15 menit terlewati → autonomous escalation ke Pimpinan
```

### 4.2 Briefing ke Pimpinan

1. Supervisor memilih insiden dan `Kirim Briefing`.
2. Sistem mengisi judul, ringkasan, rekomendasi, peta, dan evidence.
3. Supervisor mengecek classification dan penerima.
4. Validation memeriksa kelengkapan; distribusi mencatat delivery result.

### 4.3 Edge Case — Kanal Eksternal Gagal

```text
SMS/email gagal → in-app tetap authoritative
 → retry policy berjalan → failure tampil pada delivery status
    ├─ retry sukses → status delivered
    └─ habis retry → notifier membuat escalation channel failure
```

## 5. Data yang Dikelola

| Entity | Field Utama | Contoh |
|---|---|---|
| Alert | ID, title, domain, severity, area, source, received time, state | AL-13-2025-001-062, KRITIS |
| Incident | Related alerts, owner, state, notes, resolution | Penyusupan kapal asing |
| SLA timer | Severity, due time, acknowledgment, resolution | Response 15m |
| Escalation event | From/to, reason, time, channel | Supervisor → Pimpinan |
| Notification | Recipient, classification, channel, delivery | In-app delivered |
| Briefing | Title, summary, recommendation, attachments, approver | Aktivitas mencurigakan Sulawesi |

## 6. Sumber Data

EWC hanya menerima validated triggers dari Anomaly, source-health monitor, atau authorized internal intelligence. Location visualization memakai kontrak peta bersama; recipient directory dan classification berasal dari Administration.

## 7. Stack Agent Modul

| Agent | Peran | Trigger | Output |
|---|---|---|---|
| Task Automation Agent | Membuat timer, assignment/escalation actions dari validated trigger | Event-driven | Action result |
| Workflow/State Agent | Menjaga lifecycle alert/incident | Event-driven | State/history |
| Notification Agent | Mengirim melalui kanal yang diizinkan dan menangani retry | Event-driven | Delivery status |
| Validation/Guardrail Agent | Memeriksa briefing dan external-facing notification | Pre/Post process | Approved/rejected output |
| Orchestrator Agent | Mengkoordinasikan branch alert kritis | System-level | Execution state |

## 8. State dan Severity

State canonical: `BARU`, `DALAM_VERIFIKASI`, `DITINDAKLANJUTI`, `DIESKALASI`, `DISELESAIKAN`. Severity tidak boleh diturunkan tanpa reason, role berwenang, dan audit. Warna selalu disertai ikon serta teks.

## 9. Standar Layanan dan Use Case

Alert harus tersedia 24/7, real-time, serta tahan terhadap kegagalan kanal. SLA timer memakai waktu sistem authoritative. UI selalu menunjukkan due/overdue dan data freshness.

**Happy path:** anomaly kritis tervalidasi, analis acknowledge, Supervisor assign dan mengirim briefing ke Pimpinan sebelum SLA.  
**Edge case:** alert tidak ditindaklanjuti; sistem mengeskalasi otomatis, mencatat timer, recipient, dan delivery.

## 10. Acceptance dan Referensi

- Seluruh F-M6-01–F-M6-08 tersedia.
- Matriks SLA FRD dapat dikonfigurasi tanpa kehilangan history.
- Alert terdeduplikasi, setiap state transition diaudit, dan retry tidak membuat notifikasi ganda.
- Referensi: FRD Section 3.6; mockup lokal; policy recipient/classification klien.

---

*Modul 06 | Versi 1.0.0*
