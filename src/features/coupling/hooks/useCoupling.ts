import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import i18n from 'i18next'
import type { CouplingFilters } from '../service/contracts'
import { couplingManager } from '../service'

function getErrorMessage(error: unknown) {
  const t = i18n.getFixedT(null, 'coupling')
  if (axios.isAxiosError(error) && !error.response) return t('errors.offline')
  if (axios.isAxiosError(error) && typeof error.response?.data?.detail === 'string') return error.response.data.detail
  return t('errors.fallback')
}

// Refaz a busca quando um filtro muda e mantém o último resultado visível enquanto carrega o novo.
export function useCoupling(repositoryUrl: string, { limit, minSupport, months }: CouplingFilters) {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) => couplingManager.getCouplingReport(repositoryUrl, { limit, minSupport, months }, signal),
    queryKey: ['coupling-report', repositoryUrl, months, minSupport, limit],
  })

  return {
    error: query.error ? getErrorMessage(query.error) : null,
    isLoading: query.isFetching,
    report: query.data ?? null,
  }
}
