import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

const MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'Email not confirmed': 'Este e-mail ainda não foi confirmado no Supabase.',
}

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(MESSAGES[error.message] ?? error.message)
    setBusy(false)
  }

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={submit}>
        <div className="stack-2">
          <span className="eyebrow">Análise e Desenvolvimento de Sistemas</span>
          <h1 className="title">Meus estudos</h1>
        </div>

        <label className="field">
          E-mail
          <input className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          Senha
          <input
            className="input"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p role="alert" className="form-error">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Aguarde…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
