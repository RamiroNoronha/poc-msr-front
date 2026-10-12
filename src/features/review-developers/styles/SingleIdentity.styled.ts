import styled from '@emotion/styled'

export const Wrapper = styled.div`
  display: grid;
  gap: 0.4rem;
  padding: 0.3rem;
  border: 1px solid transparent;
  border-radius: 0.9rem;
  transition: border-color 0.15s, background 0.15s;

  &[data-over] { border-color: var(--accent-2); background: rgba(34, 211, 238, 0.1); }
`
