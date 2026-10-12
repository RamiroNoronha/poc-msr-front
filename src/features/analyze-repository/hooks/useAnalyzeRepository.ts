import { useQueries } from '@tanstack/react-query'
import axios from 'axios'
import i18n from 'i18next'
import { useState } from 'react'
import type { DeveloperGroups, RepositoryAnalysis } from '../service/contracts'
import { analyzeRepositoryManager } from '../service'

type AnalysisRequest = {
  groups: DeveloperGroups
  repositoryUrl: string
}

const NO_REQUEST: AnalysisRequest = { groups: [], repositoryUrl: '' }

function getErrorMessage(error: unknown) {
  const t = i18n.getFixedT(null, 'analyzeRepository')
  if (!axios.isAxiosError(error)) return t('errors.fallback')
  if (error.response?.status === 404) return t('errors.notFound')
  if (!error.response) return t('errors.offline')

  const detail = error.response.data?.detail
  return typeof detail === 'string' ? detail : t('errors.fallback')
}

// As três consultas rodam em paralelo; só começam depois do submit e usam cache por (URL, grupos).
export function useAnalyzeRepository() {
  const [request, setRequest] = useState<AnalysisRequest | null>(null)
  const { groups, repositoryUrl } = request ?? NO_REQUEST
  const enabled = request !== null

  const [repository, mining, truckFactor] = useQueries({
    queries: [
      { enabled, queryFn: ({ signal }) => analyzeRepositoryManager.getRepositoryInfo(repositoryUrl, signal), queryKey: ['repository-info', repositoryUrl] },
      { enabled, queryFn: ({ signal }) => analyzeRepositoryManager.getMiningReport(repositoryUrl, groups, signal), queryKey: ['mining-report', repositoryUrl, groups] },
      { enabled, queryFn: ({ signal }) => analyzeRepositoryManager.getTruckFactorReport(repositoryUrl, groups, signal), queryKey: ['truck-factor-report', repositoryUrl, groups] },
    ],
  })

  // Mineração e Truck Factor são essenciais; a falha de "repositório" é ignorada, mas esperamos ele terminar para a tela não "pular".
  const isRepositorySettled = !repository.isFetching && (repository.isSuccess || repository.isError)
  const analysis: RepositoryAnalysis | null =
    mining.data && truckFactor.data && isRepositorySettled ? analyzeRepositoryManager.buildAnalysis(repository.data, mining.data, truckFactor.data) : null
  const error = mining.error ?? truckFactor.error

  return {
    analysis,
    error: error ? getErrorMessage(error) : null,
    isLoading: repository.isFetching || mining.isFetching || truckFactor.isFetching,
    reset: () => setRequest(null),
    submit: (url: string, developerGroups: DeveloperGroups = []) => setRequest({ groups: developerGroups, repositoryUrl: url }),
  }
}
