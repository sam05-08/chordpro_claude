export interface InstrumentString { label: string; midi: number }
export interface Instrument { id: string; name: string; strings: InstrumentString[] }

const s = (label: string, midi: number): InstrumentString => ({ label, midi })

export const INSTRUMENTS: Instrument[] = [
  { id: 'guitar', name: 'Violão / Guitarra', strings: [s('E2', 40), s('A2', 45), s('D3', 50), s('G3', 55), s('B3', 59), s('E4', 64)] },
  { id: 'bass', name: 'Baixo (4 cordas)', strings: [s('E1', 28), s('A1', 33), s('D2', 38), s('G2', 43)] },
  { id: 'ukulele', name: 'Ukulele', strings: [s('G4', 67), s('C4', 60), s('E4', 64), s('A4', 69)] },
  { id: 'cavaquinho', name: 'Cavaquinho', strings: [s('D4', 62), s('G4', 67), s('B4', 71), s('D5', 74)] },
  { id: 'violin', name: 'Violino / Bandolim', strings: [s('G3', 55), s('D4', 62), s('A4', 69), s('E5', 76)] },
]
