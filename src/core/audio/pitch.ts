// Detecção de altura (algoritmo YIN). Lógica pura: recebe amostras e devolve Hz.
export function detectPitch(buf: Float32Array, sampleRate: number): number | null {
  const size = buf.length
  let sum = 0
  for (let i = 0; i < size; i++) sum += buf[i] * buf[i]
  if (Math.sqrt(sum / size) < 0.008) return null // silêncio

  const half = size >> 1
  const minTau = Math.floor(sampleRate / 1600)
  const maxTau = Math.min(half - 1, Math.floor(sampleRate / 25))
  const d = new Float32Array(maxTau + 1)
  for (let tau = 1; tau <= maxTau; tau++) {
    let acc = 0
    for (let i = 0; i < half; i++) {
      const diff = buf[i] - buf[i + tau]
      acc += diff * diff
    }
    d[tau] = acc
  }
  // Diferença média cumulativa normalizada
  let running = 0
  d[0] = 1
  for (let tau = 1; tau <= maxTau; tau++) {
    running += d[tau]
    d[tau] = running === 0 ? 1 : (d[tau] * tau) / running
  }
  const threshold = 0.12
  let tau = -1
  for (let t = Math.max(2, minTau); t < maxTau; t++) {
    if (d[t] < threshold) {
      while (t + 1 < maxTau && d[t + 1] < d[t]) t++
      tau = t
      break
    }
  }
  if (tau === -1) return null
  // Interpolação parabólica para precisão fina
  const a = d[tau - 1], b = d[tau], c = d[tau + 1]
  const denom = 2 * (2 * b - c - a)
  const better = denom !== 0 ? tau + (c - a) / denom : tau
  return sampleRate / better
}
