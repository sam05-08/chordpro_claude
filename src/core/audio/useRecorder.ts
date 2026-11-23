import { useCallback, useEffect, useRef, useState } from 'react'

export type RecStatus = 'idle' | 'requesting' | 'recording' | 'denied' | 'unsupported' | 'error'
export interface RecordedAudio { blob: Blob; durationSeconds: number }

// Safari/iPhone grava em mp4; Chrome/Android em webm. Escolhe o que o aparelho suporta.
const MIMES = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']

export function useRecorder(onFinish: (a: RecordedAudio) => void) {
  const [status, setStatus] = useState<RecStatus>('idle')
  const [elapsed, setElapsed] = useState(0)
  const finishRef = useRef(onFinish)
  finishRef.current = onFinish
  const recRef = useRef<MediaRecorder | null>(null)

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { setStatus('unsupported'); return }
    setStatus('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      const mimeType = MIMES.find((m) => MediaRecorder.isTypeSupported(m))
      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      const chunks: Blob[] = []
      const t0 = Date.now()
      const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 250)
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }
      rec.onstop = () => {
        window.clearInterval(timer)
        stream.getTracks().forEach((t) => t.stop())
        recRef.current = null
        setStatus('idle')
        setElapsed(0)
        if (chunks.length) {
          finishRef.current({
            blob: new Blob(chunks, { type: rec.mimeType || mimeType || 'audio/webm' }),
            durationSeconds: Math.max(1, Math.round((Date.now() - t0) / 1000)),
          })
        }
      }
      rec.start(1000)
      recRef.current = rec
      setElapsed(0)
      setStatus('recording')
    } catch (e) {
      setStatus(e instanceof DOMException && (e.name === 'NotAllowedError' || e.name === 'SecurityError') ? 'denied' : 'error')
    }
  }, [])

  const stop = useCallback(() => { if (recRef.current?.state === 'recording') recRef.current.stop() }, [])

  // Se o usuário sair da tela gravando, finaliza e salva em vez de perder o áudio.
  useEffect(() => () => { if (recRef.current?.state === 'recording') recRef.current.stop() }, [])

  return { status, elapsed, start, stop }
}
