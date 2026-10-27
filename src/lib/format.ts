export const PALETTE = ['#3B5BDB', '#E8590C', '#0C8599', '#9C36B5', '#2F9E44', '#C2255C', '#5F3DC4', '#E67700']
export const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export const SUGGESTED_SUBJECTS = ['Lógica de Programação', 'Banco de Dados', 'Engenharia de Software', 'Desenvolvimento Web']

export function pad(n: number) {
  return n < 10 ? '0' + n : String(n)
}

/** Data local no formato AAAA-MM-DD (o mesmo do tipo `date` do Postgres). */
export function ymd(d: Date) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

export function parseYmd(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** AAAA-MM-DD → DD/MM/AAAA */
export function br(s: string) {
  const p = s.split('-')
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : s
}

/** Minutos → "45 min", "2h", "1h 30min" */
export function fmt(minutes: number) {
  const m = Math.round(minutes || 0)
  if (m < 60) return m + ' min'
  const h = Math.floor(m / 60)
  const r = m % 60
  return r ? `${h}h ${r}min` : `${h}h`
}

export function minutesByDay(sessions: { date: string; minutes: number }[]) {
  const out: Record<string, number> = {}
  for (const s of sessions) out[s.date] = (out[s.date] || 0) + (s.minutes || 0)
  return out
}
