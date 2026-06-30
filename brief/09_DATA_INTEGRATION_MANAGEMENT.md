# Modul Data Integration & Management

## 1. Gambaran Umum

Data Integration & Management adalah fondasi lintas-modul untuk ingest AIS, ADS-B, border, registry, OSINT, dan intel internal; validasi, normalisasi, deduplikasi, enrichment, provenance, fixture/live switching, source health, manual input, pengguna, role, threshold, classification, dan audit. Modul ini mengisi menu `Data Management` dan `Administration` yang terlihat konsisten pada delapan mockup.

### Tujuan dan Pengguna

| Tujuan | Outcome |
|---|---|
| Data konsisten | Semua domain menggunakan waktu, lokasi, provenance, dan quality vocabulary yang sama |
| Build tidak terblokir provider | Fixture realistis dan live adapter memakai kontrak identik |
| Health transparan | Status source, freshness, retry, dan last success terlihat |
| Administrasi terkendali | User, role, threshold, classification, dan audit dikelola sesuai kewenangan |

Pengguna: Administrator; Analis untuk manual intelligence input; Supervisor untuk review data/threshold; Auditor read-only.

## 2. Fitur Utama dan Traceability

| ID | Fitur | Perilaku |
|---|---|---|
| F-DI-01 | AIS Data Ingestion | Continuous position events, validation, dedupe, track history, source health |
| F-DI-02 | ADS-B Data Ingestion | Continuous flight events, validation, track history, flight-plan linking |
| F-DI-03 | API Connector Framework | Provider contract `fixture/live`, authentication/config isolation, retry, provenance |
| F-DI-04 | Data Validation Engine | Required fields, WGS84/range, timestamp, duplicate, conflict, quality flag |
| F-DI-05 | Data Enrichment | MMSI/IMO registry, aircraft registry, port/airport/area, entity linking |
| F-DI-06 | Manual Data Entry | Laporan lapangan/file input dengan classification, source, evidence, review |
| F-DI-07 | Data Source Health Monitor | ONLINE/DEGRADED/OFFLINE/STALE, last success, freshness, retry, affected modules |

### Komponen Tambahan

- User dan role management untuk lima role canonical.
- MFA production policy dan session control.
- Threshold/version management untuk anomaly, risk, alert, dan threat.
- Classification/clearance dan recipient directory.
- Immutable audit explorer.
- Fixture catalog dengan label `SYNTHETIC` dan scenario reset.

## 3. Navigasi & Interaksi

| Dari | Aksi | Menuju | Context |
|---|---|---|---|
| Data Management | Pilih source | Source detail | Source ID, mode, status |
| Source detail | Test/refresh | Health event | Connector version and result |
| Manual input | Submit | Review queue | Classification, evidence, provenance |
| Conflict queue | Resolve | Entity/version history | Conflicting records |
| Administration | Pilih user/role | Access editor | User/role/audit |
| Threshold | Edit/propose | Approval flow | Rule version and reason |
| Audit explorer | Open event | Read-only detail | Actor, action, before/after, time |

Semua modul dapat membuka Source Health dengan context sumber yang memengaruhi tampilan saat itu.

## 4. Alur Bisnis

### 4.1 Ingest Normal

```text
Provider fixture/live → Data Collection → raw record + provenance
 → Data Processing validation/normalize/dedupe/enrich
    ├─ valid → canonical domain event
    └─ invalid/conflict → quarantine/review + health metric
```

### 4.2 Manual Intelligence

1. Analis mengisi source, observation time, area/entity, summary, classification, dan attachment.
2. Sistem memvalidasi format dan clearance.
3. Supervisor mereview data berisiko tinggi/classified.
4. Record approved menjadi input terstruktur; original submission tetap diaudit.

### 4.3 Edge Case — Provider Outage

```text
Monitor mendeteksi failure/freshness breach
 → state DEGRADED/OFFLINE/STALE + affected modules
 → autonomous retry/backoff
    ├─ pulih → reconcile gap + ONLINE event
    └─ tetap gagal → notifier ke recipient internal + snapshot fallback
```

## 5. Data yang Dikelola

| Entity | Field Utama | Contoh |
|---|---|---|
| Data source | Type, provider, mode, status, freshness, last success | AIS National, fixture, ONLINE |
| Canonical observation | Domain, entity, event time, ingest time, coordinate, source, quality | vessel position, WGS84 |
| Conflict/quarantine | Reason, records, disposition, reviewer | MMSI/IMO mismatch |
| Manual intelligence | Source, area/entity, summary, classification, evidence, review | Laporan lapangan Natuna |
| User/role | Username, role, clearance, active, MFA policy | Analis, RAHASIA |
| Threshold version | Rule, business unit, value, reason, approver, effective period | Loitering 3 jam |
| Audit event | Actor, action, target, before/after reference, time | role changed |

## 6. Kebutuhan Data Eksternal

| Provider Class | Output Minimum |
|---|---|
| AIS | MMSI, time, coordinate, speed, course, navigation status |
| ADS-B | Aircraft ID/callsign, time, coordinate, altitude, speed, heading |
| Border/Immigration | Crossing ID, time, post/route, person/goods aggregate, status |
| Registry | Entity identifiers, owner/operator, flag/country, validity period |
| OSINT | Source URL/reference, publish time, entity/topic, content/evidence reference |
| Mapbox | Satellite Streets v12 basemap and geospatial rendering |

Live access remains deployment-gated. Fixture mode must exercise success, stale, invalid, duplicate, conflict, and outage scenarios.

## 7. Stack Agent Modul

| Agent | Peran | Trigger | Output |
|---|---|---|---|
| Data Collection Agent | Mengambil data melalui tool provider | Scheduler + on-demand | Raw records with provenance |
| Data Processing Agent | Validate, normalize, deduplicate, enrich | Event (post-collection) | Canonical observations/quality events |
| Tool Integration Agent | Menyediakan adapter/tool reusable untuk provider | On-demand | Tool result |
| Monitoring Agent | Mengawasi source, queue, stall, retry | Continuous | Health and escalation event |
| Validation/Guardrail Agent | Memeriksa manual/classified input dan critical conflicts | Pre/Post process | Approved/quarantined record |

## 8. Akses dan Keamanan

- Development/demo memiliki lima akun fixed dan MFA bypass; production tidak menyertakan fixed-password login sebagai bypass MFA.
- Password selalu ter-hash; credential provider tidak muncul pada UI, fixture, report, agent trace, atau audit payload.
- Auditor read-only; Analis tidak dapat mengubah user/threshold; Supervisor tidak dapat mengubah system-level access; Administrator tidak dapat menghapus audit.

## 9. Standar Layanan dan Use Case

Ingestion berjalan 24/7, health real-time, manual input cepat, dan provider failure terisolasi. Data historis tersedia sesuai retensi FRD. Status stale diturunkan sampai UI konsumen.

**Happy path:** fixture AIS masuk, dinormalisasi, diperkaya registry, dan tampil di NMP/Vessel dengan provenance.  
**Edge case:** live ADS-B gagal; monitor menandai offline, retry berjalan, consumers memakai snapshot, dan tidak membuat mass anomaly.

## 10. Acceptance dan Referensi

- F-DI-01–F-DI-07 tersedia.
- Fixture/live memiliki output canonical yang sama.
- Health, provenance, conflict, classification, dan audit dapat ditelusuri end-to-end.
- Referensi: FRD Section 4; ITU-R M.1371; ICAO Annex 10; standard geospatial BIG; delapan mockup shell.

---

*Modul 09 | Versi 1.0.0*
