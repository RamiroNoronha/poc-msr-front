const githubRepositoryPattern = /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/?$/i

export function normalizeGitHubRepositoryUrl(value: string): string | null {
  const normalizedUrl = value.trim().replace(/\.git\/?$/i, '')
  return githubRepositoryPattern.test(normalizedUrl) ? normalizedUrl : null
}

export function parseGitHubRepositoryUrl(value: string) {
  const normalizedUrl = normalizeGitHubRepositoryUrl(value)
  if (!normalizedUrl) return null

  const [, owner, repository] = new URL(normalizedUrl).pathname.split('/')
  return { owner, repository }
}
