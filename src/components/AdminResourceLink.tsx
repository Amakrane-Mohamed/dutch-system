import { useEffect, useState, type ReactNode } from 'react'
import type { Resource } from '../content/resources'
import { Ext } from './ui'

export function AdminResourceLink({ id, isAdmin, children }: { id: string; isAdmin: boolean; children?: ReactNode }) {
  const [lookup, setLookup] = useState<{ id: string; resource: Resource | null }>()

  useEffect(() => {
    let active = true
    if (isAdmin) {
      void import('../content/resources').then(({ resourceById }) => {
        if (active) setLookup({ id, resource: resourceById(id) ?? null })
      }).catch(() => { if (active) setLookup({ id, resource: null }) })
    }
    return () => { active = false }
  }, [id, isAdmin])

  const resource = lookup?.id === id ? lookup.resource : null
  if (!isAdmin || !resource?.urls[0]) return null
  return <Ext href={resource.urls[0]}>{children ?? resource.name}</Ext>
}
