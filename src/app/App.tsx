import { AnalyzeRepositoryView } from '../features/analyze-repository/views/AnalyzeRepositoryView'
import { PageContainer } from '../shared/components/PageContainer'
import { GlobalStyles } from '../shared/styles/GlobalStyles'

export function App() {
  return (
    <>
      <GlobalStyles />
      <PageContainer>
        <AnalyzeRepositoryView />
      </PageContainer>
    </>
  )
}
