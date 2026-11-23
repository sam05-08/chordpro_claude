// Lógica musical PURA (sem React). Fácil de portar para Swift no futuro.

const SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
const NOTE_INDEX: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6,
  G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
}

// Raiz (A-G + #/b), qualidade (m, 7, maj7, sus4...) e baixo opcional (/E)
const CHORD_RE = /^([A-G][#b]?)([^/\s]*)(?:\/([A-G][#b]?))?$/

export interface Chord { root: string; quality: string; bass?: string }

export function parseChord(text: string): Chord | null {
  const m = CHORD_RE.exec(text.trim())
  if (!m) return null
  const [, root, quality, bass] = m
  // Evita falsos positivos em palavras (ex.: "Dado", "Amor")
  if (!/^(m|M|maj|min|dim|aug|sus|add|\d|\+|-|°|ø|\(|\))*$/.test(quality)) return null
  return { root, quality, bass }
}

export function isChord(text: string): boolean {
  return parseChord(text) !== null
}

function shiftNote(note: string, semitones: number, useFlats: boolean): string {
  const i = NOTE_INDEX[note]
  const next = (((i + semitones) % 12) + 12) % 12
  return (useFlats ? FLAT : SHARP)[next]
}

export function transposeChord(chord: string, semitones: number, useFlats = false): string {
  const c = parseChord(chord)
  if (!c) return chord
  const bass = c.bass ? '/' + shiftNote(c.bass, semitones, useFlats) : ''
  return shiftNote(c.root, semitones, useFlats) + c.quality + bass
}

export function semitonesBetween(fromKey: string, toKey: string): number {
  const a = parseChord(fromKey), b = parseChord(toKey)
  if (!a || !b) return 0
  return (((NOTE_INDEX[b.root] - NOTE_INDEX[a.root]) % 12) + 12) % 12
}
