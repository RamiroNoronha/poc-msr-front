import styled from '@emotion/styled'

export const LABEL_FONT = 10

export const Wrapper = styled.div`
  position: relative;
  display: grid;
  gap: 0.75rem;
`

export const Toolbar = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 1;
  display: flex;
  gap: 0.35rem;

  button {
    min-width: 2.1rem;
    padding: 0.35rem 0.7rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--text);
    background: var(--surface-strong);
    font-size: 0.875rem;
    cursor: pointer;
    backdrop-filter: blur(8px);
  }

  button:hover { border-color: rgba(124, 92, 255, 0.6); }
`

export const Svg = styled.svg`
  display: block;
  width: 100%;
  max-height: var(--chart-max-height, 80vh);
  height: auto;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.25);
  cursor: grab;
  touch-action: none;
  user-select: none;

  &:active { cursor: grabbing; }
`

// Espessura em pixels da tela (não escala com o zoom), para as ligações continuarem finas ao aproximar.
export const Line = styled.path`
  fill: none;
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
`

export const Hit = styled.path`
  fill: none;
  stroke: transparent;
  stroke-width: 10px;
  vector-effect: non-scaling-stroke;
  cursor: pointer;
  pointer-events: stroke;
`

// Ponto + nome crescem com √zoom (e não com o zoom inteiro), a partir do centro do ponto.
export const Mark = styled.g`
  transform: scale(var(--inv-sqrt-k, 1));
`

export const Label = styled.text`
  fill: rgba(226, 232, 240, 0.8);
  font-size: ${LABEL_FONT}px;
  pointer-events: none;

  &[data-emphasized] {
    fill: #fff;
    font-size: 12px;
    font-weight: 700;
    paint-order: stroke;
    stroke: rgba(7, 9, 18, 0.9);
    stroke-width: 3px;
  }

  /* Arquivo em foco: maior e em ciano, para se distinguir dos parceiros. */
  &[data-focus] {
    fill: #67e8f9;
    font-size: 15px;
  }
`

export const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
  margin: 0;
  padding: 0;
  color: var(--text-muted);
  font-size: 0.75rem;
  list-style: none;

  li { display: inline-flex; align-items: center; gap: 0.4rem; }
  i { width: 0.7rem; height: 0.7rem; border-radius: 50%; }
`

export const Details = styled.p`
  display: grid;
  gap: 0.15rem;
  min-height: 4.5rem;
  margin: 0;
  color: var(--text-muted);
  font-size: 0.8125rem;

  strong { color: var(--text); font-weight: 600; word-break: break-all; }
`
