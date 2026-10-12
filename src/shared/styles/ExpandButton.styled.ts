import styled from '@emotion/styled'

export const Button = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text);
  background: var(--surface-strong);
  font-size: 0.8125rem;
  cursor: pointer;
  backdrop-filter: blur(8px);

  &:hover { border-color: rgba(124, 92, 255, 0.6); }
`
