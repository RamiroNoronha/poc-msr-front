import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { hierarchy, pack } from 'd3-hierarchy'
import type { FileOwnership } from '../../utils/ownership'
import { getNodePath, type FileNode } from '../../utils/tree'

const SIZE = 800
const NEUTRAL = '#3b4766'
const CHAR_WIDTH = 6.6

type CirclePackChartProps = {
  dimUncolored: boolean
  fileColors: Map<string, string>
  ownership: Map<string, FileOwnership>
  tree: FileNode
}

type Hovered = {
  collaborators: string[]
  files?: number
  kind: 'file' | 'folder'
  lines: number
  path: string
  revisions?: number
}

function truncate(text: string, width: number) {
  const maxChars = Math.floor(width / CHAR_WIDTH)
  if (maxChars < 3) return ''
  return text.length > maxChars ? `${text.slice(0, maxChars - 1)}…` : text
}

export function CirclePackChart({ dimUncolored, fileColors, ownership, tree }: CirclePackChartProps) {
  const [hovered, setHovered] = useState<Hovered | null>(null)

  const nodes = useMemo(() => {
    const root = hierarchy(tree)
      .sum((node) => (node.children ? 0 : Math.max(node.size ?? 0, 1)))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    const packed = pack<FileNode>().size([SIZE, SIZE]).padding(4)(root)

    return packed.descendants().map((node) => ({
      node,
      path: getNodePath(node.ancestors().reverse().slice(1).map((ancestor) => ancestor.data.name)),
    }))
  }, [tree])

  return (
    <Wrapper>
      <Svg aria-label="Círculos aninhados: cada círculo é um arquivo, com área proporcional ao número de linhas, agrupados pelas pastas" role="img" viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {nodes.map(({ node, path }) => {
          if (node.children) {
            return (
              <Folder
                cx={node.x}
                cy={node.y}
                key={path || 'root'}
                onMouseEnter={() => setHovered({ collaborators: [], files: node.leaves().length, kind: 'folder', lines: node.value ?? 0, path: path || 'raiz do repositório' })}
                onMouseLeave={() => setHovered(null)}
                r={node.r}
              />
            )
          }

          const color = fileColors.get(path)
          const collaborators = ownership.get(path)?.collaborators ?? []
          return (
            <g
              key={path}
              onMouseEnter={() => setHovered({ collaborators, kind: 'file', lines: node.data.size ?? 0, path, revisions: node.data.revisions ?? 0 })}
              onMouseLeave={() => setHovered(null)}
            >
              <circle cx={node.x} cy={node.y} fill={color ?? NEUTRAL} opacity={color ? 1 : dimUncolored ? 0.22 : 0.85} r={node.r} />
              {node.r > 26 ? <Label x={node.x} y={node.y}>{truncate(node.data.name, node.r * 1.8)}</Label> : null}
            </g>
          )
        })}
      </Svg>

      <Details aria-live="polite">
        {hovered ? (
          <>
            <strong>{hovered.kind === 'folder' ? `📁 ${hovered.path}` : hovered.path}</strong>
            <span>
              {hovered.lines.toLocaleString('pt-BR')} linhas
              {hovered.kind === 'folder' ? ` · ${hovered.files?.toLocaleString('pt-BR')} arquivos` : ` · ${hovered.revisions?.toLocaleString('pt-BR')} revisões`}
            </span>
            {hovered.kind === 'file' ? (
              <span>{hovered.collaborators.length > 0 ? `Key developers que colaboraram: ${hovered.collaborators.join(', ')}` : 'Nenhum key developer colaborou neste arquivo.'}</span>
            ) : null}
          </>
        ) : (
          <span>Passe o mouse sobre um círculo para ver os detalhes. Quanto maior o círculo, mais linhas o arquivo tem.</span>
        )}
      </Details>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  gap: 0.75rem;
`

const Svg = styled.svg`
  display: block;
  width: 100%;
  max-height: var(--chart-max-height, 80vh);
  height: auto;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.25);
`

const Folder = styled.circle`
  fill: rgba(255, 255, 255, 0.025);
  stroke: rgba(255, 255, 255, 0.16);
  transition: stroke 0.15s;

  &:hover { stroke: rgba(196, 181, 253, 0.8); }
`

const Label = styled.text`
  fill: rgba(255, 255, 255, 0.92);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
`

const Details = styled.p`
  display: grid;
  gap: 0.15rem;
  min-height: 3.6rem;
  margin: 0;
  color: var(--text-muted);
  font-size: 0.8125rem;

  strong { color: var(--text); font-weight: 600; word-break: break-all; }
`
