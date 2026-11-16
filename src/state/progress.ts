import { setState, uid, type TestResult } from './store'
import type { Activity } from '../content/data'
import { todayISO } from '../lib/dates'

export function completeNode(nodeId: string, pct: number) {
  const date = todayISO()
  setState((s) => {
    const prev = s.nodes[nodeId]
    return { ...s, nodes: { ...s.nodes, [nodeId]: { date: prev?.date ?? date, best: Math.max(prev?.best ?? 0, pct) } } }
  })
}
export function uncompleteNode(nodeId: string) {
  setState((s) => { const n = { ...s.nodes }; delete n[nodeId]; return { ...s, nodes: n } })
}
export function pushTest(t: Omit<TestResult, 'id' | 'date'>) {
  const date = todayISO()
  setState((s) => ({ ...s, tests: [...s.tests, { ...t, id: uid(), date }] }))
}
export function logMinutes(minutes: number, note: string, activity: Activity = 'app') {
  const date = todayISO()
  setState((s) => ({ ...s, log: [...s.log, { id: uid(), date, activity, minutes, note, source: 'app' }] }))
}
