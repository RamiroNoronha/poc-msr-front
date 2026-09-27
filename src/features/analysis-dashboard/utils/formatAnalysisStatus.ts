import type { AnalysisStatus } from '../store/analysis.store'

const labels: Record<AnalysisStatus, string> = { completed: 'Concluída', failed: 'Falhou', processing: 'Em processamento', queued: 'Na fila' }
export function formatAnalysisStatus(status: AnalysisStatus) { return labels[status] }
