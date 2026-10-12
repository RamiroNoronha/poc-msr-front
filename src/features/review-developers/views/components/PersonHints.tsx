import { useTranslation } from 'react-i18next'
import type { PersonHint } from '../../utils/people'
import { describeReason } from '../../utils/reasonLabels'
import { List } from '../../styles/PersonHints.styled'

type PersonHintsProps = {
  hints: PersonHint[]
  nameOf: (personId: string) => string
  onMerge: (otherId: string) => void
}

export function PersonHints({ hints, nameOf, onMerge }: PersonHintsProps) {
  const { t } = useTranslation('reviewDevelopers')

  if (hints.length === 0) return null

  return (
    <List>
      {hints.map((hint) => (
        <li key={hint.otherId}>
          <span>
            {t('hints.maybeSame')} <strong>{nameOf(hint.otherId)}</strong>
            <small>{hint.reasons.map(describeReason).join(' · ')}</small>
          </span>
          <button onClick={() => onMerge(hint.otherId)} type="button">{t('hints.merge')}</button>
        </li>
      ))}
    </List>
  )
}
