import type { Theme } from "./model"
export class GameAudio {
    context: AudioContext | null = null
    beat = 0
    next = 0
    unlock() {
        try {
            this.context ||= new AudioContext()
            void this.context.resume()
        } catch {
            /* Audio is optional. */
        }
    }
    tone(
        frequency: number,
        duration: number,
        volume: number,
        type: OscillatorType = "sine"
    ) {
        const c = this.context
        if (!c || c.state !== "running" || !volume) return
        const oscillator = c.createOscillator(),
            gain = c.createGain()
        oscillator.type = type
        oscillator.frequency.setValueAtTime(frequency, c.currentTime)
        gain.gain.setValueAtTime(volume * 0.09, c.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration)
        oscillator.connect(gain)
        gain.connect(c.destination)
        oscillator.start()
        oscillator.stop(c.currentTime + duration)
    }
    effect(name: string, volume: number) {
        if (name === "explode") {
            this.tone(65, 0.45, volume, "triangle")
            this.tone(115, 0.22, volume * 0.65, "sawtooth")
            return
        }
        this.tone(
            name === "damage" ? 95 : name === "warning" ? 740 : 520,
            0.18,
            volume,
            name === "damage" ? "sawtooth" : "sine"
        )
        if (name === "warning") this.tone(980, 0.5, volume)
    }
    music(dt: number, theme: Theme, volume: number) {
        this.next -= dt
        if (this.next > 0) return
        this.next = theme === "Neon" ? 0.3 : 0.48
        const sequence = [0, 4, 7, 11, 7, 4, 2, 7, 0, 4, 9, 7, 4, 2, -3, 2]
        const base = { Sea: 196, Garden: 220, Forest: 164.81, Neon: 246.94 }[
            theme
        ]
        this.tone(
            base * 2 ** (sequence[this.beat++ % sequence.length] / 12),
            0.4,
            volume,
            "triangle"
        )
    }
    dispose() {
        void this.context?.close()
    }
}
