import { useState } from 'react'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import type { Developer } from '../../service/contracts'
import type { Person, PersonHint } from '../../utils/people'
import type { MoveTargets } from './IdentityRow'
import { SingleIdentity } from './SingleIdentity'

const PAGE_SIZE = 30

type OthersListProps = {
  developersById: Map<string, Developer>
  hints: Map<string, PersonHint[]>
  moveTargets: MoveTargets
  nameOf: (personId: string) => string
  onMerge: (keepId: string, absorbId: string) => void
  onMove: (identityId: string, targetId: string) => void
  people: Person[]
}

export function OthersList({ developersById, hints, moveTargets, nameOf, onMerge, onMove, people }: OthersListProps) {
  const { t } = useTranslation('reviewDevelopers')
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)

  const normalized = query.trim().toLowerCase()
  const matches = normalized
    ? people.filter((person) => {
        const developer = developersById.get(person.identityIds[0])
        return developer ? `${developer.name} ${developer.email}`.toLowerCase().includes(normalized) : false
      })
    : people
  const visible = matches.slice(0, limit)

  return (
    <Wrapper>
      {people.length > PAGE_SIZE ? (
        <Search aria-label={t('others.searchLabel')} onChange={(event) => { setQuery(event.target.value); setLimit(PAGE_SIZE) }} placeholder={t('others.search')} type="search" value={query} />
      ) : null}
      <List>
        {visible.map((person) => {
          const developer = developersById.get(person.identityIds[0])
          return developer ? (
            <SingleIdentity developer={developer} hints={hints.get(person.id) ?? []} key={person.id} moveTargets={moveTargets} nameOf={nameOf} onMerge={onMerge} onMove={onMove} person={person} />
          ) : null
        })}
        {matches.length === 0 ? <Empty>{t('others.empty')}</Empty> : null}
      </List>
      {matches.length > limit ? (
        <More onClick={() => setLimit((current) => current + PAGE_SIZE)} type="button">{t('others.more', { count: matches.length - limit })}</More>
      ) : null}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  gap: 0.75rem;
`

const List = styled.div`
  display: grid;
  gap: 0.15rem;
`

const Search = styled.input`
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 0.7rem;
  color: var(--text);
  background: var(--surface);
  font-size: 0.875rem;

  &::placeholder { color: var(--text-muted); }
`

const More = styled.button`
  justify-self: start;
  padding: 0.35rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text);
  background: transparent;
  font-size: 0.8125rem;
  cursor: pointer;

  &:hover { background: var(--surface-strong); }
`

const Empty = styled.p`
  margin: 0;
  color: var(--text-muted);
`
