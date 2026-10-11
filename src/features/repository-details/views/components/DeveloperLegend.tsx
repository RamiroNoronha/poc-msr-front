import styled from '@emotion/styled'
import { developerColor } from '../../utils/developerColors'
import type { CollaborationMode, DeveloperActivity } from '../../utils/ownership'

type DeveloperLegendProps = {
  activity: DeveloperActivity[]
  mode: CollaborationMode
  onModeChange: (mode: CollaborationMode) => void
  onSelect: (developer: string | null) => void
  selected: string | null
}

const MODES: { label: string; value: CollaborationMode }[] = [
  { label: 'Colaborou no arquivo', value: 'collaborated' },
  { label: 'É o principal autor do arquivo', value: 'main' },
]

function describe({ revisions, status }: DeveloperActivity) {
  if (status === 'loading') return 'Carregando…'
  if (status === 'error') return 'Falha ao carregar'
  return `${revisions.size.toLocaleString('pt-BR')} arquivos`
}

export function DeveloperLegend({ activity, mode, onModeChange, onSelect, selected }: DeveloperLegendProps) {
  return (
    <Panel>
      <Section>
        <h2>Key developers</h2>
        {activity.length === 0 ? (
          <Hint>Nenhum key developer foi identificado neste repositório.</Hint>
        ) : (
          <>
            <List>
              {activity.map((item, index) => (
                <li key={item.developer}>
                  <Developer aria-pressed={selected === item.developer} disabled={item.status !== 'ready'} onClick={() => onSelect(selected === item.developer ? null : item.developer)} type="button">
                    <Swatch style={{ background: developerColor(index) }} />
                    <span>
                      <strong>{item.developer}</strong>
                      <small>{describe(item)}</small>
                    </span>
                  </Developer>
                </li>
              ))}
            </List>
            <Hint>
              {selected
                ? 'Clique de novo no desenvolvedor para limpar a seleção.'
                : 'Sem seleção, cada arquivo usa a cor do key developer que mais o alterou.'}
            </Hint>
          </>
        )}
      </Section>

      <Filter disabled={selected === null}>
        <legend>Destacar arquivos em que o desenvolvedor</legend>
        {MODES.map((option) => (
          <label key={option.value}>
            <input checked={mode === option.value} name="collaboration-mode" onChange={() => onModeChange(option.value)} type="radio" />
            {option.label}
          </label>
        ))}
      </Filter>
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

const List = styled.ul`
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
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

  &:hover:not(:disabled) { background: var(--surface-strong); }
  &[aria-pressed='true'] { border-color: rgba(124, 92, 255, 0.7); background: rgba(124, 92, 255, 0.14); }
  &:disabled { cursor: default; opacity: 0.6; }

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

const Hint = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: 0.8125rem;
  line-height: 1.5;
`

const Filter = styled.fieldset`
  display: grid;
  gap: 0.6rem;
  margin: 0;
  padding: 1rem 0 0;
  border: 0;
  border-top: 1px solid var(--border);
  font-size: 0.875rem;

  legend { padding: 0 0.5rem 0 0; color: var(--text-muted); font-size: 0.8125rem; }
  label { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; }
  input { accent-color: var(--accent); }
  &:disabled { opacity: 0.5; }
  &:disabled label { cursor: default; }
`
