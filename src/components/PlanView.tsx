import { formatDay, today } from '../lib/dates'
import type { PlanDay, StudySession, Subject } from '../lib/types'

const KIND_LABEL = { learn: 'Learn', practice: 'Practice', review: 'Review' } as const

interface Props {
  plan: PlanDay[]
  subjects: Map<string, Subject>
  completed: Set<string>
  onToggle: (sessionId: string) => void
  onFocus: (session: StudySession) => void
}

function PlanView({ plan, subjects, completed, onToggle, onFocus }: Props) {
  if (plan.length === 0) {
    return (
      <div className="card empty">
        <h2>Your plan</h2>
        <p className="muted">
          Your schedule appears here once you add subjects with upcoming exams.
        </p>
      </div>
    )
  }

  const now = today()

  return (
    <div className="plan">
      {plan.map((day) => {
        const done = day.sessions.filter((s) => completed.has(s.id)).length
        return (
          <section key={day.date} className={day.date === now ? 'card day today' : 'card day'}>
            <header>
              <h3>{day.date === now ? 'Today' : formatDay(day.date)}</h3>
              {day.sessions.length > 0 && (
                <span className="muted">
                  {done}/{day.sessions.length} done
                </span>
              )}
            </header>

            {day.exams.map((id) => {
              const s = subjects.get(id)
              return (
                s && (
                  <div key={id} className="exam" style={{ borderColor: s.color }}>
                    📝 {s.name} exam
                  </div>
                )
              )
            })}

            {day.sessions.length === 0 && day.exams.length === 0 && (
              <p className="muted">Rest day 🌿</p>
            )}

            <ul className="sessions">
              {day.sessions.map((session) => {
                const subject = subjects.get(session.subjectId)
                if (!subject) return null
                const isDone = completed.has(session.id)
                return (
                  <li key={session.id} className={isDone ? 'done' : ''}>
                    <label>
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => onToggle(session.id)}
                      />
                      <span className="dot" style={{ background: subject.color }} />
                      <span className="session-name">{subject.name}</span>
                      <span className={`tag ${session.kind}`}>{KIND_LABEL[session.kind]}</span>
                      <span className="muted">{session.minutes}m</span>
                    </label>
                    {!isDone && day.date === now && (
                      <button
                        className="small"
                        title="Start focus timer"
                        aria-label={`Start ${subject.name} focus timer`}
                        onClick={() => onFocus(session)}
                      >
                        ▶
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

export default PlanView
