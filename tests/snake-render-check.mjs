import assert from "node:assert/strict"
import { createServer } from "vite"
import { NullEngine } from "@babylonjs/core/Engines/nullEngine.js"
import { Scene } from "@babylonjs/core/scene.js"
import { TransformNode } from "@babylonjs/core/Meshes/transformNode.js"
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera.js"
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js"
const server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
})
try {
    const { GameScene } = await server.ssrLoadModule(
        "/src/pages/snake-game/scene.ts"
    )
    const { Match } = await server.ssrLoadModule(
        "/src/pages/snake-game/model.ts"
    )
    const { CameraFollow } = await server.ssrLoadModule(
        "/src/pages/snake-game/camera-follow.ts"
    )
    const m = new Match("#fff")
    m.countdown = 0
    m.robots = []
    m.obstacles = []
    m.bombs = []
    m.items = []
    m.player.body = Array.from({ length: 200 }, (_, i) => ({
        x: 0,
        z: -i * 0.1,
    }))
    const g = Object.create(GameScene.prototype)
    g.engine = new NullEngine()
    g.scene = new Scene(g.engine)
    g.camera = new FreeCamera("camera", new Vector3(0, 10, 0), g.scene)
    g.settings = {
        theme: "Garden",
        view: "2D",
        suit: "Petal Parade",
        reduced: false,
    }
    g.match = m
    g.nodes = new Map()
    g.materials = new Map()
    g.templates = new Map()
    g.shadow = { addShadowCaster() {}, removeShadowCaster() {} }
    g.follow = new CameraFollow()
    g.scenery = new TransformNode("scenery", g.scene)
    g.target = new TransformNode("target", g.scene)
    g.locator = new TransformNode("locator", g.scene)
    g.orbit = 0
    g.tilt = 0
    g.zoom = 2.5
    let renderCount = 0
    g.scene.render = () => {
        renderCount++
    }
    for (let i = 0; i < 120; i++) g.draw(1 / 60)
    assert.equal(renderCount, 0)
    assert.equal(g.nodes.size, 0)
    assert.equal(g.scene.meshes.length, 0)
    g.engine.getRenderingCanvas = () => ({
        getBoundingClientRect: () => ({
            left: 10,
            top: 20,
            width: 800,
            height: 600,
        }),
    })
    assert.deepEqual(g.pick(410, 320), { x: 0, z: 0 })
    assert.equal(g.pick(10, 20), null)
    g.settings.view = "3D"
    g.draw(1 / 60)
    assert.equal(renderCount, 1)
    assert.equal(g.nodes.size, 200)
    const geometries = new Set(
        [...g.nodes.values()].flatMap((n) =>
            n
                .getChildMeshes()
                .filter((m) => m.name === "part")
                .map((m) => m.geometry)
        )
    )
    assert.ok(geometries.size <= 2)
    const meshCount = g.scene.meshes.length
    for (let i = 0; i < 4; i++) {
        g.settings.view = "2D"
        g.draw(1 / 60)
        assert.equal(g.nodes.size, 0)
        g.settings.view = "3D"
        g.draw(1 / 60)
        assert.equal(g.scene.meshes.length, meshCount)
    }
    console.log(
        "PASS: 200-segment 2D bypass, projection, shared geometry, and repeated view switches"
    )
    g.scene.dispose()
    g.engine.dispose()
} finally {
    await server.close()
}
