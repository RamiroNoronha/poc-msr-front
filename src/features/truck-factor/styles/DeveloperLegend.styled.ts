import styled from '@emotion/styled'

export const Panel = styled.aside`
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);
`

export const Section = styled.section`
  display: grid;
  gap: 0.75rem;

  h2 { margin: 0; font-size: 1.05rem; }
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

export const List = styled.ul`
  display: grid;
  gap: 0.5rem;
  max-height: 22rem;
  margin: 0;
  padding: 0 0.25rem 0 0;
  overflow-y: auto;
  list-style: none;
`

export const Developer = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  color: var(--text);
  background: var(--surface);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover { background: var(--surface-strong); }
  &[aria-pressed='true'] { border-color: rgba(124, 92, 255, 0.7); background: rgba(124, 92, 255, 0.14); }

  span:last-of-type { display: grid; min-width: 0; }
  strong { overflow: hidden; font-size: 0.9rem; text-overflow: ellipsis; white-space: nowrap; }
  small { color: var(--text-muted); font-size: 0.75rem; }
`

export const Swatch = styled.span`
  flex: none;
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
`

export const Badge = styled.em`
  margin-left: 0.5rem;
  padding: 0.05rem 0.4rem;
  border: 1px solid rgba(124, 92, 255, 0.5);
  border-radius: 999px;
  color: #c4b5fd;
  font-size: 0.65rem;
  font-style: normal;
  font-weight: 600;
`

export const Hint = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: 0.8125rem;
  line-height: 1.5;
`

export const Filters = styled.div`
  display: grid;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  font-size: 0.875rem;

  label { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; }
  input { accent-color: var(--accent); }
`

export const Filter = styled.fieldset`
  display: grid;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  border: 0;

  legend { padding: 0 0 0.6rem; color: var(--text-muted); font-size: 0.8125rem; }
  &:disabled { opacity: 0.5; }
  &:disabled label { cursor: default; }
`
