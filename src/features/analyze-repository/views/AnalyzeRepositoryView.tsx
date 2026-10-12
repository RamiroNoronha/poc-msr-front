import { Trans, useTranslation } from 'react-i18next'
import type { RepositoryAnalysis } from '../service/contracts'
import { useRepositoryUrl } from '../hooks/useRepositoryUrl'
import { AnalysisSummary } from './components/AnalysisSummary'
import { ExampleRepositories } from './components/ExampleRepositories'
import { RepositoryUrlForm } from './components/RepositoryUrlForm'
import { Badge, Brand, Description, DetailsButton, Feature, Features, Hero, Logo, Nav } from '../styles/AnalyzeRepositoryView.styled'

const FEATURES = ['truckFactor', 'hotspots', 'authorship'] as const

type AnalyzeRepositoryViewProps = {
  analysis: RepositoryAnalysis | null
  error: string | null
  isLoading: boolean
  onShowDetails: () => void
  onSubmit: (repositoryUrl: string) => void
}

export function AnalyzeRepositoryView({ analysis, error: requestError, isLoading, onShowDetails, onSubmit }: AnalyzeRepositoryViewProps) {
  const { t } = useTranslation('analyzeRepository')
  const { error, repositoryUrl, setRepositoryUrl, validate } = useRepositoryUrl()

  function handleSubmit() {
    const normalizedUrl = validate()
    if (normalizedUrl) onSubmit(normalizedUrl)
  }

  return (
    <>
      <Nav>
        <Brand><Logo aria-hidden="true" />{t('brand')}</Brand>
      </Nav>
      <Hero>
        <Badge>{t('badge')}</Badge>
        <h1><Trans components={{ em: <em /> }} i18nKey="hero.title" ns="analyzeRepository" /></h1>
        <Description>{t('hero.description')}</Description>
        <RepositoryUrlForm error={error ?? requestError} isLoading={isLoading} onChange={setRepositoryUrl} onSubmit={handleSubmit} value={repositoryUrl} />
        <ExampleRepositories disabled={isLoading} onSelect={setRepositoryUrl} />
        {analysis ? (
          <>
            <AnalysisSummary analysis={analysis} />
            <DetailsButton onClick={onShowDetails} type="button">{t('details.button')}</DetailsButton>
          </>
        ) : null}
      </Hero>
      {!analysis ? (
        <Features>
          {FEATURES.map((feature) => (
            <Feature key={feature}>
              <h2>{t(`features.${feature}.title`)}</h2>
              <p>{t(`features.${feature}.text`)}</p>
            </Feature>
          ))}
        </Features>
      ) : null}
    </>
  )
}
