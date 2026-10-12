import axios from 'axios'
import i18n from 'i18next'
import { useRef, useState } from 'react'
import { getDevelopers, type DevelopersReview } from '../api/developers'

function getErrorMessage(error: unknown) {
  const t = i18n.getFixedT(null, 'reviewDevelopers')
  if (!axios.isAxiosError(error)) return t('errors.fallback')
  if (!error.response) return t('errors.offline')

  const detail = error.response.data?.detail
  return typeof detail === 'string' ? detail : t('errors.fallback')
}

export function useDevelopersReview() {
  const [review, setReview] = useState<DevelopersReview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const latestRequest = useRef(0)

  // Devolve o resultado (ou null em caso de erro) para quem orquestra o fluxo decidir o próximo passo.
  async function load(repositoryUrl: string): Promise<DevelopersReview | null> {
    const request = ++latestRequest.current
    setReview(null)
    setError(null)
    setIsLoading(true)

    try {
      const result = await getDevelopers(repositoryUrl)
      if (request !== latestRequest.current) return null
      if (result.developers.length === 0) {
        setError(i18n.t('errors.noCommits', { ns: 'reviewDevelopers' }))
        return null
      }
      setReview(result)
      return result
    } catch (requestError) {
      if (request === latestRequest.current) setError(getErrorMessage(requestError))
      return null
    } finally {
      if (request === latestRequest.current) setIsLoading(false)
    }
  }

  return { error, isLoading, load, review }
}
