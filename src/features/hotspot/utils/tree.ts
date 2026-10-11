export type FileNode = {
  children?: FileNode[]
  name: string
  revisions?: number
  size?: number
  weight?: number
}

export function countFiles(node: FileNode): number {
  if (!node.children) return 1
  return node.children.reduce((total, child) => total + countFiles(child), 0)
}
