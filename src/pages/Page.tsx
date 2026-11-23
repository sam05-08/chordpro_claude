import { supabaseConfigured } from '../lib/supabase'

export default function Page({ title, note }: { title: string; note: string }) {
  return (
    <>
      <h1>{title}</h1>
      <div className="card"><p className="muted">{note}</p></div>
      {!supabaseConfigured && (
        <div className="card"><p className="muted">
          Supabase ainda não configurado. Copie <code>.env.example</code> para <code>.env</code> e preencha.
        </p></div>
      )}
    </>
  )
}
