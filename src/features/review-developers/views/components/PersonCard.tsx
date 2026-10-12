import { useDroppable } from '@dnd-kit/core'
import { useTranslation } from 'react-i18next'
import type { Developer } from '../../service/contracts'
import { getPersonCommits, getPersonName, type Person, type PersonHint } from '../../utils/people'
import { IdentityRow, type MoveTargets } from './IdentityRow'
import { PersonHints } from './PersonHints'
import { Card, Rows } from '../../styles/PersonCard.styled'

type PersonCardProps = {
  developersById: Map<string, Developer>
  hints: PersonHint[]
  moveTargets: MoveTargets
  nameOf: (personId: string) => string
  onMerge: (keepId: string, absorbId: string) => void
  onMove: (identityId: string, targetId: string) => void
  person: Person
}

export function PersonCard({ developersById, hints, moveTargets, nameOf, onMerge, onMove, person }: PersonCardProps) {
  const { t } = useTranslation('reviewDevelopers')
  const { isOver, setNodeRef } = useDroppable({ id: person.id })

  return (
    <Card data-over={isOver || undefined} ref={setNodeRef}>
      <header>
        <h3>{getPersonName(person, developersById)}</h3>
        <small>{t('person.summary', { commits: t('identity.commits', { count: getPersonCommits(person, developersById) }), identities: t('person.identityCount', { count: person.identityIds.length }) })}</small>
      </header>
      <Rows>
        {person.identityIds.map((id) => {
          const developer = developersById.get(id)
          return developer ? <IdentityRow canSeparate developer={developer} key={id} moveTargets={moveTargets} onMove={onMove} personId={person.id} /> : null
        })}
      </Rows>
      <PersonHints hints={hints} nameOf={nameOf} onMerge={(otherId) => onMerge(person.id, otherId)} />
    </Card>
  )
}
