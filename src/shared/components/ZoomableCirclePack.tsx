import { useMemo, useState, type MouseEvent, type ReactNode } from 'react'
import { hierarchy, pack, type HierarchyCircularNode } from 'd3-hierarchy'
import { useTranslation } from 'react-i18next'
import { useAnimatedView } from '../hooks/useAnimatedView'
import { Breadcrumb, Details, Folder, FolderLabel, Label, Leaf, Svg, UpButton, Wrapper } from '../styles/ZoomableCirclePack.styled'

const SIZE = 800
const CHAR_WIDTH = 6.6

export type CircleTreeNode = {
  children?: CircleTreeNode[]
  name: string
}

export type CircleLeafAppearance = {
  color: string
  opacity?: number
}

export type CircleLeafSelection<T> = {
  node: T
  path: string
  value: number
}

type Hovered<T> =
  | ({ kind: 'file' } & CircleLeafSelection<T>)
  | { files: number; kind: 'folder'; path: string; value: number }

type ZoomableCirclePackProps<T extends CircleTreeNode> = {
  // Linhas extras exibidas nos detalhes de uma folha, abaixo do caminho e do valor.
  describeLeaf?: (leaf: CircleLeafSelection<T>) => ReactNode
  focusPath?: string
  getLeafAppearance: (path: string, leaf: T) => CircleLeafAppearance
  getValue: (leaf: T) => number
  hint?: string
  onFocusChange?: (path: string) => void
  // Texto do valor de um círculo ou pasta (já com a unidade, no singular/plural certo).
  formatValue: (value: number) => string
  tree: T
}

type PackedNode<T> = HierarchyCircularNode<T>

function truncate(text: string, width: number) {
  const maxChars = Math.floor(width / CHAR_WIDTH)
  if (maxChars < 3) return ''
  return text.length > maxChars ? `${text.slice(0, maxChars - 1)}…` : text
}

function pathOf<T extends CircleTreeNode>(node: PackedNode<T>) {
  return node.ancestors().reverse().slice(1).map((ancestor) => ancestor.data.name).join('/')
}

// Circle packing com zoom: folhas são círculos (área = valor) aninhados nas pastas que as contêm.
// O foco do zoom pode ser controlado de fora (focusPath/onFocusChange) ou ficar interno.
export function ZoomableCirclePack<T extends CircleTreeNode>({
  describeLeaf,
  focusPath: controlledFocusPath,
  formatValue,
  getLeafAppearance,
  getValue,
  hint,
  onFocusChange,
  tree,
}: ZoomableCirclePackProps<T>) {
  const { t } = useTranslation('common')
  const [hovered, setHovered] = useState<Hovered<T> | null>(null)
  const [internalFocusPath, setInternalFocusPath] = useState('')
  const focusPath = controlledFocusPath ?? internalFocusPath
  const setFocusPath = onFocusChange ?? setInternalFocusPath

  const { byPath, nodes, root } = useMemo(() => {
    const hierarchyRoot = hierarchy(tree)
      .sum((node) => (node.children ? 0 : Math.max(getValue(node), 1)))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    const packed = pack<T>().size([SIZE, SIZE]).padding(4)(hierarchyRoot)
    const items = packed.descendants().map((node) => ({ node, path: pathOf(node) }))

    return { byPath: new Map(items.map((item) => [item.path, item.node])), nodes: items, root: packed }
  }, [getValue, tree])

  const focus = byPath.get(focusPath) ?? root
  const view = useAnimatedView({ r: focus.r * 1.04, x: focus.x, y: focus.y })
  const scale = SIZE / (2 * view.r)
  const trail = focus.ancestors().reverse()

  function focusOn(node: PackedNode<T>) {
    setHovered(null)
    setFocusPath(pathOf(node))
  }

  function zoomOut() {
    if (focus.parent) focusOn(focus.parent)
  }

  // Dentro do foco, o clique desce um nível: leva à filha do foco que contém o círculo clicado.
  function handleClick(node: PackedNode<T>) {
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
      <Breadcrumb aria-label={t('circlePack.breadcrumb')}>
        {trail.map((node, index) => (
          <span key={`${node.data.name}-${index}`}>
            {index > 0 ? <i aria-hidden="true">/</i> : null}
            <button disabled={node === focus} onClick={() => focusOn(node)} type="button">{index === 0 ? t('circlePack.root') : node.data.name}</button>
          </span>
        ))}
        {focus.parent ? <UpButton onClick={zoomOut} type="button">{t('circlePack.up')}</UpButton> : null}
      </Breadcrumb>

      <Svg aria-label={t('circlePack.svgLabel')} onClick={zoomOut} role="img" viewBox={`0 0 ${SIZE} ${SIZE}`}>
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
                onMouseEnter={() => setHovered({ files: node.leaves().length, kind: 'folder', path: path || t('circlePack.rootFolder'), value: node.value ?? 0 })}
                onMouseLeave={() => setHovered(null)}
                r={r}
              />
            )
          }

          const { color, opacity = 1 } = getLeafAppearance(path, node.data)
          return (
            <Leaf
              cx={cx}
              cy={cy}
              data-zoomable={canZoom || undefined}
              fill={color}
              key={path}
              onClick={handleClick(node)}
              onMouseEnter={() => setHovered({ kind: 'file', node: node.data, path, value: getValue(node.data) })}
              onMouseLeave={() => setHovered(null)}
              opacity={opacity}
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
              {formatValue(hovered.value)}
              {hovered.kind === 'folder' ? ` · ${t('circlePack.fileCount', { count: hovered.files })}` : ''}
            </span>
            {hovered.kind === 'file' ? describeLeaf?.(hovered) : null}
          </>
        ) : (
          <span>{hint ?? t('circlePack.defaultHint')}</span>
        )}
      </Details>
    </Wrapper>
  )
}
