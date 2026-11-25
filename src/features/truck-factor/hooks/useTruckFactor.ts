import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import i18n from 'i18next'
import { useMemo } from 'react'
import { truckFactorManager } from '../service'

type UseTruckFactorParams = {
  groups: string[][]
  hiddenPaths: ReadonlySet<string>
  repositoryUrl: string
}

function getErrorMessage(error: unknown) {
  const t = i18n.getFixedT(null, 'truckFactor')
  if (axios.isAxiosError(error) && !error.response) return t('summary.errors.offline')
  if (axios.isAxiosError(error) && typeof error.response?.data?.detail === 'string') return error.response.data.detail
  return t('summary.errors.fallback')
}

// Recalcula o Truck Factor no servidor sempre que o conjunto de pastas ocultas muda,
// mantendo o último resultado na tela enquanto o novo é calculado.
export function useTruckFactor({ groups, hiddenPaths, repositoryUrl }: UseTruckFactorParams) {
  const excludedPaths = useMemo(() => truckFactorManager.normalizeExcludedPaths(hiddenPaths), [hiddenPaths])

  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) => truckFactorManager.getTruckFactorReport({ excludedPaths, groups, repositoryUrl }, signal),
    queryKey: ['truck-factor-section', repositoryUrl, groups, excludedPaths],
  })

  return {
    error: query.error ? getErrorMessage(query.error) : null,
    isLoading: query.isFetching,
    report: query.data ?? null,
  }
}
