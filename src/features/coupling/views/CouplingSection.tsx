import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { ExpandButton } from '../../../shared/components/ExpandButton'
import { useExpandable } from '../../../shared/hooks/useExpandable'
import { expandedOverlay } from '../../../shared/styles/expandable'
import { COUPLING_LIMITS, type CouplingFilters, type CouplingLink } from '../api/coupling'
import { useCoupling } from '../hooks/useCoupling'
import { computeFileStats, computeVisibility } from '../utils/fileStats'
import { CouplingGraph } from './components/CouplingGraph'
import { TopCoupledFiles } from './components/TopCoupledFiles'
import { TopCoupledPairs } from './components/TopCoupledPairs'

const PERIODS: { label: string; months: number | null }[] = [
  { label: 'Todo o histórico', months: null },
  { label: 'Últimos 24 meses', months: 24 },
  { label: 'Últimos 12 meses', months: 12 },
  { label: 'Últimos 6 meses', months: 6 },
]
const SUPPORTS = [2, 3, 5, 10]
const DEGREES = [0, 5, 10, 15, 20, 30]
const HUBS = [0, 5, 10, 15, 20, 30]

type Tab = 'files' | 'pairs'

export function CouplingSection({ repositoryUrl }: { repositoryUrl: string }) {
  // Filtros enviados ao backend (refazem o cálculo).
  const [filters, setFilters] = useState<CouplingFilters>({ limit: COUPLING_LIMITS[0], minSupport: 3, months: null })
  // Filtros aplicados no navegador, sobre o resultado recebido.
  const [minDegree, setMinDegree] = useState(0)
  const [minCouplings, setMinCouplings] = useState(0)
  const [tab, setTab] = useState<Tab>('pairs')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [selectedLink, setSelectedLink] = useState<CouplingLink | null>(null)
  const { isExpanded, toggle } = useExpandable()
  const { error, isLoading, report } = useCoupling(repositoryUrl, filters)

  const links = useMemo(() => (report?.links ?? []).filter((link) => link.degree * 100 >= minDegree), [minDegree, report])
  const files = useMemo(() => {
    const paths = new Set(links.flatMap((link) => [link.source, link.target]))
    return (report?.files ?? []).filter((file) => paths.has(file.path))
  }, [links, report])
  const stats = useMemo(() => computeFileStats(links), [links])
  const visibility = useMemo(() => computeVisibility(links, stats, minCouplings, selectedFile, selectedLink), [links, minCouplings, selectedFile, selectedLink, stats])
  const hubCount = useMemo(() => [...stats.values()].filter((fileStats) => fileStats.couplings >= minCouplings).length, [minCouplings, stats])

  function clearSelection() {
    setSelectedFile(null)
    setSelectedLink(null)
  }

  function changeFilters(changes: Partial<CouplingFilters>) {
    clearSelection()
    setFilters((current) => ({ ...current, ...changes }))
  }

  const hasServerLinks = (report?.links.length ?? 0) > 0
  const hasLinks = links.length > 0
  const hasHubs = minCouplings === 0 || hubCount > 0

  return (
    <Section>
      <SectionHeader>
        <h2>Acoplamento histórico</h2>
        <p>
          Arquivos que costumam mudar juntos nos mesmos commits, mesmo sem uma dependência explícita no código. Cada ponto é um arquivo, agrupado por pasta;
          as ligações mostram o acoplamento, e as que cruzam pastas são as mais suspeitas. Commits grandes (inclusive squash) contam com peso menor, e arquivos
          de ruído, como <code>package.json</code> e lockfiles, são ignorados.
        </p>
      </SectionHeader>

      <Controls>
        <label>
          <b>Período</b>
          <select onChange={(event) => changeFilters({ months: event.target.value === 'all' ? null : Number(event.target.value) })} value={filters.months ?? 'all'}>
            {PERIODS.map((period) => <option key={period.label} value={period.months ?? 'all'}>{period.label}</option>)}
          </select>
          <small>Contado a partir do último commit</small>
        </label>
        <label title="Evidência: quantas vezes os dois arquivos mudaram juntos. Descarta coincidências.">
          <b>Commits em comum (mínimo)</b>
          <select onChange={(event) => changeFilters({ minSupport: Number(event.target.value) })} value={filters.minSupport}>
            {SUPPORTS.map((support) => <option key={support} value={support}>pelo menos {support} commits juntos</option>)}
          </select>
          <small>Evidência: quantas vezes mudaram juntos</small>
        </label>
        <label>
          <b>Máximo de pares</b>
          <select onChange={(event) => changeFilters({ limit: Number(event.target.value) })} value={filters.limit}>
            {COUPLING_LIMITS.map((limit) => <option key={limit} value={limit}>{limit} mais acoplados</option>)}
          </select>
          <small>Quantos pares o mapa considera</small>
        </label>
        <label title="Força: commits em comum ÷ média de mudanças dos dois arquivos. Separa vínculo forte de arquivo que só muda muito.">
          <b>Grau de acoplamento (mínimo)</b>
          <select onChange={(event) => { clearSelection(); setMinDegree(Number(event.target.value)) }} value={minDegree}>
            {DEGREES.map((degree) => <option key={degree} value={degree}>{degree === 0 ? 'qualquer grau' : `pelo menos ${degree}%`}</option>)}
          </select>
          <small>Força: peso dos commits juntos no total de mudanças</small>
        </label>
        <label title="Mostra só os arquivos acoplados a muitos outros; as ligações aparecem ao clicar em um deles.">
          <b>Arquivos com muitos acoplamentos</b>
          <select onChange={(event) => { clearSelection(); setMinCouplings(Number(event.target.value)) }} value={minCouplings}>
            {HUBS.map((hub) => <option key={hub} value={hub}>{hub === 0 ? 'mostrar todos' : `só com ${hub} ou mais`}</option>)}
          </select>
          <small>Ligações aparecem ao clicar no arquivo</small>
        </label>
      </Controls>

      {report ? (
        <Summary>
          {report.stats.commits_analyzed.toLocaleString('pt-BR')} commits analisados
          {report.stats.commits_skipped_large > 0 ? ` (${report.stats.commits_skipped_large} pulados por terem arquivos demais)` : ''}
          {' · '}
          {links.length.toLocaleString('pt-BR')} pares em {files.length.toLocaleString('pt-BR')} arquivos
          {report.links.length >= filters.limit ? ` (limitado aos ${filters.limit} mais acoplados; os acoplamentos por arquivo contam só esses pares)` : ''}
          {minCouplings > 0 && hasHubs ? ` · ${hubCount} arquivos com ${minCouplings} ou mais acoplamentos` : ''}
        </Summary>
      ) : null}

      {error ? <Message role="alert">{error}</Message> : null}
      {!error && !report ? <Message>Calculando o acoplamento…</Message> : null}
      {!error && report && !hasServerLinks ? (
        <Message>Nenhum par de arquivos com acoplamento nesse período. Tente um período maior ou reduza o suporte mínimo.</Message>
      ) : null}
      {!error && report && hasServerLinks && !hasLinks ? (
        <Message>Nenhum par com grau de acoplamento de pelo menos {minDegree}%. Reduza o grau mínimo.</Message>
      ) : null}
      {!error && report && hasLinks && !hasHubs ? (
        <Message>Nenhum arquivo tem {minCouplings} ou mais acoplamentos nesses pares. Reduza esse valor ou aumente o máximo de pares.</Message>
      ) : null}

      {report && hasLinks && hasHubs ? (
        <Layout>
          <Card aria-busy={isLoading} data-expanded={isExpanded || undefined} data-loading={isLoading || undefined}>
            <ExpandButton isExpanded={isExpanded} onToggle={toggle} />
            <CouplingGraph
              files={files}
              links={links}
              onSelectFile={setSelectedFile}
              onSelectLink={setSelectedLink}
              revealOnSelect={minCouplings > 0}
              selectedFile={selectedFile}
              selectedLink={selectedLink}
              visibleFiles={visibility.files}
              visibleLinks={visibility.links}
            />
          </Card>
          <Side>
            <Tabs role="tablist">
              <button aria-selected={tab === 'pairs'} onClick={() => setTab('pairs')} role="tab" type="button">Pares mais acoplados</button>
              <button aria-selected={tab === 'files'} onClick={() => setTab('files')} role="tab" type="button">Arquivos com mais acoplamentos</button>
            </Tabs>
            {tab === 'pairs' ? (
              <>
                <p>Grau = commits em comum (ponderados) ÷ média de revisões dos dois arquivos. Clique para dar zoom no par.</p>
                <TopCoupledPairs links={links} onSelect={(link) => { setSelectedFile(null); setSelectedLink(link) }} selected={selectedLink} />
              </>
            ) : (
              <>
                <p>Número de outros arquivos com que cada arquivo está acoplado, entre os pares exibidos. Clique para destacar as ligações dele.</p>
                <TopCoupledFiles onSelect={(path) => { setSelectedLink(null); setSelectedFile(path) }} selected={selectedFile} stats={stats} />
              </>
            )}
          </Side>
        </Layout>
      ) : null}
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
  code { padding: 0.05rem 0.35rem; border-radius: 0.3rem; background: var(--surface-strong); font-size: 0.85em; }
`

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  gap: 1rem 1.5rem;

  label { display: grid; gap: 0.3rem; max-width: 15rem; color: var(--text-muted); font-size: 0.8125rem; }
  label b { color: var(--text); font-weight: 600; }
  label small { font-size: 0.6875rem; line-height: 1.35; }
  select {
    padding: 0.5rem 0.8rem;
    border: 1px solid var(--border);
    border-radius: 0.7rem;
    color: var(--text);
    background: var(--surface);
    font-size: 0.875rem;
    cursor: pointer;
  }
`

const Summary = styled.p`
  margin: -0.5rem 0 0;
  color: var(--text-muted);
  font-size: 0.8125rem;
`

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(18rem, 1fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 60rem) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Card = styled.div`
  position: relative;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);
  transition: opacity 0.2s;

  &[data-loading] { opacity: 0.5; }
  &[data-expanded] {
    ${expandedOverlay}
  }
`

const Side = styled.aside`
  display: grid;
  gap: 0.75rem;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);

  p { margin: 0; color: var(--text-muted); font-size: 0.8125rem; line-height: 1.5; }
`

const Tabs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: 0.8rem;
  background: var(--surface-strong);

  button {
    padding: 0.5rem 0.6rem;
    border: 0;
    border-radius: 0.6rem;
    color: var(--text-muted);
    background: transparent;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
  }

  button[aria-selected='true'] { color: var(--text); background: rgba(124, 92, 255, 0.25); }
`

const Message = styled.p`
  margin: 0;
  padding: 1.5rem;
  border: 1px dashed var(--border);
  border-radius: 1.25rem;
  color: var(--text-muted);
  text-align: center;

  &[role='alert'] { border-color: var(--danger); color: var(--danger); }
`
