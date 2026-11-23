import { detectPitch } from './pitch'
import { freqToReading } from '../music/notes'

const make = (f: number, sr = 48000, n = 4096, harmonics = false) => {
  const b = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    let v = Math.sin((2 * Math.PI * f * i) / sr)
    if (harmonics) v = 0.6 * v + 0.3 * Math.sin((4 * Math.PI * f * i) / sr) + 0.2 * Math.sin((6 * Math.PI * f * i) / sr)
    b[i] = v * 0.5
  }
  return b
}
for (const [f, h, sr] of [[82.41, false, 48000], [82.41, true, 48000], [110, true, 44100], [329.63, true, 48000], [440, false, 48000], [41.2, true, 48000], [880, false, 44100]] as const) {
  const got = detectPitch(make(f, sr, 4096, h), sr)
  if (got === null || Math.abs(got - f) > f * 0.003) throw new Error(`FALHOU ${f}Hz (${h}): ${got}`)
  console.log('ok', f, '->', got.toFixed(2))
}
if (detectPitch(new Float32Array(4096), 48000) !== null) throw new Error('silêncio deveria ser null')
const r = freqToReading(442)
if (r.note !== 'A' || r.cents < 7 || r.cents > 9) throw new Error('cents errado ' + r.cents)
console.log('ok silêncio e cents', r.cents.toFixed(1))
