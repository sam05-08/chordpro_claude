import { useEffect, useRef, useState } from 'react'
import { Metronome } from '../core/audio/metronome'
import type { ClickSound } from '../core/audio/metronome'
import { usePrefs } from '../lib/prefs'

const SIGNATURES = [
  { label: '2/4', beats: 2 }, { label: '3/4', beats: 3 }, { label: '4/4', beats: 4 },
  { label: '5/4', beats: 5 }, { label: '6/8', beats: 6 },
]
const SOUND_NAMES: Record<ClickSound, string> = { click: 'Clique', wood: 'Madeira', beep: 'Bipe' }
const clampBpm = (n: number) => Math.max(30, Math.min(300, Math.round(n)))

export default function MetronomePanel() {
  const [prefs, setPrefs] = usePrefs()
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState(-1)
  const [error, setError] = useState('')
  const taps = useRef<number[]>([])
  const metro = useRef<Metronome | null>(null)

  if (!metro.current) {
    metro.current = new Metronome(
      { bpm: prefs.bpm, beatsPerBar: prefs.beatsPerBar, sound: prefs.sound, accent: prefs.accent },
      (b) => setBeat(b))
  }
  useEffect(() => {
    metro.current?.update({ bpm: prefs.bpm, beatsPerBar: prefs.beatsPerBar, sound: prefs.sound, accent: prefs.accent })
  }, [prefs])
  useEffect(() => () => metro.current?.dispose(), [])

  const toggle = async () => {
    if (running) { metro.current?.stop(); setRunning(false); setBeat(-1); return }
    try { await metro.current?.start(); setRunning(true); setError('') }
    catch { setError('Não foi possível iniciar o áudio neste navegador.') }
  }
  const tap = () => {
    const now = performance.now()
    taps.current = [...taps.current.filter((t) => now - t < 2500), now].slice(-5)
    if (taps.current.length >= 2) {
      const gaps = taps.current.slice(1).map((t, i) => t - taps.current[i])
      setPrefs({ bpm: clampBpm(60000 / (gaps.reduce((a, b) => a + b, 0) / gaps.length)) })
    }
  }

  return (
    <>
      <div className="card tuner">
        <div className="note-big">{prefs.bpm}</div>
        <p className="muted small">BPM</p>
        <div className="beats">
          {Array.from({ length: prefs.beatsPerBar }, (_, i) => (
            <span key={i} className={'dot' + (i === 0 ? ' first' : '') + (i === beat ? ' on' : '')} />
          ))}
        </div>
        <input type="range" min={30} max={300} value={prefs.bpm} aria-label="BPM"
          onChange={(e) => setPrefs({ bpm: Number(e.target.value) })} className="slider" />
        <div className="stepper">
          <button className="btn" onClick={() => setPrefs({ bpm: clampBpm(prefs.bpm - 1) })}>−</button>
          <button className="btn" onClick={tap}>Tap</button>
          <button className="btn" onClick={() => setPrefs({ bpm: clampBpm(prefs.bpm + 1) })}>+</button>
        </div>
        <button className="btn primary" onClick={toggle}>{running ? 'Pausar' : 'Iniciar'}</button>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="card">
        <label className="muted small">Compasso</label>
        <div className="seg">
          {SIGNATURES.map((s) => (
            <button key={s.label} className={s.beats === prefs.beatsPerBar ? 'on' : ''}
              onClick={() => setPrefs({ beatsPerBar: s.beats })}>{s.label}</button>
          ))}
        </div>
        <label className="muted small">Som</label>
        <div className="seg">
          {(Object.keys(SOUND_NAMES) as ClickSound[]).map((k) => (
            <button key={k} className={k === prefs.sound ? 'on' : ''} onClick={() => setPrefs({ sound: k })}>{SOUND_NAMES[k]}</button>
          ))}
        </div>
        <label className="row" style={{ marginTop: 12 }}>
          <span>Acento no primeiro tempo</span>
          <input type="checkbox" checked={prefs.accent} onChange={(e) => setPrefs({ accent: e.target.checked })} />
        </label>
      </div>
    </>
  )
}
