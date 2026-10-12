import { useDroppable } from '@dnd-kit/core'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import type { Developer } from '../../api/developers'
import { getPersonCommits, getPersonName, type Person, type PersonHint } from '../../utils/people'
import { IdentityRow, type MoveTargets } from './IdentityRow'
import { PersonHints } from './PersonHints'

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

const Card = styled.article`
  display: grid;
  gap: 0.8rem;
  padding: 1.1rem;
  border: 1px solid rgba(124, 92, 255, 0.45);
  border-radius: 1rem;
  background: rgba(124, 92, 255, 0.07);
  transition: border-color 0.15s, background 0.15s;

  &[data-over] { border-color: var(--accent-2); background: rgba(34, 211, 238, 0.1); }

  header { display: grid; gap: 0.1rem; }
  h3 { margin: 0; font-size: 1rem; }
  small { color: var(--text-muted); font-size: 0.8125rem; }
`

const Rows = styled.div`
  display: grid;
  gap: 0.4rem;
`
