import type { Developer, SuggestedGroup } from '../api/developers'
import { mergeCheckedGroups } from './mergeGroups'

// Uma "pessoa" reúne as identidades de commit (nome + e-mail) que o usuário considera a mesma pessoa.
export type Person = {
  id: string
  identityIds: string[]
}

export type PersonHint = {
  otherId: string
  reasons: string[]
}

export const NEW_PERSON = 'new-person'

let sequence = 0
const createPersonId = () => `person-${++sequence}`

// Grupos de alta confiança já vêm unidos; as demais identidades começam sozinhas.
export function buildInitialPeople(developers: Developer[], suggestedGroups: SuggestedGroup[]): Person[] {
  const highConfidence = new Set(suggestedGroups.flatMap((group, index) => (group.confidence === 'high' ? [index] : [])))
  const unitedGroups = mergeCheckedGroups(suggestedGroups, highConfidence)
  const united = new Set(unitedGroups.flat())

  return [
    ...unitedGroups.map((identityIds) => ({ id: createPersonId(), identityIds })),
    ...developers.filter((developer) => !united.has(developer.id)).map((developer) => ({ id: createPersonId(), identityIds: [developer.id] })),
  ]
}

export function moveIdentity(people: Person[], identityId: string, targetId: string): Person[] {
  const source = people.find((person) => person.identityIds.includes(identityId))
  if (!source || source.id === targetId) return people
  if (targetId === NEW_PERSON && source.identityIds.length === 1) return people

  const remaining = people
    .map((person) => (person.id === source.id ? { ...person, identityIds: person.identityIds.filter((id) => id !== identityId) } : person))
    .filter((person) => person.identityIds.length > 0)

  if (targetId === NEW_PERSON) return [...remaining, { id: createPersonId(), identityIds: [identityId] }]
  return remaining.map((person) => (person.id === targetId ? { ...person, identityIds: [...person.identityIds, identityId] } : person))
}

export function mergePeople(people: Person[], keepId: string, absorbId: string): Person[] {
  const absorbed = people.find((person) => person.id === absorbId)
  if (!absorbed || keepId === absorbId) return people

  return people
    .filter((person) => person.id !== absorbId)
    .map((person) => (person.id === keepId ? { ...person, identityIds: [...person.identityIds, ...absorbed.identityIds] } : person))
}

// O que vai para o backend: só as pessoas com mais de uma identidade.
export function toGroups(people: Person[]): string[][] {
  return people.filter((person) => person.identityIds.length > 1).map((person) => person.identityIds)
}

// Sugestões de média confiança viram dicas entre pessoas ("pode ser a mesma pessoa que...").
export function findHints(people: Person[], suggestedGroups: SuggestedGroup[]): Map<string, PersonHint[]> {
  const personOf = new Map<string, string>()
  for (const person of people) person.identityIds.forEach((id) => personOf.set(id, person.id))

  const reasonsByPair = new Map<string, Set<string>>()
  for (const group of suggestedGroups) {
    if (group.confidence !== 'medium') continue

    const personIds = [...new Set(group.ids.flatMap((id) => personOf.get(id) ?? []))]
    for (const a of personIds) {
      for (const b of personIds) {
        if (a === b) continue
        const reasons = reasonsByPair.get(`${a}|${b}`) ?? new Set<string>()
        group.reasons.forEach((reason) => reasons.add(reason))
        reasonsByPair.set(`${a}|${b}`, reasons)
      }
    }
  }

  const hints = new Map<string, PersonHint[]>()
  for (const [pair, reasons] of reasonsByPair) {
    const [personId, otherId] = pair.split('|')
    hints.set(personId, [...(hints.get(personId) ?? []), { otherId, reasons: [...reasons] }])
  }
  return hints
}

export function getPersonCommits(person: Person, developersById: Map<string, Developer>) {
  return person.identityIds.reduce((total, id) => total + (developersById.get(id)?.commits ?? 0), 0)
}

// Nome exibido: o que mais aparece somando as identidades da pessoa (empate: o mais longo).
export function getPersonName(person: Person, developersById: Map<string, Developer>) {
  const commitsByName = new Map<string, number>()
  for (const id of person.identityIds) {
    const developer = developersById.get(id)
    if (developer) commitsByName.set(developer.name, (commitsByName.get(developer.name) ?? 0) + developer.commits)
  }

  return [...commitsByName.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)[0]?.[0] ?? person.identityIds[0]
}
