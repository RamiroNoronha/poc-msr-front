import { useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { ExpandButton } from '../../../shared/components/ExpandButton'
import { useExpandable } from '../../../shared/hooks/useExpandable'
import { expandedOverlay } from '../../../shared/styles/expandable'
import { assignDeveloperColors, OTHERS_COLOR, SELECTED_OTHER_COLOR } from '../utils/developerColors'
import { buildOwnership, isSoloFile, selectFileColors, summarizeDevelopers, type CollaborationMode } from '../utils/ownership'
import { collectFiles, type FileNode } from '../utils/tree'
import { DeveloperLegend } from './components/DeveloperLegend'
import { KnowledgeSilos } from './components/KnowledgeSilos'
import { OwnershipCircles } from './components/OwnershipCircles'

type TruckFactorSectionProps = {
  keyDevelopers: string[]
  tree: FileNode
}

export function TruckFactorSection({ keyDevelopers, tree }: TruckFactorSectionProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [mode, setMode] = useState<CollaborationMode>('collaborated')
  const [soloOnly, setSoloOnly] = useState(false)
  const { isExpanded, toggle } = useExpandable()
  const [focusPath, setFocusPath] = useState('')
  const chartRef = useRef<HTMLElement>(null)

  const files = useMemo(() => collectFiles(tree), [tree])
  const ownership = useMemo(() => buildOwnership(files), [files])
  const developers = useMemo(() => summarizeDevelopers(files), [files])
  const soloFiles = useMemo(() => files.filter(isSoloFile), [files])
  const colors = useMemo(() => assignDeveloperColors(developers.map((developer) => developer.name)), [developers])
  const fileColors = useMemo(() => {
    const colorOf = (developer: string) => colors.get(developer) ?? (developer === selected ? SELECTED_OTHER_COLOR : OTHERS_COLOR)
    return selectFileColors(ownership, colorOf, selected, mode, soloOnly)
  }, [colors, mode, ownership, selected, soloOnly])

  function showFileInChart(path: string) {
    setFocusPath(path)
    chartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <Section>
      <SectionHeader>
        <h2>Truck Factor</h2>
        <p>
          Cada círculo é um arquivo (tamanho = linhas de código), agrupado dentro das pastas que o contêm. Escolha um desenvolvedor para ver os arquivos
          em que ele atuou e onde o conhecimento está concentrado em uma pessoa só.
        </p>
      </SectionHeader>

      {files.length === 0 ? (
        <Empty>Nenhum arquivo foi encontrado no histórico deste repositório.</Empty>
      ) : (
        <>
        <Layout data-expanded={isExpanded || undefined}>
          <ChartCard ref={chartRef}>
            <ExpandButton isExpanded={isExpanded} onToggle={toggle} />
            <OwnershipCircles dimUncolored={selected !== null || soloOnly} fileColors={fileColors} focusPath={focusPath} onFocusChange={setFocusPath} ownership={ownership} tree={tree} />
          </ChartCard>
          <DeveloperLegend
            colors={colors}
            developers={developers}
            keyDevelopers={keyDevelopers}
            mode={mode}
            onModeChange={setMode}
            onSelect={setSelected}
            onSoloOnlyChange={setSoloOnly}
            selected={selected}
            soloFileCount={soloFiles.length}
            soloOnly={soloOnly}
          />
        </Layout>
        <KnowledgeSilos colors={colors} onSelectFile={showFileInChart} soloFiles={soloFiles} totalFiles={files.length} />
        </>
      )}
    </Section>
  )
}

const Section = styled.section`
  display: grid;
  gap: 1.5rem;
`

const SectionHeader = styled.header`
  h2 { margin: 0; font-size: 1.5rem; letter-spacing: -0.02em; }
  p { max-width: 52rem; margin: 0.5rem 0 0; color: var(--text-muted); line-height: 1.6; }
`

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(16rem, 1fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 60rem) {
    grid-template-columns: minmax(0, 1fr);
  }

  &[data-expanded] {
    ${expandedOverlay}
  }
`

const ChartCard = styled.section`
  position: relative;
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
