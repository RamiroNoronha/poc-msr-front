import type { SuggestedGroup } from '../service/contracts'

// Une (por união-busca) os grupos marcados: grupos que compartilham uma identidade viram uma só pessoa.
export function mergeCheckedGroups(groups: SuggestedGroup[], checked: Set<number>): string[][] {
  const parent = new Map<string, string>()

  function find(id: string): string {
    let root = id
    while (parent.get(root) !== root) root = parent.get(root) ?? root
    parent.set(id, root)
    return root
  }

  groups.forEach((group, index) => {
    if (!checked.has(index)) return
    group.ids.forEach((id) => { if (!parent.has(id)) parent.set(id, id) })
    group.ids.slice(1).forEach((id) => parent.set(find(id), find(group.ids[0])))
  })

  const merged = new Map<string, string[]>()
  for (const id of parent.keys()) {
    const root = find(id)
    merged.set(root, [...(merged.get(root) ?? []), id])
  }

  return [...merged.values()].filter((members) => members.length > 1)
}
