# MBIS frontend fixture provenance

All operational records in this folder are static synthetic data for a frontend simulation. They are designed to be operationally credible, but they do **not** describe current real-world military, border, vessel, aircraft, or incident activity. No live feed, provider credential, personal data, or restricted registry is embedded.

## Public references reviewed before generation

- International Maritime Organization — AIS identity, position, course, speed, and navigational-status field model: https://www.imo.org/en/ourwork/safety/pages/ais.aspx
- Global Fishing Watch — vessel identity, registry reconciliation, vessel classification, and AIS identity-spoofing context: https://globalfishingwatch.org/datasets-and-code-vessel-identity/
- Global Fishing Watch — hourly AIS vessel-presence concept: https://globalfishingwatch.org/platform-update/global-ais-vessel-presence-dataset/
- OpenSky Network — 24-hour aircraft state vectors including position, velocity, heading, vertical rate, callsign, and altitude: https://opensky-network.org/data/scientific
- BMKG Maritime — Indonesian maritime-area names and official wave, wind, visibility, current, and weather parameter vocabulary: https://maritim.bmkg.go.id/public_api/perairan
- Directorate General of Sea Transportation — official Inaportnet port-name list used as the basis for the port fixture: https://hubla.dephub.go.id/uppogoamas/page/news/read/11479/menyusuli-77-pelabuhan-kemenhub-targetkan-implementasi-inaportnet-di-25-pelabuhan-di-tahun-2022
- Directorate General of Sea Transportation — Traffic Separation Scheme context for Sunda and Lombok Straits: https://hubla.dephub.go.id/storage/portal/documents/post/7653/traffic_separation_scheme_tss.pdf
- United Nations Division for Ocean Affairs and the Law of the Sea — Indonesian archipelagic sea-lane designations for ALKI I, II, and III: https://digitallibrary.un.org/record/3889991/files/bulletin52e.pdf
- Badan Informasi Geospasial — Peta NKRI maritime jurisdiction coverage, including territorial sea, archipelagic waters, ZEE, and continental shelf: https://www.big.go.id/content/siaran-pers/rilis-peta-nkri-edisi-tahun-2025-mempertegas-batas-identitas-dan-masa-depan-indonesia
- BIG IGT catalogue — Indonesian nautical-chart feature categories including maritime boundaries and prohibited/restricted areas: https://simpatig.big.go.id/peta/detail/198
- ReCAAP Information Sharing Centre — maritime incident categorisation and reporting patterns in the Straits of Malacca and Singapore: https://www.recaap.org/resources/ck/files/reports/quarterly/Q1%202025%20report%28final%29.pdf
- BNPP — official PLBN names and integrated border-service context: https://bnpp.go.id/plbn
- BNPP — PLBN Sei Nyamuk identification survey of unofficial crossing routes on Sebatik Island: https://bnpp.go.id/berita/plbn-sei-nyamuk-laksanakan-giat-identifikasi-jalur-tidak-resmi-di-pulau-sebatik
- BNPP — Sebatik community awareness context for narcotics and illegal-goods smuggling risk: https://bnpp.go.id/berita/sosialisasi-bahaya-narkoba-dan-penyelundupan-di-perbatasan-plbn-sei-nyamuk-tingkatkan-kesadaran-warga-sebatik
- Bea Cukai Sintete — joint patrol and inspection pattern on the right-side border inspection route at PLBN Aruk: https://sintete.beacukai.go.id/berita/operasi-gabungan-pengawasan-batas-negara-di-jalur-inspeksi-patroli-perbatasan-sektor-kanan-plbn-aruk
- Bea Cukai Sintete — intelligence mapping and interdiction context from Aruk to Sambas/Galing: https://sintete.beacukai.go.id/berita/bea-cukai-sintete-dan-bnnp-kalbar-gagalkan-penyelundupan-10-kilogram-sabu-di-perbatasan-darat-malaysia
- Imigrasi Putussibau — joint monitoring of unofficial Badau routes toward Pos Tiga and Pos Mentari: https://putussibau.imigrasi.go.id/berita-utama/operasi-gabungan-pengawasan-orang-asing-di-perbatasan-desa-badau-berjalan-lancar-tanpa-temuan-pelanggaran
- Direktorat Jenderal Imigrasi — non-procedural migrant movement through an unofficial route in Seriang, Badau: https://www.imigrasi.go.id/berita/2021/09/27/imigrasi-putussibau-amankan-pemulangan-41-tki-ilegal-ke-sambas
- Polri Tribrata — K9 patrol and inspection model for unofficial routes around Aruk and Jagoi Babang: https://tribratanews.polri.go.id/blog/nasional-3/polda-kalbar-patroli-gunakan-anjing-pelacak-di-perbatasan-21225
- BNPP — completed/new PLBN locations including Sei Nyamuk, Jagoi Babang, Napan, Yetetkun, Long Midang, Long Nawang, Labang, Sota, and Sei Kelik: https://bnpp.go.id/berita/plbn-yang-selesai-secara-fisik-mana-saja
- BNPP — official Motamasin location and Indonesia–Timor-Leste border context: https://bnpp.go.id/plbn/plbn-motamasin
- BNPP — TIMPORA Sebatik monitoring anchors around PB 02 Aji Kuning, Desa Seberang, and Desa Pancang: https://bnpp.go.id/berita/plbn-sei-nyamuk-perkuat-sinergi-timpora-dalam-operasi-gabungan-pengawasan-orang-asing-di-sebatik
- Imigrasi Atambua — operational crossing context for Motaain, Wini, and Motamasin: https://atambua.imigrasi.go.id/berita-utama/perlintasan-di-plbn-motaain-wini-dan-motamasin-selama-libur-isra-mi-raj-dan-imlek-berjalan-lancar
- Bea Cukai Entikong — mapped joint-patrol route from Segumon toward Gunabanir: https://bengkulu.beacukai.go.id/berita/amankan-perbatasan-bea-cukai-entikong-lakukan-patroli-gabungan

## Generated NMP coverage

| Fixture | Contents |
| --- | ---: |
| `nmp-entities.json` | 360 vessels, 72 aircraft, 41,904 total 15-minute track points spanning 24 hours |
| `nmp-geography.json` | 36 ports, 12 choke points, 24 patrol zones, 18 watch/restricted/disputed areas, 24 sensors, 56 tactical routes (8 ALKI lanes, 39 commercial corridors, 8 risk corridors, 1 air-surveillance corridor) |
| `nmp-intelligence.json` | 140 maritime events, 64 anomalies, 40 early warnings, 36 threat assessments, 60 intelligence reports, 240 alert timeline records |
| `nmp-replay.json` | 96 quarter-hour replay frames, maritime weather, and multi-source health |

The route, jurisdiction, zone, and facility geometries are simplified for tactical UI rendering and are not suitable for navigation, enforcement, or legal boundary determination.
