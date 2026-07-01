import PerfectScrollbar from 'react-perfect-scrollbar'
import type { ComponentProps } from 'react'

type TPerfectScrollAreaProps = ComponentProps<typeof PerfectScrollbar>

export function PerfectScrollArea({ className, ...props }: TPerfectScrollAreaProps) {
  return <PerfectScrollbar className={`perfect-scroll-area ${className ?? ''}`} {...props} />
}
