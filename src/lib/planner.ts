import { addDays, daysBetween, parseISODate } from './dates'
import type { PlanDay, SessionKind, Settings, StudySession, Subject } from './types'

/**
 * How much attention a subject deserves on a given day. Harder subjects and
 * lower confidence raise the weight; a closer exam raises it sharply.
 */
export function priority(subject: Subject, date: string): number {
  const daysLeft = daysBetween(date, subject.examDate)
  if (daysLeft <= 0) return 0
  const need = subject.difficulty + (6 - subject.confidence) // 2 – 10
  return need / Math.sqrt(daysLeft)
}

function sessionKind(daysLeft: number): SessionKind {
  if (daysLeft <= 2) return 'review'
  if (daysLeft <= 7) return 'practice'
  return 'learn'
}

/**
 * Builds a day-by-day plan from `start` until the last exam (capped at
 * `maxDays`). Each study day's slots are handed out one at a time to the
 * subject with the highest remaining priority, which spreads time across
 * subjects in proportion to their weight instead of starving the smaller ones.
 */
export function generatePlan(
  subjects: Subject[],
  settings: Settings,
  start: string,
  maxDays = 60,
): PlanDay[] {
  const upcoming = subjects.filter((s) => daysBetween(start, s.examDate) >= 0)
  if (upcoming.length === 0) return []

  const lastExam = upcoming.reduce((max, s) => (s.examDate > max ? s.examDate : max), start)
  const totalDays = Math.min(daysBetween(start, lastExam) + 1, maxDays)
  const slotsPerDay = Math.max(
    1,
    Math.floor((settings.hoursPerDay * 60) / Math.max(settings.sessionMinutes, 5)),
  )

  const plan: PlanDay[] = []
  for (let i = 0; i < totalDays; i++) {
    const date = addDays(start, i)
    const exams = upcoming.filter((s) => s.examDate === date).map((s) => s.id)
    const isRest = settings.restDays.includes(parseISODate(date).getDay())

    const sessions: StudySession[] = []
    const weights = new Map(upcoming.map((s) => [s.id, priority(s, date)]))
    const active = upcoming.filter((s) => (weights.get(s.id) ?? 0) > 0)

    if (!isRest && active.length > 0) {
      const given = new Map<string, number>()
      for (let slot = 0; slot < slotsPerDay; slot++) {
        // Diminishing returns: each extra slot for a subject halves its pull.
        let best = active[0]
        let bestScore = -Infinity
        for (const s of active) {
          const score = (weights.get(s.id) ?? 0) / (1 + (given.get(s.id) ?? 0))
          if (score > bestScore) {
            best = s
            bestScore = score
          }
        }
        given.set(best.id, (given.get(best.id) ?? 0) + 1)
      }

      // Emit sessions grouped by subject, highest priority first.
      const ordered = [...given.entries()].sort(
        (a, b) => (weights.get(b[0]) ?? 0) - (weights.get(a[0]) ?? 0),
      )
      for (const [subjectId, count] of ordered) {
        const subject = active.find((s) => s.id === subjectId)!
        const kind = sessionKind(daysBetween(date, subject.examDate))
        for (let n = 0; n < count; n++) {
          sessions.push({
            id: `${date}:${subjectId}:${n}`,
            subjectId,
            minutes: settings.sessionMinutes,
            kind,
          })
        }
      }
    }

    plan.push({ date, sessions, exams })
  }
  return plan
}
