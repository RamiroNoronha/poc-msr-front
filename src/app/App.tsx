import { useState } from 'react'
import { useAnalyzeRepository } from '../features/analyze-repository/hooks/useAnalyzeRepository'
import { AnalyzeRepositoryView } from '../features/analyze-repository/views/AnalyzeRepositoryView'
import { RepositoryDetailsView } from '../features/repository-details/views/RepositoryDetailsView'
import { PageContainer } from '../shared/components/PageContainer'
import { GlobalStyles } from '../shared/styles/GlobalStyles'

type Screen = 'details' | 'home'

export function App() {
  const { analysis, error, isLoading, submit } = useAnalyzeRepository()
  const [screen, setScreen] = useState<Screen>('home')

  function changeScreen(next: Screen) {
    setScreen(next)
    window.scrollTo(0, 0)
  }

  function handleSubmit(repositoryUrl: string) {
    setScreen('home')
    void submit(repositoryUrl)
  }

  return (
    <>
      <GlobalStyles />
      <PageContainer>
        {/* A home fica montada (apenas oculta) para preservar a URL digitada ao voltar. */}
        <div hidden={screen !== 'home' || undefined}>
          <AnalyzeRepositoryView analysis={analysis} error={error} isLoading={isLoading} onShowDetails={() => changeScreen('details')} onSubmit={handleSubmit} />
        </div>
        {analysis && screen === 'details' ? (
          <RepositoryDetailsView
            developers={analysis.truckFactor.key_developers}
            key={analysis.mining.repo_analyzed}
            onBack={() => changeScreen('home')}
            repositoryUrl={analysis.mining.repo_analyzed}
            title={analysis.repository?.full_name ?? analysis.mining.repo_analyzed}
            tree={analysis.mining.d3_data}
          />
        ) : null}
      </PageContainer>
    </>
  )
}
