import { apiClient } from '../../../shared/api/apiClient'

export type CouplingFile = {
  path: string
  revisions: number
  size: number | null
}

export type CouplingLink = {
  commits: number
  degree: number
  source: string
  source_confidence: number
  target: string
  target_confidence: number
  weight: number
}

export type CouplingReport = {
  files: CouplingFile[]
  links: CouplingLink[]
  stats: {
    commits_analyzed: number
    commits_skipped_large: number
    links_returned: number
    pairs_considered: number
  }
  window: { from: string | null; months: number | null; to: string | null }
}

export type CouplingFilters = {
  // Máximo de pares devolvidos (os mais acoplados primeiro).
  limit: number
  minSupport: number
  // null = todo o histórico
  months: number | null
}

export const COUPLING_LIMITS = [300, 600, 1000]

export async function getCoupling(repositoryUrl: string, filters: CouplingFilters, signal?: AbortSignal): Promise<CouplingReport> {
  const response = await apiClient.get<CouplingReport>('/analytics/report/coupling', {
    params: { limit: filters.limit, min_support: filters.minSupport, months: filters.months ?? undefined, repo_url: repositoryUrl },
    signal,
  })

  return response.data
}
