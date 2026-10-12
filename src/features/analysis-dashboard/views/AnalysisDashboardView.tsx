import styled from '@emotion/styled'
import { CouplingSection } from '../../coupling'
import { HotspotSection } from '../../hotspot'
import { TruckFactorSection } from '../../truck-factor'

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
  return (
    <Page>
      <Header>
        <BackButton onClick={onBack} type="button">← Voltar</BackButton>
        <h1>{title}</h1>
      </Header>
      <TruckFactorSection keyDevelopers={keyDevelopers} tree={tree} />
      <HotspotSection tree={tree} />
      <CouplingSection repositoryUrl={repositoryUrl} />
    </Page>
  )
}

const Page = styled.main`
  display: grid;
  gap: 3rem;
  padding-top: 2rem;
`

const Header = styled.header`
  display: grid;
  gap: 1rem;
  justify-items: start;

  h1 { margin: 0; font-size: clamp(1.5rem, 3vw, 2.25rem); letter-spacing: -0.03em; word-break: break-word; }
`

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text);
  background: var(--surface);
  cursor: pointer;

  &:hover { background: var(--surface-strong); }
`
