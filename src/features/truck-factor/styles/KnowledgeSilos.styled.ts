import styled from '@emotion/styled'

export const Card = styled.section`
  display: grid;
  gap: 1.25rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);

  h2 { margin: 0; font-size: 1.1rem; }
  header p { margin: 0.4rem 0 0; color: var(--text-muted); font-size: 0.875rem; line-height: 1.5; }
`

export const Groups = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 24rem), 1fr));
  gap: 1rem;
  align-items: start;

  > button { grid-column: 1 / -1; justify-self: start; }
`

export const Group = styled.article`
  display: grid;
  gap: 0.6rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: var(--surface);
`

export const GroupHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;

  strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  small { margin-left: auto; flex: none; color: var(--text-muted); font-size: 0.75rem; }
`

export const Swatch = styled.span`
  flex: none;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
`

export const Files = styled.ul`
  display: grid;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const FileButton = styled.button`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.45rem 0.6rem;
  border: 0;
  border-radius: 0.6rem;
  color: var(--text);
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:hover { background: var(--surface-strong); }

  span { display: grid; min-width: 0; }
  strong, small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  strong { font-size: 0.875rem; font-weight: 600; }
  small { color: var(--text-muted); font-size: 0.75rem; }
  em { flex: none; color: var(--text-muted); font-size: 0.75rem; font-style: normal; }
`

export const More = styled.button`
  padding: 0.35rem 0.8rem;
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
