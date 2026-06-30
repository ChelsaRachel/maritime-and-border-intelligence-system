import { SeverityBadge } from '@/components/common/SeverityBadge'
import type { INmpAircraft, INmpAlert, INmpCurrentEntity, INmpVessel } from '@/features/mbis/types/nmp.types'

interface INmpTacticalPopupProps {
  entity?: INmpCurrentEntity | null
  alert?: INmpAlert | null
  onClose: () => void
}

function alertTime(timestamp: string) {
  return new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(timestamp))
}

export function NmpTacticalPopup({ entity, alert, onClose }: INmpTacticalPopupProps) {
  if (!entity && !alert) return null

  if (alert) {
    return (
      <section className={`nmp-selection nmp-selection--alert nmp-selection--${alert.severity.toLowerCase()} glass-panel`} aria-label="Detail alert taktis">
        <button type="button" onClick={onClose} aria-label="Tutup detail alert"><i className="ph ph-x" aria-hidden="true" /></button>
        <span>TACTICAL ALERT · {alert.id}</span>
        <strong>{alert.title}</strong>
        <small>{alert.entityName} · {alert.status}</small>
        <div className="nmp-selection__telemetry">
          <b>{alert.severity}<small> SEVERITY</small></b>
          <b>{alert.confidence.toFixed(1)}%<small> CONFIDENCE</small></b>
          <b>{alertTime(alert.timestamp)}<small> WIB</small></b>
          <b>{alert.coordinates[1].toFixed(2)}<small> LAT</small></b>
        </div>
        <dl className="nmp-popup__evidence">
          <div><dt>SOURCE FUSION</dt><dd>{alert.source}</dd></div>
          <div><dt>SUGGESTED ACTION</dt><dd>{alert.suggestedAction}</dd></div>
        </dl>
        <SeverityBadge value={alert.severity} />
      </section>
    )
  }

  const vessel = entity?.category === 'VESSEL' ? entity.detail as INmpVessel : null
  const aircraft = entity?.category === 'AIRCRAFT' ? entity.detail as INmpAircraft : null
  return (
    <section className={`nmp-selection nmp-selection--${entity?.severity.toLowerCase()} glass-panel`} aria-label="Detail target terpilih">
      <button type="button" onClick={onClose} aria-label="Tutup detail target"><i className="ph ph-x" aria-hidden="true" /></button>
      <span>ENTITY FOCUS · {entity?.category}</span>
      <strong>{entity?.label}</strong>
      <small>{vessel ? `${vessel.mmsi} · ${vessel.flag} · ${vessel.type}` : aircraft ? `${aircraft.registration} · ${aircraft.operator} · ${aircraft.type}` : entity?.id}</small>
      <div className="nmp-selection__telemetry">
        <b>{entity?.speed}<small>{entity?.category === 'VESSEL' ? ' KNOT' : ' KT'}</small></b>
        <b>{Math.round(entity?.heading ?? 0)}°<small> HEADING</small></b>
        <b>{entity?.coordinates[1].toFixed(2)}<small> LAT</small></b>
        <b>{entity?.coordinates[0].toFixed(2)}<small> LON</small></b>
      </div>
      <dl className="nmp-popup__evidence">
        <div><dt>DESTINATION</dt><dd>{vessel?.destination ?? aircraft?.destination}</dd></div>
        <div><dt>PROVENANCE</dt><dd>{vessel?.provenance ?? aircraft?.provenance}</dd></div>
      </dl>
      <SeverityBadge value={entity?.severity ?? 'NORMAL'} />
    </section>
  )
}
