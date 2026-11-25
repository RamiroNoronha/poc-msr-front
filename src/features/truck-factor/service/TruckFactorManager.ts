import type { TruckFactorReport, TruckFactorRequest } from './contracts'
import type { TruckFactorRepository } from './TruckFactorRepository'

// Regras em cima do relatório devolvido pela API.
export class TruckFactorManager {
  private readonly repository: TruckFactorRepository

  constructor(repository: TruckFactorRepository) {
    this.repository = repository
  }

  getTruckFactorReport(request: TruckFactorRequest, signal?: AbortSignal): Promise<TruckFactorReport> {
    return this.repository.getTruckFactorReport(request, signal)
  }

  // Ordena as pastas para que o mesmo conjunto gere sempre a mesma chave de cache.
  normalizeExcludedPaths(hiddenPaths: ReadonlySet<string>): string[] {
    return [...hiddenPaths].sort()
  }
}
