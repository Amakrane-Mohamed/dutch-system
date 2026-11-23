import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { getState, migrate, replaceState, setUserStorage, subscribeState } from './store'

type AccessState = 'loading' | 'none' | 'pending' | 'active'
type AuthState = {
  session: Session | null
  user: User | null
  isAdmin: boolean
  access: AccessState
  ready: boolean
  refreshAccess: () => Promise<void>
  signOut: () => Promise<void>
}
const Context = createContext<AuthState>({ session: null, user: null, isAdmin: false, access: 'loading', ready: false, refreshAccess: async () => {}, signOut: async () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [access, setAccess] = useState<AccessState>('loading')
  const [ready, setReady] = useState(!supabase)

  const refreshAccess = async () => {
    if (!supabase || !session?.user) { setIsAdmin(false); setAccess('none'); return }
    const [profile, entitlement] = await Promise.all([
      supabase.from('profiles').select('is_admin').eq('id', session.user.id).maybeSingle(),
      supabase.from('entitlements').select('active').eq('user_id', session.user.id).maybeSingle(),
    ])
    const admin = profile.data?.is_admin === true
    setIsAdmin(admin)
    if (admin || entitlement.data?.active === true) { setAccess('active'); return }
    const request = await supabase.from('access_requests').select('id').eq('user_id', session.user.id).eq('status', 'pending').limit(1)
    setAccess(request.data?.length ? 'pending' : 'none')
  }

  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase.auth.getSession().then(({ data }) => { if (alive) { setSession(data.session); setReady(true) } })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      if (!next) { setAccess('none'); setIsAdmin(false) }
      setReady(true)
    })
    return () => { alive = false; subscription.unsubscribe() }
  }, [])

  useEffect(() => { if (ready) void refreshAccess() }, [ready, session?.user.id])

  useEffect(() => {
    const id = session?.user.id
    if (!supabase || !id) return
    setUserStorage(id)
    let alive = true
    let hydrated = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const unsubscribe = subscribeState(() => {
      if (!hydrated || !alive) return
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        if (alive) void supabase!.from('learning_progress').upsert({ user_id: id, state: getState(), updated_at: new Date().toISOString() })
      }, 700)
    })
    void supabase.from('learning_progress').select('state').eq('user_id', id).maybeSingle().then(async ({ data, error }) => {
      if (!alive) return
      if (!error && data?.state) {
        try { replaceState(migrate(data.state)) } catch { /* keep the user's local copy if an older row has an unknown format */ }
      } else if (!error) {
        await supabase!.from('learning_progress').upsert({ user_id: id, state: getState() })
      }
      hydrated = true
    })
    return () => {
      alive = false
      if (timer) clearTimeout(timer)
      unsubscribe()
      setUserStorage(null)
    }
  }, [session?.user.id])

  const value = useMemo(() => ({ session, user: session?.user ?? null, isAdmin, access, ready, refreshAccess, signOut: async () => { if (supabase) await supabase.auth.signOut() } }), [session, isAdmin, access, ready])
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useAuth = () => useContext(Context)
