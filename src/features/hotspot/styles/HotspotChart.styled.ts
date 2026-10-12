import styled from '@emotion/styled'
import { heatGradient } from '../utils/heatColor'

export const Wrapper = styled.div`
  display: grid;
  gap: 0.75rem;
`

export const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--text-muted);
  font-size: 0.8125rem;
`

export const Gradient = styled.span`
  width: 9rem;
  height: 0.55rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: ${heatGradient};
`
