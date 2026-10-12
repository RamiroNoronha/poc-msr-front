import type { CouplingFilters, CouplingReport, CouplingSelection } from './contracts'
import type { CouplingRepository } from './CouplingRepository'

// Regras em cima do relatório devolvido pela API.
export class CouplingManager {
  private readonly repository: CouplingRepository

  constructor(repository: CouplingRepository) {
    this.repository = repository
  }

  getCouplingReport(repositoryUrl: string, filters: CouplingFilters, signal?: AbortSignal): Promise<CouplingReport> {
    return this.repository.getCouplingReport(repositoryUrl, filters, signal)
  }

  // Descarta arquivos (e os pares que os envolvem) dentro das pastas ocultas; `hiddenPaths` são caminhos de pasta.
  excludeFolders(report: CouplingReport, hiddenPaths: ReadonlySet<string>): CouplingReport {
    if (hiddenPaths.size === 0) return report

    const isHidden = (path: string) => [...hiddenPaths].some((folder) => path.startsWith(`${folder}/`))
    return {
      ...report,
      files: report.files.filter((file) => !isHidden(file.path)),
      links: report.links.filter((link) => !isHidden(link.source) && !isHidden(link.target)),
    }
  }

  // Mantém só os pares com grau de acoplamento de pelo menos `minDegreePercent` (0-100) e os arquivos que sobram neles.
  filterByDegree(report: CouplingReport, minDegreePercent: number): CouplingSelection {
    const links = report.links.filter((link) => link.degree * 100 >= minDegreePercent)
    const paths = new Set(links.flatMap((link) => [link.source, link.target]))

    return { files: report.files.filter((file) => paths.has(file.path)), links }
  }
}
