import { apiClient } from '../../../shared/api/apiClient'
import type { CouplingFilters, CouplingReport } from './contracts'

// Só conversa com a API; qualquer tratamento do resultado fica no Manager.
export class CouplingRepository {
  async getCouplingReport(repositoryUrl: string, filters: CouplingFilters, signal?: AbortSignal): Promise<CouplingReport> {
    const response = await apiClient.get<CouplingReport>('/analytics/report/coupling', {
      params: { limit: filters.limit, min_support: filters.minSupport, months: filters.months ?? undefined, repo_url: repositoryUrl },
      signal,
    })

    return response.data
  }
}
