import type { NoiseTree } from './detectNoise'

// Remove da árvore as pastas ocultas (por caminho, sem o nome da raiz) e as pastas que ficarem vazias.
export function pruneTree<T extends NoiseTree>(root: T, hiddenPaths: ReadonlySet<string>): T {
  if (hiddenPaths.size === 0) return root

  function prune(node: T, names: string[]): T | null {
    if (!node.children) return node
    if (names.length > 0 && hiddenPaths.has(names.join('/'))) return null

    const children = node.children.flatMap((child) => prune(child as T, [...names, child.name]) ?? [])
    return children.length === 0 && names.length > 0 ? null : { ...node, children }
  }

  return prune(root, []) ?? { ...root, children: [] }
}
