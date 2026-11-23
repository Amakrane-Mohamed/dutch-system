export const PLANS = {
  monthly: { key: 'monthly', name: 'شهري', price: 100, period: 'الشهر' },
  yearly: { key: 'yearly', name: 'سنوي', price: 500, period: 'العام' },
} as const

export type PlanKey = keyof typeof PLANS

export function planKey(value: unknown): PlanKey {
  return value === 'yearly' ? 'yearly' : 'monthly'
}
