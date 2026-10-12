import i18n from 'i18next'
import { useState } from 'react'
import { normalizeGitHubRepositoryUrl } from '../utils/normalizeGitHubRepositoryUrl'

export function useRepositoryUrl() {
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  function validate() {
    const normalizedUrl = normalizeGitHubRepositoryUrl(repositoryUrl)
    if (!normalizedUrl) {
      setError(i18n.t('errors.invalidUrl', { ns: 'analyzeRepository' }))
      return null
    }
    setError(null)
    return normalizedUrl
  }

  return { error, repositoryUrl, setRepositoryUrl, validate }
}
