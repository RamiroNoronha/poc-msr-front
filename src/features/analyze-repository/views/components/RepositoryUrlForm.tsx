import styled from '@emotion/styled'

type RepositoryUrlFormProps = {
  error: string | null
  onChange: (value: string) => void
  onSubmit: () => void
  value: string
}

export function RepositoryUrlForm({ error, onChange, onSubmit, value }: RepositoryUrlFormProps) {
  return (
    <Form onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
      <Label htmlFor="repository-url">URL do repositório GitHub</Label>
      <Controls>
        <input id="repository-url" name="repository-url" onChange={(event) => onChange(event.target.value)} placeholder="https://github.com/owner/repository" type="url" value={value} />
        <button type="submit">Analisar</button>
      </Controls>
      {error ? <ErrorMessage role="alert">{error}</ErrorMessage> : null}
    </Form>
  )
}

const Form = styled.form`
  display: grid;
  gap: 0.75rem;
  width: min(100%, 42rem);
  margin-top: 2rem;
`

const Label = styled.label`
  font-weight: 600;
`

const Controls = styled.div`
  display: flex;
  gap: 0.75rem;

  input {
    min-width: 0;
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid #c8cfdb;
    border-radius: 0.5rem;
    background: #ffffff;
  }

  button {
    padding: 0.75rem 1rem;
    border: 0;
    border-radius: 0.5rem;
    color: #ffffff;
    background: #1f3b74;
    cursor: pointer;
  }
`

const ErrorMessage = styled.p`
  margin: 0;
  color: #b42318;
`
