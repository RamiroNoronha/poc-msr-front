import { useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ExpandButton } from '../../../shared/components/ExpandButton'
import { useExpandable } from '../../../shared/hooks/useExpandable'
import { COUPLING_LIMITS, type CouplingFilters, type CouplingLink, type CouplingSelection } from '../service/contracts'
import { useCoupling } from '../hooks/useCoupling'
import { couplingManager } from '../service'
import { computeFileStats, computeVisibility } from '../utils/fileStats'
import { CouplingGraph } from './components/CouplingGraph'
import { TopCoupledFiles } from './components/TopCoupledFiles'
import { TopCoupledPairs } from './components/TopCoupledPairs'
import { Card, Controls, Layout, Message, Section, SectionHeader, Side, Summary, Tabs } from '../styles/CouplingSection.styled'

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
