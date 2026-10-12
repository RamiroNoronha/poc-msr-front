import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import i18n from 'i18next'
import type { DevelopersReview } from '../service/contracts'
import { NoCommitsFoundError } from '../service/NoCommitsFoundError'
import { reviewDevelopersManager } from '../service'

function getErrorMessage(error: unknown) {
  const t = i18n.getFixedT(null, 'reviewDevelopers')
  if (error instanceof NoCommitsFoundError) return t('errors.noCommits')
  if (!axios.isAxiosError(error)) return t('errors.fallback')
  if (!error.response) return t('errors.offline')

  const detail = error.response.data?.detail
  return typeof detail === 'string' ? detail : t('errors.fallback')
}

// A busca é uma ação do usuário (clicar em "Analisar") cujo resultado decide a próxima tela, por isso é uma mutation.
export function useDevelopersReview() {
  const mutation = useMutation({ mutationFn: (repositoryUrl: string) => reviewDevelopersManager.getDevelopersReview(repositoryUrl) })

  // Devolve o resultado (ou null em caso de erro) para quem orquestra o fluxo decidir o próximo passo.
  async function load(repositoryUrl: string): Promise<DevelopersReview | null> {
    try {
      return await mutation.mutateAsync(repositoryUrl)
    } catch {
      return null
    }
  }

  return {
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    isLoading: mutation.isPending,
    load,
    review: mutation.data ?? null,
  }
}
