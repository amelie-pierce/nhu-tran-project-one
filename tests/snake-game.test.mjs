import { test } from "node:test"
import assert from "node:assert/strict"
import { Match, distance } from "../src/pages/snake-game/model.ts"

function empty() {
    const m = new Match("#ee927b")
    m.countdown = 0
    m.robots = []
    m.bombs = []
    m.items = []
    return m
}
function advance(m, seconds) {
    for (let i = 0; i < Math.ceil(seconds * 60); i++) m.step(1 / 60)
}
function item(m, kind, x = 0, z = 0) {
    const i = {
        id: Math.random(),
        kind,
        x,
        z,
        expires: 100,
        color: "#fff",
        shape: 0,
    }
    m.items.push(i)
    return i
}
test("initial populations and countdown never auto-start movement", () => {
    const m = new Match("#fff")
    assert.equal(m.robots.length, 2)
    assert.equal(m.bombs.length, 3)
    assert.equal(m.items.length, 40)
    m.aim({ x: 10, z: 10 })
    m.steer(1)
    advance(m, 3.1)
    assert.equal(m.player.moving, false)
    assert.deepEqual(m.player.body[0], { x: 0, z: 0 })
    assert.equal(m.lives, 3)
})
test("stop target is reached, cleared, and stays stopped", () => {
    const m = empty()
    m.aim({ x: 0, z: 5 })
    advance(m, 2)
    assert.equal(m.target, null)
    assert.equal(m.player.moving, false)
    assert.ok(Math.abs(m.player.body[0].z - 5) <= 0.5)
})
test("continue target clears; held steering release clears old target", () => {
    const m = empty()
    m.behavior = "Continue"
    m.aim({ x: 0, z: 2 })
    advance(m, 1)
    assert.equal(m.target, null)
    assert.ok(m.player.body[0].z > 5)
    m.aim({ x: 10, z: 10 })
    m.steer(-1)
    advance(m, 0.2)
    m.steer(0)
    assert.equal(m.target, null)
    assert.equal(m.player.moving, true)
})
test("relative left turns left while moving from rest, release stops without target", () => {
    const m = empty()
    m.steer(-1)
    advance(m, 0.25)
    assert.ok(m.player.heading < 0)
    assert.ok(m.player.body[0].x < 0)
    assert.ok(distance(m.player.body[0], { x: 0, z: 0 }) > 1)
    m.steer(0)
    assert.equal(m.player.moving, false)
})
test("pause freezes countdown and all match timers", () => {
    const m = empty()
    m.countdown = 2
    m.pause()
    advance(m, 5)
    assert.equal(m.countdown, 2)
    m.countdown = 0
    m.shield = 5
    advance(m, 10)
    assert.equal(m.time, 0)
    assert.equal(m.shield, 5)
})
test("stationary player still experiences world time and hazards", () => {
    const m = empty()
    m.bombs.push({ id: 500, x: 0, z: 0 })
    advance(m, 0.1)
    assert.equal(m.lives, 2)
    assert.equal(m.bombs.length, 0)
    assert.ok(m.time > 0)
    assert.equal(m.player.moving, false)
})
test("shield contact passes through without consuming bomb or killing robot", () => {
    const m = empty()
    m.shield = 5
    m.bombs.push({ id: 600, x: 0, z: 0 })
    advance(m, 0.1)
    assert.equal(m.bombs.length, 1)
    m.bombs = []
    const r = m.snake({ x: 0, z: 0.8 }, "#fff")
    r.heading = Math.PI
    r.wander = Math.PI
    m.robots.push(r)
    advance(m, 0.1)
    assert.equal(m.lives, 3)
    assert.equal(m.robots.length, 1)
})
test("robot moving into stationary player dies and leaves one mark per segment", () => {
    const m = empty()
    const r = m.snake({ x: 0, z: 1.02 }, "#fff")
    r.heading = Math.PI
    r.wander = Math.PI
    m.robots.push(r)
    m.step(1 / 60)
    assert.equal(m.lives, 3)
    assert.equal(m.robots.length, 0)
    assert.equal(m.items.filter((i) => i.kind === "mark").length, 3)
})
test("simultaneous head-on collision hurts player and kills robot once", () => {
    const m = empty()
    const r = m.snake({ x: 0, z: 1.1 }, "#fff")
    r.heading = Math.PI
    r.wander = Math.PI
    m.robots.push(r)
    m.behavior = "Continue"
    m.player.moving = true
    m.step(1 / 60)
    assert.equal(m.lives, 2)
    assert.equal(m.robots.length, 0)
    assert.equal(m.score, 0)
    assert.ok(m.protected)
})
test("damage retains length and score, third hit ends game", () => {
    const m = empty()
    m.grow(m.player)
    m.score = 100
    m.damage()
    assert.equal(m.player.body.length, 4)
    assert.equal(m.score, 100)
    m.damage()
    assert.equal(m.lives, 2)
    advance(m, 3.1)
    m.damage()
    assert.equal(m.lives, 1)
    advance(m, 3.1)
    m.damage()
    assert.equal(m.over, true)
})
test("food replacement and robot replacement use match time", () => {
    const m = empty()
    m.collect(m.player, item(m, "food"))
    assert.equal(m.score, 10)
    assert.equal(m.items.length, 0)
    advance(m, 2.9)
    assert.equal(m.items.length, 0)
    advance(m, 0.2)
    assert.equal(m.items.length, 1)
    const r = m.snake({ x: 50, z: 50 }, "#fff")
    m.robots.push(r)
    m.kill(r)
    advance(m, 4.9)
    assert.equal(m.robots.length, 0)
    advance(m, 0.2)
    assert.equal(m.robots.length, 1)
})
test("hearts at full health stay; overlapping effect timers refresh independently", () => {
    const m = empty()
    const h = item(m, "heart")
    m.collect(m.player, h)
    assert.ok(m.items.includes(h))
    m.damage()
    m.collect(m.player, h)
    assert.equal(m.lives, 3)
    assert.equal(m.score, 25)
    m.collect(m.player, item(m, "shield"))
    m.collect(m.player, item(m, "magnet"))
    advance(m, 2)
    m.collect(m.player, item(m, "shield"))
    assert.ok(m.shield > m.magnet)
    assert.equal(m.recovery, 3)
    assert.equal(m.score, 70)
})
test("growth warnings are queued; speed and hazard caps are independent", () => {
    const m = empty()
    for (let i = 0; i < 120; i++) m.grow(m.player)
    assert.equal(m.speed, 6)
    assert.equal(m.warnings.length, 12)
    advance(m, 3.01)
    assert.equal(m.speed, 6.6)
    assert.equal(m.applied, 1)
    assert.equal(m.bombs.length, 1)
    m.robots = []
    m.bombs = []
    m.pending = []
    for (let i = 0; i < 11; i++) {
        m.time = m.warnings[0]
        m.step(1 / 60)
        m.robots = []
        m.bombs = []
    }
    assert.equal(m.speed, 12)
    assert.equal(m.applied, 12)
})
test("magnet affects only food within three units", () => {
    const m = empty()
    m.magnet = 5
    const near = item(m, "food", 2.9, 0),
        far = item(m, "food", 3.2, 0),
        mark = item(m, "mark", 2.5, 0)
    m.step(1 / 60)
    assert.ok(near.x < 2.9)
    assert.equal(far.x, 3.2)
    assert.equal(mark.x, 2.5)
})
test("boundary stops safely and steering away resumes movement", () => {
    const m = empty()
    m.player.body = [{ x: 0, z: 74.49 }]
    m.player.moving = true
    m.step(1 / 60)
    assert.equal(m.player.moving, false)
    assert.equal(m.lives, 3)
    m.steer(1)
    advance(m, 1.2)
    assert.ok(m.player.body[0].z < 74)
    assert.equal(m.lives, 3)
})
test("marks and power-ups expire on match time", () => {
    const m = empty()
    item(m, "mark", 20, 20).expires = 0.1
    item(m, "shield", 30, 30).expires = 0.1
    advance(m, 0.2)
    assert.equal(m.items.length, 0)
    advance(m, 15)
    assert.equal(m.items.length, 1)
})
test("milestones add only six robots and nine bombs at their exact thresholds", () => {
    const m = empty(),
        counts = { robot: 2, bomb: 3 }
    m.spawn = (kind) => {
        if (kind in counts) counts[kind]++
    }
    for (let level = 1; level <= 12; level++) {
        for (let j = 0; j < 10; j++) m.grow(m.player)
        assert.equal(m.player.body.length, 3 + level * 10)
        m.time = m.warnings[0]
        m.step(1 / 60)
        assert.equal(counts.robot, Math.min(8, 2 + level))
        assert.equal(counts.bomb, Math.min(12, 3 + level))
        assert.equal(m.speed, Math.min(12, 6 + level * 0.6))
    }
})
test("player initiating contact loses life without killing robot", () => {
    const m = empty()
    m.player.body = [{ x: 0, z: 0 }]
    m.player.moving = true
    const r = m.snake({ x: 0, z: 1.01 }, "#fff")
    r.body = [{ x: 0, z: 1.01 }]
    m.robots.push(r)
    m.step(1 / 60)
    assert.equal(m.lives, 2)
    assert.equal(m.robots.length, 1)
})
test("protected continuous contact cannot retrigger until separation", () => {
    const m = empty()
    m.shield = 0.05
    m.bombs.push({ id: 2, x: 0, z: 0 })
    advance(m, 0.2)
    assert.equal(m.lives, 3)
    assert.equal(m.bombs.length, 1)
    m.player.body = [{ x: 20, z: 20 }]
    m.step(1 / 60)
    m.player.body = [{ x: 0, z: 0 }]
    m.step(1 / 60)
    assert.equal(m.lives, 2)
    assert.equal(m.bombs.length, 0)
})
test("robots can collect marks but cannot collect power-ups", () => {
    const m = empty(),
        r = m.snake({ x: 20, z: 20 }, "#fff")
    const h = item(m, "heart", 20, 20)
    m.collect(r, h)
    assert.ok(m.items.includes(h))
    m.collect(r, item(m, "mark", 20, 20))
    assert.equal(r.body.length, 4)
    assert.equal(m.score, 0)
})
test("a target reached during held steering is not reused on release", () => {
    const m = empty()
    m.aim({ x: 0, z: 0 })
    m.steer(1)
    m.step(1 / 60)
    m.steer(0)
    assert.equal(m.target, null)
    assert.equal(m.player.moving, false)
})

test("close side and rear targets are approached without endless circling", () => {
    for (const p of [
        { x: 1, z: 0 },
        { x: -1, z: 0 },
        { x: 0, z: -1 },
    ]) {
        const m = empty()
        m.aim(p)
        advance(m, 20)
        assert.equal(m.target, null)
        assert.ok(distance(m.player.body[0], p) <= 0.5)
    }
})
