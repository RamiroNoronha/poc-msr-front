import styled from '@emotion/styled'

export const Row = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.6rem;
  border-radius: 0.7rem;
  background: var(--surface-strong);
  transition: opacity 0.15s;

  &[data-dragging] { opacity: 0.35; }

  @media (max-width: 40rem) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    select { grid-column: 1 / -1; }
  }
`

export const Handle = styled.button`
  padding: 0.3rem 0.2rem;
  border: 0;
  border-radius: 0.4rem;
  color: var(--text-muted);
  background: transparent;
  font-size: 1rem;
  letter-spacing: -0.2em;
  cursor: grab;
  touch-action: none;

  &:hover { color: var(--text); background: var(--surface); }
  &:active { cursor: grabbing; }
`

export const Info = styled.div`
  display: grid;
  min-width: 0;

  strong { overflow: hidden; font-size: 0.9rem; text-overflow: ellipsis; white-space: nowrap; }
  span { overflow: hidden; color: var(--text-muted); font-size: 0.8125rem; text-overflow: ellipsis; white-space: nowrap; }
`

export const Commits = styled.span`
  color: var(--text-muted);
  font-size: 0.8125rem;
  white-space: nowrap;
`

export const Move = styled.select`
  max-width: 11rem;
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  color: var(--text);
  background: var(--bg);
  font-size: 0.8125rem;
  cursor: pointer;
`

export const Preview = styled.div`
  display: grid;
  max-width: 22rem;
  padding: 0.6rem 0.9rem;
  border: 1px solid rgba(124, 92, 255, 0.7);
  border-radius: 0.8rem;
  background: rgba(20, 24, 44, 0.95);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  cursor: grabbing;

  strong { font-size: 0.9rem; }
  span { overflow: hidden; color: var(--text-muted); font-size: 0.8125rem; text-overflow: ellipsis; }
`
