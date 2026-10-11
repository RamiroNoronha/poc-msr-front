import { useEffect, useState } from 'react'
import { getAuthorMining } from '../api/authorMining'
import type { DeveloperActivity } from '../utils/ownership'
import { collectRevisions } from '../utils/tree'

export function useDeveloperActivity(repositoryUrl: string, developers: string[]) {
  const [activity, setActivity] = useState<DeveloperActivity[]>(() =>
    developers.map((developer) => ({ developer, revisions: new Map(), status: 'loading' })),
  )

  useEffect(() => {
    let cancelled = false

    function update(developer: string, changes: Partial<DeveloperActivity>) {
      if (cancelled) return
      setActivity((current) => current.map((item) => (item.developer === developer ? { ...item, ...changes } : item)))
    }

    developers.forEach((developer) => {
      getAuthorMining(repositoryUrl, developer)
        .then((tree) => update(developer, { revisions: collectRevisions(tree), status: 'ready' }))
        .catch(() => update(developer, { status: 'error' }))
    })

    return () => { cancelled = true }
  }, [developers, repositoryUrl])

  return activity
}
