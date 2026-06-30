# Modul Anomaly Detection

**Mockup utama:** [`anomaly_detection_engine.png`](../design/anomaly_detection_engine.png)

## 1. Gambaran Umum

Anomaly Detection menjalankan deteksi 24/7 pada data maritim, border, dan udara. Workspace mengutamakan daftar anomaly aktif, detail evidence, peta kejadian, explainable factors, recommended actions, configurable thresholds, false-positive rules, dan correlation timeline. Detection candidate tidak otomatis menjadi ancaman: hasil harus melalui quality check dan review sesuai severity.

### Tujuan dan Pengguna

| Tujuan | Outcome |
|---|---|
| Menyaring volume data | Analis fokus pada behavior yang keluar dari baseline/rule |
| Menjaga explainability | Setiap candidate memiliki rule, evidence, confidence, dan model factors |
| Mengorelasikan kejadian | Event spasial, temporal, dan entity-related dapat dikelompokkan |
| Memperbaiki kualitas | False positive menyimpan alasan dan menjadi feedback terukur |

Pengguna: Analis lintas-domain, Supervisor, Administrator threshold, Pimpinan ringkasan, dan Auditor read-only.

## 2. Jenis Anomali Wajib

| ID | Nama | Domain | Rule Awal |
|---|---|---|---|
| AN-01 | AIS Off / Dark Vessel | Maritim | AIS hilang melebihi threshold, default FRD 6 jam |
| AN-02 | Loitering Vessel | Maritim | Kecepatan <2 knot dalam area yang sama melebihi threshold |
| AN-03 | Ship-to-Ship Transfer | Maritim | Dua kapal berjarak <500 m bersamaan di area non-pelabuhan |
| AN-04 | Route Deviation | Maritim | Deviasi dari shipping lane melewati threshold NM |
| AN-05 | Entry into Restricted Zone | Maritim | Entitas masuk zona terbatas tanpa clearance |
| AN-06 | Border Crossing Anomaly | Border | Aktivitas di jalur informal/di luar jam pos |
| AN-07 | Unusual Cross-border Pattern | Border | Frekuensi perlintasan individu/entitas di atas baseline |
| AN-08 | Unscheduled Aircraft | Udara | Track tidak memiliki flight plan yang cocok |
| AN-09 | Flight Route Deviation | Udara | Track menyimpang dari flight plan/corridor |
| AN-10 | Cluster Activity | Multi-domain | Lonjakan multi-entitas pada area dan window pendek |

## 3. Fitur Utama dan Traceability

| ID | Fitur | Perilaku dan Komponen |
|---|---|---|
| F-M5-01 | Automated Anomaly Detection | Continuous rules dan analysis pipeline untuk sepuluh anomaly types |
| F-M5-02 | Configurable Thresholds | Admin mengubah threshold terversi; perubahan membutuhkan reason dan audit |
| F-M5-03 | Anomaly Dashboard | Tabs domain, filter jenis/severity/status/periode, list aktif, KPI harian |
| F-M5-04 | Anomaly Detail Card | ID, status, lokasi/waktu, entity, evidence, confidence, explainable factors, action |
| F-M5-05 | False Positive Management | Mark false positive dengan category/reason/evidence dan rule feedback |
| F-M5-06 | Anomaly Correlation | Timeline/graf hubungan entity, location, time, dan correlation confidence |

### Komponen Visual

| Komponen | Tipe | Data | Update |
|---|---|---|---|
| Active anomaly list | Daftar prioritas | Type, location, time, severity, state | Real-time |
| Detail & evidence | Panel investigation | Primary facts dan supporting sources | Event-driven |
| Anomaly map | Peta tactical | Observed track, predicted gap, location | Real-time |
| Explainable factors | Ranked bars | Factor contribution dan confidence | On-demand |
| Recommended actions | Checklist/action panel | Verification steps, not command execution | On-demand |
| Threshold config | Slider/form panel | Active version dan business units | Manual |
| Correlation timeline | Timeline/graf | Related anomalies/entities | Event-driven |

## 4. Navigasi & Interaksi

| Dari | Aksi | Menuju | Context |
|---|---|---|---|
| Anomaly list | Pilih row | Detail anomaly | Anomaly ID |
| Entity | Klik | Vessel/Aircraft/Border detail | Entity ID, event time |
| Map | Klik track/location | NMP/domain map | Area, layers, timestamp |
| `Investigasi` | Assign/start | Investigation state | Analyst, due time |
| `Tandai Ditinjau` | Klik | State update | Review reason |
| `False Positive` | Klik | Review modal | Category, reason, evidence |
| `Buat Laporan` | Klik | Reporting | Anomaly, evidence, map snapshot |
| `Eskalasi` | Klik | Early Warning | Validated anomaly context |

## 5. Alur Bisnis

### 5.1 Detection-to-Review

```text
Validated input → deterministic rule/analysis → candidate
 → evidence bundle + confidence → validation
    ├─ invalid/noisy → rejected/quality event
    └─ valid → anomaly BARU → analyst assignment
```

### 5.2 Correlation dan Eskalasi

```text
Anomaly ditinjau → correlation menemukan related events
 → analyst melihat timeline dan entities
    ├─ bukti cukup → Supervisor validate → Early Warning
    └─ tidak cukup → tetap investigation/monitoring
```

### 5.3 Edge Case — False Positive

1. Analis memilih false positive dan wajib mengisi category serta explanation.
2. Supervisor mereview untuk anomaly tinggi/kritis.
3. State berubah tanpa menghapus original detection/evidence.
4. Feedback masuk evaluasi threshold/model; perubahan rule tetap membutuhkan approval Administrator.

## 6. Data yang Dikelola

| Entity | Field Utama | Contoh |
|---|---|---|
| Anomaly | ID, type, domain, severity, state, time, location, entities | ANM-2024-0613-0001, AN-01 |
| Evidence | Source, observation time, content reference, quality | AIS gap 24m37s, verified |
| Factor | Name, value, contribution, explanation | AIS discontinuity 0.91 |
| Threshold version | Rule, unit, value, effective period, approver | AIS off 360 minutes |
| Investigation | Assignee, notes, state history, outcome | Dalam investigasi |
| Correlation | Related IDs, relation type, confidence | Same entity, likely related |
| False-positive feedback | Category, reason, reviewer, disposition | Scheduled maintenance |

## 7. Kebutuhan Data Eksternal

Input berasal dari Data Integration: AIS, ADS-B, border, registry, geofence, flight plan, OSINT, dan internal intelligence. Modul tidak boleh membaca feed mentah tanpa quality/provenance flag.

## 8. Stack Agent Modul

| Agent | Peran | Trigger | Output |
|---|---|---|---|
| Analysis Agent | Menilai pattern dan correlation setelah input terstruktur | Event / batch | Candidate, factors, relation candidates |
| Validation/Guardrail Agent | Memvalidasi candidate dan output explainability | Post-process | Verified/rejected/needs-review |
| Orchestrator Agent | Mengkoordinasikan multi-domain correlation dan escalation branch | System-level | Routing/execution state |
| Workflow/State Agent | Menjaga review/investigation/false-positive lifecycle | Event-driven | State history |
| Learning/Improvement Agent | Mengevaluasi feedback secara periodik dan mengusulkan tuning | Offline / periodic | Evaluation report/proposal; tidak auto-apply |

Pipeline: Data Collection → Data Processing → Analysis → Validation → state/review; anomaly kritis yang sudah divalidasi dapat masuk Orchestrator → Early Warning/Notification.

## 9. Alert dan State

Severity: `RENDAH`, `SEDANG`, `TINGGI`, `KRITIS`. State: `BARU`, `DITINJAU`, `DALAM_INVESTIGASI`, `TERVALIDASI`, `FALSE_POSITIVE`, `SELESAI`. Transisi tidak boleh melompati audit reason.

## 10. Standar Layanan dan Use Case

Engine berjalan 24/7; candidate muncul cepat setelah data masuk; detail selalu menyertakan freshness dan provenance; failure satu rule tidak menghentikan rule lain.

**Happy path:** dark vessel candidate dibentuk, evidence dan factors tervalidasi, analis menghubungkan route deviation, lalu Supervisor mengeskalasi.  
**Edge case:** missing AIS karena source outage; validation menolak candidate massal dan mengirim source-health event, bukan alert kapal individual.

## 11. Acceptance dan Referensi

- Kesepuluh AN-01–AN-10 dapat diuji dengan fixture positif dan negatif.
- Seluruh F-M5-01–F-M5-06 tersedia.
- Akurasi pengujian memenuhi FRD dan false-positive history tetap dapat diaudit.
- Referensi: FRD Section 3.5; mockup lokal; domain rules dari modul sumber.

---

*Modul 05 | Versi 1.0.0*
