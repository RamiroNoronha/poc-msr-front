import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { ZoomableCirclePack } from '../../../../shared/components/ZoomableCirclePack'
import { heatColor, heatGradient } from '../../utils/heatColor'
import type { FileNode } from '../../utils/tree'

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

const Wrapper = styled.div`
  display: grid;
  gap: 0.75rem;
`

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--text-muted);
  font-size: 0.8125rem;
`

const Gradient = styled.span`
  width: 9rem;
  height: 0.55rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: ${heatGradient};
`
