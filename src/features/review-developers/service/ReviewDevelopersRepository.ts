import { apiClient } from '../../../shared/api/apiClient'
import type { DevelopersResponse } from './contracts'

// Só conversa com a API; qualquer tratamento do resultado fica no Manager.
export class ReviewDevelopersRepository {
  async getDevelopers(repositoryUrl: string, signal?: AbortSignal): Promise<DevelopersResponse> {
    const response = await apiClient.get<DevelopersResponse>('/mining/developers', { params: { repo_url: repositoryUrl }, signal })
    return response.data
  }
}
