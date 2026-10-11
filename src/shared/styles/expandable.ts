import { css } from '@emotion/react'

// Estilos do painel em "tela cheia"; aplicar dentro de `&[data-expanded] { ... }`.
export const expandedOverlay = css`
  --chart-max-height: calc(100vh - 9rem);
  position: fixed;
  inset: 0;
  z-index: 10;
  align-content: start;
  padding: 1.5rem;
  overflow: auto;
  background: var(--bg);
`
