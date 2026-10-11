import styled from '@emotion/styled'
import type { RepositoryAnalysis } from '../api/analyzeRepository'
import { useRepositoryUrl } from '../hooks/useRepositoryUrl'
import { AnalysisSummary } from './components/AnalysisSummary'
import { ExampleRepositories } from './components/ExampleRepositories'
import { RepositoryUrlForm } from './components/RepositoryUrlForm'

const FEATURES = [
  { title: 'Truck Factor', text: 'Quantas pessoas precisam sair para o projeto perder o conhecimento crítico.' },
  { title: 'Hotspots', text: 'Arquivos com mais revisões e maior concentração de mudanças no histórico.' },
  { title: 'Autoria', text: 'Quem domina cada parte do código, extraído direto do histórico Git.' },
]

type AnalyzeRepositoryViewProps = {
  analysis: RepositoryAnalysis | null
  error: string | null
  isLoading: boolean
  onShowDetails: () => void
  onSubmit: (repositoryUrl: string) => void
}

export function AnalyzeRepositoryView({ analysis, error: requestError, isLoading, onShowDetails, onSubmit }: AnalyzeRepositoryViewProps) {
  const { error, repositoryUrl, setRepositoryUrl, validate } = useRepositoryUrl()

  function handleSubmit() {
    const normalizedUrl = validate()
    if (normalizedUrl) onSubmit(normalizedUrl)
  }

  return (
    <>
      <Nav>
        <Brand><Logo aria-hidden="true" />POC-MSR</Brand>
      </Nav>
      <Hero>
        <Badge>Mining Software Repositories</Badge>
        <h1>Descubra o <em>risco de conhecimento</em> do seu repositório.</h1>
        <Description>Cole a URL de um repositório do GitHub e veja Truck Factor, hotspots e concentração de autoria em segundos.</Description>
        <RepositoryUrlForm error={error ?? requestError} isLoading={isLoading} onChange={setRepositoryUrl} onSubmit={handleSubmit} value={repositoryUrl} />
        <ExampleRepositories disabled={isLoading} onSelect={setRepositoryUrl} />
        {analysis ? (
          <>
            <AnalysisSummary analysis={analysis} />
            <DetailsButton onClick={onShowDetails} type="button">Clique aqui para ver mais detalhes →</DetailsButton>
          </>
        ) : null}
      </Hero>
      {!analysis ? (
        <Features>
          {FEATURES.map((feature) => (
            <Feature key={feature.title}>
              <h2>{feature.title}</h2>
              <p>{feature.text}</p>
            </Feature>
          ))}
        </Features>
      ) : null}
    </>
  )
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Brand = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.02em;
`

const Logo = styled.span`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.45rem;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
`

const Hero = styled.main`
  padding: clamp(3rem, 9vw, 7rem) 0 3rem;
  text-align: center;

  h1 {
    max-width: 18ch;
    margin: 1.25rem auto 0;
    font-size: clamp(2.25rem, 6vw, 4.5rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.04em;
  }

  em {
    font-style: normal;
    background: linear-gradient(120deg, #a78bfa, var(--accent-2));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`

const Badge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border: 1px solid rgba(124, 92, 255, 0.4);
  border-radius: 999px;
  color: #c4b5fd;
  background: rgba(124, 92, 255, 0.12);
  font-size: 0.8125rem;
  font-weight: 600;
`

const Description = styled.p`
  max-width: 38rem;
  margin: 1.5rem auto 0;
  color: var(--text-muted);
  font-size: 1.125rem;
  line-height: 1.6;
`

const DetailsButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.9rem 1.6rem;
  border: 0;
  border-radius: 0.8rem;
  color: #fff;
  background: linear-gradient(135deg, var(--accent), #5b8cff);
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, filter 0.15s;

  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`

const Features = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
`

const Feature = styled.article`
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);

  h2 { margin: 0; font-size: 1.05rem; }
  p { margin: 0.6rem 0 0; color: var(--text-muted); line-height: 1.55; }
`
