interface IDataStateProps { loading: boolean; error: string | null; ready: boolean; children: React.ReactNode }

export function DataState({ loading, error, ready, children }: IDataStateProps) {
  if (error) return <div className="data-state data-state--error"><i className="ph ph-warning" /><strong>LOCAL DATA UNAVAILABLE</strong><small>{error}</small></div>
  if (loading || !ready) return <div className="data-state"><span className="radar-loader" /><strong>SYNCHRONIZING LOCAL INTELLIGENCE FIXTURES</strong><small>Memuat data AIS, ADS-B, perbatasan, cuaca, dan laporan dari perangkat lokal.</small></div>
  return <>{children}</>
}
