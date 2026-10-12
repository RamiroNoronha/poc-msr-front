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
