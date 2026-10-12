import { useDroppable } from '@dnd-kit/core'
import { useTranslation } from 'react-i18next'
import { NEW_PERSON } from '../../utils/people'
import { Zone } from '../../styles/NewPersonDropZone.styled'

export function NewPersonDropZone() {
  const { t } = useTranslation('reviewDevelopers')
  const { isOver, setNodeRef } = useDroppable({ id: NEW_PERSON })

  return <Zone data-over={isOver || undefined} ref={setNodeRef}>{t('dropZone')}</Zone>
}
