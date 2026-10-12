import styled from '@emotion/styled'
import { expandedOverlay } from '../../../shared/styles/expandable'

export const Section = styled.section`
  display: grid;
  gap: 1.5rem;
`

export const SectionHeader = styled.header`
  h2 { margin: 0; font-size: 1.5rem; letter-spacing: -0.02em; }
  p { max-width: 52rem; margin: 0.5rem 0 0; color: var(--text-muted); line-height: 1.6; }
  code { padding: 0.05rem 0.35rem; border-radius: 0.3rem; background: var(--surface-strong); font-size: 0.85em; }
`

export const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  gap: 1rem 1.5rem;

  label { display: grid; gap: 0.3rem; max-width: 15rem; color: var(--text-muted); font-size: 0.8125rem; }
  label b { color: var(--text); font-weight: 600; }
  label small { font-size: 0.6875rem; line-height: 1.35; }
  select {
    padding: 0.5rem 0.8rem;
    border: 1px solid var(--border);
    border-radius: 0.7rem;
    color: var(--text);
    background: var(--surface);
    font-size: 0.875rem;
    cursor: pointer;
  }
`

export const Summary = styled.p`
  margin: -0.5rem 0 0;
  color: var(--text-muted);
  font-size: 0.8125rem;
`

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(18rem, 1fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 60rem) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const Card = styled.div`
  position: relative;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);
  transition: opacity 0.2s;

  &[data-loading] { opacity: 0.5; }
  &[data-expanded] {
    ${expandedOverlay}
  }
`

export const Side = styled.aside`
  display: grid;
  gap: 0.75rem;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);

  p { margin: 0; color: var(--text-muted); font-size: 0.8125rem; line-height: 1.5; }
`

export const Tabs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: 0.8rem;
  background: var(--surface-strong);

  button {
    padding: 0.5rem 0.6rem;
    border: 0;
    border-radius: 0.6rem;
    color: var(--text-muted);
    background: transparent;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
  }

  button[aria-selected='true'] { color: var(--text); background: rgba(124, 92, 255, 0.25); }
`

export const Message = styled.p`
  margin: 0;
  padding: 1.5rem;
  border: 1px dashed var(--border);
  border-radius: 1.25rem;
  color: var(--text-muted);
  text-align: center;

  &[role='alert'] { border-color: var(--danger); color: var(--danger); }
`
