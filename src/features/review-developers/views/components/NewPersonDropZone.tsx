import { useDroppable } from '@dnd-kit/core'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { NEW_PERSON } from '../../utils/people'

export function NewPersonDropZone() {
  const { t } = useTranslation('reviewDevelopers')
  const { isOver, setNodeRef } = useDroppable({ id: NEW_PERSON })

  return <Zone data-over={isOver || undefined} ref={setNodeRef}>{t('dropZone')}</Zone>
}

const Zone = styled.div`
  padding: 1rem;
  border: 1px dashed var(--border);
  border-radius: 1rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  text-align: center;
  transition: border-color 0.15s, background 0.15s, color 0.15s;

  &[data-over] { border-color: var(--accent-2); background: rgba(34, 211, 238, 0.1); color: var(--text); }
`
