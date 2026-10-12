import { apiClient } from '../../../shared/api/apiClient'
import type { DeveloperGroups, MiningReport, RepositoryInfo, TruckFactorReport } from './contracts'

// Só conversa com a API; qualquer tratamento do resultado fica no Manager.
export class AnalyzeRepositoryRepository {
  async getRepositoryInfo(owner: string, repository: string, signal?: AbortSignal): Promise<RepositoryInfo> {
    const response = await apiClient.get<RepositoryInfo>(`/repo/${owner}/${repository}`, { signal })
    return response.data
  }

  async getMiningReport(repositoryUrl: string, groups: DeveloperGroups, signal?: AbortSignal): Promise<MiningReport> {
    const response = await apiClient.post<MiningReport>('/mining/report', { groups, repo_url: repositoryUrl }, { signal })
    return response.data
  }

  async getTruckFactorReport(repositoryUrl: string, groups: DeveloperGroups, signal?: AbortSignal): Promise<TruckFactorReport> {
    const response = await apiClient.post<TruckFactorReport>('/analytics/report/truck-factor', { groups, repo_url: repositoryUrl }, { signal })
    return response.data
  }
}
