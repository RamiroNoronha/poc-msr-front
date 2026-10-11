import { useMemo, useState, type MouseEvent } from 'react'
import styled from '@emotion/styled'
import { hierarchy, pack, type HierarchyCircularNode } from 'd3-hierarchy'
import { useAnimatedView } from '../../hooks/useAnimatedView'
import type { FileOwnership } from '../../utils/ownership'
import { getNodePath, type FileNode } from '../../utils/tree'

const SIZE = 800
const NEUTRAL = '#3b4766'
const CHAR_WIDTH = 6.6
const MAX_LISTED_COLLABORATORS = 6

type CircleNode = HierarchyCircularNode<FileNode>

type CirclePackChartProps = {
  dimUncolored: boolean
  fileColors: Map<string, string>
  focusPath: string
  onFocusChange: (path: string) => void
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

function describeCollaborators(collaborators: string[]) {
  const shown = collaborators.slice(0, MAX_LISTED_COLLABORATORS).join(', ')
  const rest = collaborators.length - MAX_LISTED_COLLABORATORS
  const label = collaborators.length === 1 ? 'Colaborador' : `Colaboradores (${collaborators.length})`
  return `${label}: ${shown}${rest > 0 ? ` e mais ${rest}` : ''}`
}

function pathOf(node: CircleNode) {
  return getNodePath(node.ancestors().reverse().slice(1).map((ancestor) => ancestor.data.name))
}

export function CirclePackChart({ dimUncolored, fileColors, focusPath, onFocusChange, ownership, tree }: CirclePackChartProps) {
  const [hovered, setHovered] = useState<Hovered | null>(null)

  const { byPath, nodes, root } = useMemo(() => {
    const hierarchyRoot = hierarchy(tree)
      .sum((node) => (node.children ? 0 : Math.max(node.size ?? 0, 1)))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    const packed = pack<FileNode>().size([SIZE, SIZE]).padding(4)(hierarchyRoot)
    const items = packed.descendants().map((node) => ({ node, path: pathOf(node) }))

    return { byPath: new Map(items.map((item) => [item.path, item.node])), nodes: items, root: packed }
  }, [tree])

  const focus = byPath.get(focusPath) ?? root
  const view = useAnimatedView({ r: focus.r * 1.04, x: focus.x, y: focus.y })
  const scale = SIZE / (2 * view.r)
  const trail = focus.ancestors().reverse()

  function focusOn(node: CircleNode) {
    setHovered(null)
    onFocusChange(pathOf(node))
  }

  function zoomOut() {
    if (focus.parent) focusOn(focus.parent)
  }

  // Dentro do foco, o clique desce um nível: leva à filha do foco que contém o círculo clicado.
  function handleClick(node: CircleNode) {
    return (event: MouseEvent) => {
      const ancestors = node.ancestors()
      const focusIndex = ancestors.indexOf(focus)
      if (focusIndex === -1) return // fora do foco: o clique sobe para o SVG e afasta o zoom
      event.stopPropagation()
      if (focusIndex > 0) focusOn(ancestors[focusIndex - 1])
    }
  }

  const visible = nodes
    .map(({ node, path }) => ({
      cx: (node.x - view.x) * scale + SIZE / 2,
      cy: (node.y - view.y) * scale + SIZE / 2,
      inFocus: node.ancestors().includes(focus),
      node,
      path,
      r: node.r * scale,
    }))
    .filter(({ cx, cy, r }) => r >= 0.6 && cx + r > 0 && cx - r < SIZE && cy + r > 0 && cy - r < SIZE)

  return (
    <Wrapper>
      <Breadcrumb aria-label="Caminho do zoom">
        {trail.map((node, index) => (
          <span key={`${node.data.name}-${index}`}>
            {index > 0 ? <i aria-hidden="true">/</i> : null}
            <button disabled={node === focus} onClick={() => focusOn(node)} type="button">{index === 0 ? 'raiz' : node.data.name}</button>
          </span>
        ))}
        {focus.parent ? <UpButton onClick={zoomOut} type="button">↑ Subir um nível</UpButton> : null}
      </Breadcrumb>

      <Svg aria-label="Círculos aninhados: cada círculo é um arquivo, com área proporcional ao número de linhas, agrupados pelas pastas" onClick={zoomOut} role="img" viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {visible.map(({ cx, cy, inFocus, node, path, r }) => {
          const canZoom = inFocus && node !== focus

          if (node.children) {
            return (
              <Folder
                cx={cx}
                cy={cy}
                data-zoomable={canZoom || undefined}
                key={path || 'root'}
                onClick={handleClick(node)}
                onMouseEnter={() => setHovered({ collaborators: [], files: node.leaves().length, kind: 'folder', lines: node.value ?? 0, path: path || 'raiz do repositório' })}
                onMouseLeave={() => setHovered(null)}
                r={r}
              />
            )
          }

          const color = fileColors.get(path)
          const collaborators = ownership.get(path)?.collaborators ?? []
          return (
            <Leaf
              cx={cx}
              cy={cy}
              data-zoomable={canZoom || undefined}
              fill={color ?? NEUTRAL}
              key={path}
              onClick={handleClick(node)}
              onMouseEnter={() => setHovered({ collaborators, kind: 'file', lines: node.data.size ?? 0, path, revisions: node.data.revisions ?? 0 })}
              onMouseLeave={() => setHovered(null)}
              opacity={color ? 1 : dimUncolored ? 0.22 : 0.85}
              r={r}
            />
          )
        })}

        {visible.map(({ cx, cy, inFocus, node, path, r }) => {
          if (node.children) {
            // Nome das pastas logo abaixo do foco, para dar contexto ao navegar.
            return node.parent === focus && r > 45 ? <FolderLabel key={path} x={cx} y={cy - r + 16}>{truncate(node.data.name, r * 1.6)}</FolderLabel> : null
          }
          return inFocus && r > 26 ? <Label key={path} x={cx} y={cy}>{truncate(node.data.name, r * 1.8)}</Label> : null
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
            {hovered.kind === 'file' && hovered.collaborators.length > 0 ? <span>{describeCollaborators(hovered.collaborators)}</span> : null}
          </>
        ) : (
          <span>Clique em um círculo para dar zoom e clique fora dele para voltar. Quanto maior o círculo, mais linhas o arquivo tem.</span>
        )}
      </Details>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  gap: 0.75rem;
`

const Breadcrumb = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  min-height: 2rem;
  padding-right: 8rem;
  font-size: 0.875rem;

  i { margin-right: 0.25rem; color: var(--text-muted); font-style: normal; }

  button {
    padding: 0.2rem 0.5rem;
    border: 0;
    border-radius: 0.4rem;
    color: var(--text);
    background: transparent;
    cursor: pointer;
  }

  button:hover:not(:disabled) { background: var(--surface-strong); }
  button:disabled { color: var(--text-muted); cursor: default; }
`

const UpButton = styled.button`
  margin-left: 0.5rem;
  border: 1px solid var(--border) !important;
`

const Svg = styled.svg`
  display: block;
  width: 100%;
  max-height: var(--chart-max-height, 80vh);
  height: auto;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.25);
  cursor: zoom-out;
`

const Folder = styled.circle`
  fill: rgba(255, 255, 255, 0.025);
  stroke: rgba(255, 255, 255, 0.16);
  cursor: inherit;
  transition: stroke 0.15s;

  &[data-zoomable] { cursor: zoom-in; }
  &:hover { stroke: rgba(196, 181, 253, 0.8); }
`

const Leaf = styled.circle`
  cursor: inherit;

  &[data-zoomable] { cursor: zoom-in; }
`

const Label = styled.text`
  fill: rgba(255, 255, 255, 0.92);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
`

const FolderLabel = styled.text`
  fill: var(--text);
  font-size: 12px;
  font-weight: 600;
  paint-order: stroke;
  stroke: rgba(7, 9, 18, 0.85);
  stroke-width: 3px;
  text-anchor: middle;
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
