import type { FileInfo } from './tree'

export type CollaborationMode = 'collaborated' | 'main'

export type FileOwnership = {
  collaborators: string[]
  main: string | null
}

export type DeveloperSummary = {
  files: number
  name: string
  soloFiles: number
}

export function isSoloFile(file: FileInfo) {
  return file.authors.length === 1
}

// Para cada arquivo: quem colaborou e quem é o principal autor (mais revisões).
export function buildOwnership(files: FileInfo[]): Map<string, FileOwnership> {
  const ownership = new Map<string, FileOwnership>()

  for (const { authors, path } of files) {
    const sorted = [...authors].sort((a, b) => b.revisions - a.revisions)
    ownership.set(path, { collaborators: sorted.map((author) => author.name), main: sorted[0]?.name ?? null })
  }

  return ownership
}

// Desenvolvedores ordenados pelo número de arquivos em que colaboraram.
export function summarizeDevelopers(files: FileInfo[]): DeveloperSummary[] {
  const summaries = new Map<string, DeveloperSummary>()

  for (const file of files) {
    for (const { name } of file.authors) {
      const summary = summaries.get(name) ?? { files: 0, name, soloFiles: 0 }
      summary.files += 1
      if (isSoloFile(file)) summary.soloFiles += 1
      summaries.set(name, summary)
    }
  }

  return [...summaries.values()].sort((a, b) => b.files - a.files || a.name.localeCompare(b.name))
}

export function selectFileColors(
  ownership: Map<string, FileOwnership>,
  colorOf: (developer: string) => string,
  selected: string | null,
  mode: CollaborationMode,
  soloOnly: boolean,
): Map<string, string> {
  const colors = new Map<string, string>()

  for (const [path, { collaborators, main }] of ownership) {
    if (soloOnly && collaborators.length !== 1) continue

    if (selected === null) {
      if (main) colors.set(path, colorOf(main))
    } else if (mode === 'collaborated' ? collaborators.includes(selected) : main === selected) {
      colors.set(path, colorOf(selected))
    }
  }

  return colors
}
