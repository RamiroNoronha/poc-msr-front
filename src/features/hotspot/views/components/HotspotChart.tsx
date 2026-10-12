import { useTranslation } from 'react-i18next'
import { ZoomableCirclePack } from '../../../../shared/components/ZoomableCirclePack'
import { heatColor } from '../../utils/heatColor'
import type { FileNode } from '../../utils/tree'
import { Gradient, Legend, Wrapper } from '../../styles/HotspotChart.styled'

const getLines = (file: FileNode) => file.size ?? 0
const getAppearance = (_path: string, file: FileNode) => ({ color: heatColor(file.weight ?? 0) })

export function HotspotChart({ tree }: { tree: FileNode }) {
  const { t } = useTranslation('hotspot')

  return (
    <Wrapper>
      <ZoomableCirclePack
        describeLeaf={({ node }) => <span>{t('units.revisions', { count: node.revisions ?? 0 })}</span>}
        formatValue={(value) => t('units.lines', { count: value })}
        getLeafAppearance={getAppearance}
        getValue={getLines}
        hint={t('chart.hint')}
        tree={tree}
      />
      <Legend>
        <span>{t('chart.legendLow')}</span>
        <Gradient />
        <span>{t('chart.legendHigh')}</span>
      </Legend>
    </Wrapper>
  )
}
