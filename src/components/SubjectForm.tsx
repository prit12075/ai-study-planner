import { useState, type FormEvent } from 'react'
import { addDays, today } from '../lib/dates'
import type { Subject } from '../lib/types'

const PALETTE = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6']

interface Props {
  existingCount: number
  onAdd: (subject: Subject) => void
}

function SubjectForm({ existingCount, onAdd }: Props) {
  const [name, setName] = useState('')
  const [examDate, setExamDate] = useState(addDays(today(), 14))
  const [difficulty, setDifficulty] = useState(3)
  const [confidence, setConfidence] = useState(3)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd({
      id: crypto.randomUUID(),
      name: trimmed,
      examDate,
      difficulty,
      confidence,
      color: PALETTE[existingCount % PALETTE.length],
    })
    setName('')
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Add a subject</h2>
      <label>
        Subject
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Organic Chemistry"
          required
        />
      </label>
      <label>
        Exam date
        <input
          type="date"
          value={examDate}
          min={today()}
          onChange={(e) => setExamDate(e.target.value)}
          required
        />
      </label>
      <label>
        Difficulty <span className="muted">{difficulty}/5</span>
        <input
          type="range"
          min={1}
          max={5}
          value={difficulty}
          onChange={(e) => setDifficulty(Number(e.target.value))}
        />
      </label>
      <label>
        Confidence <span className="muted">{confidence}/5</span>
        <input
          type="range"
          min={1}
          max={5}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
        />
      </label>
      <button type="submit" className="primary">
        Add subject
      </button>
    </form>
  )
}

export default SubjectForm
