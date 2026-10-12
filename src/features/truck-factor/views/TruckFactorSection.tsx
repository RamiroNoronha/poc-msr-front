import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExpandButton } from '../../../shared/components/ExpandButton'
import { useExpandable } from '../../../shared/hooks/useExpandable'
import { assignDeveloperColors, OTHERS_COLOR, SELECTED_OTHER_COLOR } from '../utils/developerColors'
import { buildOwnership, isSoloFile, selectFileColors, summarizeDevelopers, type CollaborationMode } from '../utils/ownership'
import { collectFiles, type FileNode } from '../utils/tree'
import { DeveloperLegend } from './components/DeveloperLegend'
import { KnowledgeSilos } from './components/KnowledgeSilos'
import { OwnershipCircles } from './components/OwnershipCircles'
import { ChartCard, Empty, Layout, Section, SectionHeader } from '../styles/TruckFactorSection.styled'

type TruckFactorSectionProps = {
  keyDevelopers: string[]
  tree: FileNode
}

export function TruckFactorSection({ keyDevelopers, tree }: TruckFactorSectionProps) {
  const { t } = useTranslation('truckFactor')
  const { t: tCommon } = useTranslation('common')
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
        <h2>{t('section.title')}</h2>
        <p>{t('section.description')}</p>
      </SectionHeader>

      {files.length === 0 ? (
        <Empty>{tCommon('noFiles')}</Empty>
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
