import { useEffect, useState } from 'react'

export type ThemeChoice = 'auto' | 'claro' | 'escuro'

// Mesma chave lida pelo script em index.html, que aplica o tema antes do React carregar.
const KEY = 'ads-estudos-v1-tema'
const NEXT: Record<ThemeChoice, ThemeChoice> = { auto: 'claro', claro: 'escuro', escuro: 'auto' }
export const THEME_LABELS: Record<ThemeChoice, string> = { auto: 'Automático', claro: 'Claro', escuro: 'Escuro' }

function loadChoice(): ThemeChoice {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'claro' || v === 'escuro' ? v : 'auto'
  } catch {
    return 'auto'
  }
}

export function useTheme() {
  const [choice, setChoice] = useState<ThemeChoice>(loadChoice)
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemDark(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const resolved = choice === 'auto' ? (systemDark ? 'escuro' : 'claro') : choice

  useEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  function cycle() {
    const next = NEXT[choice]
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // Sem armazenamento (ex.: aba anônima): o tema vale só até recarregar.
    }
    setChoice(next)
  }

  return { choice, cycle }
}
