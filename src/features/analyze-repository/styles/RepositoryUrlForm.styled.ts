import styled from '@emotion/styled'

export const Form = styled.form`
  display: grid;
  gap: 0.75rem;
  width: min(100%, 40rem);
  margin: 2.5rem auto 0;
`

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.5rem 0.5rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: var(--surface-strong);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35), 0 0 0 6px rgba(124, 92, 255, 0.06);
  backdrop-filter: blur(12px);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: rgba(124, 92, 255, 0.7);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35), 0 0 0 6px rgba(124, 92, 255, 0.18);
  }

  &[data-invalid='true'] { border-color: var(--danger); }

  input {
    min-width: 0;
    flex: 1;
    padding: 0.7rem 0;
    border: 0;
    outline: 0;
    color: var(--text);
    background: transparent;
    font-size: 1rem;
  }

  input::placeholder { color: var(--text-muted); }

  button {
    padding: 0.8rem 1.4rem;
    border: 0;
    border-radius: 0.7rem;
    color: #fff;
    background: linear-gradient(135deg, var(--accent), #5b8cff);
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, filter 0.15s;
  }

  button:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
  button:disabled { opacity: 0.6; cursor: progress; }

  @media (max-width: 30rem) {
    flex-wrap: wrap;
    padding: 0.75rem;
    button { width: 100%; }
    svg { display: none; }
  }
`

export const GitHubIcon = styled.svg`
  flex: none;
  color: var(--text-muted);
`

export const ErrorMessage = styled.p`
  margin: 0;
  color: var(--danger);
  font-size: 0.9rem;
  text-align: center;
`
