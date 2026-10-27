import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { useStudyData } from './lib/useStudyData'
import { useTheme, type ThemeChoice } from './lib/useTheme'
import type { Tab } from './lib/types'
import { Login } from './components/Login'
import { ThemeButton } from './components/ThemeButton'
import { Painel } from './pages/Painel'
import { Materias } from './pages/Materias'

const TABS: [Tab, string][] = [
  ['painel', 'Painel'],
  ['materias', 'Matérias'],
  ['resumos', 'Resumos'],
  ['calendario', 'Calendário'],
  ['pomodoro', 'Pomodoro'],
]

export default function App() {
  // undefined = ainda verificando se já existe login salvo
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const theme = useTheme()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (session === undefined) return <div className="center-screen muted">Carregando…</div>
  if (!session) return <Login />
  return <Shell email={session.user.email ?? ''} theme={theme.choice} onCycleTheme={theme.cycle} />
}

type ShellProps = { email: string; theme: ThemeChoice; onCycleTheme: () => void }

function Shell({ email, theme, onCycleTheme }: ShellProps) {
  const [tab, setTab] = useState<Tab>('painel')
  const data = useStudyData()

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="stack-1">
            <span className="eyebrow">Análise e Desenvolvimento de Sistemas</span>
            <h1 className="title">Meus estudos</h1>
          </div>
          <div className="header-actions">
            <nav aria-label="Seções" className="segmented">
              {TABS.map(([id, label]) => (
                <button key={id} type="button" className="segment" aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)}>
                  {label}
                </button>
              ))}
            </nav>
            <ThemeButton choice={theme} onClick={onCycleTheme} />
          </div>
          <div className="account">
            <span className="muted small" title={email}>
              {email}
            </span>
            <button type="button" className="link-btn" onClick={() => supabase.auth.signOut()}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        {data.error && (
          <div role="alert" className="error-banner">
            <span>{data.error}</span>
            <button type="button" className="link-btn" onClick={data.clearError}>
              Fechar
            </button>
          </div>
        )}
        {data.loading ? (
          <p className="muted">Carregando seus dados…</p>
        ) : tab === 'painel' ? (
          <Painel data={data} goTo={setTab} />
        ) : tab === 'materias' ? (
          <Materias data={data} />
        ) : (
          <div className="empty">
            <p>Esta tela é a próxima etapa. Por enquanto, use o Painel e as Matérias.</p>
          </div>
        )}
      </main>
    </div>
  )
}
