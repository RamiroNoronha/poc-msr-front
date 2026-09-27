type RepositoryUrlFormProps = {
  error: string | null
  onChange: (value: string) => void
  onSubmit: () => void
  value: string
}

export function RepositoryUrlForm({ error, onChange, onSubmit, value }: RepositoryUrlFormProps) {
  return (
    <form onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
      <label htmlFor="repository-url">URL do repositório GitHub</label>
      <div>
        <input id="repository-url" name="repository-url" onChange={(event) => onChange(event.target.value)} placeholder="https://github.com/owner/repository" type="url" value={value} />
        <button type="submit">Analisar</button>
      </div>
      {error ? <p role="alert">{error}</p> : null}
    </form>
  )
}
