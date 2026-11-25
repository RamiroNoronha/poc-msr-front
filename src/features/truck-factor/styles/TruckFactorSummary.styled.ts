import styled from '@emotion/styled'

export const Summary = styled.section`
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  gap: 1.5rem;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);

  &[data-loading] { opacity: 0.6; }

  @media (max-width: 40rem) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.75rem;
  }
`

export const Metric = styled.div`
  display: grid;
  gap: 0.15rem;

  span { color: var(--text-muted); font-size: 0.8rem; }
  strong { font-size: 1.75rem; letter-spacing: -0.02em; }
`

export const KeyDevelopers = styled.div`
  display: grid;
  gap: 0.35rem;

  span { color: var(--text-muted); font-size: 0.8rem; }
  p { margin: 0; line-height: 1.5; }
`

export const Note = styled.p`
  grid-column: 1 / -1;
  margin: 0;
  color: var(--text-muted);
  font-size: 0.8rem;
`
