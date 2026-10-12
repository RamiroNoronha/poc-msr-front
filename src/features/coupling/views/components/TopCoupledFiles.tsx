import { useTranslation } from 'react-i18next'
import { splitPath } from '../../utils/fileTree'
import type { FileStats } from '../../utils/fileStats'
import { Item, List } from '../../styles/TopCoupledFiles.styled'

const LIMIT = 10

type TopCoupledFilesProps = {
  onSelect: (path: string | null) => void
  selected: string | null
  stats: Map<string, FileStats>
}

export function TopCoupledFiles({ onSelect, selected, stats }: TopCoupledFilesProps) {
  const { t } = useTranslation('coupling')
  const top = [...stats.entries()]
    .sort((a, b) => b[1].couplings - a[1].couplings || b[1].strongest - a[1].strongest || a[0].localeCompare(b[0]))
    .slice(0, LIMIT)

  return (
    <List>
      {top.map(([path, fileStats]) => {
        const { directory, name } = splitPath(path)
        const isSelected = selected === path
        return (
          <li key={path}>
            <Item aria-pressed={isSelected} onClick={() => onSelect(isSelected ? null : path)} title={path} type="button">
              <span>
                <strong>{name}</strong>
                <small>{directory || t('root')}</small>
              </span>
              <em>
                {fileStats.couplings}
                <small>{t('units.couplingsLabel', { count: fileStats.couplings })}</small>
              </em>
            </Item>
          </li>
        )
      })}
    </List>
  )
}
