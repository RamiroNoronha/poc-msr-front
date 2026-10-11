import { apiClient } from '../../../shared/api/apiClient'
import type { FileNode } from '../utils/tree'

type AuthorMiningReport = {
  author_filter: string
  d3_data: FileNode
  repo_analyzed: string
  status: 'success'
}

// Cada chamada clona o repositório no backend; o cache evita repetir a requisição.
const requests = new Map<string, Promise<FileNode>>()

export function getAuthorMining(repositoryUrl: string, author: string): Promise<FileNode> {
  const key = `${repositoryUrl}::${author}`
  let request = requests.get(key)

  if (!request) {
    request = apiClient
      .get<AuthorMiningReport>('/mining/report/author', { params: { author, repo_url: repositoryUrl } })
      .then((response) => response.data.d3_data)
    request.catch(() => requests.delete(key))
    requests.set(key, request)
  }

  return request
}
