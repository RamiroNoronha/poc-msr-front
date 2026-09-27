import { useState } from 'react'
import { useRepositoryUrl } from '../hooks/useRepositoryUrl'
import { RepositoryUrlForm } from './components/RepositoryUrlForm'

export function AnalyzeRepositoryView() {
  const { error, repositoryUrl, setRepositoryUrl, validate } = useRepositoryUrl()
  const [submittedRepository, setSubmittedRepository] = useState<string | null>(null)

  function handleSubmit() {
    const normalizedUrl = validate()
    if (normalizedUrl) setSubmittedRepository(normalizedUrl)
  }

  return (
    <main>
      <p>POC-MSR</p>
      <h1>Entenda o risco de conhecimento no seu repositório.</h1>
      <p>Analise hotspots, Truck Factor e concentração de autoria a partir do histórico Git.</p>
      <RepositoryUrlForm error={error} onChange={setRepositoryUrl} onSubmit={handleSubmit} value={repositoryUrl} />
      {submittedRepository ? <p>Repositório pronto para análise: {submittedRepository}</p> : null}
    </main>
  )
}
