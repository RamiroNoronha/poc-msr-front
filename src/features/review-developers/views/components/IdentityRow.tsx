import { useDraggable } from '@dnd-kit/core'
import { useTranslation } from 'react-i18next'
import type { Developer } from '../../service/contracts'
import { NEW_PERSON } from '../../utils/people'
import { Commits, Handle, Info, Move, Preview, Row } from '../../styles/IdentityRow.styled'

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
