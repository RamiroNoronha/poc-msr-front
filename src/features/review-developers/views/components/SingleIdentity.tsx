import { useDroppable } from '@dnd-kit/core'
import type { Developer } from '../../service/contracts'
import type { Person, PersonHint } from '../../utils/people'
import { IdentityRow, type MoveTargets } from './IdentityRow'
import { PersonHints } from './PersonHints'
import { Wrapper } from '../../styles/SingleIdentity.styled'

type SingleIdentityProps = {
  developer: Developer
  hints: PersonHint[]
  moveTargets: MoveTargets
  nameOf: (personId: string) => string
  onMerge: (keepId: string, absorbId: string) => void
  onMove: (identityId: string, targetId: string) => void
  person: Person
}

// Identidade sozinha: também recebe soltura, então arrastar outra identidade sobre ela as une.
export function SingleIdentity({ developer, hints, moveTargets, nameOf, onMerge, onMove, person }: SingleIdentityProps) {
  const { isOver, setNodeRef } = useDroppable({ id: person.id })

  return (
    <Wrapper data-over={isOver || undefined} ref={setNodeRef}>
      <IdentityRow canSeparate={false} developer={developer} moveTargets={moveTargets} onMove={onMove} personId={person.id} />
      <PersonHints hints={hints} nameOf={nameOf} onMerge={(otherId) => onMerge(person.id, otherId)} />
    </Wrapper>
  )
}
