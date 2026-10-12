import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'

type Transform = { k: number; x: number; y: number }
export type ContentBox = { x0: number; x1: number; y0: number; y1: number }

type UseSvgZoomOptions = {
  // Zoom máximo ao enquadrar uma região (fitTo); o zoom manual pode ir até maxScale.
  maxFitScale?: number
  maxScale?: number
  // Lado do viewBox quadrado e centrado na origem: `${-viewSize / 2} ${-viewSize / 2} ${viewSize} ${viewSize}`.
  viewSize: number
}

const IDENTITY: Transform = { k: 1, x: 0, y: 0 }
const DRAG_THRESHOLD = 4
const BUTTON_FACTOR = 1.5

// Zoom e movimento para um <svg>: roda do mouse (em torno do cursor), arrastar, pinça e animação até uma região.
// A transformação é aplicada direto no <g ref={contentRef}>, sem re-renderizar o gráfico a cada frame.
// Também publica a variável CSS --inv-sqrt-k (1/√zoom) nesse <g>: marcas e textos podem usá-la em
// `transform: scale(var(--inv-sqrt-k))` para crescer mais devagar que o zoom e continuar legíveis sem ficarem enormes.
export function useSvgZoom({ maxFitScale = 4, maxScale = 16, viewSize }: UseSvgZoomOptions) {
  const svgRef = useRef<SVGSVGElement>(null)
  const contentRef = useRef<SVGGElement>(null)
  const transform = useRef<Transform>(IDENTITY)
  const animation = useRef(0)
  const suppressClick = useRef(false)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<{ moved: boolean; startX: number; startY: number } | null>(null)
  const lastPinch = useRef<number | null>(null)
  // Nível de zoom (0 = ajustado), só muda ao cruzar potências de 2, para o gráfico decidir quantos rótulos mostrar.
  const [level, setLevel] = useState(0)

  const apply = useCallback((next: Transform) => {
    transform.current = next
    contentRef.current?.setAttribute('transform', `translate(${next.x} ${next.y}) scale(${next.k})`)
    contentRef.current?.style.setProperty('--inv-sqrt-k', String(1 / Math.sqrt(next.k)))
    const nextLevel = Math.max(0, Math.floor(Math.log2(next.k)))
    setLevel((current) => (current === nextLevel ? current : nextLevel))
  }, [])

  const stopAnimation = useCallback(() => cancelAnimationFrame(animation.current), [])

  const toSvgPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current
    const matrix = svg?.getScreenCTM()
    if (!svg || !matrix) return { x: 0, y: 0 }
    const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse())
    return { x: point.x, y: point.y }
  }, [])

  const zoomAt = useCallback((factor: number, point: { x: number; y: number }) => {
    const { k, x, y } = transform.current
    const nextK = Math.min(Math.max(k * factor, 1), maxScale)
    const ratio = nextK / k
    apply({ k: nextK, x: point.x - (point.x - x) * ratio, y: point.y - (point.y - y) * ratio })
  }, [apply, maxScale])

  const animateTo = useCallback((target: Transform, duration = 650) => {
    stopAnimation()
    const from = transform.current
    const start = performance.now()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function tick(now: number) {
      const linear = reduceMotion ? 1 : Math.min(Math.max((now - start) / duration, 0), 1)
      const progress = linear < 0.5 ? 2 * linear * linear : 1 - (-2 * linear + 2) ** 2 / 2
      apply({
        k: from.k * (target.k / from.k) ** progress,
        x: from.x + (target.x - from.x) * progress,
        y: from.y + (target.y - from.y) * progress,
      })
      if (linear < 1) animation.current = requestAnimationFrame(tick)
    }

    animation.current = requestAnimationFrame(tick)
  }, [apply, stopAnimation])

  const fitTo = useCallback((box: ContentBox, padding = 0.3) => {
    const width = Math.max(box.x1 - box.x0, 1) * (1 + padding)
    const height = Math.max(box.y1 - box.y0, 1) * (1 + padding)
    const k = Math.min(Math.max(Math.min(viewSize / width, viewSize / height), 1), maxFitScale, maxScale)
    animateTo({ k, x: (-(box.x0 + box.x1) / 2) * k, y: (-(box.y0 + box.y1) / 2) * k })
  }, [animateTo, maxFitScale, maxScale, viewSize])

  const reset = useCallback(() => animateTo(IDENTITY), [animateTo])
  const zoomIn = useCallback(() => { stopAnimation(); zoomAt(BUTTON_FACTOR, { x: 0, y: 0 }) }, [stopAnimation, zoomAt])
  const zoomOut = useCallback(() => { stopAnimation(); zoomAt(1 / BUTTON_FACTOR, { x: 0, y: 0 }) }, [stopAnimation, zoomAt])

  // O React registra "wheel" como passivo; precisamos de um ouvinte nativo para impedir a rolagem da página.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    function handleWheel(event: WheelEvent) {
      event.preventDefault()
      stopAnimation()
      const unit = event.deltaMode === 1 ? 16 : 1
      zoomAt(Math.exp(-event.deltaY * unit * 0.0015), toSvgPoint(event.clientX, event.clientY))
    }

    svg.addEventListener('wheel', handleWheel, { passive: false })
    return () => svg.removeEventListener('wheel', handleWheel)
  }, [stopAnimation, toSvgPoint, zoomAt])

  function endGesture(event: PointerEvent<SVGSVGElement>) {
    if (gesture.current?.moved || pointers.current.size > 1) {
      // O "click" que o navegador dispara ao soltar após arrastar não deve selecionar nada.
      suppressClick.current = true
      setTimeout(() => { suppressClick.current = false }, 0)
    }
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) lastPinch.current = null
    gesture.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const svgProps = {
    onPointerCancel: endGesture,
    onPointerDown(event: PointerEvent<SVGSVGElement>) {
      stopAnimation()
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
      gesture.current = pointers.current.size === 1 ? { moved: false, startX: event.clientX, startY: event.clientY } : null
    },
    onPointerMove(event: PointerEvent<SVGSVGElement>) {
      const previous = pointers.current.get(event.pointerId)
      if (!previous) return
      const current = { x: event.clientX, y: event.clientY }

      if (pointers.current.size === 2) {
        pointers.current.set(event.pointerId, current)
        const [a, b] = [...pointers.current.values()]
        const distance = Math.hypot(a.x - b.x, a.y - b.y)
        if (lastPinch.current) zoomAt(distance / lastPinch.current, toSvgPoint((a.x + b.x) / 2, (a.y + b.y) / 2))
        lastPinch.current = distance
        return
      }

      const active = gesture.current
      if (!active) return
      if (!active.moved) {
        if (Math.hypot(current.x - active.startX, current.y - active.startY) < DRAG_THRESHOLD) return
        active.moved = true
        event.currentTarget.setPointerCapture(event.pointerId)
      }

      const unitsPerPixel = 1 / (svgRef.current?.getScreenCTM()?.a || 1)
      const { k, x, y } = transform.current
      apply({ k, x: x + (current.x - previous.x) * unitsPerPixel, y: y + (current.y - previous.y) * unitsPerPixel })
      pointers.current.set(event.pointerId, current)
    },
    onPointerUp: endGesture,
  }

  return { contentRef, fitTo, level, reset, svgProps, svgRef, wasDragged: () => suppressClick.current, zoomIn, zoomOut }
}
