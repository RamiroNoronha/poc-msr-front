const palette = ['#7c5cff', '#22d3ee', '#f59e0b', '#34d399', '#f472b6', '#60a5fa', '#a3e635', '#fb923c']

export function developerColor(index: number) {
  return palette[index % palette.length]
}
