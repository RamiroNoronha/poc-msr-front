import { useAnalysis } from '../hooks/useAnalysis'
import { MetricCard } from './components/MetricCard'

export function AnalysisDashboardView() {
  const analysis = useAnalysis()
  return (
    <main>
      <h1>Análise do repositório</h1>
      <p>Status: {analysis.status ?? 'Aguardando análise'}</p>
      <section aria-label="Métricas principais">
        <MetricCard label="Truck Factor" value="-" />
        <MetricCard label="Arquivos analisados" value="-" />
        <MetricCard label="Pessoas críticas" value="-" />
      </section>
    </main>
  )
}
