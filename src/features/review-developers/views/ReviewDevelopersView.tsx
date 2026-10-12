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
import { useTranslation } from 'react-i18next'
import type { DevelopersReview } from '../service/contracts'
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
import { ActionBar, BackButton, Cards, ConfirmButton, Empty, Header, Page, ResetButton } from '../styles/ReviewDevelopersView.styled'

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
  const { t } = useTranslation('reviewDevelopers')
  const { t: tCommon } = useTranslation('common')
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
    unified: united.map((person) => ({ id: person.id, label: t('moveTargets.person', { count: person.identityIds.length, name: getPersonName(person, developersById) }) })),
  }), [developersById, singles, t, united])

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
        <BackButton onClick={onBack} type="button">{tCommon('back')}</BackButton>
        <h1>{t('title')}</h1>
        <p>{t('intro', { identities: t('introIdentities', { count: developers.length }) })}</p>
      </Header>

      <DndContext collisionDetection={collisionDetection} onDragCancel={() => setActiveIdentity(null)} onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
        <section aria-label={t('sections.unitedLabel')}>
          <h2>{t('sections.united', { count: united.length })}</h2>
          {united.length === 0 ? <Empty>{t('sections.unitedEmpty')}</Empty> : null}
          <Cards>
            {united.map((person) => (
              <PersonCard developersById={developersById} hints={hints.get(person.id) ?? []} key={person.id} moveTargets={moveTargets} nameOf={nameOf} onMerge={handleMerge} onMove={handleMove} person={person} />
            ))}
          </Cards>
          <NewPersonDropZone />
        </section>

        {singles.length > 0 ? (
          <section aria-label={t('sections.othersLabel')}>
            <h2>{t('sections.others', { count: singles.length })}</h2>
            <OthersList developersById={developersById} hints={hints} moveTargets={moveTargets} nameOf={nameOf} onMerge={handleMerge} onMove={handleMove} people={singles} />
          </section>
        ) : null}

        <DragOverlay>{activeDeveloper ? <DragPreview developer={activeDeveloper} /> : null}</DragOverlay>
      </DndContext>

      <ActionBar>
        <span>
          {t('summary.line', {
            total: t('summary.total', { count: people.length }),
            united: united.length === 0 ? t('summary.none') : t('summary.united', { count: united.length }),
          })}
        </span>
        <div>
          <ResetButton onClick={() => setPeople(buildInitialPeople(developers, suggestedGroups))} type="button">{t('actions.reset')}</ResetButton>
          <ConfirmButton onClick={() => onConfirm(toGroups(people))} type="button">{t('actions.confirm')}</ConfirmButton>
        </div>
      </ActionBar>
    </Page>
  )
}
