export type FileAuthor = {
  name: string
  revisions: number
}

export type FileNode = {
  authors?: FileAuthor[]
  children?: FileNode[]
  name: string
  revisions?: number
  size?: number
  weight?: number
}

export type FileInfo = {
  authors: FileAuthor[]
  path: string
  revisions: number
  size: number
}

export function getNodePath(names: string[]) {
  return names.join('/')
}

export function splitPath(path: string) {
  const index = path.lastIndexOf('/')
  return index === -1 ? { directory: '', name: path } : { directory: path.slice(0, index), name: path.slice(index + 1) }
}

// Lista plana de arquivos (folhas da árvore), com caminho sem o nó raiz.
export function collectFiles(root: FileNode): FileInfo[] {
  const files: FileInfo[] = []

  function visit(node: FileNode, names: string[]) {
    if (node.children) {
      node.children.forEach((child) => visit(child, [...names, child.name]))
      return
    }
    files.push({ authors: node.authors ?? [], path: getNodePath(names), revisions: node.revisions ?? 0, size: node.size ?? 0 })
  }

  visit(root, [])
  return files
}
