import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useDeveloperActivity } from '../hooks/useDeveloperActivity'
import { developerColor } from '../utils/developerColors'
import { buildOwnership, selectFileColors, type CollaborationMode } from '../utils/ownership'
import type { FileNode } from '../utils/tree'
import { CirclePackChart } from './components/CirclePackChart'
import { DeveloperLegend } from './components/DeveloperLegend'

type RepositoryDetailsViewProps = {
  developers: string[]
  onBack: () => void
  repositoryUrl: string
  title: string
  tree: FileNode
}

export function RepositoryDetailsView({ developers, onBack, repositoryUrl, title, tree }: RepositoryDetailsViewProps) {
  const activity = useDeveloperActivity(repositoryUrl, developers)
  const [selected, setSelected] = useState<string | null>(null)
  const [mode, setMode] = useState<CollaborationMode>('collaborated')

  const ownership = useMemo(() => buildOwnership(activity), [activity])
  const fileColors = useMemo(() => {
    const colorOf = (developer: string) => developerColor(developers.indexOf(developer))
    return selectFileColors(ownership, colorOf, selected, mode)
  }, [developers, mode, ownership, selected])

  return (
    <Page>
      <Header>
        <BackButton onClick={onBack} type="button">← Voltar</BackButton>
        <div>
          <h1>{title}</h1>
          <p>Cada círculo é um arquivo (tamanho = linhas de código), agrupado dentro das pastas que o contêm.</p>
        </div>
      </Header>

      {(tree.children?.length ?? 0) === 0 ? (
        <Empty>Nenhum arquivo foi encontrado no histórico deste repositório.</Empty>
      ) : (
        <Layout>
          <ChartCard>
            <CirclePackChart dimUncolored={selected !== null} fileColors={fileColors} ownership={ownership} tree={tree} />
          </ChartCard>
          <DeveloperLegend activity={activity} mode={mode} onModeChange={setMode} onSelect={setSelected} selected={selected} />
        </Layout>
      )}
    </Page>
  )
}

const Page = styled.main`
  display: grid;
  gap: 1.5rem;
  padding-top: 2rem;
`

const Header = styled.header`
  display: grid;
  gap: 1rem;
  justify-items: start;

  h1 { margin: 0; font-size: clamp(1.5rem, 3vw, 2.25rem); letter-spacing: -0.03em; word-break: break-word; }
  p { margin: 0.4rem 0 0; color: var(--text-muted); }
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

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(16rem, 1fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 60rem) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const ChartCard = styled.section`
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);
`

const Empty = styled.p`
  padding: 1.5rem;
  border: 1px dashed var(--border);
  border-radius: 1.25rem;
  color: var(--text-muted);
  text-align: center;
`
