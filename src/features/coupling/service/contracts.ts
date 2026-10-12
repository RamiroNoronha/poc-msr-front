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

// Pares e arquivos que sobram depois de um filtro aplicado no navegador.
export type CouplingSelection = {
  files: CouplingFile[]
  links: CouplingLink[]
}
