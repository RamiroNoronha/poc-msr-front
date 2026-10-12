import styled from '@emotion/styled'

export const Page = styled.main`
  display: grid;
  gap: 2rem;
  padding-top: 2rem;

  section > h2 { margin: 0 0 1rem; font-size: 1.1rem; }
`

export const Header = styled.header`
  display: grid;
  gap: 1rem;
  justify-items: start;

  h1 { margin: 0; font-size: clamp(1.5rem, 3vw, 2.25rem); letter-spacing: -0.03em; }
  p { max-width: 52rem; margin: 0; color: var(--text-muted); line-height: 1.6; }
`

export const BackButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text);
  background: var(--surface);
  cursor: pointer;

  &:hover { background: var(--surface-strong); }
`

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 34rem), 1fr));
  gap: 1rem;
  align-items: start;
  margin-bottom: 1rem;
`

export const Empty = styled.p`
  margin: 0 0 1rem;
  color: var(--text-muted);
`

export const ActionBar = styled.div`
  position: sticky;
  bottom: 1rem;
  z-index: 5;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: rgba(14, 18, 32, 0.88);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  color: var(--text-muted);
  font-size: 0.9rem;

  div { display: flex; flex-wrap: wrap; gap: 0.75rem; }
`

export const ResetButton = styled.button`
  padding: 0.8rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: 0.7rem;
  color: var(--text);
  background: transparent;
  cursor: pointer;

  &:hover { background: var(--surface-strong); }
`

export const ConfirmButton = styled.button`
  padding: 0.8rem 1.4rem;
  border: 0;
  border-radius: 0.7rem;
  color: #fff;
  background: linear-gradient(135deg, var(--accent), #5b8cff);
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, filter 0.15s;

  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`
