import { useTuner } from '../core/audio/useTuner'
import { INSTRUMENTS } from '../core/music/tunings'
import { midiToFreq, midiToName } from '../core/music/notes'
import { usePrefs } from '../lib/prefs'

const MESSAGES = {
  denied: 'Permissão do microfone negada. Libere o microfone nas configurações do navegador e tente de novo.',
  unsupported: 'Este navegador não permite usar o microfone (é preciso HTTPS).',
  error: 'Não foi possível iniciar o microfone. Verifique se ele está disponível.',
} as const

export default function TunerPanel() {
  const [prefs, setPrefs] = usePrefs()
  const { status, reading, start, stop } = useTuner(prefs.a4)
  const instrument = INSTRUMENTS.find((i) => i.id === prefs.instrument)

  // Alvo: no modo instrumento, a corda mais próxima; no cromático, a nota mais próxima.
  let targetLabel = reading ? `${reading.note}${reading.octave}` : '–'
  let cents = reading?.cents ?? 0
  if (reading && instrument) {
    const target = instrument.strings.reduce((best, st) =>
      Math.abs(st.midi - reading.midiFloat) < Math.abs(best.midi - reading.midiFloat) ? st : best)
    targetLabel = target.label
    cents = (reading.midiFloat - target.midi) * 100
  }
  const clamped = Math.max(-50, Math.min(50, cents))
  const inTune = reading !== null && Math.abs(cents) <= 5
  const hint = !reading ? 'Toque uma nota' : inTune ? 'Afinado' : cents < 0 ? 'Grave: aperte a corda' : 'Agudo: afrouxe a corda'
  const listening = status === 'listening'

  return (
    <>
      <div className="card">
        <label className="muted small">Modo</label>
        <select className="select" value={prefs.instrument} onChange={(e) => setPrefs({ instrument: e.target.value })}>
          <option value="chromatic">Cromático (todos os instrumentos)</option>
          {INSTRUMENTS.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>

      <div className="card tuner">
        <div className={'note-big' + (inTune ? ' ok' : '')}>{targetLabel}</div>
        <div className="gauge" role="img" aria-label={`Desvio de ${Math.round(cents)} cents`}>
          <div className="gauge-center" />
          {reading && <div className={'needle' + (inTune ? ' ok' : '')} style={{ left: `${50 + clamped}%` }} />}
        </div>
        <div className="gauge-scale"><span>♭ −50</span><span>0</span><span>+50 ♯</span></div>
        <p className={'hint' + (inTune ? ' ok' : '')}>{hint}</p>
        <p className="muted small">
          {reading ? `${reading.freq.toFixed(1)} Hz · ${cents > 0 ? '+' : ''}${cents.toFixed(0)} cents` : '– Hz'}
        </p>
        <button className="btn primary" onClick={listening ? stop : start} disabled={status === 'starting'}>
          {listening ? 'Parar' : status === 'starting' ? 'Iniciando…' : 'Iniciar afinador'}
        </button>
        {(status === 'denied' || status === 'unsupported' || status === 'error') &&
          <p className="error">{MESSAGES[status]}</p>}
      </div>

      {instrument && (
        <div className="card">
          <p className="muted small" style={{ marginBottom: 8 }}>Cordas (grave → agudo conforme a afinação)</p>
          <div className="strings">
            {instrument.strings.map((st) => (
              <div key={st.label + st.midi} className={'string' + (reading && targetLabel === st.label ? ' on' : '')}>
                <strong>{midiToName(st.midi).replace(/-?\d+$/, '')}</strong>
                <span className="muted small">{midiToFreq(st.midi, prefs.a4).toFixed(1)} Hz</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card row">
        <span>Referência A4</span>
        <div className="stepper">
          <button className="btn" onClick={() => setPrefs({ a4: Math.max(415, prefs.a4 - 1) })}>−</button>
          <strong>{prefs.a4} Hz</strong>
          <button className="btn" onClick={() => setPrefs({ a4: Math.min(466, prefs.a4 + 1) })}>+</button>
        </div>
      </div>
    </>
  )
}
