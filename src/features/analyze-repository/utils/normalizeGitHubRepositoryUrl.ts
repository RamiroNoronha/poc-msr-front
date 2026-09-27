const githubRepositoryPattern = /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/?$/i

export function normalizeGitHubRepositoryUrl(value: string): string | null {
  const normalizedUrl = value.trim().replace(/\.git\/?$/i, '')
  return githubRepositoryPattern.test(normalizedUrl) ? normalizedUrl : null
}
