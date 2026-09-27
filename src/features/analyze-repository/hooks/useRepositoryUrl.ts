import { useState } from 'react'
import { normalizeGitHubRepositoryUrl } from '../utils/normalizeGitHubRepositoryUrl'

export function useRepositoryUrl() {
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  function validate() {
    const normalizedUrl = normalizeGitHubRepositoryUrl(repositoryUrl)
    if (!normalizedUrl) {
      setError('Informe uma URL válida de um repositório público do GitHub.')
      return null
    }
    setError(null)
    return normalizedUrl
  }

  return { error, repositoryUrl, setRepositoryUrl, validate }
}
