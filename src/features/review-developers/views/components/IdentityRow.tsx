import { useDraggable } from '@dnd-kit/core'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import type { Developer } from '../../api/developers'
import { NEW_PERSON } from '../../utils/people'

export type MoveTarget = { id: string; label: string }
export type MoveTargets = { singles: MoveTarget[]; unified: MoveTarget[] }

type IdentityRowProps = {
  canSeparate: boolean
  developer: Developer
  moveTargets: MoveTargets
  onMove: (identityId: string, targetId: string) => void
  personId: string
}

export function IdentityRow({ canSeparate, developer, moveTargets, onMove, personId }: IdentityRowProps) {
  const { t } = useTranslation('reviewDevelopers')
  const { attributes, isDragging, listeners, setNodeRef } = useDraggable({ id: `identity:${developer.id}` })
  const unified = moveTargets.unified.filter((target) => target.id !== personId)
  const singles = moveTargets.singles.filter((target) => target.id !== personId)

  return (
    <Row data-dragging={isDragging || undefined} ref={setNodeRef}>
      <Handle {...attributes} {...listeners} aria-label={t('identity.dragLabel', { email: developer.email, name: developer.name })} type="button">⋮⋮</Handle>
      <Info>
        <strong>{developer.name}</strong>
        <span>{developer.email}</span>
      </Info>
      <Commits>{t('identity.commits', { count: developer.commits })}</Commits>
      <Move
        aria-label={t('identity.moveLabel', { email: developer.email, name: developer.name })}
        onChange={(event) => { if (event.target.value) onMove(developer.id, event.target.value) }}
        value=""
      >
        <option value="">{t('identity.moveTo')}</option>
        {canSeparate ? <option value={NEW_PERSON}>{t('identity.newPerson')}</option> : null}
        {unified.length > 0 ? (
          <optgroup label={t('identity.unitedGroup')}>
            {unified.map((target) => <option key={target.id} value={target.id}>{target.label}</option>)}
          </optgroup>
        ) : null}
        {singles.length > 0 ? (
          <optgroup label={t('identity.otherGroup')}>
            {singles.map((target) => <option key={target.id} value={target.id}>{target.label}</option>)}
          </optgroup>
        ) : null}
      </Move>
    </Row>
  )
}

export function DragPreview({ developer }: { developer: Developer }) {
  return (
    <Preview>
      <strong>{developer.name}</strong>
      <span>{developer.email}</span>
    </Preview>
  )
}

const Row = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.6rem;
  border-radius: 0.7rem;
  background: var(--surface-strong);
  transition: opacity 0.15s;

  &[data-dragging] { opacity: 0.35; }

  @media (max-width: 40rem) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    select { grid-column: 1 / -1; }
  }
`

const Handle = styled.button`
  padding: 0.3rem 0.2rem;
  border: 0;
  border-radius: 0.4rem;
  color: var(--text-muted);
  background: transparent;
  font-size: 1rem;
  letter-spacing: -0.2em;
  cursor: grab;
  touch-action: none;

  &:hover { color: var(--text); background: var(--surface); }
  &:active { cursor: grabbing; }
`

const Info = styled.div`
  display: grid;
  min-width: 0;

  strong { overflow: hidden; font-size: 0.9rem; text-overflow: ellipsis; white-space: nowrap; }
  span { overflow: hidden; color: var(--text-muted); font-size: 0.8125rem; text-overflow: ellipsis; white-space: nowrap; }
`

const Commits = styled.span`
  color: var(--text-muted);
  font-size: 0.8125rem;
  white-space: nowrap;
`

const Move = styled.select`
  max-width: 11rem;
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  color: var(--text);
  background: var(--bg);
  font-size: 0.8125rem;
  cursor: pointer;
`

const Preview = styled.div`
  display: grid;
  max-width: 22rem;
  padding: 0.6rem 0.9rem;
  border: 1px solid rgba(124, 92, 255, 0.7);
  border-radius: 0.8rem;
  background: rgba(20, 24, 44, 0.95);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  cursor: grabbing;

  strong { font-size: 0.9rem; }
  span { overflow: hidden; color: var(--text-muted); font-size: 0.8125rem; text-overflow: ellipsis; }
`
