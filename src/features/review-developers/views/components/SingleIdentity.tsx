import { useDroppable } from '@dnd-kit/core'
import styled from '@emotion/styled'
import type { Developer } from '../../api/developers'
import type { Person, PersonHint } from '../../utils/people'
import { IdentityRow, type MoveTargets } from './IdentityRow'
import { PersonHints } from './PersonHints'

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

const Wrapper = styled.div`
  display: grid;
  gap: 0.4rem;
  padding: 0.3rem;
  border: 1px solid transparent;
  border-radius: 0.9rem;
  transition: border-color 0.15s, background 0.15s;

  &[data-over] { border-color: var(--accent-2); background: rgba(34, 211, 238, 0.1); }
`
