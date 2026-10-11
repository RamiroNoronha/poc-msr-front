type Rgb = [number, number, number]

// Do branco (poucas mudanças) ao vermelho forte (muitas mudanças).
const stops: Rgb[] = [
  [248, 250, 252],
  [252, 165, 165],
  [239, 68, 68],
  [185, 28, 28],
]

const toRgb = ([red, green, blue]: Rgb) => `rgb(${red}, ${green}, ${blue})`

// O peso (revisões relativas ao arquivo mais alterado) é muito concentrado perto de zero;
// a raiz quadrada espalha melhor as cores.
export function heatColor(weight: number) {
  const position = Math.sqrt(Math.min(Math.max(weight, 0), 1)) * (stops.length - 1)
  const index = Math.min(Math.floor(position), stops.length - 2)
  const fraction = position - index
  const [from, to] = [stops[index], stops[index + 1]]
  return toRgb(from.map((value, channel) => Math.round(value + (to[channel] - value) * fraction)) as Rgb)
}

export const heatGradient = `linear-gradient(90deg, ${stops.map(toRgb).join(', ')})`
