import { useTranslation } from 'react-i18next'
import { formatPercent } from '../../../../shared/i18n/format'
import type { CouplingLink } from '../../service/contracts'
import { splitPath } from '../../utils/fileTree'
import { List, Pair } from '../../styles/TopCoupledPairs.styled'

const LIMIT = 10

type TopCoupledPairsProps = {
  links: CouplingLink[]
  onSelect: (link: CouplingLink | null) => void
  selected: CouplingLink | null
}

export function TopCoupledPairs({ links, onSelect, selected }: TopCoupledPairsProps) {
  const { t } = useTranslation('coupling')
  const top = [...links].sort((a, b) => b.degree - a.degree || b.commits - a.commits).slice(0, LIMIT)

  return (
    <List>
      {top.map((link) => {
        const isSelected = selected?.source === link.source && selected.target === link.target
        const source = splitPath(link.source)
        const target = splitPath(link.target)
        return (
          <li key={`${link.source}|${link.target}`}>
            <Pair aria-pressed={isSelected} onClick={() => onSelect(isSelected ? null : link)} title={`${link.source} ↔ ${link.target}`} type="button">
              <span>
                <strong>{source.name}</strong>
                <small>{source.directory || t('root')}</small>
              </span>
              <i aria-hidden="true">↔</i>
              <span>
                <strong>{target.name}</strong>
                <small>{target.directory || t('root')}</small>
              </span>
              <em>{formatPercent(link.degree)}</em>
            </Pair>
          </li>
        )
      })}
    </List>
  )
}
