import { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { cluster, hierarchy, type HierarchyPointNode } from 'd3-hierarchy'
import { curveBundle, lineRadial } from 'd3-shape'
import { useTranslation } from 'react-i18next'
import { formatPercent } from '../../../../shared/i18n/format'
import { useSvgZoom } from '../../../../shared/hooks/useSvgZoom'
import type { CouplingFile, CouplingLink } from '../../service/contracts'
import { buildFileTree, splitPath, type TreeNode } from '../../utils/fileTree'
import { linkKey } from '../../utils/fileStats'
import { assignFolderColors, folderOf } from '../../utils/folderColors'

const RADIUS = 330
const LABEL_FONT = 10
const CHAR_WIDTH = 5.4
const MAX_LABEL_ROOM = 200
const LABEL_LIMIT = 160
const ZOOM_LABEL_LEVEL = 2
const HIGHLIGHT = '#22d3ee'
const BASE_LINK = '#a78bfa'
const TOP_COUPLED_SHOWN = 5

type CouplingGraphProps = {
  // Arquivos e ligações que definem o layout (posições fixas); o que aparece é decidido por visibleFiles/visibleLinks.
  files: CouplingFile[]
  links: CouplingLink[]
  // true: as ligações só aparecem ao selecionar um arquivo (filtro de arquivos com muitos acoplamentos).
  revealOnSelect: boolean
  visibleFiles: Set<string> | null
  visibleLinks: Set<string> | null
  onSelectFile: (path: string | null) => void
  onSelectLink: (link: CouplingLink | null) => void
  selectedFile: string | null
  selectedLink: CouplingLink | null
}

const toCartesian = (node: { x: number; y: number }): [number, number] => [node.y * Math.sin(node.x), -node.y * Math.cos(node.x)]

export function CouplingGraph({ files, links, onSelectFile, onSelectLink, revealOnSelect, selectedFile, selectedLink, visibleFiles, visibleLinks }: CouplingGraphProps) {
  const { t } = useTranslation('coupling')
  const [hoverFile, setHoverFile] = useState<string | null>(null)
  const [hoverLink, setHoverLink] = useState<CouplingLink | null>(null)

  // O viewBox reserva espaço para o maior nome, para os rótulos não serem cortados.
  const labelRoom = Math.min(MAX_LABEL_ROOM, 24 + Math.max(...files.map((file) => splitPath(file.path).name.length), 0) * CHAR_WIDTH)
  const size = 2 * (RADIUS + labelRoom)
  const { contentRef, fitTo, level, reset, svgProps, svgRef, wasDragged, zoomIn, zoomOut } = useSvgZoom({ viewSize: size })

  const folderColors = useMemo(() => assignFolderColors(files.map((file) => file.path)), [files])
  const fileInfo = useMemo(() => new Map(files.map((file) => [file.path, file])), [files])

  const { edges, leaves } = useMemo(() => {
    const root = hierarchy(buildFileTree(files.map((file) => file.path))).sort((a, b) => a.data.name.localeCompare(b.data.name))
    const laidOut = cluster<TreeNode>().size([2 * Math.PI, RADIUS])(root)
    const leafByPath = new Map(laidOut.leaves().map((leaf) => [leaf.data.path ?? '', leaf]))
    const line = lineRadial<HierarchyPointNode<TreeNode>>().curve(curveBundle.beta(0.85)).radius((node) => node.y).angle((node) => node.x)

    const bundled = links.flatMap((link) => {
      const source = leafByPath.get(link.source)
      const target = leafByPath.get(link.target)
      if (!source || !target) return []
      const route = source.path(target)
      return [{ d: line(route) ?? '', key: linkKey(link), link, points: route.map(toCartesian) }]
    })

    return { edges: bundled, leaves: laidOut.leaves() }
  }, [files, links])

  const drawnEdges = useMemo(() => (visibleLinks ? edges.filter((edge) => visibleLinks.has(edge.key)) : edges), [edges, visibleLinks])
  const drawnLeaves = useMemo(() => (visibleFiles ? leaves.filter((leaf) => visibleFiles.has(leaf.data.path ?? '')) : leaves), [leaves, visibleFiles])

  // Ao selecionar uma ligação (no gráfico ou na lista), aproxima até o par.
  const selectedKey = selectedLink ? linkKey(selectedLink) : null
  useEffect(() => {
    const edge = edges.find((candidate) => candidate.key === selectedKey)
    if (!edge) return
    const xs = edge.points.map(([x]) => x)
    const ys = edge.points.map(([, y]) => y)
    fitTo({ x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) })
  }, [edges, fitTo, selectedKey])

  // Ao selecionar um arquivo (no gráfico ou na lista), aproxima até ele e os arquivos acoplados a ele.
  useEffect(() => {
    if (!selectedFile) return
    const group = new Set([selectedFile])
    for (const link of links) {
      if (link.source === selectedFile) group.add(link.target)
      else if (link.target === selectedFile) group.add(link.source)
    }

    const points = leaves.filter((leaf) => group.has(leaf.data.path ?? '')).map(toCartesian)
    if (points.length === 0) return
    const xs = points.map(([x]) => x)
    const ys = points.map(([, y]) => y)
    // Folga maior que a do par, porque os nomes ficam ao lado dos pontos.
    fitTo({ x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }, 0.6)
  }, [fitTo, leaves, links, selectedFile])

  const activeLink = hoverLink ?? selectedLink
  const activeFile = activeLink ? null : hoverFile ?? selectedFile

  const coupledToActiveFile = useMemo(() => {
    if (!activeFile) return []
    return links.filter((link) => link.source === activeFile || link.target === activeFile).sort((a, b) => b.degree - a.degree)
  }, [activeFile, links])

  // Com um arquivo em foco: o grau de cada parceiro e o parceiro mais fortemente acoplado (a lista já vem ordenada por grau).
  const partnerDegree = useMemo(
    () => new Map(coupledToActiveFile.map((link) => [link.source === activeFile ? link.target : link.source, link.degree])),
    [activeFile, coupledToActiveFile],
  )
  const strongestLink = coupledToActiveFile[0] ?? null
  const strongestKey = strongestLink ? linkKey(strongestLink) : null
  const strongestPartner = strongestLink ? (strongestLink.source === activeFile ? strongestLink.target : strongestLink.source) : null

  const highlightedFiles = useMemo(() => {
    const set = new Set<string>()
    if (activeLink) { set.add(activeLink.source); set.add(activeLink.target) }
    if (activeFile) {
      set.add(activeFile)
      coupledToActiveFile.forEach((link) => { set.add(link.source); set.add(link.target) })
    }
    return set
  }, [activeFile, activeLink, coupledToActiveFile])

  const hasFocus = activeLink !== null || activeFile !== null
  const isHighlighted = (link: CouplingLink) =>
    activeLink ? linkKey(link) === linkKey(activeLink) : activeFile ? link.source === activeFile || link.target === activeFile : false
  const showAllLabels = drawnLeaves.length <= LABEL_LIMIT || level >= ZOOM_LABEL_LEVEL

  function clearSelection() {
    if (wasDragged()) return
    onSelectFile(null)
    onSelectLink(null)
  }

  const ordered = [...drawnEdges.filter(({ link }) => !isHighlighted(link)), ...drawnEdges.filter(({ link }) => isHighlighted(link))]

  return (
    <Wrapper>
      <Toolbar aria-label={t('toolbar.label')}>
        <button aria-label={t('toolbar.zoomIn')} onClick={zoomIn} title={t('toolbar.zoomIn')} type="button">+</button>
        <button aria-label={t('toolbar.zoomOut')} onClick={zoomOut} title={t('toolbar.zoomOut')} type="button">−</button>
        <button onClick={reset} title={t('toolbar.resetTitle')} type="button">{t('toolbar.reset')}</button>
      </Toolbar>

      <Svg
        {...svgProps}
        aria-label={t('graph.ariaLabel')}
        onClick={clearSelection}
        ref={svgRef}
        role="img"
        viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
      >
        <g ref={contentRef}>
          <g>
            {ordered.map(({ d, key, link }) => {
              const highlighted = isHighlighted(link)
              const opacity = hasFocus ? (highlighted ? 1 : 0.03) : Math.min(0.18 + link.degree * 0.9, 0.7)
              const isMain = highlighted && activeFile !== null && key === strongestKey
              const width = 0.8 + link.degree * 5
              return (
                <g key={key} style={{ pointerEvents: 'none' }}>
                  {highlighted ? <Line d={d} opacity={isMain ? 0.5 : 0.28} stroke={HIGHLIGHT} strokeWidth={width + (isMain ? 14 : 9)} /> : null}
                  <Line d={d} opacity={opacity} stroke={highlighted ? (isMain ? '#a5f3fc' : HIGHLIGHT) : BASE_LINK} strokeWidth={highlighted ? width + (isMain ? 4 : 2) : width} />
                </g>
              )
            })}
          </g>

          <g>
            {drawnEdges.map(({ d, key, link }) => (
              <Hit
                d={d}
                key={key}
                onClick={(event) => {
                  event.stopPropagation()
                  if (wasDragged()) return
                  onSelectFile(null)
                  onSelectLink(selectedLink && linkKey(selectedLink) === key ? null : link)
                }}
                onMouseEnter={() => setHoverLink(link)}
                onMouseLeave={() => setHoverLink(null)}
              />
            ))}
          </g>

          <g>
            {drawnLeaves.map((leaf) => {
              const path = leaf.data.path ?? ''
              const onRight = leaf.x < Math.PI
              const emphasized = highlightedFiles.has(path)
              const isFocus = path === activeFile
              const degree = partnerDegree.get(path)
              const name = splitPath(path).name
              const labelText = isFocus || degree === undefined ? name : t(path === strongestPartner ? 'graph.strongestLabel' : 'graph.partnerLabel', { degree: formatPercent(degree), name })
              const labelled = showAllLabels || emphasized
              return (
                <g
                  key={path}
                  onClick={(event) => {
                    event.stopPropagation()
                    if (wasDragged()) return
                    onSelectLink(null)
                    onSelectFile(selectedFile === path ? null : path)
                  }}
                  onMouseEnter={() => setHoverFile(path)}
                  onMouseLeave={() => setHoverFile(null)}
                  opacity={hasFocus && !emphasized ? 0.4 : 1}
                  style={{ cursor: 'pointer' }}
                  transform={`rotate(${(leaf.x * 180) / Math.PI - 90}) translate(${leaf.y},0)`}
                >
                  <Mark>
                    <circle fill="transparent" r={9} />
                    <circle fill={folderColors.get(folderOf(path)) ?? BASE_LINK} r={isFocus ? 7 : emphasized ? 4.5 : 3.2} stroke={isFocus ? '#fff' : emphasized ? HIGHLIGHT : 'none'} strokeWidth={isFocus ? 2.5 : 1.5} />
                    {labelled ? (
                      <Label data-emphasized={emphasized || undefined} data-focus={isFocus || undefined} dy="0.31em" textAnchor={onRight ? 'start' : 'end'} transform={onRight ? undefined : 'rotate(180)'} x={onRight ? (isFocus ? 13 : 10) : isFocus ? -13 : -10}>
                        {labelText}
                      </Label>
                    ) : null}
                  </Mark>
                </g>
              )
            })}
          </g>
        </g>
      </Svg>

      <Legend aria-label={t('graph.colorsLabel')}>
        {[...folderColors.entries()].map(([folder, color]) => (
          <li key={folder || 'root'}>
            <i style={{ background: color }} />
            {folder || t('root')}
          </li>
        ))}
      </Legend>

      <Details aria-live="polite">
        {activeLink ? (
          <>
            <strong>{activeLink.source} ↔ {activeLink.target}</strong>
            <span>{t('graph.linkSummary', { commits: t('units.commits', { count: activeLink.commits }), degree: formatPercent(activeLink.degree) })}</span>
            <span>{t('graph.linkConfidence', { from: splitPath(activeLink.source).name, percent: formatPercent(activeLink.source_confidence), to: splitPath(activeLink.target).name })}</span>
            <span>{t('graph.linkConfidence', { from: splitPath(activeLink.target).name, percent: formatPercent(activeLink.target_confidence), to: splitPath(activeLink.source).name })}</span>
          </>
        ) : activeFile ? (
          <>
            <strong>{activeFile}</strong>
            <span>
              {t('graph.fileSummary', {
                coupled: t('units.files', { count: coupledToActiveFile.length }),
                revisions: t('units.revisions', { count: fileInfo.get(activeFile)?.revisions ?? 0 }),
              })}
            </span>
            {coupledToActiveFile.slice(0, TOP_COUPLED_SHOWN).map((link, index) => {
              const other = link.source === activeFile ? link.target : link.source
              return (
                <span key={other}>
                  {t(index === 0 ? 'graph.strongestLine' : 'graph.partnerLine', {
                    commits: t('units.commits', { count: link.commits }),
                    degree: formatPercent(link.degree),
                    path: other,
                  })}
                </span>
              )
            })}
          </>
        ) : revealOnSelect ? (
          <span>{t('graph.hintReveal')}</span>
        ) : (
          <span>{t('graph.hintDefault')}</span>
        )}
      </Details>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  display: grid;
  gap: 0.75rem;
`

const Toolbar = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 1;
  display: flex;
  gap: 0.35rem;

  button {
    min-width: 2.1rem;
    padding: 0.35rem 0.7rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--text);
    background: var(--surface-strong);
    font-size: 0.875rem;
    cursor: pointer;
    backdrop-filter: blur(8px);
  }

  button:hover { border-color: rgba(124, 92, 255, 0.6); }
`

const Svg = styled.svg`
  display: block;
  width: 100%;
  max-height: var(--chart-max-height, 80vh);
  height: auto;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.25);
  cursor: grab;
  touch-action: none;
  user-select: none;

  &:active { cursor: grabbing; }
`

// Espessura em pixels da tela (não escala com o zoom), para as ligações continuarem finas ao aproximar.
const Line = styled.path`
  fill: none;
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
`

const Hit = styled.path`
  fill: none;
  stroke: transparent;
  stroke-width: 10px;
  vector-effect: non-scaling-stroke;
  cursor: pointer;
  pointer-events: stroke;
`

// Ponto + nome crescem com √zoom (e não com o zoom inteiro), a partir do centro do ponto.
const Mark = styled.g`
  transform: scale(var(--inv-sqrt-k, 1));
`

const Label = styled.text`
  fill: rgba(226, 232, 240, 0.8);
  font-size: ${LABEL_FONT}px;
  pointer-events: none;

  &[data-emphasized] {
    fill: #fff;
    font-size: 12px;
    font-weight: 700;
    paint-order: stroke;
    stroke: rgba(7, 9, 18, 0.9);
    stroke-width: 3px;
  }

  /* Arquivo em foco: maior e em ciano, para se distinguir dos parceiros. */
  &[data-focus] {
    fill: #67e8f9;
    font-size: 15px;
  }
`

const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
  margin: 0;
  padding: 0;
  color: var(--text-muted);
  font-size: 0.75rem;
  list-style: none;

  li { display: inline-flex; align-items: center; gap: 0.4rem; }
  i { width: 0.7rem; height: 0.7rem; border-radius: 50%; }
`

const Details = styled.p`
  display: grid;
  gap: 0.15rem;
  min-height: 4.5rem;
  margin: 0;
  color: var(--text-muted);
  font-size: 0.8125rem;

  strong { color: var(--text); font-weight: 600; word-break: break-all; }
`
