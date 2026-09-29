import { daysBetween, formatDay, today } from '../lib/dates'
import type { Subject } from '../lib/types'

interface Props {
  subjects: Subject[]
  onRemove: (id: string) => void
  onUpdate: (id: string, patch: Partial<Subject>) => void
}

function SubjectList({ subjects, onRemove, onUpdate }: Props) {
  if (subjects.length === 0) {
    return (
      <div className="card empty">
        <h2>Subjects</h2>
        <p className="muted">Add your first subject to generate a plan.</p>
      </div>
    )
  }

  const sorted = [...subjects].sort((a, b) => a.examDate.localeCompare(b.examDate))
  const now = today()

  return (
    <div className="card">
      <h2>Subjects</h2>
      <ul className="subject-list">
        {sorted.map((s) => {
          const daysLeft = daysBetween(now, s.examDate)
          return (
            <li key={s.id} style={{ borderLeftColor: s.color }}>
              <div className="subject-main">
                <strong>{s.name}</strong>
                <span className="muted">
                  {formatDay(s.examDate)} ·{' '}
                  {daysLeft < 0 ? 'done' : daysLeft === 0 ? 'today!' : `${daysLeft}d left`}
                </span>
              </div>
              <label className="inline" title="Update as you improve — the plan adapts">
                Confidence
                <select
                  value={s.confidence}
                  onChange={(e) => onUpdate(s.id, { confidence: Number(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <button className="icon" aria-label={`Remove ${s.name}`} onClick={() => onRemove(s.id)}>
                ✕
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SubjectList
