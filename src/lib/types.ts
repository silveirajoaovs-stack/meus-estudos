export type Subject = {
  id: string
  name: string
  total: number
  done: number
  color: string
  created_at: string
}

export type StudySession = {
  id: string
  subject_id: string | null
  date: string
  minutes: number
  note: string | null
}

export type Lesson = {
  id: string
  subject_id: string | null
  date: string
  title: string | null
  summary: string | null
  created_at: string
}

export type Tab = 'painel' | 'materias' | 'resumos' | 'calendario' | 'pomodoro'
