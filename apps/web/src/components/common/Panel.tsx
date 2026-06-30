import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

interface IPanelProps {
  title?: string
  eyebrow?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function Panel({ title, eyebrow, action, children, className }: IPanelProps) {
  return (
    <section className={cn('intel-panel', className)}>
      {(title || eyebrow || action) && (
        <header className="intel-panel__header">
          <div>{eyebrow && <span className="intel-panel__eyebrow">{eyebrow}</span>}{title && <h2>{title}</h2>}</div>
          {action && <div className="intel-panel__action">{action}</div>}
        </header>
      )}
      <div className="intel-panel__body">{children}</div>
    </section>
  )
}
