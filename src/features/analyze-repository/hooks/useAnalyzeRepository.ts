import axios from 'axios'
import i18n from 'i18next'
import { useState } from 'react'
import { analyzeRepository, type DeveloperGroups, type RepositoryAnalysis } from '../api/analyzeRepository'

function getErrorMessage(error: unknown) {
  const t = i18n.getFixedT(null, 'analyzeRepository')
  if (!axios.isAxiosError(error)) return t('errors.fallback')
  if (error.response?.status === 404) return t('errors.notFound')
  if (!error.response) return t('errors.offline')

  const detail = error.response.data?.detail
  return typeof detail === 'string' ? detail : t('errors.fallback')
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
