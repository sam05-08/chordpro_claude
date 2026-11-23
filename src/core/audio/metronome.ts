// Metrônomo com agendamento pelo relógio de áudio (preciso, não depende de setInterval).
export type ClickSound = 'click' | 'wood' | 'beep'
export interface MetronomeOptions { bpm: number; beatsPerBar: number; sound: ClickSound; accent: boolean }

const SOUNDS: Record<ClickSound, { type: OscillatorType; hi: number; lo: number; dur: number }> = {
  click: { type: 'square', hi: 1800, lo: 1200, dur: 0.03 },
  wood: { type: 'sine', hi: 1100, lo: 800, dur: 0.06 },
  beep: { type: 'sine', hi: 880, lo: 660, dur: 0.09 },
}

export class Metronome {
  private ctx: AudioContext | null = null
  private timer: number | null = null
  private nextTime = 0
  private beat = 0
  private opts: MetronomeOptions
  private onBeat: (beat: number) => void

  constructor(opts: MetronomeOptions, onBeat: (beat: number) => void) {
    this.opts = opts
    this.onBeat = onBeat
  }

  update(partial: Partial<MetronomeOptions>) {
    this.opts = { ...this.opts, ...partial }
    if (this.beat >= this.opts.beatsPerBar) this.beat = 0
  }

  async start() {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctor) throw new Error('Este navegador não suporta áudio.')
    if (!this.ctx) this.ctx = new Ctor()
    await this.ctx.resume() // iOS exige gesto do usuário
    this.beat = 0
    this.nextTime = this.ctx.currentTime + 0.06
    this.timer = window.setInterval(this.tick, 25)
  }

  stop() {
    if (this.timer !== null) window.clearInterval(this.timer)
    this.timer = null
  }

  dispose() {
    this.stop()
    void this.ctx?.close()
    this.ctx = null
  }

  private tick = () => {
    const ctx = this.ctx
    if (!ctx) return
    while (this.nextTime < ctx.currentTime + 0.12) {
      this.play(this.beat, this.nextTime)
      const b = this.beat
      window.setTimeout(() => this.onBeat(b), Math.max(0, (this.nextTime - ctx.currentTime) * 1000))
      this.nextTime += 60 / this.opts.bpm
      this.beat = (this.beat + 1) % this.opts.beatsPerBar
    }
  }

  private play(beat: number, time: number) {
    const ctx = this.ctx!
    const snd = SOUNDS[this.opts.sound]
    const accent = this.opts.accent && beat === 0
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = snd.type
    osc.frequency.value = accent ? snd.hi : snd.lo
    const peak = accent ? 0.9 : 0.55
    gain.gain.setValueAtTime(peak, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + snd.dur)
    osc.connect(gain).connect(ctx.destination)
    osc.start(time)
    osc.stop(time + snd.dur + 0.02)
  }
}
