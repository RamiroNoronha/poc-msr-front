import { AnalyzeRepositoryManager } from './AnalyzeRepositoryManager'
import { AnalyzeRepositoryRepository } from './AnalyzeRepositoryRepository'

export const analyzeRepositoryManager = new AnalyzeRepositoryManager(new AnalyzeRepositoryRepository())
