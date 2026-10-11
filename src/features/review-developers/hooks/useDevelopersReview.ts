import axios from 'axios'
import { useRef, useState } from 'react'
import { getDevelopers, type DevelopersReview } from '../api/developers'

const fallbackMessage = 'Não foi possível buscar os desenvolvedores do repositório.'

function getErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return fallbackMessage
  if (!error.response) return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.'

  const detail = error.response.data?.detail
  return typeof detail === 'string' ? detail : fallbackMessage
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
        setError('Nenhum commit encontrado. Confira a URL e se o repositório é público.')
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
