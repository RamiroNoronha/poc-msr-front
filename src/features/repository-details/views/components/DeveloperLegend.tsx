import { useState } from 'react'
import styled from '@emotion/styled'
import { OTHERS_COLOR } from '../../utils/developerColors'
import type { CollaborationMode, DeveloperSummary } from '../../utils/ownership'

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

const MODES: { label: string; value: CollaborationMode }[] = [
  { label: 'Colaborou no arquivo', value: 'collaborated' },
  { label: 'É o principal autor do arquivo', value: 'main' },
]

export function DeveloperLegend({ colors, developers, keyDevelopers, mode, onModeChange, onSelect, onSoloOnlyChange, selected, soloFileCount, soloOnly }: DeveloperLegendProps) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = normalizedQuery ? developers.filter((developer) => developer.name.toLowerCase().includes(normalizedQuery)) : developers
  const hasOthers = developers.length > colors.size

  return (
    <Panel>
      <Section>
        <h2>Desenvolvedores ({developers.length})</h2>
        {developers.length === 0 ? (
          <Hint>Nenhum desenvolvedor foi identificado neste repositório.</Hint>
        ) : (
          <>
            {developers.length > 8 ? (
              <Search aria-label="Buscar desenvolvedor" onChange={(event) => setQuery(event.target.value)} placeholder="Buscar desenvolvedor…" type="search" value={query} />
            ) : null}
            <List>
              {filtered.map((developer) => (
                <li key={developer.name}>
                  <Developer aria-pressed={selected === developer.name} onClick={() => onSelect(selected === developer.name ? null : developer.name)} type="button">
                    <Swatch style={{ background: colors.get(developer.name) ?? OTHERS_COLOR }} />
                    <span>
                      <strong>
                        {developer.name}
                        {keyDevelopers.includes(developer.name) ? <Badge>key</Badge> : null}
                      </strong>
                      <small>
                        {developer.files.toLocaleString('pt-BR')} arquivos · {developer.soloFiles.toLocaleString('pt-BR')} só dele
                      </small>
                    </span>
                  </Developer>
                </li>
              ))}
              {filtered.length === 0 ? <Hint>Nenhum desenvolvedor encontrado.</Hint> : null}
            </List>
            <Hint>
              {selected ? 'Clique de novo no desenvolvedor para limpar a seleção.' : 'Sem seleção, cada arquivo usa a cor do desenvolvedor que mais o alterou.'}
              {hasOthers ? ' Os demais desenvolvedores aparecem em cinza.' : ''}
            </Hint>
          </>
        )}
      </Section>

      <Filters>
        <Filter disabled={selected === null}>
          <legend>Destacar arquivos em que o desenvolvedor</legend>
          {MODES.map((option) => (
            <label key={option.value}>
              <input checked={mode === option.value} name="collaboration-mode" onChange={() => onModeChange(option.value)} type="radio" />
              {option.label}
            </label>
          ))}
        </Filter>
        <label>
          <input checked={soloOnly} onChange={(event) => onSoloOnlyChange(event.target.checked)} type="checkbox" />
          Só arquivos com 1 colaborador ({soloFileCount.toLocaleString('pt-BR')})
        </label>
      </Filters>
    </Panel>
  )
}

const Panel = styled.aside`
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);
`

const Section = styled.section`
  display: grid;
  gap: 0.75rem;

  h2 { margin: 0; font-size: 1.05rem; }
`

const Search = styled.input`
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 0.7rem;
  color: var(--text);
  background: var(--surface);
  font-size: 0.875rem;

  &::placeholder { color: var(--text-muted); }
`

const List = styled.ul`
  display: grid;
  gap: 0.5rem;
  max-height: 22rem;
  margin: 0;
  padding: 0 0.25rem 0 0;
  overflow-y: auto;
  list-style: none;
`

const Developer = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  color: var(--text);
  background: var(--surface);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover { background: var(--surface-strong); }
  &[aria-pressed='true'] { border-color: rgba(124, 92, 255, 0.7); background: rgba(124, 92, 255, 0.14); }

  span:last-of-type { display: grid; min-width: 0; }
  strong { overflow: hidden; font-size: 0.9rem; text-overflow: ellipsis; white-space: nowrap; }
  small { color: var(--text-muted); font-size: 0.75rem; }
`

const Swatch = styled.span`
  flex: none;
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
`

const Badge = styled.em`
  margin-left: 0.5rem;
  padding: 0.05rem 0.4rem;
  border: 1px solid rgba(124, 92, 255, 0.5);
  border-radius: 999px;
  color: #c4b5fd;
  font-size: 0.65rem;
  font-style: normal;
  font-weight: 600;
`

const Hint = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: 0.8125rem;
  line-height: 1.5;
`

const Filters = styled.div`
  display: grid;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  font-size: 0.875rem;

  label { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; }
  input { accent-color: var(--accent); }
`

const Filter = styled.fieldset`
  display: grid;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  border: 0;

  legend { padding: 0 0 0.6rem; color: var(--text-muted); font-size: 0.8125rem; }
  &:disabled { opacity: 0.5; }
  &:disabled label { cursor: default; }
`
