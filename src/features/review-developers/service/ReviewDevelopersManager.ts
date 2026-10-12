import type { DevelopersReview } from './contracts'
import { NoCommitsFoundError } from './NoCommitsFoundError'
import type { ReviewDevelopersRepository } from './ReviewDevelopersRepository'

// Regras em cima da resposta da API: converte para o modelo da tela e rejeita repositórios sem commits.
export class ReviewDevelopersManager {
  private readonly repository: ReviewDevelopersRepository

  constructor(repository: ReviewDevelopersRepository) {
    this.repository = repository
  }

  async getDevelopersReview(repositoryUrl: string, signal?: AbortSignal): Promise<DevelopersReview> {
    const response = await this.repository.getDevelopers(repositoryUrl, signal)
    if (response.developers.length === 0) throw new NoCommitsFoundError()

    return { developers: response.developers, repositoryUrl, suggestedGroups: response.suggested_groups }
  }
}
