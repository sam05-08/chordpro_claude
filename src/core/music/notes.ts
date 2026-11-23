// Conversão frequência <-> nota. Lógica pura.
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export interface NoteReading {
  freq: number
  note: string      // ex.: "A"
  octave: number    // ex.: 4
  midiFloat: number // nota "decimal" (ex.: 69.2)
  cents: number     // desvio da nota cromática mais próxima (-50..+50)
}

export const midiToFreq = (midi: number, a4 = 440) => a4 * Math.pow(2, (midi - 69) / 12)
export const midiToName = (midi: number) => `${NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`

export function freqToReading(freq: number, a4 = 440): NoteReading {
  const midiFloat = 69 + 12 * Math.log2(freq / a4)
  const nearest = Math.round(midiFloat)
  return {
    freq,
    note: NAMES[((nearest % 12) + 12) % 12],
    octave: Math.floor(nearest / 12) - 1,
    midiFloat,
    cents: (midiFloat - nearest) * 100,
  }
}
