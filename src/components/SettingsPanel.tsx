import type { Settings } from '../lib/types'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface Props {
  settings: Settings
  onChange: (settings: Settings) => void
}

function SettingsPanel({ settings, onChange }: Props) {
  function toggleRestDay(day: number) {
    const restDays = settings.restDays.includes(day)
      ? settings.restDays.filter((d) => d !== day)
      : [...settings.restDays, day]
    onChange({ ...settings, restDays })
  }

  return (
    <div className="card form">
      <h2>Preferences</h2>
      <label>
        Study hours per day <span className="muted">{settings.hoursPerDay}h</span>
        <input
          type="range"
          min={0.5}
          max={10}
          step={0.5}
          value={settings.hoursPerDay}
          onChange={(e) => onChange({ ...settings, hoursPerDay: Number(e.target.value) })}
        />
      </label>
      <label>
        Session length
        <select
          value={settings.sessionMinutes}
          onChange={(e) => onChange({ ...settings, sessionMinutes: Number(e.target.value) })}
        >
          {[25, 30, 45, 50, 60, 90].map((m) => (
            <option key={m} value={m}>
              {m} min
            </option>
          ))}
        </select>
      </label>
      <fieldset>
        <legend>Rest days</legend>
        <div className="chips">
          {DAY_LABELS.map((label, i) => (
            <button
              type="button"
              key={label}
              className={settings.restDays.includes(i) ? 'chip active' : 'chip'}
              aria-pressed={settings.restDays.includes(i)}
              onClick={() => toggleRestDay(i)}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

export default SettingsPanel
