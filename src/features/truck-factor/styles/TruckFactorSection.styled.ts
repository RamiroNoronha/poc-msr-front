import styled from '@emotion/styled'
import { expandedOverlay } from '../../../shared/styles/expandable'

export const Section = styled.section`
  display: grid;
  gap: 1.5rem;
`

export const SectionHeader = styled.header`
  h2 { margin: 0; font-size: 1.5rem; letter-spacing: -0.02em; }
  p { max-width: 52rem; margin: 0.5rem 0 0; color: var(--text-muted); line-height: 1.6; }
`

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(16rem, 1fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 60rem) {
    grid-template-columns: minmax(0, 1fr);
  }

  &[data-expanded] {
    ${expandedOverlay}
  }
`

export const ChartCard = styled.section`
  position: relative;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);
`

export const Empty = styled.p`
  padding: 1.5rem;
  border: 1px dashed var(--border);
  border-radius: 1.25rem;
  color: var(--text-muted);
  text-align: center;
`
