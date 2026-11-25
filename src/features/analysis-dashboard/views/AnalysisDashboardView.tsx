import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CouplingSection } from '../../coupling'
import { HotspotSection } from '../../hotspot'
import { HiddenFoldersBar, pruneTree, useHiddenFolders } from '../../noise-folders'
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
  groups: string[][]
  keyDevelopers: string[]
  onBack: () => void
  repositoryUrl: string
  title: string
  tree: AnalysisTree
}

export function AnalysisDashboardView({ groups, keyDevelopers, onBack, repositoryUrl, title, tree }: AnalysisDashboardViewProps) {
  const { t } = useTranslation('common')
  const hidden = useHiddenFolders(tree)
  const visibleTree = useMemo(() => pruneTree(tree, hidden.hiddenPaths), [hidden.hiddenPaths, tree])

  return (
    <Page>
      <Header>
        <BackButton onClick={onBack} type="button">{t('back')}</BackButton>
        <h1>{title}</h1>
      </Header>
      <HiddenFoldersBar folders={hidden.folders} onRestore={hidden.restore} onRestoreAll={hidden.restoreAll} />
      <TruckFactorSection
        groups={groups}
        hiddenPaths={hidden.hiddenPaths}
        initialKeyDevelopers={keyDevelopers}
        onHideFolder={hidden.hide}
        repositoryUrl={repositoryUrl}
        tree={visibleTree}
      />
      <HotspotSection onHideFolder={hidden.hide} tree={visibleTree} />
      <CouplingSection hiddenPaths={hidden.hiddenPaths} repositoryUrl={repositoryUrl} />
    </Page>
  )
}
