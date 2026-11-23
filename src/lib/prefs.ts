import { useCallback, useState } from 'react'
import type { ClickSound } from '../core/audio/metronome'

// Preferências guardadas no aparelho. Quando o Supabase estiver ligado,
// elas também serão sincronizadas na nuvem.
export interface Prefs {
  bpm: number; beatsPerBar: number; sound: ClickSound; accent: boolean
  a4: number; instrument: string // 'chromatic' ou id do instrumento
}
const KEY = 'chordpro:prefs:v1'
const DEFAULTS: Prefs = { bpm: 100, beatsPerBar: 4, sound: 'click', accent: true, a4: 440, instrument: 'chromatic' }

function load(): Prefs {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') } } catch { return DEFAULTS }
}

export function usePrefs() {
  const [prefs, setPrefs] = useState<Prefs>(load)
  const update = useCallback((p: Partial<Prefs>) => {
    setPrefs((cur) => {
      const next = { ...cur, ...p }
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* armazenamento indisponível */ }
      return next
    })
  }, [])
  return [prefs, update] as const
}
