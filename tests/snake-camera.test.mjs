import { test } from "node:test"
import assert from "node:assert/strict"
import { CameraFollow } from "../src/pages/snake-game/camera-follow.ts"
const input = {
    x: 0,
    z: 0,
    heading: 0,
    orbit: 0,
    zoom: 2.5,
    tilt: 0,
    riding: true,
    reduced: false,
}

test("a keyboard turn eases both camera and look direction without snapping", () => {
    const follow = new CameraFollow()
    const before = follow.update(input, 0)
    const after = follow.update({ ...input, heading: Math.PI / 2 }, 1 / 60)
    assert.ok(
        after.heading > 0 && after.heading <= (Math.PI * 0.8) / 60 + 1e-10
    )
    assert.ok(Math.abs(after.target.x - before.target.x) < 0.3)
    assert.ok(Math.abs(after.position.x - before.position.x) < 0.3)
    assert.ok(after.position.x < 0 && after.target.x > 0)
})
test("heading wrap uses the short path across minus/plus pi", () => {
    const follow = new CameraFollow()
    follow.update({ ...input, heading: Math.PI - 0.02 }, 0)
    const next = follow.update({ ...input, heading: -Math.PI + 0.02 }, 1 / 60)
    assert.ok(next.heading > Math.PI - 0.02)
    assert.ok(next.heading < Math.PI + 0.02)
})
test("turn convergence is consistent at 30, 60 and 144 fps", () => {
    const results = [30, 60, 144].map((fps) => {
        const follow = new CameraFollow()
        follow.update(input, 0)
        let pose
        for (let frame = 0; frame < fps * 2; frame++)
            pose = follow.update({ ...input, heading: Math.PI / 2 }, 1 / fps)
        assert.ok(Math.abs(pose.heading - Math.PI / 2) < 0.01)
        return pose.heading
    })
    assert.ok(Math.max(...results) - Math.min(...results) < 0.002)
})
test("rapid alternating inputs and long frame gaps cannot snap the camera", () => {
    const follow = new CameraFollow()
    let previous = follow.update(input, 0).heading
    for (let i = 0; i < 100; i++) {
        const pose = follow.update(
            { ...input, heading: i % 2 ? Math.PI / 2 : -Math.PI / 2 },
            i === 50 ? 5 : 1 / 60
        )
        const dt = i === 50 ? 1 / 15 : 1 / 60
        assert.ok(
            Math.abs(pose.heading - previous) <= Math.PI * 0.8 * dt + 1e-10
        )
        previous = pose.heading
    }
})
test("reduced motion holds heading but smoothly tracks position", () => {
    const follow = new CameraFollow()
    const first = follow.update(input, 0)
    const next = follow.update(
        { ...input, reduced: true, heading: Math.PI / 2, x: 2 },
        1 / 60
    )
    assert.equal(next.heading, 0)
    assert.ok(next.position.x > first.position.x && next.position.x < 2)
    const resumed = follow.update(
        { ...input, heading: Math.PI / 2, x: 2 },
        1 / 60
    )
    assert.ok(resumed.heading > 0 && resumed.heading < 0.05)
})
test("view entry initializes in place; camera presets ease while preserving height limits", () => {
    const follow = new CameraFollow()
    follow.update(input, 0)
    const changed = follow.update(
        { ...input, riding: false, zoom: 0.65, tilt: -1 },
        1 / 60
    )
    assert.ok(changed.position.y > 1.7 && changed.position.y < 7)
    follow.reset()
    const fresh = follow.update(
        { ...input, x: 20, z: -10, heading: Math.PI / 2 },
        1 / 60
    )
    assert.ok(Math.abs(fresh.position.x - 13.75) < 1e-10)
    assert.ok(Math.abs(fresh.position.z + 10) < 1e-10)
    assert.equal(fresh.position.y, 7)
})
