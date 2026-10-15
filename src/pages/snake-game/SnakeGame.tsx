import { useEffect, useRef, useState } from "react"
import { Link, Navigate } from "react-router"
import { useFeatureFlags } from "@/hooks/useFeatureFlags"
import {
    Match,
    readSettings,
    themes,
    suits,
    palettes,
    suitStyles,
    ARENA_SIZE,
    ARENA_HALF,
    CAMERA_ZOOM_MIN,
    CAMERA_ZOOM_MAX,
} from "./model"
import type { Settings, Suit } from "./model"
import { GameScene } from "./scene"
import { GameAudio } from "./audio"
import "./snake.css"
import { drawArena2D } from "./arena2d"

function SnakeArt({
    color,
    suit,
    reduced = false,
}: {
    color: string
    suit: Suit
    reduced?: boolean
}) {
    const { isGameplayEnabled } = useFeatureFlags()

    if (!isGameplayEnabled) return <Navigate to="/" replace />

    return (
        <svg
            className={`sg-snake-art ${reduced ? "still" : ""}`}
            viewBox="0 0 520 350"
            role="img"
            aria-label={`${color} snake wearing ${suit}`}
        >
            <defs>
                <filter id="snake-shadow">
                    <feDropShadow
                        dx="0"
                        dy="12"
                        stdDeviation="8"
                        floodColor="#536546"
                        floodOpacity=".2"
                    />
                </filter>
                <linearGradient id="snake-shine" x2="0" y2="1">
                    <stop stopColor="#fff" stopOpacity=".4" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
            </defs>
            <ellipse
                cx="262"
                cy="290"
                rx="170"
                ry="27"
                fill="#547f5b"
                opacity=".13"
            />
            <g filter="url(#snake-shadow)">
                <path
                    d="M100 252 C160 290 228 258 212 214 S122 178 146 131 S237 135 278 183 S374 222 376 146 L376 116"
                    fill="none"
                    stroke={color}
                    strokeWidth="60"
                    strokeLinecap="round"
                />
                {suit !== "Petal Parade" && (
                    <>
                        <path
                            d="M100 252 C160 290 228 258 212 214 S122 178 146 131 S237 135 278 183 S374 222 376 146 L376 132"
                            fill="none"
                            stroke={suitStyles[suit].fabric}
                            strokeWidth="64"
                            strokeLinecap="round"
                        />
                        <path
                            d="M100 252 C160 290 228 258 212 214 S122 178 146 131 S237 135 278 183 S374 222 376 146 L376 132"
                            fill="none"
                            stroke={suitStyles[suit].trim}
                            strokeWidth="2"
                            strokeDasharray={
                                suit === "Neon Circuit" ? undefined : "5 5"
                            }
                            strokeLinecap="round"
                        />
                        <path
                            d="M347 135 Q376 146 405 135"
                            fill="none"
                            stroke={suitStyles[suit].trim}
                            strokeWidth={suit === "Cloud Puff" ? 14 : 7}
                            strokeLinecap="round"
                        />
                        {suit === "Candy Ribbon" && (
                            <g fill="#fff0d4" stroke="#d77899" strokeWidth="2">
                                <path d="M376 144 Q343 119 349 148 Q352 165 376 144 Q402 120 404 145 Q406 162 376 144" />
                                <circle cx="376" cy="144" r="6" />
                            </g>
                        )}
                    </>
                )}
                <path
                    d="M100 243 C160 281 228 249 212 205 S122 169 146 122 S237 126 278 174 S374 213 376 137 L376 107"
                    fill="none"
                    stroke="url(#snake-shine)"
                    strokeWidth="32"
                    strokeLinecap="round"
                />
                {[
                    { x: 130, y: 252 },
                    { x: 207, y: 242 },
                    { x: 178, y: 192 },
                    { x: 147, y: 130 },
                    { x: 211, y: 133 },
                    { x: 272, y: 177 },
                    { x: 331, y: 207 },
                ].map((p, i) => (
                    <g key={i} transform={`translate(${p.x} ${p.y - 15})`}>
                        {suit === "Petal Parade" ? (
                            <>
                                <g fill="#ffded7">
                                    {[0, 72, 144, 216, 288].map((a) => (
                                        <ellipse
                                            key={a}
                                            rx="9"
                                            ry="16"
                                            cy="-10"
                                            transform={`rotate(${a})`}
                                        />
                                    ))}
                                </g>
                                <circle r="8" fill="#f4c265" />
                            </>
                        ) : (
                            <path
                                d="M-19 -7 Q0 5 19 -7"
                                fill="none"
                                stroke={suitStyles[suit].trim}
                                strokeWidth={suit === "Cloud Puff" ? 5 : 3}
                                strokeLinecap="round"
                            />
                        )}
                    </g>
                ))}
                <ellipse cx="376" cy="103" rx="37" ry="38" fill={color} />
                <ellipse cx="359" cy="85" rx="13" ry="16" fill="white" />
                <ellipse cx="391" cy="85" rx="13" ry="16" fill="white" />
                <ellipse cx="363" cy="87" rx="6" ry="9" fill="#24443f" />
                <ellipse cx="395" cy="87" rx="6" ry="9" fill="#24443f" />
                <path
                    d="M365 116 Q377 127 390 115"
                    stroke="#674e44"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                />
                <ellipse cx="348" cy="110" rx="6" ry="4" fill="#fbc4ac" />
                <ellipse cx="404" cy="110" rx="6" ry="4" fill="#fbc4ac" />
            </g>
            <g fill="#f8f4de">
                <path d="M83 80l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" />
                <path d="M441 223l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" />
            </g>
        </svg>
    )
}
const tutorialSteps = [
    [
        "Make your first move",
        "After the countdown, tap the arena to set a destination. Your snake turns immediately toward the destination.",
    ],
    [
        "A moment to breathe",
        "Stop travels to your destination and waits. Continue keeps you moving. Try the movement switch. The world keeps running either way.",
    ],
    [
        "Follow your own direction",
        "Press left or right, A / D, or an arrow key to turn 90° immediately. Hold to keep moving in that direction. Hold W / Up Arrow to move straight. S / Down Arrow turns around once and moves while held. Release to stop in Stop mode. Left and right are relative to your snake.",
    ],
    [
        "Three little lives",
        "Suit → normal snake → skeleton. Bombs and robot collisions can hurt. A hit gives three seconds of protection.",
    ],
    [
        "Pick up something good",
        "Food grows your snake. Hearts restore a life; shields protect and magnets pull nearby food for five seconds.",
    ],
    [
        "A new perspective",
        "Switch to 3D, try Riding or Chase, and orbit with right-drag or two fingers. Pinch or scroll to zoom.",
    ],
    [
        "Ready to wander",
        "Collect food, watch the robots, and find your rhythm. Practice scores never affect your best scores.",
    ],
]
const timeLabel = (n: number) =>
    `${Math.floor(n / 60)}:${Math.floor(n % 60)
        .toString()
        .padStart(2, "0")}`

function Arena({
    match,
    settings,
    update,
    exit,
    finish,
    audio,
}: {
    match: Match
    settings: Settings
    update: (s: Partial<Settings>) => void
    exit: () => void
    finish: () => void
    audio: GameAudio
}) {
    const canvas = useRef<HTMLCanvasElement>(null),
        map = useRef<HTMLCanvasElement>(null),
        readableMap = useRef<HTMLCanvasElement>(null),
        scene = useRef<GameScene | null>(null)
    const settingsRef = useRef(settings),
        finishRef = useRef(finish)
    const [tick, render] = useState(0),
        [error, setError] = useState(""),
        [lesson, setLesson] = useState(0)
    useEffect(() => {
        settingsRef.current = settings
        if (scene.current) scene.current.settings = settings
    }, [settings])
    useEffect(() => {
        finishRef.current = finish
    }, [finish])
    useEffect(() => {
        let game: GameScene
        try {
            game = new GameScene(canvas.current!, match, settingsRef.current)
            scene.current = game
        } catch {
            setError(
                "Your browser could not start the 3D renderer. Enable hardware acceleration or try an up-to-date browser."
            )
            return
        }
        let previous = performance.now(),
            accumulated = 0,
            hud = 0,
            ended = false
        const drawMap = () => {
            const c = map.current?.getContext("2d")
            if (!c) return
            c.fillStyle = palettes[settingsRef.current.theme].ground
            c.fillRect(0, 0, 160, 160)
            const dot = (x: number, z: number, color: string, size: number) => {
                c.fillStyle = color
                c.beginPath()
                c.arc(
                    ((x + ARENA_HALF) / ARENA_SIZE) * 156 + 2,
                    ((ARENA_HALF - z) / ARENA_SIZE) * 156 + 2,
                    size,
                    0,
                    Math.PI * 2
                )
                c.fill()
            }
            for (const obstacle of match.obstacles)
                dot(
                    obstacle.x,
                    obstacle.z,
                    palettes[settingsRef.current.theme].edge,
                    (obstacle.radius / ARENA_SIZE) * 156
                )
            for (const i of match.items)
                dot(
                    i.x,
                    i.z,
                    i.kind === "food"
                        ? "#fff3bd"
                        : i.kind === "mark"
                          ? i.color
                          : "#ef6d91",
                    i.kind === "food" ? 1.4 : 2.4
                )
            for (const b of match.bombs) dot(b.x, b.z, "#293637", 2.3)
            for (const r of match.robots)
                for (const p of r.body) dot(p.x, p.z, "#725198", 2)
            for (const p of match.player.body) dot(p.x, p.z, "#fff", 2)
            dot(match.player.body[0].x, match.player.body[0].z, "#193f39", 3)
            c.strokeStyle = "#34584e"
            c.lineWidth = 3
            c.strokeRect(1, 1, 158, 158)
        }
        game.engine.runRenderLoop(() => {
            const now = performance.now(),
                dt = Math.min(0.1, (now - previous) / 1000)
            previous = now
            accumulated += dt
            while (accumulated >= 1 / 60) {
                match.step(1 / 60)
                accumulated -= 1 / 60
            }
            if (!match.paused && !match.over && match.countdown === 0)
                audio.music(
                    dt,
                    settingsRef.current.theme,
                    settingsRef.current.music
                )
            for (const e of match.events.splice(0))
                audio.effect(e, settingsRef.current.sound)
            game.draw(dt)
            if (settingsRef.current.view === "2D" && readableMap.current)
                drawArena2D(readableMap.current, match, settingsRef.current)
            drawMap()
            hud += dt
            if (hud > 0.08) {
                render((n) => n + 1)
                hud = 0
            }
            if (match.over && !ended) {
                ended = true
                finishRef.current()
            }
        })
        const held = new Set<string>()
        const key = (e: KeyboardEvent, down: boolean) => {
            const travelKey = ["w", "arrowup", "s", "arrowdown"].includes(
                e.key.toLowerCase()
            )
            // Release held controls even when focus moves into a form field.
            if (!down && travelKey) {
                match.travelKey(e.key, false)
                return
            }
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLSelectElement ||
                e.target instanceof HTMLTextAreaElement ||
                (e.target instanceof HTMLElement && e.target.isContentEditable)
            )
                return
            if (travelKey) {
                e.preventDefault()
                // A fresh press is required after countdown or pause.
                match.travelKey(e.key, down, e.repeat)
                return
            }
            if (
                ["ArrowLeft", "ArrowRight", "a", "A", "d", "D"].includes(e.key)
            ) {
                e.preventDefault()
                if (down && (match.paused || match.countdown > 0)) return
                if (down) held.add(e.key.toLowerCase())
                else held.delete(e.key.toLowerCase())
                match.steer(
                    (held.has("arrowright") || held.has("d") ? 1 : 0) -
                        (held.has("arrowleft") || held.has("a") ? 1 : 0)
                )
            }
            if (down && !e.repeat && e.key === "Escape") {
                if (match.paused) match.paused = false
                else match.pause()
                render((n) => n + 1)
            }
        }
        const down = (e: KeyboardEvent) => key(e, true),
            up = (e: KeyboardEvent) => key(e, false)
        const blur = () => {
            held.clear()
            match.pause()
            render((n) => n + 1)
        }
        const visibility = () => {
            if (document.hidden) blur()
        }
        window.addEventListener("keydown", down)
        window.addEventListener("keyup", up)
        window.addEventListener("blur", blur)
        document.addEventListener("visibilitychange", visibility)
        const el = canvas.current!,
            pointers = new Map<number, { x: number; y: number }>()
        let gesture = false,
            right = false,
            start = { x: 0, y: 0 },
            last = { x: 0, y: 0 },
            pinch = 0
        const pointerDown = (e: PointerEvent) => {
            audio.unlock()
            el.setPointerCapture(e.pointerId)
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
            if (pointers.size === 1) {
                start = last = { x: e.clientX, y: e.clientY }
                gesture = false
                right = e.button === 2
            }
            if (pointers.size >= 2) {
                gesture = true
                match.steer(0)
                const [a, b] = [...pointers.values()]
                pinch = Math.hypot(a.x - b.x, a.y - b.y)
                last = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
            }
        }
        const pointerMove = (e: PointerEvent) => {
            if (!pointers.has(e.pointerId)) return
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
            if (settingsRef.current.view !== "3D") return
            let x = e.clientX,
                y = e.clientY
            if (pointers.size >= 2) {
                const [a, b] = [...pointers.values()]
                x = (a.x + b.x) / 2
                y = (a.y + b.y) / 2
                const d = Math.hypot(a.x - b.x, a.y - b.y)
                if (d > 0)
                    game.zoom = Math.max(
                        CAMERA_ZOOM_MIN,
                        Math.min(CAMERA_ZOOM_MAX, (game.zoom * pinch) / d)
                    )
                pinch = d
            }
            if (right || pointers.size >= 2) {
                game.orbit -= (x - last.x) * 0.008
                game.tilt = Math.max(
                    -1,
                    Math.min(12, game.tilt + (y - last.y) * 0.04)
                )
                last = { x, y }
            }
        }
        const pointerUp = (e: PointerEvent) => {
            if (
                !gesture &&
                !right &&
                e.type !== "pointercancel" &&
                Math.hypot(e.clientX - start.x, e.clientY - start.y) < 12
            ) {
                const p = game.pick(e.clientX, e.clientY)
                if (p) match.aim(p)
            }
            pointers.delete(e.pointerId)
        }
        const wheel = (e: WheelEvent) => {
            if (settingsRef.current.view === "3D") {
                e.preventDefault()
                game.zoom = Math.max(
                    CAMERA_ZOOM_MIN,
                    Math.min(
                        CAMERA_ZOOM_MAX,
                        game.zoom * Math.exp(e.deltaY * 0.001)
                    )
                )
            }
        }
        const context = (e: Event) => e.preventDefault()
        el.addEventListener("pointerdown", pointerDown)
        el.addEventListener("pointermove", pointerMove)
        el.addEventListener("pointerup", pointerUp)
        el.addEventListener("pointercancel", pointerUp)
        el.addEventListener("wheel", wheel, { passive: false })
        el.addEventListener("contextmenu", context)
        return () => {
            window.removeEventListener("keydown", down)
            window.removeEventListener("keyup", up)
            window.removeEventListener("blur", blur)
            document.removeEventListener("visibilitychange", visibility)
            el.removeEventListener("pointerdown", pointerDown)
            el.removeEventListener("pointermove", pointerMove)
            el.removeEventListener("pointerup", pointerUp)
            el.removeEventListener("pointercancel", pointerUp)
            el.removeEventListener("wheel", wheel)
            el.removeEventListener("contextmenu", context)
            game.dispose()
            scene.current = null
        }
    }, [match, audio])
    const paused = match.paused
    return (
        <div className="sg-play" data-tick={tick}>
            <header className="sg-hud">
                <div>
                    <span className="sg-eyebrow">YOUR SCORE</span>
                    <strong>{match.score.toString().padStart(4, "0")}</strong>
                </div>
                <div>
                    <span className="sg-eyebrow">LIVES</span>
                    <strong
                        className="sg-lives"
                        aria-label={`${match.lives} lives`}
                    >
                        {"♥".repeat(match.lives)}
                        <span>{"♡".repeat(3 - match.lives)}</span>
                    </strong>
                </div>
                <div>
                    <span className="sg-eyebrow">LENGTH</span>
                    <strong>{match.player.body.length}</strong>
                </div>
                <div className="sg-hud-time">
                    <span className="sg-eyebrow">
                        {settings.theme.toUpperCase()}
                    </span>
                    <strong>{timeLabel(match.time)}</strong>
                </div>
                <button
                    onClick={() => {
                        match.pause()
                        render((n) => n + 1)
                    }}
                >
                    Ⅱ Pause
                </button>
            </header>
            <div className="sg-stage">
                <canvas
                    ref={canvas}
                    aria-label="Snake arena. Tap to travel; Hold W or Up Arrow to move forward; hold S or Down Arrow to turn around and move. Release to stop in Stop mode. A and D or arrow keys to steer."
                    tabIndex={0}
                />
                <canvas
                    ref={readableMap}
                    className="sg-readable-map"
                    aria-hidden="true"
                    style={{
                        display: settings.view === "2D" ? "block" : "none",
                    }}
                />
                {settings.view === "2D" && (
                    <div className="sg-map-key">
                        <span>🍎 Food</span>
                        <span>💣 Bomb</span>
                        <span>▧ Gray blocks = obstacles</span>
                        <span>✦ Glowing shells = boosts</span>
                    </div>
                )}
                {settings.view === "3D" && (
                    <div className="sg-minimap">
                        <canvas
                            ref={map}
                            width="160"
                            height="160"
                            aria-label="Minimap showing arena, snakes, pickups and obstacles"
                        />
                        <span>● YOU · ◆ ROBOTS · ● ITEMS · ● OBSTACLES</span>
                    </div>
                )}
                <div className="sg-effects" aria-live="polite">
                    {match.shield > match.time && (
                        <span>
                            ◈ Shield {(match.shield - match.time).toFixed(1)}s
                        </span>
                    )}
                    {match.recovery > match.time && (
                        <span>
                            ♡ Recovery{" "}
                            {(match.recovery - match.time).toFixed(1)}s
                        </span>
                    )}
                    {match.magnet > match.time && (
                        <span>
                            ∩ Magnet {(match.magnet - match.time).toFixed(1)}s
                        </span>
                    )}
                    {match.warnings.length > 0 && (
                        <span className="sg-warning">
                            ↗ Level up in{" "}
                            {Math.ceil(match.warnings[0] - match.time)}s ·{" "}
                            {Math.min(
                                12,
                                6 + (match.applied + 1) * 0.6
                            ).toFixed(1)}{" "}
                            speed
                        </span>
                    )}
                </div>
                {match.countdown > 0 && !paused && (
                    <div className="sg-countdown">
                        <span>GET READY TO WANDER</span>
                        <b>{Math.ceil(match.countdown)}</b>
                        <p>Wait for go, then choose your first destination.</p>
                    </div>
                )}
                {match.countdown === 0 &&
                    match.time < 8 &&
                    !match.player.moving &&
                    !paused && (
                        <div className="sg-hint">
                            Tap the ground to get going 🌱
                        </div>
                    )}
                {match.practice && !paused && (
                    <div className="sg-lesson">
                        <small>
                            PRACTICE {lesson + 1} / {tutorialSteps.length}
                        </small>
                        <h3>{tutorialSteps[lesson][0]}</h3>
                        <p>{tutorialSteps[lesson][1]}</p>
                        <div>
                            <button onClick={exit}>Skip tutorial</button>
                            <button
                                className="sg-primary"
                                onClick={() =>
                                    lesson === tutorialSteps.length - 1
                                        ? exit()
                                        : setLesson(lesson + 1)
                                }
                            >
                                {lesson === tutorialSteps.length - 1
                                    ? "Finish practice"
                                    : "Next →"}
                            </button>
                        </div>
                    </div>
                )}
                {paused && !match.over && (
                    <div className="sg-overlay">
                        <div className="sg-modal">
                            <span className="sg-eyebrow">TAKE A BREATHER</span>
                            <h2>A little pause.</h2>
                            <p>Your whole world is waiting for you.</p>
                            <button
                                className="sg-primary"
                                onClick={() => {
                                    audio.unlock()
                                    match.paused = false
                                    render((n) => n + 1)
                                }}
                            >
                                Resume adventure →
                            </button>
                            <button onClick={exit}>Return home</button>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="sg-overlay">
                        <div className="sg-modal">
                            <h2>Unable to start</h2>
                            <p>{error}</p>
                            <button onClick={exit}>Back home</button>
                        </div>
                    </div>
                )}
            </div>
            <footer className="sg-controls">
                <div className="sg-control-group">
                    <button
                        aria-label="Switch camera dimension"
                        onClick={() =>
                            update({
                                view: settings.view === "2D" ? "3D" : "2D",
                            })
                        }
                    >
                        {settings.view} view ⇄
                    </button>
                    <button
                        onClick={() => {
                            match.behavior =
                                match.behavior === "Stop" ? "Continue" : "Stop"
                            if (
                                match.behavior === "Stop" &&
                                !match.target &&
                                !match.steering &&
                                !match.forwardHeld
                            )
                                match.player.moving = false
                            render((n) => n + 1)
                        }}
                    >
                        {match.behavior} ⇄
                    </button>
                    {settings.view === "3D" && (
                        <>
                            <button
                                onClick={() =>
                                    update({
                                        camera:
                                            settings.camera === "Riding"
                                                ? "Chase"
                                                : "Riding",
                                    })
                                }
                            >
                                {settings.camera} ⇄
                            </button>
                            <button onClick={() => scene.current?.reset()}>
                                Reset camera
                            </button>
                        </>
                    )}
                </div>
                <div className="sg-steer">
                    {[-1, 1].map((n) => (
                        <button
                            key={n}
                            aria-label={`Turn ${n === -1 ? "left" : "right"} 90°, hold to move`}
                            onPointerDown={(e) => {
                                e.currentTarget.setPointerCapture(e.pointerId)
                                match.steer(n)
                            }}
                            onPointerUp={() => match.steer(0)}
                            onPointerCancel={() => match.steer(0)}
                            onLostPointerCapture={() => match.steer(0)}
                            onKeyDown={(e) => {
                                if (e.key === " " || e.key === "Enter") {
                                    e.preventDefault()
                                    match.steer(n)
                                }
                            }}
                            onKeyUp={() => match.steer(0)}
                        >
                            {n === -1 ? "↶" : "↷"}
                            <small>{n === -1 ? "LEFT" : "RIGHT"}</small>
                        </button>
                    ))}
                </div>
                <div className="sg-control-group">
                    <button
                        aria-label="Toggle music"
                        aria-pressed={settings.music > 0}
                        onClick={() =>
                            update({ music: settings.music ? 0 : 0.25 })
                        }
                    >
                        ♫ {settings.music ? "On" : "Off"}
                    </button>
                    <button
                        aria-label="Toggle sound effects"
                        aria-pressed={settings.sound > 0}
                        onClick={() =>
                            update({ sound: settings.sound ? 0 : 0.5 })
                        }
                    >
                        ♪ {settings.sound ? "On" : "Off"}
                    </button>
                </div>
            </footer>
        </div>
    )
}

export default function SnakeGame() {
    const [initial] = useState(readSettings),
        [settings, setSettings] = useState(initial.settings),
        [storageFailed, setStorageFailed] = useState(initial.failed)
    const [page, setPage] = useState<"home" | "setup" | "play" | "over">(
            "home"
        ),
        [modal, setModal] = useState<"settings" | "tutorial" | null>(
            initial.settings.tutorial ? null : "tutorial"
        )
    const [match, setMatch] = useState<Match | null>(null),
        [audio] = useState(() => new GameAudio())
    useEffect(() => {
        try {
            localStorage.setItem("snake-garden.v1", JSON.stringify(settings))
        } catch {
            setStorageFailed(true)
        }
    }, [settings])
    useEffect(() => () => audio.dispose(), [audio])
    useEffect(() => {
        const previous = document.title
        document.title = "Snake Game · A little adventure"
        return () => {
            document.title = previous
        }
    }, [])
    useEffect(() => {
        if (!modal) return
        const handler = (event: KeyboardEvent) => {
            const dialog = document.querySelector('.sg-modal[role="dialog"]')
            const controls = dialog?.querySelectorAll<HTMLElement>(
                "button,input,a[href]"
            )
            if (!controls?.length || event.key !== "Tab") return
            const first = controls[0],
                last = controls[controls.length - 1]
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [modal])
    const update = (patch: Partial<Settings>) =>
        setSettings((s) => ({ ...s, ...patch }))
    const start = (practice = false) => {
        audio.unlock()
        setMatch(new Match(settings.color, practice))
        setPage("play")
        setModal(null)
    }
    const home = () => {
        if (match?.practice) update({ tutorial: true })
        setPage("home")
        setMatch(null)
    }
    const finish = () => {
        if (match && !match.practice)
            setSettings((s) => ({
                ...s,
                best: {
                    ...s.best,
                    [s.theme]: Math.max(s.best[s.theme], match.score),
                },
            }))
        setPage("over")
    }
    return (
        <main className={`sg-app ${settings.reduced ? "sg-reduced" : ""}`}>
            {storageFailed && (
                <div className="sg-storage" role="status">
                    Storage is unavailable. You can still play, but scores and
                    preferences cannot be saved.
                </div>
            )}
            {page === "play" && match ? (
                <Arena
                    match={match}
                    settings={settings}
                    update={update}
                    exit={home}
                    finish={finish}
                    audio={audio}
                />
            ) : (
                <div className="sg-shell">
                    <nav className="sg-nav">
                        <button className="sg-brand" onClick={home}>
                            <span className="sg-logo">〰</span> snake
                            <span>game</span>
                            <small>THE LITTLE ADVENTURE</small>
                        </button>
                        <div>
                            <Link to="/product">← Back to the shop</Link>
                            <button onClick={() => setModal("settings")}>
                                ⚙ <span>Settings</span>
                            </button>
                        </div>
                    </nav>
                    {page === "home" && (
                        <>
                            <section className="sg-hero">
                                <div className="sg-hero-copy">
                                    <span className="sg-kicker">
                                        <i /> A LITTLE WANDER. A LOT OF WONDER.
                                    </span>
                                    <h1>
                                        Small snake.
                                        <br />
                                        Big <em>adventure.</em>
                                    </h1>
                                    <p>
                                        Find your rhythm. Follow your curiosity.
                                        <br />A colorful little world is waiting
                                        to be explored.
                                    </p>
                                    <div className="sg-hero-actions">
                                        <button
                                            className="sg-primary"
                                            onClick={() => setPage("setup")}
                                        >
                                            Let’s play <span>↗</span>
                                        </button>
                                        <button
                                            className="sg-text-button"
                                            onClick={() => start(true)}
                                        >
                                            ▷ How to play
                                        </button>
                                    </div>
                                    <div className="sg-hero-facts">
                                        <span>✧ 4 worlds to explore</span>
                                        <span>
                                            ♡ 3 lives, endless possibility
                                        </span>
                                    </div>
                                </div>
                                <div className="sg-hero-art">
                                    <span className="sg-art-label">
                                        MEET YOUR NEXT LITTLE OBSESSION
                                    </span>
                                    <div className="sg-art-orbit" />
                                    <SnakeArt
                                        color={settings.color}
                                        suit={settings.suit}
                                        reduced={settings.reduced}
                                    />
                                    <span className="sg-float sg-float-one">
                                        🌱 Grow at your own pace
                                    </span>
                                    <span className="sg-float sg-float-two">
                                        Made for a little escape ✦
                                    </span>
                                </div>
                            </section>
                            <section className="sg-worlds">
                                <div className="sg-section-heading">
                                    <div>
                                        <span className="sg-eyebrow">
                                            PICK YOUR KIND OF HAPPY
                                        </span>
                                        <h2>One snake. Four little worlds.</h2>
                                    </div>
                                    <span>All worlds unlocked. Always.</span>
                                </div>
                                <div className="sg-world-grid">
                                    {themes.map((theme, i) => (
                                        <button
                                            key={theme}
                                            className={`sg-world sg-world-${theme.toLowerCase()}`}
                                            onClick={() => {
                                                update({ theme })
                                                setPage("setup")
                                            }}
                                        >
                                            <div className="sg-world-picture">
                                                <span className="sg-world-number">
                                                    0{i + 1}
                                                </span>
                                                <span className="sg-world-icon">
                                                    {palettes[theme].icon}
                                                </span>
                                                <span className="sg-mini-snake">
                                                    〰
                                                </span>
                                                <i />
                                                <b>↗</b>
                                            </div>
                                            <div className="sg-world-description">
                                                <h3>
                                                    {theme === "Neon"
                                                        ? "Neon City"
                                                        : theme}
                                                </h3>
                                                <p>{palettes[theme].caption}</p>
                                                <span>
                                                    ♕ PERSONAL BEST{" "}
                                                    <strong>
                                                        {settings.best[theme]}
                                                    </strong>
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>
                            <footer className="sg-home-footer">
                                <span>A little joy, one bite at a time.</span>
                                <span>NO SIGN-IN. JUST GOOD TIMES. ✦</span>
                            </footer>
                        </>
                    )}
                    {page === "setup" && (
                        <section className="sg-setup">
                            <div className="sg-section-heading">
                                <div>
                                    <span className="sg-eyebrow">
                                        MAKE IT YOUR ADVENTURE
                                    </span>
                                    <h1>Ready, little wanderer?</h1>
                                </div>
                                <button onClick={home}>← Back</button>
                            </div>
                            <div className="sg-setup-grid">
                                <div className="sg-customize">
                                    <fieldset>
                                        <legend>
                                            01 <span>Choose your world</span>
                                        </legend>
                                        <div className="sg-options">
                                            {themes.map((theme) => (
                                                <button
                                                    key={theme}
                                                    aria-pressed={
                                                        settings.theme === theme
                                                    }
                                                    onClick={() =>
                                                        update({ theme })
                                                    }
                                                >
                                                    {palettes[theme].icon}{" "}
                                                    {theme}
                                                </button>
                                            ))}
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend>
                                            02{" "}
                                            <span>Dress for the occasion</span>
                                        </legend>
                                        <div className="sg-options sg-suits">
                                            {suits.map((suit) => (
                                                <button
                                                    key={suit}
                                                    aria-pressed={
                                                        settings.suit === suit
                                                    }
                                                    onClick={() =>
                                                        update({ suit })
                                                    }
                                                >
                                                    {suit}
                                                </button>
                                            ))}
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend>
                                            03 <span>Your favorite color</span>
                                        </legend>
                                        <div className="sg-colors">
                                            {[
                                                "#ee927b",
                                                "#7bab8a",
                                                "#92b9d8",
                                                "#b29acb",
                                                "#e9ba59",
                                                "#df8ead",
                                            ].map((color) => (
                                                <button
                                                    key={color}
                                                    aria-label={`Snake color ${color}`}
                                                    aria-pressed={
                                                        settings.color === color
                                                    }
                                                    style={{
                                                        background: color,
                                                    }}
                                                    onClick={() =>
                                                        update({ color })
                                                    }
                                                >
                                                    {settings.color === color
                                                        ? "✓"
                                                        : ""}
                                                </button>
                                            ))}
                                            <label>
                                                Custom
                                                <input
                                                    type="color"
                                                    value={settings.color}
                                                    onChange={(e) =>
                                                        update({
                                                            color: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </label>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend>
                                            04 <span>A fresh perspective</span>
                                        </legend>
                                        <div className="sg-options">
                                            {(["2D", "3D"] as const).map(
                                                (view) => (
                                                    <button
                                                        key={view}
                                                        aria-pressed={
                                                            view ===
                                                            settings.view
                                                        }
                                                        onClick={() =>
                                                            update({ view })
                                                        }
                                                    >
                                                        {view} ·{" "}
                                                        {view === "2D"
                                                            ? "See it all"
                                                            : "Ride along"}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </fieldset>
                                </div>
                                <div
                                    className={`sg-preview ${settings.theme === "Neon" ? "sg-preview-dark" : ""}`}
                                    style={{
                                        background:
                                            palettes[settings.theme].ground,
                                        color:
                                            settings.theme === "Neon"
                                                ? "#fff2fa"
                                                : undefined,
                                    }}
                                >
                                    <span className="sg-eyebrow">
                                        YOUR ONE-OF-A-KIND LITTLE FRIEND
                                    </span>
                                    <SnakeArt
                                        color={settings.color}
                                        suit={settings.suit}
                                        reduced={settings.reduced}
                                    />
                                    <h2>{settings.suit}</h2>
                                    <p>
                                        {suitStyles[settings.suit].description}
                                    </p>
                                    <button
                                        className="sg-primary"
                                        onClick={() => start()}
                                    >
                                        Start adventure →
                                    </button>
                                    <small>
                                        Starts in Stop mode · Tap to move after
                                        countdown
                                    </small>
                                </div>
                            </div>
                        </section>
                    )}
                    {page === "over" && match && (
                        <section className="sg-results">
                            <span className="sg-eyebrow">
                                {match.practice
                                    ? "PRACTICE MAKES A WANDERER"
                                    : "EVERY END IS A NEW BEGINNING"}
                            </span>
                            <h1>That was a lovely run.</h1>
                            <p>
                                There’s always another little adventure around
                                the bend.
                            </p>
                            <div className="sg-result-score">
                                <small>YOUR SCORE</small>
                                <b>{match.score}</b>
                            </div>
                            <div className="sg-result-stats">
                                <div>
                                    <strong>
                                        {settings.best[settings.theme]}
                                    </strong>
                                    <span>{settings.theme} best</span>
                                </div>
                                <div>
                                    <strong>{match.player.body.length}</strong>
                                    <span>Final length</span>
                                </div>
                                <div>
                                    <strong>{timeLabel(match.time)}</strong>
                                    <span>Time exploring</span>
                                </div>
                            </div>
                            <button
                                className="sg-primary"
                                onClick={() => start(match.practice)}
                            >
                                One more adventure ↗
                            </button>
                            <button onClick={home}>Back home</button>
                        </section>
                    )}
                </div>
            )}
            {modal && (
                <div className="sg-overlay">
                    <section
                        className="sg-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label={
                            modal === "settings" ? "Settings" : "Welcome"
                        }
                    >
                        <span className="sg-eyebrow">
                            {modal === "settings"
                                ? "JUST THE WAY YOU LIKE IT"
                                : "HELLO, LITTLE WANDERER"}
                        </span>
                        <h2>
                            {modal === "settings"
                                ? "Your comfort zone."
                                : "A small start to a big adventure."}
                        </h2>
                        {modal === "settings" ? (
                            <>
                                <label>
                                    Music{" "}
                                    <input
                                        aria-label="Music volume"
                                        type="range"
                                        min="0"
                                        max="1"
                                        step=".05"
                                        value={settings.music}
                                        onChange={(e) =>
                                            update({
                                                music: Number(e.target.value),
                                            })
                                        }
                                    />
                                </label>
                                <label>
                                    Sound effects{" "}
                                    <input
                                        aria-label="Sound effects volume"
                                        type="range"
                                        min="0"
                                        max="1"
                                        step=".05"
                                        value={settings.sound}
                                        onChange={(e) =>
                                            update({
                                                sound: Number(e.target.value),
                                            })
                                        }
                                    />
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={settings.reduced}
                                        onChange={(e) =>
                                            update({
                                                reduced: e.target.checked,
                                            })
                                        }
                                    />{" "}
                                    Reduce animation and protection flicker
                                </label>
                                <button
                                    className="sg-primary"
                                    autoFocus
                                    onClick={() => setModal(null)}
                                >
                                    All set ✓
                                </button>
                            </>
                        ) : (
                            <>
                                <p>
                                    Learn to steer, collect little treats, and
                                    see the world from a new angle in a quick,
                                    hands-on practice.
                                </p>
                                <button
                                    className="sg-primary"
                                    autoFocus
                                    onClick={() => start(true)}
                                >
                                    Show me around →
                                </button>
                                <button
                                    onClick={() => {
                                        update({ tutorial: true })
                                        setModal(null)
                                    }}
                                >
                                    Skip for now
                                </button>
                            </>
                        )}
                    </section>
                </div>
            )}
        </main>
    )
}
