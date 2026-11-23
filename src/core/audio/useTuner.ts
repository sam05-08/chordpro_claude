import { useCallback, useEffect, useRef, useState } from 'react'
import { detectPitch } from './pitch'
import { freqToReading } from '../music/notes'
import type { NoteReading } from '../music/notes'

export type TunerStatus = 'idle' | 'starting' | 'listening' | 'denied' | 'unsupported' | 'error'

export function useTuner(a4: number) {
  const [status, setStatus] = useState<TunerStatus>('idle')
  const [reading, setReading] = useState<NoteReading | null>(null)
  const a4Ref = useRef(a4)
  a4Ref.current = a4
  const cleanup = useRef<(() => void) | null>(null)

  const stop = useCallback(() => {
    cleanup.current?.()
    cleanup.current = null
    setReading(null)
    setStatus('idle')
  }, [])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setStatus('unsupported'); return }
    setStatus('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctor()
      await ctx.resume()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 4096
      ctx.createMediaStreamSource(stream).connect(analyser)
      const buf = new Float32Array(analyser.fftSize)
      const recent: number[] = []
      let misses = 0, raf = 0, last = 0

      const loop = (t: number) => {
        raf = requestAnimationFrame(loop)
        if (t - last < 50) return // ~20 leituras por segundo
        last = t
        analyser.getFloatTimeDomainData(buf)
        const f = detectPitch(buf, ctx.sampleRate)
        if (f === null) {
          if (++misses > 10) { recent.length = 0; setReading(null) }
          return
        }
        misses = 0
        recent.push(f)
        if (recent.length > 5) recent.shift()
        const median = [...recent].sort((a, b) => a - b)[recent.length >> 1] // suaviza oscilações
        setReading(freqToReading(median, a4Ref.current))
      }
      raf = requestAnimationFrame(loop)
      cleanup.current = () => {
        cancelAnimationFrame(raf)
        stream.getTracks().forEach((tr) => tr.stop())
        void ctx.close()
      }
      setStatus('listening')
    } catch (e) {
      setStatus(e instanceof DOMException && (e.name === 'NotAllowedError' || e.name === 'SecurityError') ? 'denied' : 'error')
    }
  }, [])

  useEffect(() => () => cleanup.current?.(), [])
  return { status, reading, start, stop }
}
