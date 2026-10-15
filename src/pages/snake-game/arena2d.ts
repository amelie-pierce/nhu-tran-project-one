import {
    ARENA_HALF,
    MAGNET_RADIUS,
    mapGeometry,
    ARENA_SIZE,
    palettes,
    suitStyles,
    EXPLOSION_DURATION,
} from "./model"
import type { Match, Point, Settings, Snake } from "./model"

// Match Babylon's whole-arena orthographic projection, including its margin.
export function arenaProjection(width: number, height: number) {
    const scale = Math.min(width, height) / (ARENA_SIZE + 10)
    return {
        scale,
        x: (width - ARENA_SIZE * scale) / 2,
        y: (height - ARENA_SIZE * scale) / 2,
    }
}

export function drawArena2D(
    canvas: HTMLCanvasElement,
    match: Match,
    settings: Settings
) {
    const width = canvas.clientWidth,
        height = canvas.clientHeight
    if (!width || !height) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    if (
        canvas.width !== Math.round(width * dpr) ||
        canvas.height !== Math.round(height * dpr)
    ) {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
    }
    const c = canvas.getContext("2d")
    if (!c) return
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    const { scale, x: left, y: top } = arenaProjection(width, height)
    const size = ARENA_SIZE * scale,
        dark = settings.theme === "Neon"
    const position = (p: Point) => ({
        x: left + (p.x + ARENA_HALF) * scale,
        y: top + (ARENA_HALF - p.z) * scale,
    })
    const circle = (
        x: number,
        y: number,
        r: number,
        fill: string,
        stroke?: string
    ) => {
        c.beginPath()
        c.arc(x, y, r, 0, Math.PI * 2)
        c.fillStyle = fill
        c.fill()
        if (stroke) {
            c.strokeStyle = stroke
            c.lineWidth = 1.5
            c.stroke()
        }
    }
    const icon = (
        p: Point,
        text: string,
        diameter: number,
        background?: string
    ) => {
        const { x, y } = position(p)
        if (background)
            circle(
                x,
                y,
                diameter * 0.56 - 0.75,
                background,
                dark ? "#fbd6ed" : "#7d5864"
            )
        c.font = `${diameter}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`
        c.textAlign = "center"
        c.textBaseline = "middle"
        c.fillStyle = "#493447"
        c.fillText(text, x, y + 1)
    }
    c.fillStyle = "#fff1ed"
    c.fillRect(0, 0, width, height)
    c.fillStyle = dark
        ? "#302945"
        : settings.theme === "Sea"
          ? "#b4e5e5"
          : settings.theme === "Forest"
            ? "#bfd5bd"
            : "#e0e9c9"
    c.fillRect(left, top, size, size)
    // Low-contrast grid supports orientation without competing with pickups.
    c.beginPath()
    for (let i = 10; i < ARENA_SIZE; i += 10) {
        c.moveTo(left + i * scale, top)
        c.lineTo(left + i * scale, top + size)
        c.moveTo(left, top + i * scale)
        c.lineTo(left + size, top + i * scale)
    }
    c.strokeStyle = dark ? "#ffffff10" : "#36574c12"
    c.lineWidth = 1
    c.stroke()
    c.strokeStyle = palettes[settings.theme].edge
    c.lineWidth = 3
    c.strokeRect(left, top, size, size)
    const { itemSize } = mapGeometry(scale)
    for (const o of match.obstacles) {
        const { x, y } = position(o)
        // Gray square badges distinguish solid scenery from colorful round food.
        circle(x, y, o.radius * scale, dark ? "#727386" : "#b0b9b4", "#5b6570")
        const badgeSize = Math.max(29, Math.min(42, scale * 5))
        c.beginPath()
        c.roundRect(
            x - badgeSize / 2,
            y - badgeSize / 2,
            badgeSize,
            badgeSize,
            4
        )
        c.fillStyle = dark ? "#6a6979" : "#c9cece"
        c.fill()
        c.strokeStyle = "#626671"
        c.lineWidth = 2
        c.stroke()
        c.save()
        c.filter = "grayscale(1)"
        c.globalAlpha = 0.72
        const symbols =
            settings.theme === "Sea"
                ? ["🪸", "🌿", "🐠"]
                : settings.theme === "Neon"
                  ? ["▥", "◎", "◆"]
                  : settings.theme === "Forest"
                    ? ["🌲", "🪵", "🍄"]
                    : ["🌸", "🪵", "🍄"]
        if (dark) {
            c.font = `bold ${Math.max(24, scale * 4)}px sans-serif`
            c.textAlign = "center"
            c.textBaseline = "middle"
            c.fillStyle = ["#ff88de", "#72f4ff", "#d6b5ff"][o.variant]
            c.fillText(symbols[o.variant], x, y)
        } else
            icon(o, symbols[o.variant], Math.max(25, Math.min(38, scale * 4.4)))
        c.restore()
        // Corner studs give every obstacle the same fixed, non-collectible treatment.
        for (const side of [-1, 1])
            circle(
                x + side * (badgeSize / 2 - 4),
                y - badgeSize / 2 + 4,
                1.5,
                "#5b6570"
            )
    }
    if (match.magnet > match.time) {
        const head = position(match.player.body[0])
        c.save()
        c.beginPath()
        c.rect(left, top, size, size)
        c.clip()
        circle(head.x, head.y, MAGNET_RADIUS * scale, "#d6a0f218", "#b575cd")
        for (const food of match.items) {
            const d = Math.hypot(
                food.x - match.player.body[0].x,
                food.z - match.player.body[0].z
            )
            if (food.kind !== "food" || d >= MAGNET_RADIUS) continue
            const p = position(food)
            circle(p.x, p.y, itemSize * 0.65, "#ffe4fb55", "#c17bdb")
            c.beginPath()
            c.moveTo(p.x, p.y)
            c.lineTo(head.x, head.y)
            c.strokeStyle = "#be7bc055"
            c.lineWidth = 1.5
            c.stroke()
            if (!settings.reduced) {
                for (let j = 0; j < 3; j++) {
                    const t = (match.time * 1.4 + food.id * 0.13 + j / 3) % 1
                    circle(
                        p.x + (head.x - p.x) * t,
                        p.y + (head.y - p.y) * t,
                        2.5 * (1 - t) + 1,
                        "#fff0b9"
                    )
                }
            }
        }
        c.restore()
    }
    for (const item of match.items) {
        if (item.kind === "food")
            icon(item, ["🍊", "🍎", "🍇"][item.shape], itemSize, "#fff1d6")
        else if (item.kind === "mark") {
            const { x, y } = position(item)
            circle(x, y, Math.max(3.5, scale * 0.8), item.color, "#ffffff")
        } else {
            const { x, y } = position(item)
            const color =
                item.kind === "heart"
                    ? "#e35c94"
                    : item.kind === "shield"
                      ? "#159bbd"
                      : "#a56ade"
            const pulse = settings.reduced
                ? 1
                : 1 + Math.sin(match.time * 3 + item.id) * 0.06
            c.save()
            c.shadowColor = color
            c.shadowBlur = 12 * pulse
            circle(
                x,
                y,
                mapGeometry(scale).powerRadius - 0.75,
                "#fffef2",
                color
            )
            c.shadowBlur = 0
            circle(x, y, itemSize * 0.6, "#fff9e9", "#ffe29a")
            icon(
                item,
                item.kind === "heart"
                    ? "❤️"
                    : item.kind === "shield"
                      ? "🛡"
                      : "🧲",
                itemSize + 3
            )
            c.fillStyle = color
            c.font = "bold 12px sans-serif"
            c.fillText("✦", x + itemSize * 0.7, y - itemSize * 0.65)
            c.restore()
        }
    }
    for (const bomb of match.bombs) icon(bomb, "💣", itemSize + 3, "#ffe1df")
    if (match.target) {
        const { x, y } = position(match.target)
        c.beginPath()
        c.arc(x, y, 7, 0, Math.PI * 2)
        c.strokeStyle = dark ? "#fff5da" : "#825067"
        c.lineWidth = 2
        c.stroke()
        c.beginPath()
        c.moveTo(x - 11, y)
        c.lineTo(x + 11, y)
        c.moveTo(x, y - 11)
        c.lineTo(x, y + 11)
        c.stroke()
    }
    const drawSnake = (s: Snake, player: boolean) => {
        const head = position(s.body[0]),
            bodyWidth = mapGeometry(scale).bodyWidth
        const suited = player && match.lives === 3,
            skeleton = player && match.lives === 1
        const color = skeleton
            ? "#fff7e6"
            : suited && settings.suit !== "Petal Parade"
              ? suitStyles[settings.suit].fabric
              : s.color
        const path = () => {
            c.beginPath()
            s.body.forEach((p, i) => {
                const q = position(p)
                if (i === 0) c.moveTo(q.x, q.y)
                else c.lineTo(q.x, q.y)
            })
        }
        c.lineCap = "round"
        c.lineJoin = "round"
        path()
        c.strokeStyle = player ? "#714351" : "#494459"
        c.lineWidth = bodyWidth + 3
        c.stroke()
        path()
        c.strokeStyle = color
        c.lineWidth = bodyWidth
        c.stroke()
        if (suited && settings.suit !== "Petal Parade") {
            path()
            c.strokeStyle = suitStyles[settings.suit].trim
            c.lineWidth = 2
            c.setLineDash([3, 3])
            c.stroke()
            c.setLineDash([])
        }
        // Space suit details in screen pixels so long snakes do not become noisy.
        let last = head
        for (let i = 1; i < s.body.length; i++) {
            const q = position(s.body[i])
            if (Math.hypot(q.x - last.x, q.y - last.y) < bodyWidth) continue
            last = q
            if (suited && settings.suit === "Petal Parade")
                icon(s.body[i], "🌸", bodyWidth)
            else if (skeleton) {
                c.fillStyle = "#aa998b"
                c.fillRect(q.x - 2, q.y - 2, 4, 4)
            }
        }
        // Face and antenna are drawn facing the actual heading.
        c.save()
        c.translate(head.x, head.y)
        c.rotate(s.heading)
        circle(
            0,
            0,
            bodyWidth * 0.65,
            skeleton ? "#fff7e6" : s.color,
            player ? "#714351" : "#494459"
        )
        for (const side of [-1, 1]) {
            circle(
                side * bodyWidth * 0.26,
                -bodyWidth * 0.24,
                bodyWidth * 0.22,
                "#fff"
            )
            circle(
                side * bodyWidth * 0.26,
                -bodyWidth * 0.3,
                bodyWidth * 0.1,
                "#352e43"
            )
        }
        if (!player) {
            c.beginPath()
            c.moveTo(0, -bodyWidth * 0.65)
            c.lineTo(0, -bodyWidth)
            c.strokeStyle = "#494459"
            c.lineWidth = 2
            c.stroke()
            circle(0, -bodyWidth, 3, "#ffe292", "#494459")
        }
        c.restore()
        if (player && match.protected) {
            c.beginPath()
            c.arc(head.x, head.y, bodyWidth, 0, Math.PI * 2)
            c.strokeStyle = "#fff"
            c.lineWidth = 3
            c.stroke()
        }
        const label = player ? "YOU" : "ROBOT",
            labelWidth = player ? 32 : 46
        const labelX = Math.max(
            left + labelWidth / 2 + 2,
            Math.min(left + size - labelWidth / 2 - 2, head.x)
        )
        const labelY =
            head.y < top + 36
                ? head.y + bodyWidth + 15
                : head.y - bodyWidth - 13
        c.fillStyle = player ? "#8b415b" : "#494459"
        c.beginPath()
        c.roundRect(labelX - labelWidth / 2, labelY - 8, labelWidth, 16, 5)
        c.fill()
        c.fillStyle = "#fff"
        c.font = "bold 9px sans-serif"
        c.textAlign = "center"
        c.textBaseline = "middle"
        c.fillText(label, labelX, labelY)
    }
    for (const robot of match.robots) drawSnake(robot, false)
    drawSnake(match.player, true)
    for (const e of match.explosions) {
        const { x, y } = position(e)
        const progress = Math.max(
            0,
            Math.min(1, 1 - (e.until - match.time) / EXPLOSION_DURATION)
        )
        const motion = settings.reduced ? 0.35 : progress
        c.save()
        c.globalAlpha = settings.reduced ? 0.85 : 1 - progress
        const radius = 12 + motion * Math.max(30, scale * 6)
        c.beginPath()
        c.arc(x, y, radius, 0, Math.PI * 2)
        c.strokeStyle = "#ff9057"
        c.lineWidth = 4 * (1 - motion) + 1
        c.stroke()
        // Warm starburst, sparks and drifting smoke stay local to the bomb.
        c.beginPath()
        for (let i = 0; i < 20; i++) {
            const angle = (i * Math.PI) / 10,
                r = (i % 2 ? 0.52 : 1) * (14 + motion * 17)
            const px = x + Math.sin(angle) * r,
                py = y + Math.cos(angle) * r
            if (i) c.lineTo(px, py)
            else c.moveTo(px, py)
        }
        c.closePath()
        c.fillStyle = "#ffe48f"
        c.fill()
        c.strokeStyle = "#ed8558"
        c.lineWidth = 2
        c.stroke()
        if (!settings.reduced) {
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4
                circle(
                    x + Math.sin(angle) * radius,
                    y + Math.cos(angle) * radius,
                    2.5,
                    i % 2 ? "#ffac4c" : "#e57868"
                )
            }
            c.globalAlpha = Math.sin(progress * Math.PI) * 0.35
            for (let i = 0; i < 3; i++)
                circle(
                    x + (i - 1) * motion * 22,
                    y - motion * 25,
                    5 + motion * 8,
                    "#857b91"
                )
        }
        c.globalAlpha = settings.reduced ? 1 : Math.min(1, (1 - progress) * 2)
        c.font = "bold 12px sans-serif"
        c.textAlign = "center"
        c.textBaseline = "middle"
        c.strokeStyle = "#fff6dc"
        c.lineWidth = 3
        c.strokeText("BOOM!", x, y)
        c.fillStyle = "#843c40"
        c.fillText("BOOM!", x, y)
        c.restore()
    }
}
