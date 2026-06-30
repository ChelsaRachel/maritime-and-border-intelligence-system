import { cn } from '@/utils/cn'

interface ISeverityBadgeProps { value: string; compact?: boolean }

export function SeverityBadge({ value, compact = false }: ISeverityBadgeProps) {
  const normalized = value.toUpperCase().replaceAll(' ', '_')
  return <span className={cn('severity-badge', `severity-badge--${normalized.toLowerCase()}`, compact && 'severity-badge--compact')}>{value.replaceAll('_', ' ')}</span>
}
