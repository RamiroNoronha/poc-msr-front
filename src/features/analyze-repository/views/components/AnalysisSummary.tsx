import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { formatNumber } from '../../../../shared/i18n/format'
import type { RepositoryAnalysis } from '../../service/contracts'

export function AnalysisSummary({ analysis }: { analysis: RepositoryAnalysis }) {
  const { t } = useTranslation('analyzeRepository')
  const { repository, truckFactor } = analysis

  return (
    <Wrapper aria-label={t('summary.label')}>
      {repository ? (
        <Header>
          <strong>{repository.full_name}</strong>
          {repository.description ? <p>{repository.description}</p> : null}
          <Meta>
            {repository.language ? <span>{repository.language}</span> : null}
            <span>★ {formatNumber(repository.stars)}</span>
            <span>⑂ {formatNumber(repository.forks)}</span>
          </Meta>
        </Header>
      ) : null}
      <Stats>
        <Stat highlight>
          <dt>{t('summary.truckFactor')}</dt>
          <dd>{truckFactor.truck_factor}</dd>
        </Stat>
        <Stat>
          <dt>{t('summary.filesAnalyzed')}</dt>
          <dd>{formatNumber(truckFactor.total_files_analyzed)}</dd>
        </Stat>
        <Stat>
          <dt>{t('summary.criticalPeople')}</dt>
          <dd>{truckFactor.key_developers.length}</dd>
        </Stat>
      </Stats>
      {truckFactor.key_developers.length > 0 ? (
        <Developers>
          {truckFactor.key_developers.map((developer) => <li key={developer}>{developer}</li>)}
        </Developers>
      ) : null}
    </Wrapper>
  )
}

const Wrapper = styled.section`
  display: grid;
  gap: 1.25rem;
  margin-top: 3rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);
  backdrop-filter: blur(12px);
  text-align: left;
`

const Header = styled.div`
  strong { font-size: 1.25rem; }
  p { margin: 0.4rem 0 0; color: var(--text-muted); }
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.75rem;
  color: var(--text-muted);
  font-size: 0.875rem;
`

const Stats = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 1rem;
  margin: 0;
`

const Stat = styled.div<{ highlight?: boolean }>`
  padding: 1rem 1.25rem;
  border: 1px solid ${({ highlight }) => (highlight ? 'rgba(124, 92, 255, 0.5)' : 'var(--border)')};
  border-radius: 1rem;
  background: ${({ highlight }) => (highlight ? 'rgba(124, 92, 255, 0.12)' : 'var(--surface)')};

  dt { color: var(--text-muted); font-size: 0.8125rem; }
  dd { margin: 0.35rem 0 0; font-size: 2.25rem; font-weight: 800; letter-spacing: -0.03em; }
`

const Developers = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: 0.3rem 0.8rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface-strong);
    font-size: 0.875rem;
  }
`
