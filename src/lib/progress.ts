import type { Subject } from './types'

export function progressOf(s: Subject) {
  const total = Math.max(1, s.total || 1)
  const done = Math.min(total, Math.max(0, s.done || 0))
  return { total, done, pct: Math.round((done / total) * 100) }
}
