import { useTranslation } from 'react-i18next'
import { formatNumber } from '../../../../shared/i18n/format'
import type { RepositoryAnalysis } from '../../service/contracts'
import { Developers, Header, Meta, Stat, Stats, Wrapper } from '../../styles/AnalysisSummary.styled'

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
