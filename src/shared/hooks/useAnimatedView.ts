import { useEffect, useRef, useState } from 'react'

export type View = { r: number; x: number; y: number }

const ease = (progress: number) => (progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2)

// Anima suavemente a "câmera" (centro e raio visível) até o alvo; o raio é interpolado de forma geométrica.
export function useAnimatedView({ r, x, y }: View, duration = 650): View {
  const [view, setView] = useState({ r, x, y })
  const current = useRef({ r, x, y })

  useEffect(() => {
    const from = current.current
    if (from.r === r && from.x === x && from.y === y) return

    const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const progress = animate ? ease(Math.min(Math.max((now - start) / duration, 0), 1)) : 1
      const next = {
        r: from.r * (r / from.r) ** progress,
        x: from.x + (x - from.x) * progress,
        y: from.y + (y - from.y) * progress,
      }
      current.current = next
      setView(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    })

    return () => cancelAnimationFrame(frame)
  }, [r, x, y, duration])

  return view
}
