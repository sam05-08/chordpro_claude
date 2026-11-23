import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthCard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const run = async (mode: 'in' | 'up') => {
    if (!supabase) return
    setBusy(true); setMsg('')
    const { data, error } = mode === 'in'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    setBusy(false)
    if (error) setMsg(`Não foi possível continuar: ${error.message}`)
    else if (mode === 'up' && !data.session) setMsg('Conta criada! Confirme o link enviado ao seu e-mail e depois toque em Entrar.')
  }

  return (
    <div className="card">
      <p style={{ marginBottom: 12 }}>Entre para guardar suas gravações com segurança.</p>
      <input className="select" type="email" placeholder="E-mail" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="select" type="password" placeholder="Senha (mín. 6 caracteres)" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="stepper">
        <button className="btn primary" style={{ marginTop: 0 }} disabled={busy || !email || password.length < 6} onClick={() => run('in')}>Entrar</button>
        <button className="btn" disabled={busy || !email || password.length < 6} onClick={() => run('up')}>Criar conta</button>
      </div>
      {msg && <p className="error">{msg}</p>}
    </div>
  )
}
