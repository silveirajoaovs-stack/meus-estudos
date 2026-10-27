import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

const MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'Email not confirmed': 'Confirme seu e-mail antes de entrar (veja sua caixa de entrada).',
  'User already registered': 'Já existe uma conta com este e-mail. Use "Entrar".',
}

function translate(message: string) {
  if (MESSAGES[message]) return MESSAGES[message]
  if (message.includes('at least 6')) return 'A senha precisa ter pelo menos 6 caracteres.'
  return message
}

export function Login() {
  const [mode, setMode] = useState<'entrar' | 'criar'>('entrar')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setInfo('')
    if (mode === 'entrar') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(translate(error.message))
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      })
      if (error) setError(translate(error.message))
      else if (!data.session) {
        setInfo('Conta criada! Enviamos um link de confirmação para o seu e-mail. Clique nele e depois entre aqui.')
        setMode('entrar')
      }
    }
    setBusy(false)
  }

  const isLogin = mode === 'entrar'

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={submit}>
        <div className="stack-2">
          <span className="eyebrow">Análise e Desenvolvimento de Sistemas</span>
          <h1 className="title">Meus estudos</h1>
        </div>

        <div className="segmented" role="tablist">
          <button type="button" role="tab" aria-selected={isLogin} className="segment" onClick={() => setMode('entrar')}>
            Entrar
          </button>
          <button type="button" role="tab" aria-selected={!isLogin} className="segment" onClick={() => setMode('criar')}>
            Criar conta
          </button>
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
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p role="alert" className="form-error">{error}</p>}
        {info && <p className="form-info">{info}</p>}

        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Aguarde…' : isLogin ? 'Entrar' : 'Criar conta'}
        </button>
      </form>
    </div>
  )
}
