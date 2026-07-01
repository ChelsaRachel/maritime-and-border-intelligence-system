import { DataState } from '@/components/common/DataState'
import { BorderActivityFeed } from '@/features/mbis/components/BorderActivityFeed'
import { BorderKpiStrip } from '@/features/mbis/components/BorderKpiStrip'
import { MetricCard } from '@/components/common/MetricCard'
import { Panel } from '@/components/common/Panel'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { TacticalMap } from '@/features/tactical/components/TacticalMap'
import { useAuthStore } from '@/stores/useAuthStore'
import { useMbisStore } from '@/stores/useMbisStore'
import { type CSSProperties, useMemo, useState } from 'react'

export type TWorkspaceModule = 'border' | 'vessel' | 'aircraft' | 'anomaly' | 'warning' | 'threat' | 'reporting' | 'data' | 'administration'


function RowList({ rows, kind = 'default' }: { rows: any[]; kind?: string }) {
  return <div className={`row-list row-list--${kind}`}>{rows.map((row, index) => <article key={row.id ?? row.name ?? row.title ?? index}><span className="row-index">{String(index + 1).padStart(2, '0')}</span><div><strong>{row.title ?? row.name ?? row.label ?? row.callSign}</strong><small>{row.location ?? row.region ?? row.detail ?? row.type ?? row.country ?? row.source}</small></div>{row.time && <time>{row.time}</time>}{row.value !== undefined && <b>{row.value}</b>}{(row.severity || row.risk || row.status) && <SeverityBadge value={row.severity ?? row.risk ?? row.status} compact />}</article>)}</div>
}

function DataTable({ columns, rows }: { columns: { key: string; label: string }[]; rows: any[] }) {
  return <div className="data-table-wrap"><table className="data-table"><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id ?? `${index}-${row[columns[0].key]}`}>{columns.map((column) => <td key={column.key}>{column.key === 'severity' || column.key === 'status' || column.key === 'classification' ? <SeverityBadge value={String(row[column.key])} compact /> : String(row[column.key] ?? '—')}</td>)}</tr>)}</tbody></table></div>
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  return <div className="score-ring" style={{ '--score': score } as CSSProperties}><div><strong>{score}</strong><span>/100</span></div><small>{label}</small></div>
}

export function OperationsWorkspace({ module }: { module: TWorkspaceModule }) {
  const { border, entities, operations, overview, loading, error } = useMbisStore()
  const user = useAuthStore((state) => state.user)
  const [selectedAnomalyId, setSelectedAnomalyId] = useState('ANM-2026-0629-001')
  const [thresholds, setThresholds] = useState({ ais: 15, loitering: 3, route: 15, zone: 1, cluster: 10 })
  const ready = Boolean(border && entities && operations && overview)
  const anomaly = entities?.anomalies.find((item: any) => item.id === selectedAnomalyId) ?? entities?.anomalies[0]

  const borderPoints = useMemo(() => border ? [...border.posts.map((item: any) => ({ ...item, severity: item.risk })), ...border.vulnerablePoints.map((item: any) => ({ ...item, severity: item.severity }))] : [], [border])
  const threatPoints = useMemo(() => operations ? operations.threat.regions.map((item: any, index: number) => ({ id: `THR-${index}`, name: item.name, coordinates: item.coordinates, severity: item.score >= 75 ? 'CRITICAL' : item.score >= 60 ? 'HIGH' : 'MEDIUM', score: item.score })) : [], [operations])
  const aircraftPoints = useMemo(() => overview ? overview.aircraft.map((item: any) => ({ ...item, name: item.callSign, severity: item.status })) : [], [overview])

  const renderBorder = () => (
    <div className="workspace-grid workspace-grid--border">
      <Panel title="Land Border Situation Map" eyebrow="National perimeter" className="span-8 map-panel"><TacticalMap id="border" points={borderPoints} routes={border!.routes} center={[124.6, -3.2]} zoom={2.7} /></Panel>
      <Panel title="Aktivitas Real-time" eyebrow="Perlintasan & insiden terkini" className="span-4 activity-panel"><BorderActivityFeed items={border!.activityFeed} /></Panel>
      <BorderKpiStrip metrics={border!.metrics} />
      <Panel title="Border Incident Timeline" eyebrow="Last 7 days" className="span-7"><div className="timeline-bars">{border!.timeline.map((item: any) => <div key={item.date}><span>{item.date}</span><i style={{ height: `${Math.min(150, 36 + item.high * 18 + item.medium * 6 + item.low * 2)}px` }} /><b>{item.low + item.medium + item.high}</b></div>)}</div></Panel>
      <Panel title="Top Aktivitas Perbatasan" eyebrow="Last 5 minutes" className="span-5"><RowList rows={border!.posts.slice(0, 5).map((item: any) => ({ ...item, title: item.name, detail: `${item.people24h.toLocaleString('id-ID')} orang · ${item.goods24h} barang` }))} /></Panel>
      <Panel title="Immigration Integration Summary" eyebrow="Cross-agency fixture" className="span-8"><div className="mini-metrics">{Object.entries(border!.immigration).map(([label, value]) => <article key={label}><span>{label.replace(/([A-Z])/g, ' $1')}</span><strong>{Number(value).toLocaleString('id-ID')}</strong></article>)}</div></Panel>
      <Panel title="Geofence Warnings" eyebrow="Priority sectors" className="span-4"><RowList rows={border!.vulnerablePoints.slice(0, 4).map((item: any) => ({ ...item, title: item.name, detail: item.type }))} /></Panel>
    </div>
  )

  const renderVessel = () => {
    const vessel = entities!.vesselProfile
    return <div className="workspace-grid workspace-grid--vessel">
      <Panel title="Vessel Profile" eyebrow="Watchlisted entity" className="span-4"><div className="entity-profile"><div className="entity-silhouette"><i className="ph ph-boat" /></div><div><span className="mono-label">{vessel.mmsi} · {vessel.callSign}</span><h2>{vessel.name}</h2><p>{vessel.type} · {vessel.flag}</p><SeverityBadge value="ACTIVE WATCH" /></div></div><dl className="key-values"><div><dt>IMO</dt><dd>{vessel.imo}</dd></div><div><dt>Dimensions</dt><dd>{vessel.lengthM} × {vessel.beamM} m</dd></div><div><dt>Operator</dt><dd>{vessel.operator}</dd></div><div><dt>Last position</dt><dd>{vessel.lastPosition}</dd></div></dl></Panel>
      <Panel title="90-day Voyage Track" eyebrow="Port calls and risk segments" className="span-5 map-panel"><TacticalMap id="vessel" points={[{ id: vessel.id, name: vessel.name, coordinates: vessel.track[vessel.track.length - 1], severity: 'CRITICAL' }]} routes={[{ id: 'VSL-TRACK', name: `${vessel.name} 90d track`, coordinates: vessel.track, risk: 'HIGH' }]} center={[108.3, 1.7]} zoom={3.3} compact /></Panel>
      <Panel title="Deterministic Risk Score" eyebrow="Weighted factors" className="span-3 score-panel"><ScoreRing score={vessel.riskScore} label={vessel.riskLabel} /><small>Updated {vessel.lastSeen}</small></Panel>
      <Panel title="Risk Factors" eyebrow="Explainable evidence" className="span-4"><RowList rows={vessel.riskFactors.map((item: any) => ({ ...item, title: item.label, detail: item.evidence }))} /></Panel>
      <Panel title="Port History" eyebrow="Latest calls" className="span-8"><DataTable columns={[{key:'date',label:'UTC DATE'},{key:'port',label:'PORT'},{key:'country',label:'COUNTRY'},{key:'arrival',label:'ARRIVAL'},{key:'departure',label:'DEPARTURE'},{key:'duration',label:'DURATION'}]} rows={vessel.ports} /></Panel>
      <Panel title="AIS Gap Log" eyebrow="90-day reception analysis" className="span-5"><DataTable columns={[{key:'start',label:'START'},{key:'duration',label:'DURATION'},{key:'location',label:'LOCATION'},{key:'status',label:'ASSESSMENT'}]} rows={vessel.aisGaps} /></Panel>
      <Panel title="Ownership & Operator" eyebrow="Entity history" className="span-4"><RowList rows={vessel.ownership.map((item: any) => ({ ...item, name: item.owner, detail: `${item.period} · ${item.operator}` }))} /></Panel>
      <Panel title="Relationship Graph" eyebrow="Linked intelligence" className="span-3"><div className="relationship-core"><span>{vessel.name}</span>{vessel.relationships.map((item: any) => <article key={item.name}><i className="ph ph-git-branch" /><div><strong>{item.name}</strong><small>{item.relation}</small></div></article>)}</div></Panel>
      <Panel title="Evidence & Verification" eyebrow="Multi-source" className="span-12"><div className="evidence-grid">{vessel.evidence.map((item: any) => <article key={item.source}><i className="ph ph-seal-check" /><span>{item.source}</span><strong>{item.availability}</strong><SeverityBadge value={item.status} compact /></article>)}</div></Panel>
    </div>
  }

  const renderAircraft = () => {
    const aircraft = entities!.aircraftProfile
    return <div className="workspace-grid workspace-grid--aircraft">
      <Panel title="Aircraft Profile" eyebrow="Focused track" className="span-3"><div className="aircraft-card"><i className="ph ph-airplane-tilt" /><SeverityBadge value="DEVIATING" /><h2>{aircraft.callSign}</h2><span>{aircraft.registration} · {aircraft.type}</span><dl><div><dt>Altitude</dt><dd>{aircraft.altitudeFt.toLocaleString()} ft</dd></div><div><dt>Groundspeed</dt><dd>{aircraft.groundSpeedKt} kt</dd></div><div><dt>Heading</dt><dd>{aircraft.heading}°</dd></div><div><dt>Squawk</dt><dd>{aircraft.squawk}</dd></div></dl></div></Panel>
      <Panel title="Live Flight Tracking" eyebrow="Actual vs planned route" className="span-6 map-panel map-panel--tall"><TacticalMap id="aircraft" points={aircraftPoints} routes={[{ id:'AIR-ACTUAL', name:'Actual route', coordinates: aircraft.track, risk:'CRITICAL' }, { id:'AIR-PLANNED', name:'Flight-plan corridor', coordinates: aircraft.plannedTrack, risk:'NORMAL' }]} center={[115.7, -1.5]} zoom={3.2} /></Panel>
      <Panel title="Suspicion Analysis" eyebrow="Evidence confidence" className="span-3 score-panel"><ScoreRing score={aircraft.confidence} label="HIGH CONFIDENCE" /><ul className="reason-list">{aircraft.suspicionReasons.map((reason: string) => <li key={reason}>{reason}</li>)}</ul></Panel>
      <Panel title="Alert & Route Deviations" eyebrow="Active detections" className="span-4"><RowList rows={aircraft.alerts.map((item: any) => ({ ...item, title: item.callSign, detail: item.title }))} /></Panel>
      <Panel title="Unscheduled Flights" eyebrow="Correlation pending" className="span-4"><DataTable columns={[{key:'callSign',label:'CALL SIGN'},{key:'registration',label:'REG'},{key:'altitudeFt',label:'ALTITUDE'},{key:'status',label:'STATUS'}]} rows={aircraft.unscheduled} /></Panel>
      <Panel title="Air Border Crossing Log" eyebrow="FIR transitions" className="span-4"><DataTable columns={[{key:'time',label:'TIME'},{key:'callSign',label:'CALL SIGN'},{key:'from',label:'FROM'},{key:'to',label:'TO'},{key:'status',label:'STATUS'}]} rows={aircraft.borderCrossings} /></Panel>
      <Panel title="Flight Profile" eyebrow="Altitude and speed history" className="span-8"><div className="flight-chart">{aircraft.history.map((item: any) => <div key={item.time}><i style={{ height: `${Math.max(4, item.altitude / 500)}%` }} /><b style={{ height: `${Math.max(4, item.speed / 6)}%` }} /><span>{item.time}</span></div>)}</div></Panel>
      <Panel title="Data Source Health" eyebrow="Latest hour" className="span-4"><div className="source-health"><ScoreRing score={99} label="99.2% AVAILABLE" /><span>ADS-B National <b>GOOD</b></span><span>SIMUL / AIDC <b>GOOD</b></span><span>Data Exchange <b>GOOD</b></span></div></Panel>
    </div>
  }

  const renderAnomaly = () => <div className="workspace-grid workspace-grid--anomaly">
    <Panel title="Active Anomaly List" eyebrow={`${entities!.anomalies.length} rule types represented`} className="span-4"><div className="anomaly-list">{entities!.anomalies.map((item: any) => <button type="button" key={item.id} onClick={() => setSelectedAnomalyId(item.id)} className={item.id === anomaly.id ? 'is-selected' : ''}><i className="ph ph-warning-diamond" /><div><strong>{item.code} / {item.type}</strong><small>{item.location} · {item.detectedAt}</small></div><SeverityBadge value={item.severity} compact /></button>)}</div></Panel>
    <div className="span-6 anomaly-detail">
      <Panel title={`${anomaly.code} / ${anomaly.type}`} eyebrow={`Detail anomaly · ${anomaly.id}`}><div className="anomaly-hero"><div><SeverityBadge value={anomaly.severity} /><h2>{anomaly.summary}</h2><p>{anomaly.entity} · {anomaly.location}</p></div><ScoreRing score={anomaly.confidence} label="CONFIDENCE" /></div></Panel>
      <div className="workspace-grid nested-grid"><Panel title="Primary Information" className="span-5"><dl className="key-values"><div><dt>Domain</dt><dd>{anomaly.domain}</dd></div><div><dt>Status</dt><dd>{anomaly.status}</dd></div><div><dt>Detection</dt><dd>{anomaly.detectedAt}</dd></div><div><dt>Entity</dt><dd>{anomaly.entity}</dd></div></dl></Panel><Panel title="Anomaly Location" className="span-7 map-panel"><TacticalMap id="anomaly" points={[{ id: anomaly.id, name: anomaly.type, coordinates: anomaly.coordinates, severity: anomaly.severity }]} center={anomaly.coordinates} zoom={6.2} compact /></Panel></div>
      <div className="workspace-grid nested-grid"><Panel title="Supporting Evidence" className="span-5"><ul className="reason-list">{anomaly.evidence.map((item: string) => <li key={item}>{item}</li>)}</ul></Panel><Panel title="Explainable Model Factors" className="span-7"><div className="factor-list">{anomaly.modelFactors.map((value: number, index: number) => <label key={index}><span>Behavior factor {index + 1}</span><progress max="1" value={value} /><b>{value.toFixed(2)}</b></label>)}</div></Panel></div>
    </div>
    <Panel title="Detection Thresholds" eyebrow="Frontend simulation" className="span-2"><div className="threshold-list">{Object.entries(thresholds).map(([key, value]) => <label key={key}><span>{key.toUpperCase()} <b>{value}</b></span><input type="range" min="1" max="60" value={value} onChange={(event) => setThresholds((state) => ({ ...state, [key]: Number(event.target.value) }))} /></label>)}</div><button className="panel-button" type="button">Save local configuration</button></Panel>
    <Panel title="Anomaly Correlation" eyebrow="Shared entity / probable relation" className="span-12"><div className="correlation-line">{entities!.anomalies.slice(0, 6).map((item: any) => <article key={item.id} className={item.id === anomaly.id ? 'is-active' : ''}><i /><strong>{item.type}</strong><small>{item.code}</small></article>)}</div></Panel>
  </div>

  const renderWarning = () => <div className="workspace-grid workspace-grid--warning">
    <div className="metric-strip span-9">{(['critical','high','medium','low'] as const).map((severity) => <MetricCard key={severity} label={severity.toUpperCase()} value={operations!.alertDistribution[severity]} delta={severity === 'high' ? '+4' : severity === 'low' ? '+1' : '-3'} severity={severity.toUpperCase()} icon="siren" />)}</div>
    <Panel title="Real-time Notifications" eyebrow="Priority channel" className="span-3 row-span-2"><RowList rows={operations!.alerts.slice(0, 6).map((item: any) => ({ ...item, time: item.createdAt }))} /></Panel>
    <Panel title="Distribution by Domain" eyebrow={`${operations!.alertDistribution.total} active alerts`} className="span-3"><div className="domain-distribution">{operations!.alertDistribution.byDomain.map((item: any) => <label key={item.label}><span>{item.label}</span><progress max="60" value={item.value} /><b>{item.value}%</b></label>)}</div></Panel>
    <Panel title="7-day Alert Trend" eyebrow="Five-minute refresh simulation" className="span-6"><div className="trend-lines">{operations!.threat.trend.map((item: any) => <div key={item.date}><i style={{ height: `${item.maritime}%` }} /><b style={{ height: `${item.border}%` }} /><span>{item.date}</span></div>)}</div></Panel>
    <Panel title="Active Incidents" eyebrow="Operational queue" className="span-6"><RowList rows={operations!.alerts} /></Panel>
    <Panel title="Escalation & SLA Matrix" eyebrow="Autonomous policy preview" className="span-6"><DataTable columns={[{key:'severity',label:'CRITICALITY'},{key:'response',label:'RESPONSE SLA'},{key:'resolution',label:'RESOLUTION SLA'},{key:'compliance',label:'COMPLIANCE %'}]} rows={operations!.sla} /></Panel>
    <Panel title="Quick Actions" eyebrow={user?.readOnly ? 'Disabled for read-only role' : 'Browser-state simulation'} className="span-8"><div className="quick-actions">{[['check','Activate response'],['user-plus','Assign analyst'],['arrow-fat-up','Escalate'],['paper-plane-tilt','Send briefing'],['note-pencil','Add note']].map(([icon,label]) => <button key={label} type="button" disabled={user?.readOnly}><i className={`ph ph-${icon}`} /><span>{label}</span></button>)}</div></Panel>
    <Panel title="Briefing to Leadership" eyebrow="Local draft only" className="span-4"><div className="brief-form"><input defaultValue="Suspicious activity in North Natuna Sea" aria-label="Briefing title" /><textarea defaultValue="AIS-dark pattern requires verification against coastal radar and available imagery." aria-label="Briefing summary" /><button type="button" disabled={user?.readOnly}>Prepare briefing</button></div></Panel>
  </div>

  const renderThreat = () => <div className="workspace-grid workspace-grid--threat">
    <Panel title="National Threat Level" eyebrow="Domain risk index" className="span-4"><div className="domain-cards">{operations!.threat.domains.map((item: any) => <article key={item.name}><span>{item.name}</span><SeverityBadge value={item.level} /><strong>{item.score}<small>/100</small></strong><em>▲ {item.trend}</em></article>)}</div><div className="national-index"><span>NATIONAL INDEX</span><strong>{operations!.threat.nationalIndex}/100</strong><em>+{operations!.threat.change} weekly</em></div></Panel>
    <Panel title="Indonesia Regional Risk Map" eyebrow="Risk heat and monitored areas" className="span-5 map-panel"><TacticalMap id="threat" points={threatPoints} center={[117.3,-2.4]} zoom={3.0} /></Panel>
    <Panel title="National Threat Trend" eyebrow="7-day comparison" className="span-3"><div className="multi-series">{operations!.threat.trend.map((item: any) => <article key={item.date}><span>{item.date}</span><i style={{ width: `${item.maritime}%` }} /><b style={{ width: `${item.border}%` }} /><em style={{ width: `${item.air}%` }} /></article>)}</div></Panel>
    <Panel title="Regional Risk Score" eyebrow="Top 10" className="span-4"><DataTable columns={[{key:'name',label:'REGION'},{key:'score',label:'SCORE'},{key:'trend',label:'7D Δ'}]} rows={operations!.threat.regions} /></Panel>
    <Panel title="Threat Drivers" eyebrow="Weighted contribution" className="span-4"><div className="factor-list">{operations!.threat.drivers.map((item: any) => <label key={item.name}><span>{item.name}</span><progress max="100" value={item.score} /><b>{item.score}</b></label>)}</div></Panel>
    <Panel title="Predictive Model / 3–24h" eyebrow="Deterministic fixture forecast" className="span-4"><DataTable columns={[{key:'region',label:'REGION'},{key:'probability',label:'PROBABILITY %'},{key:'level',label:'LEVEL'},{key:'confidence',label:'CONFIDENCE'}]} rows={operations!.threat.forecast} /></Panel>
    <Panel title="Impact Change Summary" eyebrow="Significant movement" className="span-6"><RowList rows={operations!.threat.regions.slice(0, 6).map((item: any) => ({ name: item.name, detail: `Regional threat score ${item.score}`, value: `${item.trend > 0 ? '+' : ''}${item.trend}` }))} /></Panel>
    <Panel title="Scenario Simulation / Digital Twin" eyebrow="Local visual model" className="span-6"><div className="scenario-surface"><div className="scenario-pulse scenario-pulse--one"/><div className="scenario-pulse scenario-pulse--two"/><i className="ph ph-boat"/><i className="ph ph-airplane-tilt"/><section><span>Scenario</span><strong>Increase in illegal fishing — Natuna</strong><p>Projected hotspots: 3 · Patrol units recommended: 6 · Confidence: 72%</p><button type="button">Run local simulation</button></section></div></Panel>
  </div>

  const renderReporting = () => <div className="workspace-grid workspace-grid--reporting">
    <div className="metric-strip span-7">{Object.entries(operations!.reportMetrics).map(([label,value]) => <MetricCard key={label} label={label.replace(/([A-Z])/g,' $1').toUpperCase()} value={Number(value).toLocaleString('id-ID')} delta="+12.5%" icon="file-text" />)}</div>
    <Panel title="Daily Intelligence Summary" eyebrow="29 June 2026" className="span-5"><RowList rows={operations!.dailySummary.map((item: any) => ({ ...item, name: item.label }))} /></Panel>
    <Panel title="Auto Brief Generator" eyebrow="Deterministic frontend preview" className="span-3"><div className="brief-form"><label>Report type<select defaultValue="daily"><option value="daily">Daily Intelligence Brief</option><option value="weekly">Weekly Assessment</option></select></label><label>Coverage<select defaultValue="national"><option value="national">National</option><option value="natuna">Natuna Sector</option></select></label><label>Focus<input defaultValue="Maritime · Border · Air" /></label><button type="button" disabled={user?.readOnly}><i className="ph ph-sparkle" />Generate local brief</button></div></Panel>
    <Panel title="Custom Report Builder" eyebrow="Composition canvas" className="span-5"><div className="report-builder"><aside>{['Interactive map','Trend chart','Data table','Analytic summary','Timeline','Document attachment'].map((item) => <button type="button" key={item}><i className="ph ph-plus-square" />{item}</button>)}</aside><section><article><i className="ph ph-map-trifold"/><div><strong>Regional Situation Map</strong><small>Indonesian maritime monitoring areas</small></div></article><article><i className="ph ph-chart-line"/><div><strong>Activity Trend</strong><small>30-day multi-domain comparison</small></div></article><article><i className="ph ph-list-dashes"/><div><strong>Analytic Summary</strong><small>Assessment and recommendations</small></div></article></section></div></Panel>
    <Panel title="Distribution Settings" eyebrow="Classification and recipients" className="span-2"><div className="classification-block"><SeverityBadge value="TOP SECRET" /><span>Category</span><strong>Maritime Strategic</strong><span>Recipients</span><strong>4 authorized nodes</strong><span>Distribution</span><strong>Restricted</strong></div></Panel>
    <Panel title="Approval Flow" eyebrow="Current report" className="span-2"><div className="approval-flow">{operations!.approvalFlow.map((item: any) => <article key={item.step} className={`approval-flow--${item.status.toLowerCase()}`}><b>{item.step}</b><div><strong>{item.label}</strong><small>{item.owner}</small></div></article>)}</div></Panel>
    <Panel title="Report Archive" eyebrow={`${operations!.reports.length} recent products`} className="span-9"><DataTable columns={[{key:'title',label:'REPORT TITLE'},{key:'type',label:'TYPE'},{key:'classification',label:'CLASSIFICATION'},{key:'createdAt',label:'CREATED'},{key:'author',label:'AUTHOR'},{key:'status',label:'STATUS'}]} rows={operations!.reports} /></Panel>
    <Panel title="Quick Actions" eyebrow="Product workflow" className="span-3"><div className="quick-actions quick-actions--grid">{[['file-plus','New report'],['upload','Upload'],['sparkle','Auto report'],['file-pdf','Export PDF'],['paper-plane-tilt','Distribute']].map(([icon,label]) => <button key={label} type="button" disabled={user?.readOnly}><i className={`ph ph-${icon}`} /><span>{label}</span></button>)}</div></Panel>
  </div>

  const renderData = () => <div className="workspace-grid workspace-grid--data">
    <div className="metric-strip span-12"><MetricCard label="Connected Sources" value={operations!.sources.length} delta="8 online" icon="plugs-connected"/><MetricCard label="Fusion Coverage" value="93.8%" delta="+1.4%" icon="circles-four"/><MetricCard label="Records / 24h" value="12.3M" delta="+8.2%" icon="database"/><MetricCard label="Freshness SLA" value="96.4%" delta="+0.8%" icon="timer"/><MetricCard label="Quality Flags" value="37" delta="-12" severity="MEDIUM" icon="flag"/></div>
    <Panel title="Source Health Matrix" eyebrow="fixture | live provider contract preview" className="span-9"><DataTable columns={[{key:'name',label:'SOURCE'},{key:'kind',label:'TYPE'},{key:'status',label:'STATUS'},{key:'freshness',label:'FRESHNESS'},{key:'coverage',label:'COVERAGE %'},{key:'records24h',label:'RECORDS / 24H'},{key:'provenance',label:'PROVENANCE'}]} rows={operations!.sources}/></Panel>
    <Panel title="Fusion Quality" eyebrow="Validation pipeline preview" className="span-3"><div className="quality-orbit"><ScoreRing score={94} label="QUALITY SCORE"/><span><i/>Identity resolution <b>97%</b></span><span><i/>Coordinate validity <b>99%</b></span><span><i/>Timestamp integrity <b>96%</b></span><span><i/>Provenance complete <b>91%</b></span></div></Panel>
    <Panel title="Source Status by Domain" eyebrow="Operational availability" className="span-5"><RowList rows={operations!.sources.map((item: any) => ({...item,title:item.name,detail:`${item.kind} · ${item.freshness}`}))}/></Panel>
    <Panel title="Provider Contract" eyebrow="Deferred integration design" className="span-4"><div className="contract-code"><code>mode: fixture | live</code><code>coordinates: WGS84</code><code>timestamp: ISO-8601</code><code>provenance: required</code><code>status: ONLINE | DEGRADED | OFFLINE | STALE</code></div></Panel>
    <Panel title="Frontend Constraint" eyebrow="Current execution boundary" className="span-3"><div className="scope-lock"><i className="ph ph-lock-key"/><strong>LOCAL DATA ONLY</strong><p>No backend, database, ingestion pipeline, MCP, agent, Supabase, or server auth has been initialized.</p></div></Panel>
  </div>

  const renderAdministration = () => <div className="workspace-grid workspace-grid--admin">
    <Panel title="Role Accounts" eyebrow="Development identities" className="span-7"><DataTable columns={[{key:'username',label:'USERNAME'},{key:'role',label:'ROLE'},{key:'unit',label:'UNIT'},{key:'access',label:'ACCESS'},{key:'status',label:'STATUS'}]} rows={operations!.users}/></Panel>
    <Panel title="Environment Policy" eyebrow="Frontend enforcement preview" className="span-5"><div className="policy-list"><article><i className="ph ph-shield-check"/><div><strong>Development / Demo</strong><small>MFA bypass enabled; local session only</small></div><SeverityBadge value="ACTIVE"/></article><article><i className="ph ph-fingerprint"/><div><strong>Production</strong><small>MFA required; idle logout 30 minutes</small></div><SeverityBadge value="PLANNED"/></article><article><i className="ph ph-map-trifold"/><div><strong>Map Contract</strong><small>Satellite Streets v12 · Globe · tactical layers</small></div><SeverityBadge value="ENFORCED"/></article></div></Panel>
    <Panel title="Role Matrix" eyebrow="Frontend route visibility" className="span-6"><DataTable columns={[{key:'role',label:'ROLE'},{key:'primary',label:'PRIMARY CAPABILITY'},{key:'mutation',label:'WRITE MODE'}]} rows={[{role:'Administrator',primary:'Configuration, accounts, sources',mutation:'FULL'},{role:'Pimpinan',primary:'Decision, approval, distribution',mutation:'APPROVAL'},{role:'Supervisor',primary:'Review, assignment, validation',mutation:'OPERATIONAL'},{role:'Analis',primary:'Investigation, notes, drafts',mutation:'ANALYST'},{role:'Auditor',primary:'Archive, export, audit trail',mutation:'READ ONLY'}]}/></Panel>
    <Panel title="Immutable Audit Preview" eyebrow="Local demonstration events" className="span-6"><DataTable columns={[{key:'time',label:'TIME'},{key:'actor',label:'ACTOR'},{key:'action',label:'ACTION'},{key:'object',label:'OBJECT'},{key:'result',label:'RESULT'}]} rows={operations!.auditEvents}/></Panel>
    <Panel title="Security Baseline" eyebrow="Deferred server controls are explicit" className="span-12"><div className="security-baseline">{['MFA in production','30-minute idle timeout','Role-based route access','No password in session storage','Audit event contract','Classification on reports','Read-only auditor UI','Map token loaded from root .env'].map((item) => <span key={item}><i className="ph ph-check-circle"/>{item}</span>)}</div></Panel>
  </div>

  const renderModule = () => {
    if (module === 'border') return renderBorder()
    if (module === 'vessel') return renderVessel()
    if (module === 'aircraft') return renderAircraft()
    if (module === 'anomaly') return renderAnomaly()
    if (module === 'warning') return renderWarning()
    if (module === 'threat') return renderThreat()
    if (module === 'reporting') return renderReporting()
    if (module === 'data') return renderData()
    return renderAdministration()
  }

  return <DataState loading={loading} error={error} ready={ready}><div className={`operations-workspace operations-workspace--${module}`}>{ready && renderModule()}<footer className="workspace-footer"><span>MBIS FRONTEND FIXTURE · DATA IS SYNTHETIC</span><span>Last synchronized 29 JUN 2026 · 09:42:18 WIB</span></footer></div></DataState>
}
