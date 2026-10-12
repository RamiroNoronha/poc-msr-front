const palette = ['#7c5cff', '#22d3ee', '#f59e0b', '#34d399', '#f472b6', '#60a5fa', '#a3e635', '#fb923c']

// Uma cor por pasta de primeiro nível; arquivos soltos na raiz usam a primeira cor.
export function assignFolderColors(paths: string[]) {
  const folders = [...new Set(paths.map((path) => (path.includes('/') ? path.split('/')[0] : '')))].sort()
  return new Map(folders.map((folder, index) => [folder, palette[index % palette.length]]))
}

export function folderOf(path: string) {
  return path.includes('/') ? path.split('/')[0] : ''
}
