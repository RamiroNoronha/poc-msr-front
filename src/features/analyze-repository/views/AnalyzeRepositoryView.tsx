import { useState } from 'react'
import styled from '@emotion/styled'
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
    <Content>
      <Eyebrow>POC-MSR</Eyebrow>
      <h1>Entenda o risco de conhecimento no seu repositório.</h1>
      <Description>Analise hotspots, Truck Factor e concentração de autoria a partir do histórico Git.</Description>
      <RepositoryUrlForm error={error} onChange={setRepositoryUrl} onSubmit={handleSubmit} value={repositoryUrl} />
      {submittedRepository ? <Result>Repositório pronto para análise: {submittedRepository}</Result> : null}
    </Content>
  )
}

const Content = styled.main`
  padding: clamp(2rem, 8vw, 7rem);
  border: 1px solid #e1e6ef;
  border-radius: 1rem;
  background: #ffffff;

  h1 {
    max-width: 16ch;
    margin: 0;
    font-size: clamp(2.25rem, 5vw, 4.5rem);
    line-height: 1.05;
    letter-spacing: -0.04em;
  }
`

const Eyebrow = styled.p`
  margin: 0 0 1rem;
  color: #1f3b74;
  font-weight: 700;
  letter-spacing: 0.1em;
`

const Description = styled.p`
  max-width: 42rem;
  margin: 1.5rem 0 0;
  color: #526078;
  font-size: 1.125rem;
  line-height: 1.6;
`

const Result = styled.p`
  margin: 1rem 0 0;
  color: #1f3b74;
  font-weight: 600;
`
