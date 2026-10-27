import { br, fmt, minutesByDay, WEEKDAYS, ymd } from '../lib/format'
import type { StudyData } from '../lib/useStudyData'
import type { Tab } from '../lib/types'
import { SubjectProgress } from '../components/SubjectProgress'

type Props = { data: StudyData; goTo: (tab: Tab) => void }

export function Painel({ data, goTo }: Props) {
  const { subjects, sessions, lessons } = data
  const now = new Date()
  const today = ymd(now)
  const byDay = minutesByDay(sessions)

  const bySubject: Record<string, number> = {}
  for (const s of sessions) if (s.subject_id) bySubject[s.subject_id] = (bySubject[s.subject_id] || 0) + s.minutes

  // Últimos 7 dias, terminando hoje
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i))
    return { minutes: byDay[ymd(d)] || 0, label: WEEKDAYS[d.getDay()], isToday: i === 6 }
  })
  const week = days.reduce((a, d) => a + d.minutes, 0)
  const maxDay = Math.max(1, ...days.map((d) => d.minutes))

  const monthPrefix = today.slice(0, 7)
  const monthDays = Object.keys(byDay).filter((k) => k.startsWith(monthPrefix) && byDay[k] > 0).length

  // Sequência: conta dias seguidos com estudo; se hoje ainda não teve, começa de ontem.
  let streak = 0
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (!byDay[ymd(cursor)]) cursor.setDate(cursor.getDate() - 1)
  while (byDay[ymd(cursor)] > 0) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  const colorOf = (id: string | null) => subjects.find((s) => s.id === id)?.color ?? '#9AA0AB'
  const nameOf = (id: string | null) => subjects.find((s) => s.id === id)?.name ?? 'Sem matéria'
  const plural = (n: number) => n + (n === 1 ? ' dia' : ' dias')

  return (
    <div className="stack-6">
      <div className="stats-grid">
        <Stat label="Estudado hoje" value={fmt(byDay[today] || 0)} />
        <Stat label="Últimos 7 dias" value={fmt(week)} />
        <Stat label="Dias estudados no mês" value={plural(monthDays)} />
        <Stat label="Sequência atual" value={plural(streak)} />
      </div>

      <div className="split">
        <section className="card split-main stack-4">
          <div className="card-head">
            <h2 className="card-title">Progresso por matéria</h2>
            <button type="button" className="link-btn" onClick={() => goTo('materias')}>
              Gerenciar matérias
            </button>
          </div>
          {subjects.length === 0 && <p className="muted">Nenhuma matéria ainda. Adicione na aba Matérias.</p>}
          {subjects.map((s) => (
            <SubjectProgress key={s.id} subject={s} extra={fmt(bySubject[s.id] || 0)} />
          ))}
        </section>

        <section className="card split-side stack-4">
          <h2 className="card-title card-title-sm">Esta semana</h2>
          <div className="week-bars">
            {days.map((d, i) => (
              <div key={i} className="bar-col">
                <span className="bar-value">{d.minutes ? (d.minutes >= 60 ? Math.round(d.minutes / 6) / 10 + 'h' : d.minutes + 'm') : ''}</span>
                <div
                  className="bar"
                  title={fmt(d.minutes)}
                  style={{
                    height: d.minutes ? Math.max(6, Math.round((d.minutes / maxDay) * 90)) : 4,
                    background: d.minutes ? (d.isToday ? 'var(--accent)' : 'var(--heat-2)') : 'var(--track)',
                  }}
                />
                <span className="bar-label">{d.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card stack-4">
        <div className="card-head">
          <h2 className="card-title">Últimos resumos</h2>
          <button type="button" className="link-btn" onClick={() => goTo('resumos')}>
            Escrever resumo
          </button>
        </div>
        {lessons.length === 0 && <p className="muted">Você ainda não salvou nenhum resumo de aula.</p>}
        <div className="lesson-grid">
          {lessons.slice(0, 3).map((l) => (
            <article key={l.id} className="lesson-card">
              <span className="meta">
                <span className="dot" style={{ background: colorOf(l.subject_id) }} />
                {nameOf(l.subject_id)} · {br(l.date)}
              </span>
              <h3 className="lesson-title">{l.title || 'Sem título'}</h3>
              <p className="lesson-text">{(l.summary || '').length > 180 ? l.summary!.slice(0, 180) + '…' : l.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  )
}
