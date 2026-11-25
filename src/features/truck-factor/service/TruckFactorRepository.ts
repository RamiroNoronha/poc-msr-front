import { apiClient } from '../../../shared/api/apiClient'
import type { TruckFactorReport, TruckFactorRequest } from './contracts'

// Só conversa com a API; qualquer tratamento do resultado fica no Manager.
export class TruckFactorRepository {
  async getTruckFactorReport({ excludedPaths, groups, repositoryUrl }: TruckFactorRequest, signal?: AbortSignal): Promise<TruckFactorReport> {
    const response = await apiClient.post<TruckFactorReport>(
      '/analytics/report/truck-factor',
      { excluded_paths: excludedPaths, groups, repo_url: repositoryUrl },
      { signal },
    )

    return response.data
  }
}
