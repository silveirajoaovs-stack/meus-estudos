import { useState, type FormEvent } from 'react'
import { fmt, SUGGESTED_SUBJECTS } from '../lib/format'
import type { StudyData } from '../lib/useStudyData'
import type { Subject } from '../lib/types'
import { ProgressBar } from '../components/SubjectProgress'
import { progressOf } from '../lib/progress'

export function Materias({ data }: { data: StudyData }) {
  const { subjects, sessions, lessons, addSubjects } = data
  const [name, setName] = useState('')
  const [total, setTotal] = useState('10')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (!n) return
    setBusy(true)
    const ok = await addSubjects([{ name: n, total: Math.max(1, Number(total) || 1) }])
    if (ok) {
      setName('')
      setTotal('10')
    }
    setBusy(false)
  }

  async function addSuggested() {
    setBusy(true)
    await addSubjects(SUGGESTED_SUBJECTS.map((n) => ({ name: n, total: 10 })))
    setBusy(false)
  }

  return (
    <div className="stack-6">
      <form className="card stack-3" onSubmit={submit}>
        <h2 className="card-title">Nova matéria</h2>
        <div className="form-row">
          <label className="field grow-3">
            Nome da matéria
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Estrutura de Dados" />
          </label>
          <label className="field grow-1">
            Nº de aulas / tópicos
            <input className="input" type="number" min={1} value={total} onChange={(e) => setTotal(e.target.value)} />
          </label>
          <button type="submit" className="btn btn-primary" disabled={busy || !name.trim()}>
            Adicionar
          </button>
        </div>
      </form>

      {subjects.length === 0 && (
        <div className="empty stack-3">
          <p>Você ainda não tem matérias cadastradas.</p>
          <button type="button" className="btn btn-outline" onClick={addSuggested} disabled={busy}>
            Adicionar matérias sugeridas de ADS
          </button>
        </div>
      )}

      <div className="subject-grid">
        {subjects.map((s) => (
          <SubjectCard
            key={s.id}
            subject={s}
            data={data}
            minutes={sessions.filter((x) => x.subject_id === s.id).reduce((a, x) => a + x.minutes, 0)}
            nLessons={lessons.filter((l) => l.subject_id === s.id).length}
          />
        ))}
      </div>
    </div>
  )
}

type CardProps = { subject: Subject; data: StudyData; minutes: number; nLessons: number }

function SubjectCard({ subject, data, minutes, nLessons }: CardProps) {
  const { total, done, pct } = progressOf(subject)
  const [totalDraft, setTotalDraft] = useState(String(subject.total))

  function commitTotal() {
    const t = Math.max(1, Math.round(Number(totalDraft)) || 1)
    setTotalDraft(String(t))
    if (t !== subject.total) data.updateSubject(subject.id, { total: t, done: Math.min(subject.done, t) })
  }

  function remove() {
    if (window.confirm(`Remover "${subject.name}"? Os registros e resumos dela continuam salvos, mas ficam como "Sem matéria".`)) {
      data.removeSubject(subject.id)
    }
  }

  return (
    <article className="card stack-4">
      <div className="spread align-start">
        <h3 className="subject-title">
          <span className="dot" style={{ background: subject.color }} />
          {subject.name}
        </h3>
        <button type="button" className="icon-btn corner" onClick={remove} aria-label={`Remover ${subject.name}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
          </svg>
        </button>
      </div>

      <div className="baseline">
        <span className="big-number">{pct}%</span>
        <span className="muted small">
          {done} de {total} concluídos
        </span>
      </div>
      <ProgressBar subject={subject} />

      <div className="spread">
        <span className="label">Concluídos</span>
        <div className="stepper">
          <button
            type="button"
            className="step-btn"
            aria-label="Diminuir concluídos"
            disabled={done <= 0}
            onClick={() => data.updateSubject(subject.id, { done: done - 1 })}
          >
            −
          </button>
          <button
            type="button"
            className="step-btn step-btn-primary"
            aria-label="Aumentar concluídos"
            disabled={done >= total}
            onClick={() => data.updateSubject(subject.id, { done: done + 1 })}
          >
            +
          </button>
        </div>
      </div>

      <label className="label inline-field">
        Total de aulas / tópicos
        <input
          className="input input-sm"
          type="number"
          min={1}
          value={totalDraft}
          onChange={(e) => setTotalDraft(e.target.value)}
          onBlur={commitTotal}
          onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
        />
      </label>

      <div className="card-foot">
        <span>
          <strong>{fmt(minutes)}</strong> estudadas
        </span>
        <span>
          <strong>{nLessons}</strong> resumos
        </span>
      </div>
    </article>
  )
}
