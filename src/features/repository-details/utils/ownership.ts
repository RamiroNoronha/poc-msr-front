export type DeveloperActivity = {
  developer: string
  revisions: Map<string, number>
  status: 'error' | 'loading' | 'ready'
}

export type CollaborationMode = 'collaborated' | 'main'

export type FileOwnership = {
  collaborators: string[]
  main: string | null
}

// Para cada arquivo: quem colaborou (tem revisões) e quem é o principal autor (mais revisões).
export function buildOwnership(activity: DeveloperActivity[]): Map<string, FileOwnership> {
  const ownership = new Map<string, FileOwnership>()
  const mainRevisions = new Map<string, number>()

  for (const { developer, revisions, status } of activity) {
    if (status !== 'ready') continue

    for (const [path, count] of revisions) {
      if (count <= 0) continue

      const entry = ownership.get(path) ?? { collaborators: [], main: null }
      entry.collaborators.push(developer)
      if (count > (mainRevisions.get(path) ?? 0)) {
        mainRevisions.set(path, count)
        entry.main = developer
      }
      ownership.set(path, entry)
    }
  }

  return ownership
}

export function selectFileColors(
  ownership: Map<string, FileOwnership>,
  colorOf: (developer: string) => string,
  selected: string | null,
  mode: CollaborationMode,
): Map<string, string> {
  const colors = new Map<string, string>()

  for (const [path, { collaborators, main }] of ownership) {
    if (selected === null) {
      if (main) colors.set(path, colorOf(main))
    } else if (mode === 'collaborated' ? collaborators.includes(selected) : main === selected) {
      colors.set(path, colorOf(selected))
    }
  }

  return colors
}
