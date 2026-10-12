import styled from '@emotion/styled'

export const List = styled.ul`
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid rgba(245, 158, 11, 0.4);
    border-radius: 0.7rem;
    background: rgba(245, 158, 11, 0.08);
    font-size: 0.8125rem;
  }

  span { display: grid; gap: 0.1rem; }
  strong { font-weight: 600; }
  small { color: var(--text-muted); font-size: 0.75rem; }

  button {
    flex: none;
    padding: 0.3rem 0.8rem;
    border: 1px solid rgba(245, 158, 11, 0.6);
    border-radius: 999px;
    color: #fcd34d;
    background: transparent;
    font-weight: 600;
    cursor: pointer;
  }

  button:hover { background: rgba(245, 158, 11, 0.15); }
`
