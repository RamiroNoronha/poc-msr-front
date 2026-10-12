import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OTHERS_COLOR } from '../../utils/developerColors'
import type { CollaborationMode, DeveloperSummary } from '../../utils/ownership'
import { Badge, Developer, Filter, Filters, Hint, List, Panel, Search, Section, Swatch } from '../../styles/DeveloperLegend.styled'

type DeveloperLegendProps = {
  colors: Map<string, string>
  developers: DeveloperSummary[]
  keyDevelopers: string[]
  mode: CollaborationMode
  onModeChange: (mode: CollaborationMode) => void
  onSelect: (developer: string | null) => void
  onSoloOnlyChange: (soloOnly: boolean) => void
  selected: string | null
  soloFileCount: number
  soloOnly: boolean
}

const MODES: CollaborationMode[] = ['collaborated', 'main']

export function DeveloperLegend({ colors, developers, keyDevelopers, mode, onModeChange, onSelect, onSoloOnlyChange, selected, soloFileCount, soloOnly }: DeveloperLegendProps) {
  const { t } = useTranslation('truckFactor')
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = normalizedQuery ? developers.filter((developer) => developer.name.toLowerCase().includes(normalizedQuery)) : developers
  const hasOthers = developers.length > colors.size

  return (
    <Panel>
      <Section>
        <h2>{t('legend.title', { count: developers.length })}</h2>
        {developers.length === 0 ? (
          <Hint>{t('legend.none')}</Hint>
        ) : (
          <>
            {developers.length > 8 ? (
              <Search aria-label={t('legend.searchLabel')} onChange={(event) => setQuery(event.target.value)} placeholder={t('legend.search')} type="search" value={query} />
            ) : null}
            <List>
              {filtered.map((developer) => (
                <li key={developer.name}>
                  <Developer aria-pressed={selected === developer.name} onClick={() => onSelect(selected === developer.name ? null : developer.name)} type="button">
                    <Swatch style={{ background: colors.get(developer.name) ?? OTHERS_COLOR }} />
                    <span>
                      <strong>
                        {developer.name}
                        {keyDevelopers.includes(developer.name) ? <Badge>{t('legend.keyBadge')}</Badge> : null}
                      </strong>
                      <small>
                        {t('legend.stats', { files: t('units.files', { count: developer.files }), solo: t('legend.soloCount', { count: developer.soloFiles }) })}
                      </small>
                    </span>
                  </Developer>
                </li>
              ))}
              {filtered.length === 0 ? <Hint>{t('legend.noneFound')}</Hint> : null}
            </List>
            <Hint>
              {[selected ? t('legend.hintClear') : t('legend.hintDefault'), hasOthers ? t('legend.hintOthers') : ''].filter(Boolean).join(' ')}
            </Hint>
          </>
        )}
      </Section>

      <Filters>
        <Filter disabled={selected === null}>
          <legend>{t('legend.filterTitle')}</legend>
          {MODES.map((option) => (
            <label key={option}>
              <input checked={mode === option} name="collaboration-mode" onChange={() => onModeChange(option)} type="radio" />
              {t(`legend.modes.${option}`)}
            </label>
          ))}
        </Filter>
        <label>
          <input checked={soloOnly} onChange={(event) => onSoloOnlyChange(event.target.checked)} type="checkbox" />
          {t('legend.soloOnly', { count: soloFileCount })}
        </label>
      </Filters>
    </Panel>
  )
}
