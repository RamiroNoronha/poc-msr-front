import axios from 'axios'
import { useState } from 'react'
import { analyzeRepository, type DeveloperGroups, type RepositoryAnalysis } from '../api/analyzeRepository'

const fallbackMessage = 'Não foi possível analisar o repositório.'

function getErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return fallbackMessage
  if (error.response?.status === 404) return 'Repositório não encontrado. Confira a URL e se ele é público.'
  if (!error.response) return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.'

  const detail = error.response.data?.detail
  return typeof detail === 'string' ? detail : fallbackMessage
}

export function useAnalyzeRepository() {
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function reset() {
    setAnalysis(null)
    setError(null)
  }

  async function submit(repositoryUrl: string, groups: DeveloperGroups = []) {
    reset()
    setIsLoading(true)

    try {
      const result = await analyzeRepository(repositoryUrl, groups)
      setAnalysis(result)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }

  return { analysis, error, isLoading, reset, submit }
}
