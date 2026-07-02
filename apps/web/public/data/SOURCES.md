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

## Vessel Intelligence references

- IMO — permanent ship identification number scheme and public GISIS lookup context: https://www.imo.org/en/ourwork/msas/pages/imo-identification-number-scheme.aspx
- IMO — AIS carriage, identity, and position-reporting purpose: https://www.imo.org/en/ourwork/safety/pages/ais.aspx
- Global Fishing Watch — public vessel identity data and identity-spoofing caveats: https://globalfishingwatch.org/datasets-and-code-vessel-identity/
- Global Fishing Watch — AIS disabling methodology and distinction from reception gaps: https://globalfishingwatch.org/research-project-disabled-signals/
- Global Fishing Watch — port visits, AIS gap events, encounters, and risk API methodology: https://globalfishingwatch.org/our-apis/documentation
- Global Fishing Watch — IUU risk indicators including disabling, unexplained gaps, and identity overlap: https://globalfishingwatch.org/platform-update/iuu-fishing-risk-insights-dataset-release/
- PELNI — official passenger/cargo fleet inventory and build-year reference: https://ppid.pelni.co.id/wp-content/uploads/2022/09/Armada-Kapal-PELNI.pdf
- PELNI — official 3-in-1 vessel role and Dobonsolo/Ciremai route context: https://www.pelni.co.id/ship-3-in-1
- Samudera Indonesia Ship Management — official fleet names across container, tanker, bulk, OSV, and gas-carrier categories: https://www.samudera.id/sisman/id/1/daftararmada
- PT TEMAS — operational fleet scale and Indonesian container-network context: https://temas.id/en
- KKP — Arafura transshipment enforcement and vessel-risk context: https://kkp.go.id/news/news-detail/kkp-bekukan-izin-11-kapal-terduga-transhipment-di-arafura-mqMp.html
- KKP DIVA-TUNA — Indonesian authorized tuna-vessel registry context: https://integrasi.djpt.kkp.go.id/tunavessel/
- VesselFinder public particulars used for selected anchor profiles: https://www.vesselfinder.com/vessels/details/9811000, https://www.vesselfinder.com/vessels/details/9455791, https://www.vesselfinder.com/vessels/details/9106651, https://www.vesselfinder.com/vessels/details/9827968, https://www.vesselfinder.com/vessels/details/9827956, https://www.vesselfinder.com/vessels/details/9139684, https://www.vesselfinder.com/vessels/details/9032147, https://www.vesselfinder.com/vessels/details/9226487, https://www.vesselfinder.com/vessels/details/9124548, https://www.vesselfinder.com/vessels/details/9269609

`mbis-vessel-intelligence.json` contains 10 public-reference anchor profiles and 42 clearly marked `synthetic-enriched` profiles. Synthetic operational histories, risk scores, AIS gaps, incidents, and positions are demonstration fixtures and must not be interpreted as current registry, navigational, enforcement, or sanctions findings.

### Vessel profile imagery

- Vessel photos are sourced from Wikimedia Commons file pages discovered through web search and the Commons Media API. The fixture stores the resulting `upload.wikimedia.org` thumbnail URL in each vessel profile.
- `EVER GIVEN` and `KM DOROLONDA` use photographs of the named vessel (`imageMatch: exact`).
- Other profiles use a researched photograph matching the vessel class—container ship, crude/product tanker, passenger ship, bulk carrier, general cargo, fishing vessel, or LPG tanker—and are explicitly marked `imageMatch: representative-type`. This avoids falsely presenting a different photographed hull as the named synthetic vessel.
- Source discovery references: [Ever Given category](https://commons.wikimedia.org/wiki/Category:Ever_Given_(ship,_2018)), [Ever Given cropped photograph](https://commons.wikimedia.org/wiki/File:EVER_GIVEN_(49643352087)_(cropped).jpg), [PELNI KM Dorolonda at Bitung](https://commons.wikimedia.org/wiki/File:Pelni_KM_Dorolonda_PortBitung.jpg), and [Wikimedia Commons API](https://commons.wikimedia.org/w/api.php).
- Licensing and photographer attribution remain available on each corresponding Commons file page; the remote thumbnail filename maps directly to that page.
