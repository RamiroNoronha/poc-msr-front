import styled from '@emotion/styled'

export const Bar = styled.section`
  display: grid;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: var(--surface);
`

export const Summary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;

  span { color: var(--text-muted); }
`

export const TextButton = styled.button`
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text);
  background: transparent;
  cursor: pointer;

  &:hover { background: var(--surface-strong); }
`

export const List = styled.ul`
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Item = styled.li`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  background: var(--surface-strong);

  div { display: grid; gap: 0.125rem; min-width: 0; }
  strong { overflow-wrap: anywhere; }
  small { color: var(--text-muted); }
`

export const Hint = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: 0.875rem;
`
