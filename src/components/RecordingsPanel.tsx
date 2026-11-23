import { useCallback, useEffect, useState } from 'react'
import { useRecorder } from '../core/audio/useRecorder'
import type { RecordedAudio } from '../core/audio/useRecorder'
import { useAuth } from '../lib/auth'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { deleteRecording, getPlaybackUrl, listRecordings, renameRecording, saveRecording } from '../lib/recordings'
import type { Recording } from '../lib/recordings'
import AuthCard from './AuthCard'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
const defaultName = () =>
  'Gravação ' + new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
const MIC_MSG = {
  denied: 'Permissão do microfone negada. Libere o microfone nas configurações do navegador.',
  unsupported: 'Este navegador não suporta gravação (é preciso HTTPS).',
  error: 'Não foi possível iniciar o microfone.',
} as const

export default function RecordingsPanel() {
  const { session, loading } = useAuth()
  const userId = session?.user.id
  const [items, setItems] = useState<Recording[]>([])
  const [error, setError] = useState('')
  const [pending, setPending] = useState<RecordedAudio | null>(null) // gravação ainda não salva
  const [saving, setSaving] = useState(false)
  const [playing, setPlaying] = useState<{ id: string; url: string } | null>(null)
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null)

  const refresh = useCallback(async () => {
    try { setItems(await listRecordings()) } catch { setError('Não foi possível carregar suas gravações.') }
  }, [])
  useEffect(() => { if (userId) void refresh() }, [userId, refresh])

  const save = useCallback(async (audio: RecordedAudio) => {
    if (!userId) return
    setSaving(true); setError('')
    try {
      const rec = await saveRecording(userId, audio.blob, defaultName(), audio.durationSeconds)
      setItems((cur) => [rec, ...cur])
      setPending(null)
    } catch {
      setPending(audio)
      setError('Não foi possível salvar. Sua gravação continua aqui: tente de novo ou baixe o arquivo.')
    }
    setSaving(false)
  }, [userId])

  const recorder = useRecorder((audio) => { setPending(audio); void save(audio) })

  const act = async (fn: () => Promise<void>, failMsg: string) => {
    setError('')
    try { await fn() } catch { setError(failMsg) }
  }

  if (!supabaseConfigured) return <div className="card"><p className="muted">Configure o Supabase (arquivo <code>.env</code>) para usar as gravações.</p></div>
  if (loading) return <p className="muted">Carregando…</p>
  if (!session) return <AuthCard />

  const recording = recorder.status === 'recording'
  return (
    <>
      <div className="card tuner">
        <div className={'note-big' + (recording ? ' rec' : '')}>{fmt(recorder.elapsed)}</div>
        <button className="btn primary" disabled={recorder.status === 'requesting' || saving} onClick={recording ? recorder.stop : recorder.start}>
          {recording ? '■ Parar e salvar' : saving ? 'Salvando…' : '● Gravar'}
        </button>
        {(recorder.status === 'denied' || recorder.status === 'unsupported' || recorder.status === 'error') &&
          <p className="error">{MIC_MSG[recorder.status]}</p>}
        {error && <p className="error">{error}</p>}
        {pending && !saving && (
          <div className="stepper">
            <button className="btn" onClick={() => void save(pending)}>Tentar salvar de novo</button>
            <a className="btn" href={URL.createObjectURL(pending.blob)} download={`gravacao.${pending.blob.type.includes('mp4') ? 'm4a' : 'webm'}`}>Baixar</a>
          </div>
        )}
      </div>

      <h2 className="h2">Histórico</h2>
      {items.length === 0 && <p className="muted">Nenhuma gravação ainda.</p>}
      {items.map((r) => (
        <div className="card" key={r.id}>
          {editing?.id === r.id ? (
            <div className="row">
              <input className="select" style={{ marginTop: 0 }} value={editing.name} onChange={(e) => setEditing({ id: r.id, name: e.target.value })} />
              <button className="btn" disabled={!editing.name.trim()} onClick={() => void act(async () => {
                const upd = await renameRecording(r.id, editing.name.trim())
                setItems((cur) => cur.map((x) => (x.id === r.id ? upd : x)))
                setEditing(null)
              }, 'Não foi possível renomear.')}>OK</button>
            </div>
          ) : (
            <strong>{r.name}</strong>
          )}
          <p className="muted small">{new Date(r.created_at).toLocaleDateString('pt-BR')} · {fmt(r.duration_seconds)}</p>
          {playing?.id === r.id && <audio controls autoPlay src={playing.url} style={{ width: '100%', marginTop: 8 }} />}
          <div className="stepper" style={{ justifyContent: 'flex-start' }}>
            <button className="btn" onClick={() => void act(async () => setPlaying({ id: r.id, url: await getPlaybackUrl(r) }), 'Não foi possível abrir o áudio.')}>Ouvir</button>
            <button className="btn" onClick={() => setEditing({ id: r.id, name: r.name })}>Renomear</button>
            <button className="btn" onClick={() => {
              if (!window.confirm(`Apagar "${r.name}"? Isso não pode ser desfeito.`)) return
              void act(async () => {
                await deleteRecording(r)
                setItems((cur) => cur.filter((x) => x.id !== r.id))
                if (playing?.id === r.id) setPlaying(null)
              }, 'Não foi possível apagar a gravação.')
            }}>Apagar</button>
          </div>
        </div>
      ))}
      <button className="btn" onClick={() => void supabase?.auth.signOut()}>Sair da conta</button>
    </>
  )
}
