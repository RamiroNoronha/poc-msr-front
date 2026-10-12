import styled from '@emotion/styled'

export const Card = styled.article`
  display: grid;
  gap: 0.8rem;
  padding: 1.1rem;
  border: 1px solid rgba(124, 92, 255, 0.45);
  border-radius: 1rem;
  background: rgba(124, 92, 255, 0.07);
  transition: border-color 0.15s, background 0.15s;

  &[data-over] { border-color: var(--accent-2); background: rgba(34, 211, 238, 0.1); }

  header { display: grid; gap: 0.1rem; }
  h3 { margin: 0; font-size: 1rem; }
  small { color: var(--text-muted); font-size: 0.8125rem; }
`

export const Rows = styled.div`
  display: grid;
  gap: 0.4rem;
`
