import type { CouplingLink } from '../api/coupling'

export const linkKey = (link: CouplingLink) => `${link.source}|${link.target}`

export type FileStats = {
  couplings: number
  strongest: number
}

// Por arquivo: com quantos outros ele está acoplado (nos pares considerados) e o maior grau de acoplamento.
export function computeFileStats(links: CouplingLink[]): Map<string, FileStats> {
  const stats = new Map<string, FileStats>()

  for (const link of links) {
    for (const path of [link.source, link.target]) {
      const current = stats.get(path) ?? { couplings: 0, strongest: 0 }
      stats.set(path, { couplings: current.couplings + 1, strongest: Math.max(current.strongest, link.degree) })
    }
  }

  return stats
}

export type Visibility = {
  // null = tudo visível
  files: Set<string> | null
  links: Set<string> | null
}

// Com o filtro de "N ou mais acoplamentos" ligado, só esses arquivos aparecem, sem ligações.
// Ao selecionar um arquivo (ou um par), as ligações dele e os arquivos acoplados aparecem.
export function computeVisibility(
  links: CouplingLink[],
  stats: Map<string, FileStats>,
  minCouplings: number,
  selectedFile: string | null,
  selectedLink: CouplingLink | null,
): Visibility {
  if (minCouplings <= 0) return { files: null, links: null }

  const files = new Set([...stats].filter(([, fileStats]) => fileStats.couplings >= minCouplings).map(([path]) => path))
  const visibleLinks = new Set<string>()

  if (selectedFile) {
    files.add(selectedFile)
    for (const link of links) {
      if (link.source !== selectedFile && link.target !== selectedFile) continue
      visibleLinks.add(linkKey(link))
      files.add(link.source)
      files.add(link.target)
    }
  }

  if (selectedLink) {
    visibleLinks.add(linkKey(selectedLink))
    files.add(selectedLink.source)
    files.add(selectedLink.target)
  }

  return { files, links: visibleLinks }
}
