export type TreeNode = {
  children?: TreeNode[]
  name: string
  path?: string
}

// Monta a árvore de pastas a partir dos caminhos; as folhas (arquivos) guardam o caminho completo.
export function buildFileTree(paths: string[]): TreeNode {
  const root: TreeNode = { children: [], name: 'root' }

  for (const path of paths) {
    let current = root
    const parts = path.split('/')

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current.children?.push({ name: part, path })
        return
      }
      let next = current.children?.find((child) => child.children && child.name === part)
      if (!next) {
        next = { children: [], name: part }
        current.children?.push(next)
      }
      current = next
    })
  }

  return root
}

export function splitPath(path: string) {
  const index = path.lastIndexOf('/')
  return index === -1 ? { directory: '', name: path } : { directory: path.slice(0, index), name: path.slice(index + 1) }
}
