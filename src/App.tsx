import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <span aria-hidden="true">📚</span> AI Powered Study Planner
        </h1>
        <p className="muted">
          Add your subjects and exam dates — your plan balances time by difficulty, confidence
          and urgency.
        </p>
      </header>
      <Dashboard />
    </div>
  )
}

export default App
