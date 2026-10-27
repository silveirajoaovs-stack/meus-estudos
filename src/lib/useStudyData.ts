import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { PALETTE } from './format'
import type { Lesson, StudySession, Subject } from './types'

export function useStudyData() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [s, ss, l] = await Promise.all([
      supabase.from('subjects').select('*').order('created_at'),
      supabase.from('study_sessions').select('*'),
      supabase.from('lessons').select('*').order('date', { ascending: false }).order('created_at', { ascending: false }),
    ])
    const err = s.error || ss.error || l.error
    if (err) {
      setError('Não foi possível carregar seus dados: ' + err.message)
    } else {
      setSubjects(s.data)
      setSessions(ss.data)
      setLessons(l.data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function addSubjects(items: { name: string; total: number }[]) {
    const rows = items.map((it, i) => ({
      name: it.name,
      total: it.total,
      color: PALETTE[(subjects.length + i) % PALETTE.length],
    }))
    const { data, error } = await supabase.from('subjects').insert(rows).select()
    if (error) {
      setError('Não foi possível adicionar a matéria: ' + error.message)
      return false
    }
    setSubjects((prev) => [...prev, ...data])
    return true
  }

  async function updateSubject(id: string, patch: Partial<Pick<Subject, 'name' | 'total' | 'done'>>) {
    // Atualiza a tela na hora e desfaz recarregando se o servidor recusar.
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
    const { error } = await supabase.from('subjects').update(patch).eq('id', id)
    if (error) {
      setError('Não foi possível salvar a alteração: ' + error.message)
      load()
    }
  }

  async function removeSubject(id: string) {
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) {
      setError('Não foi possível remover a matéria: ' + error.message)
      return
    }
    // No banco, registros e resumos ficam com subject_id = null (on delete set null).
    setSubjects((prev) => prev.filter((s) => s.id !== id))
    setSessions((prev) => prev.map((s) => (s.subject_id === id ? { ...s, subject_id: null } : s)))
    setLessons((prev) => prev.map((l) => (l.subject_id === id ? { ...l, subject_id: null } : l)))
  }

  return {
    subjects,
    sessions,
    lessons,
    loading,
    error,
    clearError: () => setError(null),
    addSubjects,
    updateSubject,
    removeSubject,
  }
}

export type StudyData = ReturnType<typeof useStudyData>
