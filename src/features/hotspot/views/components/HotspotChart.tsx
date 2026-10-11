import styled from '@emotion/styled'
import { ZoomableCirclePack } from '../../../../shared/components/ZoomableCirclePack'
import { heatColor, heatGradient } from '../../utils/heatColor'
import type { FileNode } from '../../utils/tree'

const HINT = 'Clique em um círculo para dar zoom e clique fora dele para voltar. Círculos grandes e vermelhos são os hotspots.'

const getLines = (file: FileNode) => file.size ?? 0
const getAppearance = (_path: string, file: FileNode) => ({ color: heatColor(file.weight ?? 0) })

export function HotspotChart({ tree }: { tree: FileNode }) {
  return (
    <Wrapper>
      <ZoomableCirclePack
        describeLeaf={({ node }) => <span>{(node.revisions ?? 0).toLocaleString('pt-BR')} revisões</span>}
        getLeafAppearance={getAppearance}
        getValue={getLines}
        hint={HINT}
        tree={tree}
        valueUnit="linhas"
      />
      <Legend>
        <span>Poucas mudanças</span>
        <Gradient />
        <span>Muitas mudanças</span>
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
