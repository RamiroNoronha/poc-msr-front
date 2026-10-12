// O backend responde 200 com lista vazia quando não consegue clonar o repositório (inexistente ou privado).
export class NoCommitsFoundError extends Error {
  constructor() {
    super('No commits found in the repository')
    this.name = 'NoCommitsFoundError'
  }
}
