import styled from '@emotion/styled'

export const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: var(--text-muted);
  font-size: 0.875rem;

  button {
    padding: 0.3rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--text);
    background: var(--surface);
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }

  button:hover:not(:disabled) { border-color: rgba(124, 92, 255, 0.6); background: var(--surface-strong); }
`
