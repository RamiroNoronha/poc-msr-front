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

// Resposta crua da API (nomes em snake_case).
export type DevelopersResponse = {
  developers: Developer[]
  repo_analyzed: string
  status: 'success'
  suggested_groups: SuggestedGroup[]
}
