import styled from '@emotion/styled'

type RepositoryUrlFormProps = {
  error: string | null
  isLoading: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  value: string
}

export function RepositoryUrlForm({ error, isLoading, onChange, onSubmit, value }: RepositoryUrlFormProps) {
  return (
    <Form onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
      <SearchBar data-invalid={error ? 'true' : undefined}>
        <GitHubIcon aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 16 16" width="20">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </GitHubIcon>
        <input aria-label="URL do repositório GitHub" aria-invalid={error ? true : undefined} autoComplete="off" disabled={isLoading} id="repository-url" name="repository-url" onChange={(event) => onChange(event.target.value)} placeholder="https://github.com/owner/repository" inputMode="url" spellCheck={false} type="text" value={value} />
        <button disabled={isLoading} type="submit">{isLoading ? 'Analisando…' : 'Analisar'}</button>
      </SearchBar>
      {error ? <ErrorMessage role="alert">{error}</ErrorMessage> : null}
    </Form>
  )
}

const Form = styled.form`
  display: grid;
  gap: 0.75rem;
  width: min(100%, 40rem);
  margin: 2.5rem auto 0;
`

const SearchBar = styled.div`
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

const GitHubIcon = styled.svg`
  flex: none;
  color: var(--text-muted);
`

const ErrorMessage = styled.p`
  margin: 0;
  color: var(--danger);
  font-size: 0.9rem;
  text-align: center;
`
