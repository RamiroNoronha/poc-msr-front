export type FileNode = {
  children?: FileNode[]
  name: string
  revisions?: number
  size?: number
  weight?: number
}

export function getNodePath(names: string[]) {
  return names.join('/')
}

// Mapa caminho do arquivo -> número de revisões, sem o nó raiz.
export function collectRevisions(root: FileNode): Map<string, number> {
  const revisions = new Map<string, number>()

  function visit(node: FileNode, names: string[]) {
    if (node.children) {
      node.children.forEach((child) => visit(child, [...names, child.name]))
      return
    }
    revisions.set(getNodePath(names), node.revisions ?? 0)
  }

  visit(root, [])
  return revisions
}
