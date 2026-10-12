import { useState } from 'react'
import { AnalysisDashboardView } from '../features/analysis-dashboard'
import { useAnalyzeRepository } from '../features/analyze-repository/hooks/useAnalyzeRepository'
import { AnalyzeRepositoryView } from '../features/analyze-repository/views/AnalyzeRepositoryView'
import { useDevelopersReview } from '../features/review-developers/hooks/useDevelopersReview'
import { ReviewDevelopersView } from '../features/review-developers/views/ReviewDevelopersView'
import { PageContainer } from '../shared/components/PageContainer'
import { GlobalStyles } from '../shared/styles/GlobalStyles'

type Screen = 'details' | 'home' | 'review'

export function App() {
  const analyze = useAnalyzeRepository()
  const developersReview = useDevelopersReview()
  const [screen, setScreen] = useState<Screen>('home')

  const { analysis } = analyze
  const { review } = developersReview

  function changeScreen(next: Screen) {
    setScreen(next)
    window.scrollTo(0, 0)
  }

  // 1ª etapa: busca só os desenvolvedores. Com sugestões de agrupamento, o usuário revisa antes da análise.
  async function handleSubmit(repositoryUrl: string) {
    analyze.reset()
    setScreen('home')

    const result = await developersReview.load(repositoryUrl)
    if (!result) return

    if (result.suggestedGroups.length === 0) void analyze.submit(repositoryUrl, [])
    else changeScreen('review')
  }

  // 2ª etapa: devolve os grupos confirmados e roda a análise com as identidades unificadas.
  function handleConfirm(groups: string[][]) {
    if (!review) return
    changeScreen('home')
    void analyze.submit(review.repositoryUrl, groups)
  }

  return (
    <>
      <GlobalStyles />
      <PageContainer>
        {/* A home fica montada (apenas oculta) para preservar a URL digitada ao voltar. */}
        <div hidden={screen !== 'home' || undefined}>
          <AnalyzeRepositoryView
            analysis={analysis}
            error={developersReview.error ?? analyze.error}
            isLoading={developersReview.isLoading || analyze.isLoading}
            onShowDetails={() => changeScreen('details')}
            onSubmit={(url) => void handleSubmit(url)}
          />
        </div>
        {review && screen === 'review' ? (
          <ReviewDevelopersView key={review.repositoryUrl} onBack={() => changeScreen('home')} onConfirm={handleConfirm} review={review} />
        ) : null}
        {analysis && screen === 'details' ? (
          <AnalysisDashboardView
            key={analysis.mining.repo_analyzed}
            keyDevelopers={analysis.truckFactor.key_developers}
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
