import type { Subject } from '../lib/types'
import { progressOf } from '../lib/progress'

export function ProgressBar({ subject }: { subject: Subject }) {
  const { pct } = progressOf(subject)
  return (
    <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={subject.name}>
      <div className="progress-fill" style={{ width: pct + '%', background: subject.color }} />
    </div>
  )
}

export function SubjectProgress({ subject, extra }: { subject: Subject; extra: string }) {
  const { total, done } = progressOf(subject)
  return (
    <div className="stack-2">
      <div className="spread">
        <span className="subject-name">
          <span className="dot" style={{ background: subject.color }} />
          {subject.name}
        </span>
        <span className="muted small">
          {done} de {total} concluídos · {extra}
        </span>
      </div>
      <ProgressBar subject={subject} />
    </div>
  )
}
