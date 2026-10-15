type CameraInput = {
    x: number
    z: number
    heading: number
    orbit: number
    zoom: number
    tilt: number
    riding: boolean
    reduced: boolean
}
type FollowState = {
    x: number
    z: number
    heading: number
    orbit: number
    back: number
    height: number
    ahead: number
}
const ease = (from: number, to: number, rate: number, dt: number) =>
    from + (to - from) * -Math.expm1(-rate * dt)
const angleDelta = (from: number, to: number) =>
    Math.atan2(Math.sin(to - from), Math.cos(to - from))

// Camera-only smoothing: gameplay turns and collision positions stay immediate.
export class CameraFollow {
    private state: FollowState | null = null

    reset() {
        this.state = null
    }

    update(input: CameraInput, elapsed: number) {
        const dt = Math.max(0, Math.min(1 / 15, elapsed))
        const desired = {
            x: input.x,
            z: input.z,
            heading: input.heading,
            orbit: input.orbit,
            back: (input.riding ? 2.5 : 10) * input.zoom,
            height: Math.max(
                1.7,
                (input.riding ? 2.8 : 9) * input.zoom + input.tilt
            ),
            ahead: input.riding ? 6 : 2,
        }
        if (!this.state) this.state = { ...desired }
        else {
            const s = this.state
            s.x = ease(s.x, desired.x, 12, dt)
            s.z = ease(s.z, desired.z, 12, dt)
            // A stable world-facing camera is more comfortable in reduced motion.
            if (!input.reduced) {
                const delta = angleDelta(s.heading, desired.heading)
                const step = delta * -Math.expm1(-4 * dt)
                const limit = Math.PI * 0.8 * dt // at most 144 degrees/second
                s.heading += Math.max(-limit, Math.min(limit, step))
            }
            s.orbit += angleDelta(s.orbit, desired.orbit) * -Math.expm1(-8 * dt)
            s.back = ease(s.back, desired.back, 7, dt)
            s.height = ease(s.height, desired.height, 7, dt)
            s.ahead = ease(s.ahead, desired.ahead, 7, dt)
        }
        const s = this.state
        const angle = s.heading + s.orbit
        return {
            heading: s.heading,
            position: {
                x: s.x - Math.sin(angle) * s.back,
                y: s.height,
                z: s.z - Math.cos(angle) * s.back,
            },
            target: {
                x: s.x + Math.sin(s.heading) * s.ahead,
                y: 0.5,
                z: s.z + Math.cos(s.heading) * s.ahead,
            },
        }
    }
}
