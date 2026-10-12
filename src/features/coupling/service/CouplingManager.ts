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

  // Mantém só os pares com grau de acoplamento de pelo menos `minDegreePercent` (0-100) e os arquivos que sobram neles.
  filterByDegree(report: CouplingReport, minDegreePercent: number): CouplingSelection {
    const links = report.links.filter((link) => link.degree * 100 >= minDegreePercent)
    const paths = new Set(links.flatMap((link) => [link.source, link.target]))

    return { files: report.files.filter((file) => paths.has(file.path)), links }
  }
}
