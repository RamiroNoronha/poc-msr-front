import { useTranslation } from 'react-i18next'
import { CouplingSection } from '../../coupling'
import { HotspotSection } from '../../hotspot'
import { TruckFactorSection } from '../../truck-factor'
import { BackButton, Header, Page } from '../styles/AnalysisDashboardView.styled'

// Tela principal de resultados: monta as seções de análise (cada uma é uma feature) só pela porta pública (index.ts).
// Árvore de arquivos do relatório de mineração; as seções aceitam este formato (tipagem estrutural).
type AnalysisTree = {
  authors?: { name: string; revisions: number }[]
  children?: AnalysisTree[]
  name: string
  revisions?: number
  size?: number
  weight?: number
}

type AnalysisDashboardViewProps = {
  keyDevelopers: string[]
  onBack: () => void
  repositoryUrl: string
  title: string
  tree: AnalysisTree
}

export function AnalysisDashboardView({ keyDevelopers, onBack, repositoryUrl, title, tree }: AnalysisDashboardViewProps) {
  const { t } = useTranslation('common')

  return (
    <Page>
      <Header>
        <BackButton onClick={onBack} type="button">{t('back')}</BackButton>
        <h1>{title}</h1>
      </Header>
      <TruckFactorSection keyDevelopers={keyDevelopers} tree={tree} />
      <HotspotSection tree={tree} />
      <CouplingSection repositoryUrl={repositoryUrl} />
    </Page>
  )
}
