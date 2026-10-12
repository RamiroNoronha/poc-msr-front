import axios from 'axios'
import i18n from 'i18next'
import { useEffect, useState } from 'react'
import { getCoupling, type CouplingFilters, type CouplingReport } from '../api/coupling'

type Result = { error: string | null; key: string; report: CouplingReport | null }

function getErrorMessage(error: unknown) {
  const t = i18n.getFixedT(null, 'coupling')
  if (axios.isAxiosError(error) && !error.response) return t('errors.offline')
  if (axios.isAxiosError(error) && typeof error.response?.data?.detail === 'string') return error.response.data.detail
  return t('errors.fallback')
}

// Busca o acoplamento e refaz a busca quando o filtro muda. Mantém o último resultado visível durante a recarga.
export function useCoupling(repositoryUrl: string, { limit, minSupport, months }: CouplingFilters) {
  const key = `${repositoryUrl}|${months ?? 'all'}|${minSupport}|${limit}`
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    getCoupling(repositoryUrl, { limit, minSupport, months }, controller.signal)
      .then((report) => setResult({ error: null, key, report }))
      .catch((error) => { if (!axios.isCancel(error)) setResult({ error: getErrorMessage(error), key, report: null }) })

    return () => controller.abort()
  }, [key, limit, minSupport, months, repositoryUrl])

  const isCurrent = result?.key === key
  return { error: isCurrent ? result.error : null, isLoading: !isCurrent, report: result?.report ?? null }
}
