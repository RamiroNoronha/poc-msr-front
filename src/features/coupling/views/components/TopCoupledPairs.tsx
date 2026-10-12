import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { formatPercent } from '../../../../shared/i18n/format'
import type { CouplingLink } from '../../api/coupling'
import { splitPath } from '../../utils/fileTree'

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

const List = styled.ol`
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

const Pair = styled.button`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  color: var(--text);
  background: var(--surface);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover { background: var(--surface-strong); }
  &[aria-pressed='true'] { border-color: rgba(34, 211, 238, 0.7); background: rgba(34, 211, 238, 0.1); }

  span { display: grid; min-width: 0; }
  strong, small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  strong { font-size: 0.8125rem; }
  small { color: var(--text-muted); font-size: 0.6875rem; }
  i { color: var(--text-muted); font-style: normal; }
  em { font-size: 0.8125rem; font-style: normal; font-weight: 700; }
`
