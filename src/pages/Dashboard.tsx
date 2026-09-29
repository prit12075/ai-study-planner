import { useMemo, useState } from 'react'
import FocusTimer from '../components/FocusTimer'
import PlanView from '../components/PlanView'
import SettingsPanel from '../components/SettingsPanel'
import SubjectForm from '../components/SubjectForm'
import SubjectList from '../components/SubjectList'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { addDays, daysBetween, today } from '../lib/dates'
import { generatePlan } from '../lib/planner'
import type { Settings, StudySession, Subject } from '../lib/types'

const DEFAULT_SETTINGS: Settings = { hoursPerDay: 3, sessionMinutes: 45, restDays: [] }

function Dashboard() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('asp.subjects', [])
  const [settings, setSettings] = useLocalStorage<Settings>('asp.settings', DEFAULT_SETTINGS)
  const [completedIds, setCompletedIds] = useLocalStorage<string[]>('asp.completed', [])
  const [focus, setFocus] = useState<StudySession | null>(null)

  const now = today()
  const plan = useMemo(() => generatePlan(subjects, settings, now), [subjects, settings, now])
  const subjectMap = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects])
  const completed = useMemo(() => new Set(completedIds), [completedIds])

  const todayPlan = plan.find((d) => d.date === now)
  const todayDone = todayPlan?.sessions.filter((s) => completed.has(s.id)) ?? []
  const todayMinutes = todayDone.reduce((sum, s) => sum + s.minutes, 0)
  const nextExam = subjects
    .filter((s) => daysBetween(now, s.examDate) >= 0)
    .sort((a, b) => a.examDate.localeCompare(b.examDate))[0]

  // Consecutive days (ending today or yesterday) with at least one finished session.
  const streak = useMemo(() => {
    const days = new Set(completedIds.map((id) => id.split(':')[0]))
    let count = 0
    let cursor = days.has(now) ? now : addDays(now, -1)
    while (days.has(cursor)) {
      count++
      cursor = addDays(cursor, -1)
    }
    return count
  }, [completedIds, now])

  function toggle(id: string) {
    setCompletedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  function completeFocus() {
    if (focus && !completed.has(focus.id)) toggle(focus.id)
    setFocus(null)
  }

  function removeSubject(id: string) {
    setSubjects((list) => list.filter((s) => s.id !== id))
    setCompletedIds((ids) => ids.filter((x) => x.split(':')[1] !== id))
  }

  function updateSubject(id: string, patch: Partial<Subject>) {
    setSubjects((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  return (
    <div className="dashboard">
      <section className="stats">
        <div className="card stat">
          <span className="stat-label">Today</span>
          <span className="stat-value">
            {todayDone.length}/{todayPlan?.sessions.length ?? 0}
          </span>
          <span className="muted">sessions · {todayMinutes} min</span>
        </div>
        <div className="card stat">
          <span className="stat-label">Streak</span>
          <span className="stat-value">{streak}🔥</span>
          <span className="muted">day{streak === 1 ? '' : 's'} in a row</span>
        </div>
        <div className="card stat">
          <span className="stat-label">Next exam</span>
          <span className="stat-value">
            {nextExam ? `${daysBetween(now, nextExam.examDate)}d` : '—'}
          </span>
          <span className="muted">{nextExam?.name ?? 'none scheduled'}</span>
        </div>
      </section>

      <div className="layout">
        <aside className="sidebar">
          <SubjectForm
            existingCount={subjects.length}
            onAdd={(s) => setSubjects((list) => [...list, s])}
          />
          <SubjectList subjects={subjects} onRemove={removeSubject} onUpdate={updateSubject} />
          <SettingsPanel settings={settings} onChange={setSettings} />
        </aside>

        <main className="main">
          {focus && (
            <FocusTimer
              key={focus.id}
              label={subjectMap.get(focus.subjectId)?.name ?? null}
              minutes={focus.minutes}
              onComplete={completeFocus}
              onClose={() => setFocus(null)}
            />
          )}
          <PlanView
            plan={plan}
            subjects={subjectMap}
            completed={completed}
            onToggle={toggle}
            onFocus={setFocus}
          />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
