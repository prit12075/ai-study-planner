export interface Subject {
  id: string
  name: string
  /** Exam date in YYYY-MM-DD (local) format. */
  examDate: string
  /** 1 (easy) – 5 (very hard) */
  difficulty: number
  /** 1 (lost) – 5 (confident) */
  confidence: number
  color: string
}

export interface Settings {
  hoursPerDay: number
  sessionMinutes: number
  restDays: number[] // 0 = Sunday … 6 = Saturday
}

export type SessionKind = 'learn' | 'practice' | 'review'

export interface StudySession {
  id: string
  subjectId: string
  minutes: number
  kind: SessionKind
}

export interface PlanDay {
  date: string
  sessions: StudySession[]
  exams: string[] // subject ids with an exam on this date
}
