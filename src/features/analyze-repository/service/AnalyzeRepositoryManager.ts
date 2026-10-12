import i18n from 'i18next'
import { parseGitHubRepositoryUrl } from '../utils/normalizeGitHubRepositoryUrl'
import type { AnalyzeRepositoryRepository } from './AnalyzeRepositoryRepository'
import type { DeveloperGroups, MiningReport, RepositoryAnalysis, RepositoryInfo, TruckFactorReport } from './contracts'

// Regras em cima das chamadas da API: valida a entrada e monta a análise a partir dos resultados.
export class AnalyzeRepositoryManager {
  private readonly repository: AnalyzeRepositoryRepository

  constructor(repository: AnalyzeRepositoryRepository) {
    this.repository = repository
  }

  getRepositoryInfo(repositoryUrl: string, signal?: AbortSignal): Promise<RepositoryInfo> {
    const { owner, repository } = this.parseUrl(repositoryUrl)
    return this.repository.getRepositoryInfo(owner, repository, signal)
  }

  getMiningReport(repositoryUrl: string, groups: DeveloperGroups, signal?: AbortSignal): Promise<MiningReport> {
    this.parseUrl(repositoryUrl)
    return this.repository.getMiningReport(repositoryUrl, groups, signal)
  }

  getTruckFactorReport(repositoryUrl: string, groups: DeveloperGroups, signal?: AbortSignal): Promise<TruckFactorReport> {
    this.parseUrl(repositoryUrl)
    return this.repository.getTruckFactorReport(repositoryUrl, groups, signal)
  }

  // Uma URL inválida falha antes de qualquer requisição.
  private parseUrl(repositoryUrl: string) {
    const parsed = parseGitHubRepositoryUrl(repositoryUrl)
    if (!parsed) throw new Error(i18n.t('errors.invalidRepositoryUrl', { ns: 'analyzeRepository' }))
    return parsed
  }

  // Mineração e Truck Factor são essenciais; os dados do repositório (stars, forks...) são opcionais.
  buildAnalysis(repository: RepositoryInfo | undefined, mining: MiningReport, truckFactor: TruckFactorReport): RepositoryAnalysis {
    return { mining, repository: repository ?? null, truckFactor }
  }
}
