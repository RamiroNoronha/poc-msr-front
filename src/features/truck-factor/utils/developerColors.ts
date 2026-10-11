const palette = ['#7c5cff', '#22d3ee', '#f59e0b', '#34d399', '#f472b6', '#60a5fa', '#a3e635', '#fb923c']

export const OTHERS_COLOR = '#94a3b8'
export const SELECTED_OTHER_COLOR = '#f1f5f9'

// Os desenvolvedores mais ativos (já ordenados) ganham cor própria; os demais usam OTHERS_COLOR.
export function assignDeveloperColors(developers: string[]) {
  return new Map(developers.slice(0, palette.length).map((developer, index) => [developer, palette[index]]))
}
