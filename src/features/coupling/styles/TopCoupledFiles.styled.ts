import styled from '@emotion/styled'

export const List = styled.ol`
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Item = styled.button`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  color: var(--text);
  background: var(--surface);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover { background: var(--surface-strong); }
  &[aria-pressed='true'] { border-color: rgba(34, 211, 238, 0.7); background: rgba(34, 211, 238, 0.1); }

  span { display: grid; min-width: 0; }
  strong, span small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  strong { font-size: 0.8125rem; }
  span small { color: var(--text-muted); font-size: 0.6875rem; }
  em { display: grid; justify-items: end; font-size: 1rem; font-style: normal; font-weight: 700; }
  em small { color: var(--text-muted); font-size: 0.6875rem; font-weight: 400; }
`
