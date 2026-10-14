import "@babylonjs/core/Culling/ray"
import { Engine } from "@babylonjs/core/Engines/engine"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color"
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder"
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial"
import { TransformNode } from "@babylonjs/core/Meshes/transformNode"
import { Mesh } from "@babylonjs/core/Meshes/mesh"
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator"
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent"
import { Match, palettes } from "./model"
import type { Settings, Point, Snake, Pickup } from "./model"

export class GameScene {
    engine: Engine
    scene: Scene
    camera: FreeCamera
    ground: Mesh
    settings: Settings
    match: Match
    orbit = 0
    zoom = 1
    tilt = 0
    nodes = new Map<string, TransformNode>()
    materials = new Map<string, StandardMaterial>()
    shadow: ShadowGenerator
    target: Mesh
    locator: Mesh
    resize: ResizeObserver
    constructor(canvas: HTMLCanvasElement, match: Match, settings: Settings) {
        this.settings = settings
        this.match = match
        this.engine = new Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
        })
        this.engine.setHardwareScalingLevel(
            Math.max(1, window.devicePixelRatio / 1.6)
        )
        this.scene = new Scene(this.engine)
        this.scene.clearColor = Color4.FromHexString("#f6f1e7ff")
        this.camera = new FreeCamera(
            "camera",
            new Vector3(0, 120, -0.01),
            this.scene
        )
        this.camera.minZ = 0.15
        this.camera.maxZ = 600
        this.camera.fov = 1.05
        const ambient = new HemisphericLight(
            "sky",
            new Vector3(0, 1, 0),
            this.scene
        )
        ambient.intensity = 0.55
        const sun = new DirectionalLight(
            "sun",
            new Vector3(-0.5, -1, 0.3),
            this.scene
        )
        sun.position = new Vector3(30, 65, -25)
        sun.intensity = 0.45
        this.shadow = new ShadowGenerator(1024, sun)
        this.shadow.useBlurExponentialShadowMap = true
        this.shadow.blurKernel = 12
        this.ground = MeshBuilder.CreateGround(
            "ground",
            { width: 150, height: 150 },
            this.scene
        )
        this.ground.material = this.material(palettes[settings.theme].ground)
        this.ground.receiveShadows = true
        const edge = palettes[settings.theme].edge
        for (let i = 0; i < 4; i++) {
            const wall = MeshBuilder.CreateBox(
                "boundary",
                {
                    width: i < 2 ? 151 : 0.6,
                    height: 0.8,
                    depth: i < 2 ? 0.6 : 151,
                },
                this.scene
            )
            wall.position = new Vector3(
                i > 1 ? (i === 2 ? -75 : 75) : 0,
                0.15,
                i < 2 ? (i === 0 ? -75 : 75) : 0
            )
            wall.material = this.material(edge)
        }
        // Subtle tiled arena and decoration outside its playable boundary.
        for (let i = -70; i <= 70; i += 10) {
            for (const axis of [0, 1]) {
                const line = MeshBuilder.CreateLines(
                    "grid",
                    {
                        points: axis
                            ? [
                                  new Vector3(-75, 0.012, i),
                                  new Vector3(75, 0.012, i),
                              ]
                            : [
                                  new Vector3(i, 0.012, -75),
                                  new Vector3(i, 0.012, 75),
                              ],
                    },
                    this.scene
                )
                line.color = Color3.FromHexString(edge)
                line.alpha = 0.16
                line.isPickable = false
            }
        }
        for (let i = 0; i < 48; i++) {
            const angle = (i / 48) * Math.PI * 2,
                p = new TransformNode("scenery", this.scene)
            p.position = new Vector3(
                Math.sin(angle) * 105,
                0,
                Math.cos(angle) * 105
            )
            if (settings.theme === "Neon")
                this.part(p, "box", [2, 3 + (i % 5), 2], [0, 2, 0], "#867bca")
            else if (settings.theme === "Sea") {
                this.part(p, "sphere", [3, 1, 2], [0, 0.3, 0], "#eee2bd")
                this.part(p, "sphere", [1, 3, 1], [1, 1, 0], "#eb9e98")
            } else {
                this.part(p, "box", [0.7, 3, 0.7], [0, 1.5, 0], "#9b785a")
                this.part(
                    p,
                    "sphere",
                    [5, 5, 5],
                    [0, 4, 0],
                    settings.theme === "Forest" ? "#497e64" : "#a6c177"
                )
            }
        }
        this.target = MeshBuilder.CreateTorus(
            "destination",
            { diameter: 1.8, thickness: 0.12, tessellation: 24 },
            this.scene
        )
        this.target.material = this.material("#ffffff", true)
        this.target.isPickable = false
        this.locator = MeshBuilder.CreateTorus(
            "player locator",
            { diameter: 3.6, thickness: 0.18, tessellation: 24 },
            this.scene
        )
        this.locator.material = this.material("#294c44")
        this.locator.isPickable = false
        this.resize = new ResizeObserver(() => this.engine.resize())
        this.resize.observe(canvas)
        this.draw(1)
    }
    material(color: string, glow = false) {
        const key = color + glow
        if (!this.materials.has(key)) {
            const m = new StandardMaterial(key, this.scene)
            m.diffuseColor = Color3.FromHexString(color)
            m.specularColor = new Color3(0.025, 0.025, 0.025)
            if (glow) m.emissiveColor = Color3.FromHexString(color).scale(0.35)
            this.materials.set(key, m)
        }
        return this.materials.get(key)!
    }
    part(
        parent: TransformNode,
        shape: "sphere" | "box",
        scale: number[],
        pos: number[],
        color: string,
        glow = false
    ) {
        const m =
            shape === "sphere"
                ? MeshBuilder.CreateSphere(
                      "part",
                      { diameter: 1, segments: 10 },
                      this.scene
                  )
                : MeshBuilder.CreateBox("part", { size: 1 }, this.scene)
        m.parent = parent
        m.scaling = new Vector3(...scale)
        m.position = new Vector3(...pos)
        m.material = this.material(color, glow)
        m.isPickable = false
        this.shadow.addShadowCaster(m)
        return m
    }
    snakePart(s: Snake, i: number) {
        const player = s === this.match.player,
            lives = player ? this.match.lives : 2
        const key = `s${s.id}-${i}-${lives}-${player ? this.settings.suit : "robot"}`
        let n = this.nodes.get(key)
        if (!n) {
            n = new TransformNode(key, this.scene)
            this.nodes.set(key, n)
            const color = lives === 1 ? "#fff6dc" : s.color
            this.part(
                n,
                player ? "sphere" : "box",
                [1, lives === 1 ? 0.48 : 0.85, 1],
                [0, 0.55, 0],
                color
            )
            if (i === 0) {
                for (const x of [-0.28, 0.28]) {
                    this.part(
                        n,
                        "sphere",
                        [0.32, 0.34, 0.28],
                        [x, 0.85, 0.35],
                        "#ffffff"
                    )
                    this.part(
                        n,
                        "sphere",
                        [0.14, 0.18, 0.1],
                        [x, 0.88, 0.49],
                        "#243f43"
                    )
                }
                if (!player)
                    this.part(
                        n,
                        "box",
                        [0.13, 0.65, 0.13],
                        [0, 1.1, 0],
                        "#f5d273",
                        true
                    )
            } else if (lives === 1) {
                this.part(n, "box", [1, 0.14, 0.18], [0, 0.68, 0], "#fffdfa")
                this.part(n, "box", [0.16, 0.16, 0.8], [0, 0.7, 0], "#fffdfa")
            }
            if (player && lives === 3) {
                switch (this.settings.suit) {
                    case "Bubble Diver": {
                        const b = this.part(
                            n,
                            "sphere",
                            [1.16, 1.12, 1.16],
                            [0, 0.6, 0],
                            "#b1e9eb"
                        )
                        const mat = this.material("#b1e9eb")
                        mat.alpha = 0.28
                        b.material = mat
                        this.part(
                            n,
                            "box",
                            [1.3, 0.1, 0.35],
                            [0, 0.45, 0],
                            "#68b5c7"
                        )
                        break
                    }
                    case "Petal Parade":
                        for (let p = 0; p < 5; p++)
                            this.part(
                                n,
                                "sphere",
                                [0.34, 0.13, 0.52],
                                [
                                    Math.sin(p * 1.26) * 0.27,
                                    1,
                                    Math.cos(p * 1.26) * 0.27,
                                ],
                                "#ffdbd1"
                            )
                        this.part(
                            n,
                            "sphere",
                            [0.23, 0.2, 0.23],
                            [0, 1.05, 0],
                            "#f2c45d"
                        )
                        break
                    case "Woodland Sprite":
                        this.part(
                            n,
                            "sphere",
                            [0.65, 0.18, 0.4],
                            [0, 1, 0],
                            "#6a994d"
                        )
                        if (i % 3 === 0) {
                            this.part(
                                n,
                                "box",
                                [0.13, 0.3, 0.13],
                                [0, 1.1, 0],
                                "#fff0d4"
                            )
                            this.part(
                                n,
                                "sphere",
                                [0.5, 0.2, 0.5],
                                [0, 1.3, 0],
                                "#e69179"
                            )
                        }
                        break
                    case "Neon Circuit":
                        this.part(
                            n,
                            "box",
                            [0.65, 0.08, 0.45],
                            [0, 1, 0],
                            "#a4ffdb",
                            true
                        )
                        break
                    case "Candy Ribbon":
                        this.part(
                            n,
                            "sphere",
                            [1.04, 0.87, 0.28],
                            [0, 0.56, 0],
                            i % 2 ? "#b9b0ea" : "#fff0d4"
                        )
                        break
                    case "Cloud Puff":
                        for (const x of [-0.3, 0, 0.3])
                            this.part(
                                n,
                                "sphere",
                                [0.5, 0.4, 0.5],
                                [x, 1, 0],
                                "#fffaf1"
                            )
                        break
                }
            }
        }
        n.position = new Vector3(s.body[i].x, 0, s.body[i].z)
        n.rotation.y =
            i === 0
                ? s.heading
                : Math.atan2(
                      s.body[i - 1].x - s.body[i].x,
                      s.body[i - 1].z - s.body[i].z
                  )
        n.setEnabled(
            !player ||
                !this.match.protected ||
                this.settings.reduced ||
                Math.floor(this.match.time * 9) % 2 === 0
        )
        return key
    }
    item(item: Pickup) {
        const key = `i${item.id}`
        let n = this.nodes.get(key)
        if (!n) {
            n = new TransformNode(key, this.scene)
            this.nodes.set(key, n)
            if (item.kind === "food") {
                const colors =
                    this.settings.theme === "Sea"
                        ? ["#ffd398", "#ff9b8b", "#bd9ee0"]
                        : this.settings.theme === "Neon"
                          ? ["#99f5df", "#eda8e2", "#ffe18a"]
                          : ["#f4a444", "#ec776c", "#a98bd0"]
                if (item.shape === 2)
                    for (let j = 0; j < 5; j++)
                        this.part(
                            n,
                            "sphere",
                            [0.42, 0.42, 0.42],
                            [
                                Math.sin(j * 2) * 0.23,
                                0.5 + (j % 2) * 0.25,
                                Math.cos(j * 2) * 0.23,
                            ],
                            colors[2]
                        )
                else {
                    this.part(
                        n,
                        this.settings.theme === "Neon" ? "box" : "sphere",
                        [0.85, 0.85, 0.85],
                        [0, 0.55, 0],
                        colors[item.shape]
                    )
                    this.part(
                        n,
                        "sphere",
                        [0.35, 0.12, 0.22],
                        [0.12, 1.03, 0],
                        "#558a56"
                    )
                }
            } else if (item.kind === "mark")
                this.part(
                    n,
                    "sphere",
                    [0.4, 0.3, 0.4],
                    [0, 0.3, 0],
                    item.color,
                    true
                )
            else if (item.kind === "heart") {
                this.part(
                    n,
                    "sphere",
                    [0.65, 0.7, 0.65],
                    [-0.22, 0.7, 0],
                    "#ee7f91"
                )
                this.part(
                    n,
                    "sphere",
                    [0.65, 0.7, 0.65],
                    [0.22, 0.7, 0],
                    "#ee7f91"
                )
                this.part(n, "sphere", [0.65, 0.7, 0.6], [0, 0.4, 0], "#ee7f91")
            } else if (item.kind === "shield") {
                this.part(
                    n,
                    "sphere",
                    [1.1, 1.25, 0.35],
                    [0, 0.7, 0],
                    "#70cdd8",
                    true
                )
                this.part(n, "box", [0.17, 0.65, 0.42], [0, 0.7, 0], "#ffffff")
            } else {
                for (const x of [-0.35, 0.35])
                    this.part(
                        n,
                        "box",
                        [0.3, 0.75, 0.35],
                        [x, 0.75, 0],
                        x < 0 ? "#ef8174" : "#79b9da"
                    )
                this.part(n, "box", [1, 0.3, 0.35], [0, 0.35, 0], "#f9e9c9")
            }
        }
        n.position = new Vector3(
            item.x,
            this.settings.reduced
                ? 0
                : Math.sin(this.match.time * 2 + item.id) * 0.08,
            item.z
        )
        return key
    }
    pick(x: number, y: number): Point | null {
        const rect = this.engine.getRenderingCanvas()!.getBoundingClientRect()
        const p = this.scene.pick(
            x - rect.left,
            y - rect.top,
            (m) => m === this.ground
        )
        return p?.pickedPoint
            ? { x: p.pickedPoint.x, z: p.pickedPoint.z }
            : null
    }
    draw(dt: number) {
        const m = this.match,
            alive = new Set<string>()
        for (const s of [m.player, ...m.robots])
            for (let i = 0; i < s.body.length; i++)
                alive.add(this.snakePart(s, i))
        for (const item of m.items) alive.add(this.item(item))
        for (const b of m.bombs) {
            const key = `b${b.id}`
            alive.add(key)
            let n = this.nodes.get(key)
            if (!n) {
                n = new TransformNode(key, this.scene)
                this.nodes.set(key, n)
                this.part(n, "sphere", [1.1, 1.1, 1.1], [0, 0.65, 0], "#3e4655")
                this.part(n, "box", [0.17, 0.4, 0.17], [0, 1.35, 0], "#d8bb86")
                this.part(
                    n,
                    "sphere",
                    [0.25, 0.25, 0.25],
                    [0, 1.55, 0],
                    "#ffba5f",
                    true
                )
            }
            n.position = new Vector3(b.x, 0, b.z)
        }
        for (const e of m.explosions) {
            const key = `e${e.id}`
            alive.add(key)
            let n = this.nodes.get(key)
            if (!n) {
                n = new TransformNode(key, this.scene)
                this.nodes.set(key, n)
                this.part(n, "sphere", [1, 1, 1], [0, 0.5, 0], "#ffc27a", true)
            }
            n.position = new Vector3(e.x, 0, e.z)
            n.scaling.setAll(
                this.settings.reduced ? 1.5 : (1 - (e.until - m.time) / 0.6) * 3
            )
        }
        for (const [key, node] of this.nodes)
            if (!alive.has(key)) {
                node.dispose()
                this.nodes.delete(key)
            }
        this.target.setEnabled(!!m.target)
        if (m.target)
            this.target.position = new Vector3(m.target.x, 0.09, m.target.z)
        const h = m.player.body[0]
        this.locator.setEnabled(
            this.settings.view === "2D" ||
                (m.protected && this.settings.reduced)
        )
        this.locator.position.set(h.x, 0.06, h.z)
        if (this.settings.view === "2D") {
            this.camera.mode = FreeCamera.ORTHOGRAPHIC_CAMERA
            const aspect =
                    this.engine.getRenderWidth() /
                    this.engine.getRenderHeight(),
                half = 80
            this.camera.orthoLeft = -half * Math.max(1, aspect)
            this.camera.orthoRight = half * Math.max(1, aspect)
            this.camera.orthoTop = half * Math.max(1, 1 / aspect)
            this.camera.orthoBottom = -half * Math.max(1, 1 / aspect)
            this.camera.position.set(0, 160, -0.001)
            this.camera.setTarget(Vector3.Zero())
        } else {
            this.camera.mode = FreeCamera.PERSPECTIVE_CAMERA
            const riding = this.settings.camera === "Riding",
                angle = m.player.heading + this.orbit
            const back = (riding ? 2.5 : 10) * this.zoom,
                height = Math.max(
                    1.7,
                    (riding ? 2.8 : 9) * this.zoom + this.tilt
                )
            const position = new Vector3(
                h.x - Math.sin(angle) * back,
                height,
                h.z - Math.cos(angle) * back
            )
            this.camera.position = Vector3.Lerp(
                this.camera.position,
                position,
                this.settings.reduced ? 1 : Math.min(1, dt * 8)
            )
            this.camera.setTarget(
                new Vector3(
                    h.x + Math.sin(m.player.heading) * (riding ? 6 : 2),
                    0.5,
                    h.z + Math.cos(m.player.heading) * (riding ? 6 : 2)
                )
            )
        }
        this.scene.render()
    }
    reset() {
        this.orbit = 0
        this.zoom = 1
        this.tilt = 0
    }
    dispose() {
        this.resize.disconnect()
        this.scene.dispose()
        this.engine.dispose()
    }
}


