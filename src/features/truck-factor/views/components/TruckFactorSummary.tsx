import { useTranslation } from 'react-i18next'
import type { TruckFactorReport } from '../../service/contracts'
import { KeyDevelopers, Metric, Note, Summary } from '../../styles/TruckFactorSummary.styled'

type TruckFactorSummaryProps = {
  error: string | null
  excludedFolders: number
  isLoading: boolean
  report: TruckFactorReport | null
}

// Truck Factor calculado no servidor sobre os arquivos atuais, sem as pastas ocultas.
export function TruckFactorSummary({ error, excludedFolders, isLoading, report }: TruckFactorSummaryProps) {
  const { t } = useTranslation('truckFactor')

  if (error) return <Summary><Note>{error}</Note></Summary>
  if (!report) return <Summary data-loading><Note>{t('summary.loading')}</Note></Summary>

  return (
    <Summary aria-busy={isLoading} data-loading={isLoading || undefined}>
      <Metric>
        <span>{t('summary.truckFactor')}</span>
        <strong>{report.truck_factor}</strong>
      </Metric>
      <Metric>
        <span>{t('summary.files')}</span>
        <strong>{t('summary.filesValue', { count: report.total_files_analyzed })}</strong>
      </Metric>
      <KeyDevelopers>
        <span>{t('summary.keyDevelopers')}</span>
        <p>{report.key_developers.length > 0 ? report.key_developers.join(', ') : t('summary.noKeyDevelopers')}</p>
      </KeyDevelopers>
      <Note>{isLoading ? t('summary.recalculating') : t('summary.note', { count: excludedFolders })}</Note>
    </Summary>
  )
}
