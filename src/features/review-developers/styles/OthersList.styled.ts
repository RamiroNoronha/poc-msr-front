import styled from '@emotion/styled'

export const Wrapper = styled.div`
  display: grid;
  gap: 0.75rem;
`

export const List = styled.div`
  display: grid;
  gap: 0.15rem;
`

export const Search = styled.input`
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 0.7rem;
  color: var(--text);
  background: var(--surface);
  font-size: 0.875rem;

  &::placeholder { color: var(--text-muted); }
`

export const More = styled.button`
  justify-self: start;
  padding: 0.35rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text);
  background: transparent;
  font-size: 0.8125rem;
  cursor: pointer;

  &:hover { background: var(--surface-strong); }
`

export const Empty = styled.p`
  margin: 0;
  color: var(--text-muted);
`
