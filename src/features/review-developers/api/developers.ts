import { apiClient } from '../../../shared/api/apiClient'

export type Developer = {
  commits: number
  email: string
  id: string
  name: string
}

export type GroupConfidence = 'high' | 'medium'

export type SuggestedGroup = {
  confidence: GroupConfidence
  ids: string[]
  reasons: string[]
}

export type DevelopersReview = {
  developers: Developer[]
  repositoryUrl: string
  suggestedGroups: SuggestedGroup[]
}

type DevelopersResponse = {
  developers: Developer[]
  repo_analyzed: string
  status: 'success'
  suggested_groups: SuggestedGroup[]
}

export async function getDevelopers(repositoryUrl: string): Promise<DevelopersReview> {
  const response = await apiClient.get<DevelopersResponse>('/mining/developers', { params: { repo_url: repositoryUrl } })

  return {
    developers: response.data.developers,
    repositoryUrl,
    suggestedGroups: response.data.suggested_groups,
  }
}
