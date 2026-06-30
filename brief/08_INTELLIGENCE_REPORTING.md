# Modul Intelligence Reporting

**Mockup utama:** [`intelligence_reporting_center.png`](../design/intelligence_reporting_center.png)

## 1. Gambaran Umum

Intelligence Reporting adalah pusat pembuatan produk intelijen dari dashboard eksekutif, daily summary, weekly assessment, auto brief, custom report builder, approval, distribution, dan archive. Produk mempertahankan provenance, classification, approver, recipient, serta snapshot peta/grafik agar laporan historis tidak berubah ketika data live berubah.

### Tujuan dan Pengguna

| Tujuan | Outcome |
|---|---|
| Mempercepat briefing | Ringkasan harian/mingguan dibentuk dari data tervalidasi |
| Menstandarkan produk | Template, blok konten, classification, dan metadata konsisten |
| Menjaga approval | Draft dan distribusi mengikuti role serta audit |
| Menyediakan arsip | Laporan dapat dicari tanpa kehilangan versi dan penerima |

Pengguna: Analis sebagai author; Supervisor sebagai reviewer; Pimpinan sebagai approver/recipient; Auditor read-only; Administrator mengelola template/recipient policy.

## 2. Fitur Utama dan Traceability

| ID | Fitur | Perilaku dan Komponen |
|---|---|---|
| F-M8-01 | Executive Dashboard | KPI laporan, peristiwa aktif, intel kritis, akurasi, daily/weekly summary |
| F-M8-02 | Daily Intelligence Summary | Otomatis setiap pagi: aktivitas 24 jam, anomaly, alert, threat change |
| F-M8-03 | Weekly Strategic Assessment | Tren, comparison, projection, dan strategic narrative |
| F-M8-04 | Auto Brief Generator | Jenis, periode, area, focus; menghasilkan brief 1–2 halaman |
| F-M8-05 | Custom Report Builder | Blok peta, chart, table, narrative, timeline, attachment; reorder/configure/preview |
| F-M8-06 | Report Distribution | Recipient, classification, approval, channel, delivery, revocation policy |
| F-M8-07 | Report Archive | Search/filter date/type/classification/status/author/recipient, version dan download audit |

### Komponen Visual

| Komponen | Tipe | Data | Update |
|---|---|---|---|
| Executive dashboard | KPI + summaries | Report/intel status | Real-time |
| Auto brief form | Guided form | Type, date, area, focus | On-demand |
| Custom builder | Canvas + block palette | Map/chart/table/narrative/timeline | On-demand |
| Distribution | Recipient/classification panel | Authority, recipient, channel | On-demand |
| Approval timeline | State timeline | Draft/review/approval/distribution | Event-driven |
| Report archive | Searchable table | Versioned products | Real-time |

## 3. Navigasi & Interaksi

| Dari | Aksi | Menuju | Context |
|---|---|---|---|
| Auto brief | Generate | Draft editor/preview | Type, period, area, focus |
| Content palette | Tambah blok | Report canvas | Data query/snapshot context |
| Map block | Configure | Tactical map selector | Area, layer, timestamp |
| `Kirim untuk Persetujuan` | Klik | Approval timeline | Report version/classification |
| Approval step | Review/approve/reject | State update | Reason/signature/time |
| Distribute | Klik | Delivery panel | Approved version and recipients |
| Archive row | View/download | Read-only report | Version, audit context |

Navigasi masuk berasal dari seluruh modul melalui `Buat/Export Laporan`, membawa selected entity/area/period/evidence tanpa mengubah source records.

## 4. Alur Bisnis

### 4.1 Daily Intelligence Summary

```text
Schedule pagi → reporter mengumpulkan validated snapshots
 → draft + provenance → validation
 → Analis review → Supervisor approve operational content
 → Pimpinan approval/distribution sesuai classification
```

### 4.2 Custom Report

1. Analis memilih template dan menambah blok konten.
2. Setiap blok menyimpan source query, snapshot time, dan caption.
3. Preview memeriksa layout, missing source, classification, dan recipient eligibility.
4. Report masuk approval workflow; versi approved tidak dapat diedit langsung.

### 4.3 Edge Case — Data Sumber Berubah

```text
Data live berubah setelah draft → report tetap memakai snapshot
 → banner menyebut data terbaru tersedia
    ├─ author refresh → version draft baru
    └─ author pertahankan → alasan dicatat
Approved version tidak pernah berubah diam-diam.
```

## 5. Data yang Dikelola

| Entity | Field Utama | Contoh |
|---|---|---|
| Report | Title, type, period, area, classification, state, author | Daily Intelligence Brief, RAHASIA |
| Report version | Version, blocks, snapshot time, change reason | v1.2 |
| Content block | Type, source, configuration, caption, snapshot | Peta situasi Natuna |
| Approval | Step, actor role, decision, time, notes | Supervisor approved |
| Distribution | Recipient, authority, channel, delivery, time | Pimpinan, delivered |
| Template | Type, required blocks, classification floor | Weekly Assessment |

## 6. Kebutuhan Data

Seluruh input berasal dari validated snapshots modul lain dan recipient/classification directory. Export/map block selalu menggunakan tactical map contract; attachments membawa checksum dan classification.

## 7. Stack Agent Modul

| Agent | Peran | Trigger | Output |
|---|---|---|---|
| Reporting Agent | Menyusun daily/weekly/auto brief dari data structured | Manual / scheduled | Report draft |
| Validation/Guardrail Agent | Memeriksa completeness, provenance, classification, dan unsupported claims | Post-process | Verified/flagged draft |
| Workflow/State Agent | Menjaga version/approval/distribution lifecycle | Event-driven | State history |
| Notification Agent | Mendistribusikan approved product dan delivery status | Event-driven | Delivery record |
| Orchestrator Agent | Mengumpulkan data lintas-modul untuk produk kompleks | System-level | Context bundle/execution state |

## 8. State dan Classification

State: `DRAFT`, `REVIEW_SUPERVISOR`, `APPROVAL_PIMPINAN`, `DISTRIBUTED`, `ARCHIVED`, `REJECTED`. Classification: `TERBATAS`, `RAHASIA`, `SANGAT_RAHASIA`. Recipient harus memiliki clearance yang sesuai sebelum distribusi.

## 9. Standar Layanan dan Use Case

Daily report siap sesuai schedule; auto brief terasa toleran namun memberikan progress; archive search cepat; reporting tersedia 24/7. Generation failure dapat diulang tanpa membuat versi/distribusi ganda.

**Happy path:** Analis membuat auto brief Natuna, meninjau peta dan evidence, Supervisor review, Pimpinan approve, lalu system mendistribusikan.  
**Edge case:** satu source stale; validation menandai blok, author memilih snapshot dengan disclosure atau refresh sebelum approval.

## 10. Acceptance dan Referensi

- F-M8-01–F-M8-07 tersedia.
- Daily, weekly, dan auto brief mengikuti struktur dan waktu FRD.
- Approved versions immutable; recipient/classification dan download tercatat.
- Referensi: FRD Section 3.8; mockup lokal; template dan classification policy klien.

---

*Modul 08 | Versi 1.0.0*
