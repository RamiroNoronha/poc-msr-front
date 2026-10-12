import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { Trans, useTranslation } from 'react-i18next'
import { ExpandButton } from '../../../shared/components/ExpandButton'
import { useExpandable } from '../../../shared/hooks/useExpandable'
import { expandedOverlay } from '../../../shared/styles/expandable'
import { COUPLING_LIMITS, type CouplingFilters, type CouplingLink, type CouplingSelection } from '../service/contracts'
import { useCoupling } from '../hooks/useCoupling'
import { couplingManager } from '../service'
import { computeFileStats, computeVisibility } from '../utils/fileStats'
import { CouplingGraph } from './components/CouplingGraph'
import { TopCoupledFiles } from './components/TopCoupledFiles'
import { TopCoupledPairs } from './components/TopCoupledPairs'

// null = todo o histórico
const PERIODS: (number | null)[] = [null, 24, 12, 6]
const SUPPORTS = [2, 3, 5, 10]
const DEGREES = [0, 5, 10, 15, 20, 30]
const HUBS = [0, 5, 10, 15, 20, 30]

type Tab = 'files' | 'pairs'

const EMPTY_SELECTION: CouplingSelection = { files: [], links: [] }

export function CouplingSection({ repositoryUrl }: { repositoryUrl: string }) {
  const { t } = useTranslation('coupling')
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

  const { files, links } = useMemo(() => (report ? couplingManager.filterByDegree(report, minDegree) : EMPTY_SELECTION), [minDegree, report])
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
        <h2>{t('section.title')}</h2>
        <p><Trans components={{ code: <code /> }} i18nKey="section.description" ns="coupling" /></p>
      </SectionHeader>

      <Controls>
        <label>
          <b>{t('controls.period.label')}</b>
          <select onChange={(event) => changeFilters({ months: event.target.value === 'all' ? null : Number(event.target.value) })} value={filters.months ?? 'all'}>
            {PERIODS.map((months) => <option key={months ?? 'all'} value={months ?? 'all'}>{months === null ? t('controls.period.all') : t('controls.period.last', { count: months })}</option>)}
          </select>
          <small>{t('controls.period.hint')}</small>
        </label>
        <label title={t('controls.support.title')}>
          <b>{t('controls.support.label')}</b>
          <select onChange={(event) => changeFilters({ minSupport: Number(event.target.value) })} value={filters.minSupport}>
            {SUPPORTS.map((support) => <option key={support} value={support}>{t('controls.support.option', { count: support })}</option>)}
          </select>
          <small>{t('controls.support.hint')}</small>
        </label>
        <label>
          <b>{t('controls.limit.label')}</b>
          <select onChange={(event) => changeFilters({ limit: Number(event.target.value) })} value={filters.limit}>
            {COUPLING_LIMITS.map((limit) => <option key={limit} value={limit}>{t('controls.limit.option', { count: limit })}</option>)}
          </select>
          <small>{t('controls.limit.hint')}</small>
        </label>
        <label title={t('controls.degree.title')}>
          <b>{t('controls.degree.label')}</b>
          <select onChange={(event) => { clearSelection(); setMinDegree(Number(event.target.value)) }} value={minDegree}>
            {DEGREES.map((degree) => <option key={degree} value={degree}>{degree === 0 ? t('controls.degree.optionAny') : t('controls.degree.option', { value: degree })}</option>)}
          </select>
          <small>{t('controls.degree.hint')}</small>
        </label>
        <label title={t('controls.hubs.title')}>
          <b>{t('controls.hubs.label')}</b>
          <select onChange={(event) => { clearSelection(); setMinCouplings(Number(event.target.value)) }} value={minCouplings}>
            {HUBS.map((hub) => <option key={hub} value={hub}>{hub === 0 ? t('controls.hubs.optionAll') : t('controls.hubs.option', { count: hub })}</option>)}
          </select>
          <small>{t('controls.hubs.hint')}</small>
        </label>
      </Controls>

      {report ? (
        <Summary>
          {[
            [
              t('summary.commits', { count: report.stats.commits_analyzed }),
              report.stats.commits_skipped_large > 0 ? t('summary.skipped', { count: report.stats.commits_skipped_large }) : '',
            ].filter(Boolean).join(' '),
            [
              t('summary.pairs', { count: links.length, files: files.length }),
              report.links.length >= filters.limit ? t('summary.limited', { count: filters.limit }) : '',
            ].filter(Boolean).join(' '),
            minCouplings > 0 && hasHubs ? t('summary.hubs', { count: hubCount, min: minCouplings }) : '',
          ].filter(Boolean).join(t('summary.separator'))}
        </Summary>
      ) : null}

      {error ? <Message role="alert">{error}</Message> : null}
      {!error && !report ? <Message>{t('messages.calculating')}</Message> : null}
      {!error && report && !hasServerLinks ? (
        <Message>{t('messages.noPairs')}</Message>
      ) : null}
      {!error && report && hasServerLinks && !hasLinks ? (
        <Message>{t('messages.noDegree', { value: minDegree })}</Message>
      ) : null}
      {!error && report && hasLinks && !hasHubs ? (
        <Message>{t('messages.noHubs', { count: minCouplings })}</Message>
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
              <button aria-selected={tab === 'pairs'} onClick={() => setTab('pairs')} role="tab" type="button">{t('tabs.pairs')}</button>
              <button aria-selected={tab === 'files'} onClick={() => setTab('files')} role="tab" type="button">{t('tabs.files')}</button>
            </Tabs>
            {tab === 'pairs' ? (
              <>
                <p>{t('tabs.pairsHelp')}</p>
                <TopCoupledPairs links={links} onSelect={(link) => { setSelectedFile(null); setSelectedLink(link) }} selected={selectedLink} />
              </>
            ) : (
              <>
                <p>{t('tabs.filesHelp')}</p>
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
