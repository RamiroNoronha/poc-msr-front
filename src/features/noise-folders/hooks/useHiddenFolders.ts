import { useCallback, useMemo, useState } from 'react'
import { scanFolders, type FolderScan, type NoiseTree } from '../utils/detectNoise'

export type HiddenFolder = {
  files: number
  path: string
  reasons: FolderScan['reasons']
  source: 'auto' | 'manual'
}

// Pastas de ruído de alta confiança começam ocultas; o usuário pode restaurá-las ou ocultar outras.
export function useHiddenFolders(tree: NoiseTree) {
  const scans = useMemo(() => scanFolders(tree), [tree])
  const byPath = useMemo(() => new Map(scans.map((scan) => [scan.path, scan])), [scans])
  const autoPaths = useMemo(() => {
    const high = scans.filter((scan) => scan.confidence === 'high')
    return high.filter((scan) => !high.some((other) => scan.path.startsWith(`${other.path}/`))).map((scan) => scan.path)
  }, [scans])

  const [restored, setRestored] = useState<ReadonlySet<string>>(new Set())
  const [manual, setManual] = useState<ReadonlySet<string>>(new Set())

  const folders = useMemo<HiddenFolder[]>(() => {
    const toFolder = (path: string, source: HiddenFolder['source']): HiddenFolder => ({ files: byPath.get(path)?.files ?? 0, path, reasons: byPath.get(path)?.reasons ?? [], source })
    return [
      ...autoPaths.filter((path) => !restored.has(path) && !manual.has(path)).map((path) => toFolder(path, 'auto')),
      ...[...manual].map((path) => toFolder(path, 'manual')),
    ]
  }, [autoPaths, byPath, manual, restored])

  const hiddenPaths = useMemo(() => new Set(folders.map((folder) => folder.path)), [folders])

  const hide = useCallback((path: string) => {
    setManual((current) => new Set(current).add(path))
    setRestored((current) => { const next = new Set(current); next.delete(path); return next })
  }, [])

  const restore = useCallback((path: string) => {
    setManual((current) => { const next = new Set(current); next.delete(path); return next })
    setRestored((current) => new Set(current).add(path))
  }, [])

  const restoreAll = useCallback(() => {
    setManual(new Set())
    setRestored(new Set(autoPaths))
  }, [autoPaths])

  return { folders, hiddenPaths, hide, restore, restoreAll }
}
