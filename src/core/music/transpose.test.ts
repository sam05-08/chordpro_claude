import { transposeChord, isChord, semitonesBetween } from './transpose'

const eq = (a: unknown, b: unknown, label: string) => {
  if (a !== b) throw new Error(`FALHOU ${label}: obtido ${a}, esperado ${b}`)
  console.log('ok', label)
}
eq(transposeChord('C', 2), 'D', 'C +2')
eq(transposeChord('Am7', 3), 'Cm7', 'Am7 +3')
eq(transposeChord('G/B', 2), 'A/C#', 'G/B +2')
eq(transposeChord('F#m', -2), 'Em', 'F#m -2')
eq(transposeChord('Bb', 1, false), 'B', 'Bb +1')
eq(transposeChord('C', 1, true), 'Db', 'C +1 bemol')
eq(transposeChord('C', 12), 'C', 'oitava')
eq(isChord('Amor'), false, 'Amor não é acorde')
eq(isChord('Cmaj7'), true, 'Cmaj7 é acorde')
eq(semitonesBetween('C', 'G'), 7, 'C->G')
