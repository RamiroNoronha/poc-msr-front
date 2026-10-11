import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import styled from '@emotion/styled'
import type { DevelopersReview } from '../api/developers'
import {
  buildInitialPeople,
  findHints,
  getPersonCommits,
  getPersonName,
  mergePeople,
  moveIdentity,
  toGroups,
} from '../utils/people'
import { DragPreview, type MoveTargets } from './components/IdentityRow'
import { NewPersonDropZone } from './components/NewPersonDropZone'
import { OthersList } from './components/OthersList'
import { PersonCard } from './components/PersonCard'

const MAX_SINGLE_MOVE_TARGETS = 50

type ReviewDevelopersViewProps = {
  onBack: () => void
  onConfirm: (groups: string[][]) => void
  review: DevelopersReview
}

// Prefere a área sob o ponteiro (mouse/toque); no teclado, cai para a interseção de retângulos.
const collisionDetection: CollisionDetection = (args) => {
  const withinPointer = pointerWithin(args)
  return withinPointer.length > 0 ? withinPointer : rectIntersection(args)
}

export function ReviewDevelopersView({ onBack, onConfirm, review }: ReviewDevelopersViewProps) {
  const { developers, suggestedGroups } = review
  const [people, setPeople] = useState(() => buildInitialPeople(developers, suggestedGroups))
  const [activeIdentity, setActiveIdentity] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  )

  const developersById = useMemo(() => new Map(developers.map((developer) => [developer.id, developer])), [developers])
  const peopleById = useMemo(() => new Map(people.map((person) => [person.id, person])), [people])
  const { singles, united } = useMemo(() => {
    const commitsOf = (person: (typeof people)[number]) => getPersonCommits(person, developersById)
    const sorted = [...people].sort((a, b) => commitsOf(b) - commitsOf(a))
    return {
      singles: sorted.filter((person) => person.identityIds.length === 1),
      united: sorted.filter((person) => person.identityIds.length > 1),
    }
  }, [people, developersById])
  const hints = useMemo(() => findHints(people, suggestedGroups), [people, suggestedGroups])

  function nameOf(personId: string) {
    const person = peopleById.get(personId)
    return person ? getPersonName(person, developersById) : personId
  }

  const moveTargets: MoveTargets = useMemo(() => ({
    singles: singles.slice(0, MAX_SINGLE_MOVE_TARGETS).map((person) => {
      const developer = developersById.get(person.identityIds[0])
      return { id: person.id, label: developer ? `${developer.name} <${developer.email}>` : person.id }
    }),
    unified: united.map((person) => ({ id: person.id, label: `${getPersonName(person, developersById)} (${person.identityIds.length} identidades)` })),
  }), [developersById, singles, united])

  function handleMove(identityId: string, targetId: string) {
    setPeople((current) => moveIdentity(current, identityId, targetId))
  }

  function handleMerge(keepId: string, absorbId: string) {
    setPeople((current) => mergePeople(current, keepId, absorbId))
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveIdentity(String(event.active.id).replace(/^identity:/, ''))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveIdentity(null)
    if (event.over) handleMove(String(event.active.id).replace(/^identity:/, ''), String(event.over.id))
  }

  const activeDeveloper = activeIdentity ? developersById.get(activeIdentity) : undefined

  return (
    <Page>
      <Header>
        <BackButton onClick={onBack} type="button">← Voltar</BackButton>
        <h1>Revise os desenvolvedores</h1>
        <p>
          O histórico tem {developers.length.toLocaleString('pt-BR')} identidades de commit (nome + e-mail), e a mesma pessoa costuma aparecer mais de uma vez.
          Cada cartão abaixo é uma pessoa. Arraste uma identidade para outra pessoa para uni-las (ou use o menu "Mover para…"), e aceite as sugestões amarelas se
          fizerem sentido. Assim a análise não conta a mesma pessoa em duplicidade.
        </p>
      </Header>

      <DndContext collisionDetection={collisionDetection} onDragCancel={() => setActiveIdentity(null)} onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
        <section aria-label="Pessoas com mais de uma identidade">
          <h2>Pessoas com mais de uma identidade ({united.length})</h2>
          {united.length === 0 ? <Empty>Nenhuma identidade foi unida automaticamente. Arraste uma identidade sobre outra para uni-las.</Empty> : null}
          <Cards>
            {united.map((person) => (
              <PersonCard developersById={developersById} hints={hints.get(person.id) ?? []} key={person.id} moveTargets={moveTargets} nameOf={nameOf} onMerge={handleMerge} onMove={handleMove} person={person} />
            ))}
          </Cards>
          <NewPersonDropZone />
        </section>

        {singles.length > 0 ? (
          <section aria-label="Demais identidades">
            <h2>Demais identidades ({singles.length.toLocaleString('pt-BR')})</h2>
            <OthersList developersById={developersById} hints={hints} moveTargets={moveTargets} nameOf={nameOf} onMerge={handleMerge} onMove={handleMove} people={singles} />
          </section>
        ) : null}

        <DragOverlay>{activeDeveloper ? <DragPreview developer={activeDeveloper} /> : null}</DragOverlay>
      </DndContext>

      <ActionBar>
        <span>
          {united.length === 0 ? 'Nenhuma identidade será unida.' : `${united.length} ${united.length === 1 ? 'pessoa unida' : 'pessoas unidas'}`}
          {' · '}
          {people.length.toLocaleString('pt-BR')} desenvolvedores no total
        </span>
        <div>
          <ResetButton onClick={() => setPeople(buildInitialPeople(developers, suggestedGroups))} type="button">Desfazer alterações</ResetButton>
          <ConfirmButton onClick={() => onConfirm(toGroups(people))} type="button">Confirmar e analisar</ConfirmButton>
        </div>
      </ActionBar>
    </Page>
  )
}

const Page = styled.main`
  display: grid;
  gap: 2rem;
  padding-top: 2rem;

  section > h2 { margin: 0 0 1rem; font-size: 1.1rem; }
`

const Header = styled.header`
  display: grid;
  gap: 1rem;
  justify-items: start;

  h1 { margin: 0; font-size: clamp(1.5rem, 3vw, 2.25rem); letter-spacing: -0.03em; }
  p { max-width: 52rem; margin: 0; color: var(--text-muted); line-height: 1.6; }
`

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text);
  background: var(--surface);
  cursor: pointer;

  &:hover { background: var(--surface-strong); }
`

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 34rem), 1fr));
  gap: 1rem;
  align-items: start;
  margin-bottom: 1rem;
`

const Empty = styled.p`
  margin: 0 0 1rem;
  color: var(--text-muted);
`

const ActionBar = styled.div`
  position: sticky;
  bottom: 1rem;
  z-index: 5;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: rgba(14, 18, 32, 0.88);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  color: var(--text-muted);
  font-size: 0.9rem;

  div { display: flex; flex-wrap: wrap; gap: 0.75rem; }
`

const ResetButton = styled.button`
  padding: 0.8rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: 0.7rem;
  color: var(--text);
  background: transparent;
  cursor: pointer;

  &:hover { background: var(--surface-strong); }
`

const ConfirmButton = styled.button`
  padding: 0.8rem 1.4rem;
  border: 0;
  border-radius: 0.7rem;
  color: #fff;
  background: linear-gradient(135deg, var(--accent), #5b8cff);
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, filter 0.15s;

  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`
