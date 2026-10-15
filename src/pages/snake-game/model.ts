export const POWER_HALO_DIAMETER = 2.1
export const POWER_HALO_THICKNESS = 0.12
export const POWER_RADIUS = (POWER_HALO_DIAMETER + POWER_HALO_THICKNESS) / 2
export const MAGNET_RADIUS = 10
export const MAGNET_PULL_SPEED = 14
export const EXPLOSION_DURATION = 1.1
export const CAMERA_ZOOM_MIN = 0.65
export const CAMERA_ZOOM_MAX = 2.5

export const ARENA_SIZE = 100
export const ARENA_HALF = ARENA_SIZE / 2
export const ARENA_LIMIT = ARENA_HALF - 0.5
export const SPAWN_LIMIT = ARENA_HALF - 5

export type Obstacle = {
    x: number
    z: number
    radius: number
    variant: number
    angle: number
}
export type Point = { x: number; z: number }
export type Theme = "Sea" | "Garden" | "Forest" | "Neon"
export type Suit =
    | "Bubble Diver"
    | "Petal Parade"
    | "Woodland Sprite"
    | "Neon Circuit"
    | "Candy Ribbon"
    | "Cloud Puff"
export type Pickup = Point & {
    id: number
    kind: "food" | "mark" | "heart" | "shield" | "magnet"
    expires: number
    color: string
    shape: number
}
export type Snake = {
    id: number
    body: Point[]
    heading: number
    moving: boolean
    color: string
    wander: number
}
export type Settings = {
    theme: Theme
    suit: Suit
    color: string
    view: "2D" | "3D"
    camera: "Riding" | "Chase"
    music: number
    sound: number
    reduced: boolean
    tutorial: boolean
    best: Record<Theme, number>
}
export const themes: Theme[] = ["Sea", "Garden", "Forest", "Neon"]
export const suits: Suit[] = [
    "Bubble Diver",
    "Petal Parade",
    "Woodland Sprite",
    "Neon Circuit",
    "Candy Ribbon",
    "Cloud Puff",
]
export const suitStyles: Record<
    Suit,
    { fabric: string; trim: string; description: string }
> = {
    "Bubble Diver": {
        fabric: "#a7d9de",
        trim: "#fff4e9",
        description: "A silky aqua wetsuit with pearl piping.",
    },
    "Petal Parade": {
        fabric: "#ffded7",
        trim: "#f4c265",
        description: "Your favorite soft petals, in full bloom.",
    },
    "Woodland Sprite": {
        fabric: "#c2cda5",
        trim: "#fff0d4",
        description: "A soft leaf-green jacket with a cream seam.",
    },
    "Neon Circuit": {
        fabric: "#b9a7da",
        trim: "#b6ffe0",
        description: "A lilac flight jacket with luminous piping.",
    },
    "Candy Ribbon": {
        fabric: "#f2b6c9",
        trim: "#fff0d4",
        description: "A pink silk wrap tied with candy ribbons.",
    },
    "Cloud Puff": {
        fabric: "#f5e5e9",
        trim: "#ffffff",
        description: "A quilted blush puffer with a fluffy collar.",
    },
}
export const palettes: Record<
    Theme,
    {
        ground: string
        edge: string
        accent: string
        icon: string
        caption: string
    }
> = {
    Sea: {
        ground: "#8edbd8",
        edge: "#289fa6",
        accent: "#176b78",
        icon: "🐚",
        caption: "A little ocean adventure",
    },
    Garden: {
        ground: "#c5de9a",
        edge: "#739f5b",
        accent: "#496a3e",
        icon: "🌷",
        caption: "Good things are growing",
    },
    Forest: {
        ground: "#8fbc98",
        edge: "#456f58",
        accent: "#264d3f",
        icon: "🍄",
        caption: "Take the wandering path",
    },
    Neon: {
        ground: "#343e65",
        edge: "#8477cf",
        accent: "#b6f4db",
        icon: "✦",
        caption: "A brighter kind of future",
    },
}
export const defaults: Settings = {
    theme: "Garden",
    suit: "Petal Parade",
    color: "#ee927b",
    view: "2D",
    camera: "Riding",
    music: 0.25,
    sound: 0.5,
    reduced: false,
    tutorial: false,
    best: { Sea: 0, Garden: 0, Forest: 0, Neon: 0 },
}
export function readSettings(): { settings: Settings; failed: boolean } {
    try {
        const raw = JSON.parse(localStorage.getItem("snake-garden.v1") || "{}")
        const settings = { ...defaults, best: { ...defaults.best } }
        if (themes.includes(raw.theme)) settings.theme = raw.theme
        if (suits.includes(raw.suit)) settings.suit = raw.suit
        if (/^#[0-9a-f]{6}$/i.test(raw.color)) settings.color = raw.color
        if (["2D", "3D"].includes(raw.view)) settings.view = raw.view
        if (["Riding", "Chase"].includes(raw.camera))
            settings.camera = raw.camera
        for (const key of ["music", "sound"] as const)
            if (typeof raw[key] === "number")
                settings[key] = Math.max(0, Math.min(1, raw[key]))
        settings.reduced =
            typeof raw.reduced === "boolean"
                ? raw.reduced
                : window.matchMedia("(prefers-reduced-motion: reduce)").matches
        settings.tutorial = raw.tutorial === true
        for (const theme of themes)
            if (Number.isFinite(raw.best?.[theme]))
                settings.best[theme] = Math.max(0, raw.best[theme])
        localStorage.setItem("snake-garden.v1", JSON.stringify(settings))
        return { settings, failed: false }
    } catch {
        return {
            settings: { ...defaults, best: { ...defaults.best } },
            failed: true,
        }
    }
}
export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.z - b.z)
let nextId = 1
export class Match {
    player: Snake
    robots: Snake[] = []
    bombs: (Point & { id: number })[] = []
    items: Pickup[] = []
    explosions: (Point & { until: number; id: number })[] = []
    time = 0
    countdown = 3
    lives = 3
    score = 0
    speed = 6
    shield = 0
    magnet = 0
    recovery = 0
    private blockedContact = false
    paused = false
    over = false
    target: Point | null = null
    behavior: "Stop" | "Continue" = "Continue"
    steering = 0
    forwardHeld = false
    private travelKeys = new Set<string>()
    private mapKeys = new Map<string, number>()
    private inputView: "2D" | "3D" = "3D"
    private mapScale = 1
    presentation(view: "2D" | "3D", scale: number) {
        if (view !== this.inputView) {
            this.travelKeys.clear()
            this.mapKeys.clear()
            this.steering = 0
            this.forward(false)
        }
        this.inputView = view
        this.mapScale = Math.max(0.01, scale)
    }
    mapKey(key: string, down: boolean, repeat = false) {
        key = key.toLowerCase()
        const headings: Record<string, number> = {
            w: 0,
            arrowup: 0,
            s: Math.PI,
            arrowdown: Math.PI,
            a: -Math.PI / 2,
            arrowleft: -Math.PI / 2,
            d: Math.PI / 2,
            arrowright: Math.PI / 2,
        }
        if (!(key in headings)) return
        if (down) {
            if (repeat || this.countdown > 0 || this.paused || this.over) return
            this.mapKeys.delete(key)
            this.mapKeys.set(key, headings[key])
        } else if (!this.mapKeys.delete(key)) return
        const heading = [...this.mapKeys.values()].at(-1)
        if (heading !== undefined) {
            if (down || this.behavior === "Stop") this.player.heading = heading
            this.forward(true)
        } else this.forward(false)
    }
    contactRadius(kind: "food" | "bomb" | "power") {
        if (this.inputView === "3D")
            return kind === "power"
                ? POWER_RADIUS + 0.5
                : kind === "food"
                  ? 0.95
                  : 1.05
        const geometry = mapGeometry(this.mapScale)
        return (
            (geometry.snakeRadius +
                (kind === "food"
                    ? geometry.foodRadius
                    : kind === "power"
                      ? geometry.powerRadius
                      : geometry.bombRadius)) /
            this.mapScale
        )
    }
    milestones = 0
    applied = 0
    warnings: number[] = []
    pending: { at: number; kind: "food" | "robot" | "bomb" }[] = []
    contacts = new Set<string>()
    nextPower = 15
    events: string[] = []
    obstacles: Obstacle[] = []
    practice: boolean
    constructor(color: string, practice = false) {
        this.practice = practice
        this.player = this.snake({ x: 0, z: 0 }, color)
        // Keep the starting area and tutorial route clear; generate once per match.
        for (
            let attempt = 0;
            attempt < 300 && this.obstacles.length < 12;
            attempt++
        ) {
            const p = {
                x: (Math.random() * 2 - 1) * 42,
                z: (Math.random() * 2 - 1) * 42,
            }
            if (
                Math.hypot(p.x, p.z) < 21 ||
                this.obstacles.some((o) => distance(o, p) < 12)
            )
                continue
            this.obstacles.push({
                ...p,
                radius: 2.4,
                variant: this.obstacles.length % 3,
                angle: Math.random() * Math.PI * 2,
            })
        }
        for (let i = 0; i < 40; i++) this.spawn("food")
        for (let i = 0; i < 2; i++) this.spawn("robot")
        for (let i = 0; i < 3; i++) this.spawn("bomb")
        if (practice) {
            this.items.slice(0, 5).forEach((item, i) => {
                item.x = 0
                item.z = 4 + i * 3
            })
            for (const [i, kind] of (
                ["heart", "shield", "magnet"] as const
            ).entries())
                this.items.push({
                    id: nextId++,
                    x: 5 + i * 4,
                    z: 12,
                    kind,
                    expires: Infinity,
                    color: "#fff",
                    shape: 0,
                })
        }
    }
    snake(p: Point, color: string): Snake {
        return {
            id: nextId++,
            body: [p, { x: p.x, z: p.z - 0.85 }, { x: p.x, z: p.z - 1.7 }],
            heading: 0,
            moving: false,
            color,
            wander: 0,
        }
    }
    free(): Point {
        let p = { x: 0, z: 0 }
        for (let i = 0; i < 500; i++) {
            p = {
                x: Math.random() * (SPAWN_LIMIT * 2) - SPAWN_LIMIT,
                z: Math.random() * (SPAWN_LIMIT * 2) - SPAWN_LIMIT,
            }
            if (
                this.obstacles.every((o) => distance(o, p) > o.radius + 3) &&
                this.player.body.every((b) => distance(b, p) > 12) &&
                this.robots.every((r) =>
                    r.body.every((b) => distance(b, p) > 3)
                ) &&
                this.bombs.every((b) => distance(b, p) > 3) &&
                this.items.every((b) => distance(b, p) > 1.5)
            )
                return p
        }
        // Crowding may relax item spacing, but never place a pickup inside scenery.
        for (let x = -SPAWN_LIMIT; x <= SPAWN_LIMIT; x += 3)
            for (let z = -SPAWN_LIMIT; z <= SPAWN_LIMIT; z += 3)
                if (
                    this.obstacles.every(
                        (o) => distance(o, { x, z }) > o.radius + 3
                    )
                )
                    return { x, z }
        return { x: 0, z: 0 }
    }
    spawn(kind: "food" | "robot" | "bomb" | "power") {
        const p = this.free()
        if (kind === "robot") {
            const r = this.snake(
                p,
                ["#a495df", "#e6a642", "#68a9d6"][Math.floor(Math.random() * 3)]
            )
            const length = 3 + Math.floor(Math.random() * 10)
            let placed = false
            for (let attempt = 0; attempt < 60; attempt++) {
                const head = attempt === 0 ? p : this.free()
                const heading = Math.random() * Math.PI * 2
                const body = Array.from({ length }, (_, i) => ({
                    x: head.x - Math.sin(heading) * i * 0.85,
                    z: head.z - Math.cos(heading) * i * 0.85,
                }))
                if (
                    !body.every(
                        (b) =>
                            Math.abs(b.x) < ARENA_LIMIT &&
                            Math.abs(b.z) < ARENA_LIMIT &&
                            this.obstacles.every(
                                (o) => distance(o, b) > o.radius + 0.5
                            ) &&
                            this.bombs.every(
                                (bomb) =>
                                    distance(bomb, b) >
                                    this.contactRadius("bomb")
                            ) &&
                            this.player.body.every(
                                (segment) => distance(segment, b) > 3
                            ) &&
                            this.robots.every((robot) =>
                                robot.body.every(
                                    (segment) => distance(segment, b) > 3
                                )
                            )
                    )
                )
                    continue
                r.body = body
                r.heading = r.wander = heading
                placed = true
                break
            }
            if (!placed) {
                this.pending.push({ at: this.time + 1, kind: "robot" })
                return
            }
            r.moving = true
            this.robots.push(r)
        } else if (kind === "bomb") this.bombs.push({ ...p, id: nextId++ })
        else
            this.items.push({
                ...p,
                id: nextId++,
                kind:
                    kind === "power"
                        ? (["heart", "shield", "magnet"] as const)[
                              Math.floor(Math.random() * 3)
                          ]
                        : "food",
                expires: kind === "power" ? this.time + 20 : Infinity,
                color: "#ed805f",
                shape: Math.floor(Math.random() * 3),
            })
    }
    get protected() {
        return this.time < Math.max(this.shield, this.recovery)
    }
    aim(p: Point) {
        if (this.countdown > 0 || this.paused || this.over) return

        this.target = {
            x: Math.max(-ARENA_LIMIT, Math.min(ARENA_LIMIT, p.x)),
            z: Math.max(-ARENA_LIMIT, Math.min(ARENA_LIMIT, p.z)),
        }
        this.player.moving = true
    }
    travelKey(key: string, down: boolean, repeat = false) {
        key = key.toLowerCase()
        if (!["w", "arrowup", "s", "arrowdown"].includes(key)) return
        if (down) {
            if (
                repeat ||
                this.travelKeys.has(key) ||
                this.countdown > 0 ||
                this.paused ||
                this.over
            )
                return
            const reversing =
                this.travelKeys.has("s") || this.travelKeys.has("arrowdown")
            this.travelKeys.add(key)
            if ((key === "s" || key === "arrowdown") && !reversing)
                this.player.heading += Math.PI
            this.forward(true)
        } else if (this.travelKeys.delete(key)) {
            if (!this.travelKeys.size) this.forward(false)
        }
    }
    forward(down: boolean) {
        if (down && (this.countdown > 0 || this.paused || this.over)) return
        const was = this.forwardHeld
        this.forwardHeld = down
        if (down) {
            this.target = null
            this.player.moving = true
        } else if (was) {
            if (this.behavior === "Continue") this.target = null
            this.player.moving = !!this.steering || this.behavior === "Continue"
        }
    }
    steer(n: number) {
        if (this.countdown > 0 || this.paused || this.over) return
        const was = this.steering
        this.steering = n
        if (n) {
            if (n !== was) this.player.heading += (Math.sign(n) * Math.PI) / 2
            this.player.moving = true
        } else if (was && this.behavior === "Continue") {
            this.target = null

            this.player.moving = true
        } else if (was) this.player.moving = this.forwardHeld || !!this.target
    }
    pause() {
        this.paused = true
        this.travelKeys.clear()
        this.mapKeys.clear()
        this.forwardHeld = false
        this.steering = 0
        if (this.behavior === "Stop" && !this.target) this.player.moving = false
    }
    grow(s: Snake) {
        s.body.push({ ...s.body[s.body.length - 1] })
        if (s !== this.player) return
        const reached = Math.floor((s.body.length - 3) / 10)
        while (this.milestones < reached) {
            this.milestones++
            this.warnings.push(
                Math.max(this.time, this.warnings.at(-1) || 0) + 3
            )
            this.events.push("warning")
        }
    }
    damage() {
        if (this.protected || this.over) return
        this.lives--
        this.events.push("damage")
        if (this.lives <= 0) this.over = true
        else this.recovery = this.time + 3
    }
    kill(r: Snake) {
        if (!this.robots.includes(r)) return
        this.robots = this.robots.filter((s) => s !== r)
        for (const p of r.body)
            this.items.push({
                ...p,
                id: nextId++,
                kind: "mark",
                expires: this.time + 20,
                color: r.color,
                shape: 0,
            })
        this.pending.push({ at: this.time + 5, kind: "robot" })
    }
    explode(b: Point & { id: number }) {
        if (!this.bombs.includes(b)) return
        this.bombs = this.bombs.filter((x) => x !== b)
        this.explosions.push({ ...b, until: this.time + EXPLOSION_DURATION })
        this.events.push("explode")
        this.pending.push({ at: this.time + 5, kind: "bomb" })
    }
    move(s: Snake, dt: number, speed: number) {
        if (!s.moving) return
        const h = s.body[0],
            x = h.x + Math.sin(s.heading) * speed * dt,
            z = h.z + Math.cos(s.heading) * speed * dt
        if (
            Math.abs(x) > ARENA_LIMIT ||
            Math.abs(z) > ARENA_LIMIT ||
            this.obstacles.some((o) => distance(o, { x, z }) < o.radius + 0.5)
        ) {
            s.moving = false
            if (s === this.player) {
                this.target = null
                // Holding into the same solid surface is one contact, even after recovery.
                if (!this.blockedContact) this.damage()
                this.blockedContact = true
            } else this.kill(s)
            return
        }
        if (s === this.player) this.blockedContact = false
        h.x = x
        h.z = z
        for (let i = 1; i < s.body.length; i++) {
            const a = s.body[i - 1],
                b = s.body[i],
                d = distance(a, b)
            if (d > 0.85) {
                b.x += ((a.x - b.x) * (d - 0.85)) / d
                b.z += ((a.z - b.z) * (d - 0.85)) / d
            }
        }
    }
    collect(s: Snake, item: Pickup) {
        if (s !== this.player && item.kind !== "food" && item.kind !== "mark")
            return
        if (item.kind === "heart" && this.lives === 3) return
        this.items = this.items.filter((i) => i !== item)
        if (item.kind === "food")
            this.pending.push({ at: this.time + 3, kind: "food" })
        if (item.kind === "food" || item.kind === "mark") this.grow(s)
        if (s !== this.player) return
        this.score +=
            item.kind === "heart"
                ? 25
                : item.kind === "shield" || item.kind === "magnet"
                  ? 15
                  : 10
        if (item.kind === "heart") this.lives++
        if (item.kind === "shield") this.shield = this.time + 5
        if (item.kind === "magnet") this.magnet = this.time + 5
        this.events.push("pickup")
    }
    step(dt: number) {
        if (this.paused || this.over) return
        if (this.countdown > 0) {
            this.countdown = Math.max(0, this.countdown - dt)
            if (this.countdown === 0)
                this.player.moving = this.behavior === "Continue"
            return
        }
        this.time += dt
        if (this.warnings.length && this.warnings[0] <= this.time) {
            this.warnings.shift()
            this.applied++
            this.speed = Math.min(12, 6 + this.applied * 0.6)
            if (this.applied <= 6) this.spawn("robot")
            if (this.applied <= 9) this.spawn("bomb")
        }
        for (const p of this.pending.filter((p) => p.at <= this.time))
            this.spawn(p.kind)
        this.pending = this.pending.filter((p) => p.at > this.time)
        this.items = this.items.filter((i) => i.expires > this.time)
        this.explosions = this.explosions.filter((i) => i.until > this.time)
        if (this.time >= this.nextPower) {
            this.nextPower += 15
            if (
                this.items.filter((i) => !["food", "mark"].includes(i.kind))
                    .length < 3
            )
                this.spawn("power")
        }
        if (this.target && distance(this.player.body[0], this.target) <= 0.5) {
            this.target = null

            if (!this.steering && !this.forwardHeld)
                this.player.moving = this.behavior === "Continue"
        }
        if (this.steering || this.forwardHeld) {
            this.player.moving = true
        } else if (this.target) {
            const head = this.player.body[0]
            // Reorient before the first step: no turning arc into the old obstacle.
            this.player.heading = Math.atan2(
                this.target.x - head.x,
                this.target.z - head.z
            )
        }
        this.move(this.player, dt, this.speed)
        if (this.over) return
        for (const r of [...this.robots]) {
            const h = r.body[0]
            const obstacle = this.obstacles.find(
                (o) => distance(o, h) < o.radius + 5
            )
            if (obstacle)
                r.wander = Math.atan2(h.x - obstacle.x, h.z - obstacle.z)
            else if (
                Math.abs(h.x) > ARENA_HALF - 9 ||
                Math.abs(h.z) > ARENA_HALF - 9
            )
                r.wander = Math.atan2(-h.x, -h.z)
            else if (Math.random() < dt * 0.65)
                r.wander = r.heading + (Math.random() - 0.5) * Math.PI
            r.heading = r.wander
            r.moving = true
            this.move(r, dt, this.speed * 0.8)
        }
        if (this.magnet > this.time)
            for (const i of this.items) {
                const d = distance(i, this.player.body[0])
                if (i.kind === "food" && d < MAGNET_RADIUS && d > 0.01) {
                    const f = Math.min(1, (dt * MAGNET_PULL_SPEED) / d)
                    i.x += (this.player.body[0].x - i.x) * f
                    i.z += (this.player.body[0].z - i.z) * f
                }
            }
        const snakes = [this.player, ...this.robots]
        for (const s of snakes)
            for (const item of [...this.items])
                if (
                    distance(s.body[0], item) <
                    (item.kind === "mark"
                        ? 0.95
                        : this.contactRadius(
                              item.kind === "food" ? "food" : "power"
                          ))
                )
                    this.collect(s, item)
        const newContacts = new Set<string>(),
            deaths = new Set<Snake>(),
            consumed = new Set<Point & { id: number }>()
        const protectedAtStart = this.protected
        let hurt = false
        for (let a = 0; a < snakes.length; a++)
            for (let b = a + 1; b < snakes.length; b++) {
                const s = snakes[a],
                    t = snakes[b]
                const sHeadHit = t.body.some((p) => distance(s.body[0], p) < 1)
                const tHeadHit = s.body.some((p) => distance(t.body[0], p) < 1)
                // Track each head separately: body overlap never assigns responsibility.
                for (const [attacker, hit, other] of [
                    [s, sHeadHit, t],
                    [t, tHeadHit, s],
                ] as const) {
                    if (!hit) continue
                    const key = `head:${attacker.id}:${other.id}`
                    newContacts.add(key)
                    if (
                        this.contacts.has(key) ||
                        ((s === this.player || t === this.player) &&
                            protectedAtStart)
                    )
                        continue
                    if (attacker === this.player) hurt = true
                    else deaths.add(attacker)
                }
            }
        for (const s of snakes)
            for (const b of this.bombs) {
                const key = `${s.id}:b${b.id}`
                if (
                    !s.body.some(
                        (p) => distance(p, b) < this.contactRadius("bomb")
                    )
                )
                    continue
                newContacts.add(key)
                if (
                    this.contacts.has(key) ||
                    (s === this.player && protectedAtStart)
                )
                    continue
                if (s === this.player) hurt = true
                else deaths.add(s)
                consumed.add(b)
            }
        this.contacts = newContacts
        if (hurt) this.damage()
        for (const r of deaths) this.kill(r)
        for (const b of consumed) this.explode(b)
    }
}

// Screen-space sizes shared by the readable 2D renderer and collision model.
export function mapGeometry(scale: number) {
    const itemSize = Math.max(17, Math.min(26, scale * 3.8))
    const bodyWidth = Math.max(12, Math.min(19, scale * 2.6))
    return {
        itemSize,
        bodyWidth,
        snakeRadius: (bodyWidth + 3) / 2,
        powerRadius: itemSize * 0.7 + 3.75,
        foodRadius: itemSize * 0.56,
        bombRadius: (itemSize + 3) * 0.56,
    }
}
