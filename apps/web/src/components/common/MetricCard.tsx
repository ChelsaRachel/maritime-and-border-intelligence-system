import { SeverityBadge } from '@/components/common/SeverityBadge'

interface IMetricCardProps {
  label: string
  value: string | number
  delta?: string
  severity?: string
  icon?: string
}

export function MetricCard({ label, value, delta, severity, icon = 'pulse' }: IMetricCardProps) {
  return (
    <article className="metric-card">
      <div className="metric-card__label"><i className={`ph ph-${icon}`} aria-hidden="true" />{label}</div>
      <div className="metric-card__value">{value}</div>
      <div className="metric-card__footer">
        {delta ? <span className={delta.startsWith('-') ? 'text-critical' : 'text-low'}>{delta}</span> : <span>LIVE FIXTURE</span>}
        {severity && <SeverityBadge value={severity} compact />}
      </div>
      <div className="metric-card__spark" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
    </article>
  )
}
