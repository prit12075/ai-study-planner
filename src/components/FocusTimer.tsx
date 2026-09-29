import { useEffect, useState } from 'react'

interface Props {
  label: string | null
  minutes: number
  onComplete: () => void
  onClose: () => void
}

function FocusTimer({ label, minutes, onComplete, onClose }: Props) {
  const [remaining, setRemaining] = useState(minutes * 60)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running || remaining <= 0) return
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(id)
  }, [running, remaining])

  const done = remaining === 0
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const progress = 1 - remaining / (minutes * 60)

  useEffect(() => {
    document.title = done ? '✓ Session done' : `${mm}:${ss} · Study Planner`
    return () => {
      document.title = 'AI Study Planner'
    }
  }, [mm, ss, done])

  return (
    <div className="card timer" role="timer" aria-live="polite">
      <div className="timer-head">
        <h2>Focus: {label}</h2>
        <button className="icon" aria-label="Close timer" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="timer-clock">
        {mm}:{ss}
      </div>
      <div className="progress">
        <div style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="timer-actions">
        {done ? (
          <button className="primary" onClick={onComplete}>
            Mark session complete
          </button>
        ) : (
          <>
            <button onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Resume'}</button>
            <button onClick={() => setRemaining(minutes * 60)}>Restart</button>
            <button className="primary" onClick={onComplete}>
              Finish early
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default FocusTimer
