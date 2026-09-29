# AI Powered Study Planner

A React + TypeScript app that turns your subjects and exam dates into a day-by-day study schedule.

## Features

- **Smart scheduling**: each subject gets a priority from its difficulty, your confidence, and how close the exam is. Study slots go out with diminishing returns, so urgent subjects get more time and the others still get some.
- **Study phases**: sessions move from *Learn*, to *Practice* in the final week, to *Review* in the last two days.
- **Adapts as you go**: change your confidence in a subject and the plan updates.
- **Preferences**: set daily study hours, session length and rest days.
- **Focus timer**: start a Pomodoro-style timer from any of today's sessions; the countdown also shows in the tab title.
- **Progress tracking**: tick off sessions, keep a daily streak, and see a countdown to your next exam.
- **Saved in your browser**: everything is kept in `localStorage`, so you don't need an account.
- Light and dark mode, with a responsive layout.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run lint
```

## Project structure

```
src/
  lib/planner.ts        scheduling algorithm
  lib/dates.ts          local-date helpers
  lib/types.ts          shared types
  hooks/useLocalStorage.ts
  components/           SubjectForm, SubjectList, SettingsPanel, PlanView, FocusTimer
  pages/Dashboard.tsx   wires state and components together
```
