# Modul Threat Assessment

**Mockup utama:** [`threat_assessment_center.png`](../design/threat_assessment_center.png)

## 1. Gambaran Umum

Threat Assessment mengubah alert, insiden, entity risk, vulnerability, dan tren menjadi penilaian ancaman nasional yang dapat ditelusuri. Layar menampilkan threat level per domain, indeks nasional, risk map, trend, top area, vulnerability map, period comparison, driver, risky entities, predictive outlook, model confidence, dan simulation/digital twin.

### Tujuan dan Pengguna

| Tujuan | Outcome |
|---|---|
| Mengukur ancaman | Skor nasional/domain/area menggunakan faktor dan versi model jelas |
| Memahami perubahan | Trend dan perbandingan periode menampilkan driver naik/turun |
| Menilai kerentanan | Infrastruktur, port, airspace, dan border vulnerability terlihat spasial |
| Mendukung keputusan | Pimpinan dapat menilai skenario tanpa menyamakan prediksi dengan fakta |

Pengguna: Pimpinan dan Supervisor sebagai decision users; Analis menyiapkan assessment; Administrator mengelola approved parameters; Auditor read-only.

## 2. Fitur Utama dan Traceability

| ID | Fitur | Perilaku dan Komponen |
|---|---|---|
| F-M7-01 | National Threat Level Dashboard | Threat level maritim/border/udara, national index, trend direction, confidence |
| F-M7-02 | Area Risk Scoring | Top area, score 0–100, change, dominant drivers, data completeness |
| F-M7-03 | Trend Analysis | 7/30/90-day trend, domain/national comparison, narrative insight |
| F-M7-04 | Vulnerability Mapping | Infrastruktur kritis, pelabuhan, shipping lane, border, airport, sensitive area |
| F-M7-05 | Comparative Analysis | Current vs prior period dan daftar significant increase/decrease |
| F-M7-06 | Predictive Threat Model | 7–30 day projection dengan probability, range, confidence, model version |
| F-M7-07 | Entity Threat Profile | Vessel, aircraft, individual/network profile dan linked evidence/incidents |

### Komponen Visual

| Komponen | Tipe | Data | Update |
|---|---|---|---|
| Domain threat cards | Indikator status | Score, level, trend, confidence | Real-time/per jam |
| Risk/vulnerability maps | Peta tactical | Area score, hotspots, infrastructure | Per jam |
| Trend/comparison | Grafik/tabel | 7/30/90 days dan change drivers | Per jam |
| Threat drivers/entities | Ranked list | Factor/entity score dan trend | Per jam |
| Predictive outlook | Forecast table | Probability/range/confidence | Scheduled/on-demand |
| Scenario simulation | Interactive scenario | Input assumptions dan projected outputs | On-demand |

## 3. Navigasi & Interaksi

| Dari | Aksi | Menuju | Context |
|---|---|---|---|
| Domain card | Klik | Domain-filtered assessment | Domain dan period |
| Risk area | Klik | NMP/Border/Aircraft context | Area, layer, incidents |
| Entity row | Klik | Vessel/Aircraft/entity profile | Entity ID |
| Trend point | Klik | Incident/anomaly list | Period dan domain |
| Driver row | Klik | Evidence drawer | Factor and source bundle |
| `Jalankan Simulasi` | Klik | Simulation result | Scenario assumptions/version |
| `Export Laporan` | Klik | Intelligence Reporting | Assessment snapshot/classification |

## 4. Alur Bisnis

### 4.1 Weekly Strategic Assessment

```text
Validated incidents + vulnerability baseline → deterministic aggregation
 → threat analyst review → validation
 → Supervisor approves assessment → Pimpinan reads/requests brief
```

### 4.2 Simulation

1. Pengguna memilih pola scenario dan area.
2. Sistem menampilkan assumptions, data window, dan model version.
3. Simulation menghasilkan probability, impacted area, chokepoint, projected strength, dan recommendation.
4. Hasil diberi label `SIMULASI`, tidak mengubah live threat score, dan dapat dilampirkan ke laporan.

### 4.3 Edge Case — Data Domain Tidak Lengkap

```text
Satu domain STALE/OFFLINE → completeness turun
 → score tetap dihitung hanya bila minimum evidence terpenuhi
    ├─ terpenuhi → score + confidence warning
    └─ tidak terpenuhi → "tidak cukup data", bukan angka nol
```

## 5. Data yang Dikelola

| Entity | Field Utama | Contoh |
|---|---|---|
| Threat assessment | Scope, period, score, level, confidence, version, approver | Nasional, 66/100 |
| Area risk | Area, score, trend, drivers, incidents | Selat Malaka, 86, +12 |
| Vulnerability | Asset/area, category, exposure, mitigation | Chokepoint, tinggi |
| Forecast | Horizon, probability, range, confidence | 7 hari, 75%, 70–85% |
| Scenario | Assumptions, outputs, model version, author | Illegal fishing Natuna |
| Entity threat profile | Entity, risk history, links, current level | Vessel fishing, tinggi |

## 6. Kebutuhan Data

Modul memakai validated anomaly, incident, alert, vessel/aircraft risk, border activity, vulnerability reference, historical baseline, serta internal intelligence. Tidak menarik feed mentah langsung.

## 7. Stack Agent Modul

| Agent | Peran | Trigger | Output |
|---|---|---|---|
| Analysis Agent | Menyusun drivers, trend, dan cross-domain insight dari data structured | Event / batch | Assessment draft |
| Simulation/What-if Agent | Menjalankan scenario berdasarkan model dan assumptions yang terlihat | On-demand | Scenario result |
| Validation/Guardrail Agent | Memeriksa assessment/simulation sebelum Pimpinan | Post-process | Verified/flagged result |
| Reporting Agent | Menyajikan assessment ke dashboard dan report | Manual / scheduled | Human-readable assessment |
| Orchestrator Agent | Mengkoordinasikan cross-domain assessment branch | System-level | Execution state |

Skor live tetap deterministik; agent menghasilkan insight terstruktur dan tidak mengubah historical facts.

## 8. Severity

Skor ditampilkan bersama level `RENDAH`, `SEDANG`, `TINGGI`, `SANGAT TINGGI`, confidence, completeness, dan change. Threshold version dapat dilihat; perubahan membutuhkan approval serta audit.

## 9. Standar Layanan dan Use Case

Dashboard dan maps terasa cepat, assessment diperbarui otomatis, simulation boleh memerlukan waktu sedang, dan fungsi strategis tersedia 24/7. Semua angka dapat ditelusuri ke driver/evidence.

**Happy path:** Pimpinan melihat Maritime HIGH, membuka Selat Malaka, memeriksa driver dan entities, lalu meminta assessment report.  
**Edge case:** border source stale; score menunjukkan confidence rendah atau `insufficient data`, tidak menganggap border aman.

## 10. Acceptance dan Referensi

- F-M7-01–F-M7-07 tersedia.
- 7/30/90-day views, comparison, prediction 7–30 hari, dan area/entity drill-down bekerja.
- Simulation terpisah jelas dari live operational state.
- Referensi: FRD Section 3.7; mockup lokal; assessment policy/model card yang disahkan klien.

---

*Modul 07 | Versi 1.0.0*
