import { apiClient } from '../../../shared/api/apiClient'
import { parseGitHubRepositoryUrl } from '../utils/normalizeGitHubRepositoryUrl'

export type RepositoryInfo = {
  description: string | null
  forks: number
  full_name: string
  language: string | null
  stars: number
}

export type D3Node = {
  authors?: { name: string; revisions: number }[]
  children?: D3Node[]
  name: string
  revisions?: number
  size?: number
  weight?: number
}

export type MiningReport = {
  d3_data: D3Node
  repo_analyzed: string
  status: 'success'
}

export type TruckFactorReport = {
  key_developers: string[]
  total_files_analyzed: number
  truck_factor: number
}

export type RepositoryAnalysis = {
  mining: MiningReport
  repository: RepositoryInfo | null
  truckFactor: TruckFactorReport
}

// Cada grupo lista os ids das identidades de commit que o usuário confirmou como a mesma pessoa.
export type DeveloperGroups = string[][]

export async function analyzeRepository(repositoryUrl: string, groups: DeveloperGroups = []): Promise<RepositoryAnalysis> {
  const repository = parseGitHubRepositoryUrl(repositoryUrl)
  if (!repository) throw new Error('A URL do repositório GitHub é inválida.')

  const [repositoryResult, miningResponse, truckFactorResponse] = await Promise.allSettled([
    apiClient.get<RepositoryInfo>(`/repo/${repository.owner}/${repository.repository}`),
    apiClient.post<MiningReport>('/mining/report', { groups, repo_url: repositoryUrl }),
    apiClient.post<TruckFactorReport>('/analytics/report/truck-factor', { groups, repo_url: repositoryUrl }),
  ])

  // Mineração e Truck Factor são essenciais; os dados do repositório são opcionais.
  if (miningResponse.status === 'rejected') throw miningResponse.reason
  if (truckFactorResponse.status === 'rejected') throw truckFactorResponse.reason

  return {
    mining: miningResponse.value.data,
    repository: repositoryResult.status === 'fulfilled' ? repositoryResult.value.data : null,
    truckFactor: truckFactorResponse.value.data,
  }
}
