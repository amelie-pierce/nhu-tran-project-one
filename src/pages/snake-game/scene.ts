import { CameraFollow } from "./camera-follow"
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
import {
    Match,
    palettes,
    suitStyles,
    ARENA_SIZE,
    ARENA_HALF,
    EXPLOSION_DURATION,
    CAMERA_ZOOM_MAX,
} from "./model"
import type { Settings, Point, Snake, Pickup, Obstacle } from "./model"

export class GameScene {
    engine: Engine
    scene: Scene
    camera: FreeCamera
    ground: Mesh
    settings: Settings
    match: Match
    orbit = 0
    zoom = CAMERA_ZOOM_MAX
    private follow = new CameraFollow()
    tilt = 0
    nodes = new Map<string, TransformNode>()
    materials = new Map<string, StandardMaterial>()
    shadow: ShadowGenerator
    target: Mesh
    locator: Mesh
    scenery: TransformNode
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
        this.scene.clearColor = Color4.FromHexString("#fff1edff")
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
            { width: ARENA_SIZE, height: ARENA_SIZE },
            this.scene
        )
        this.ground.material = this.material(palettes[settings.theme].ground)
        this.ground.receiveShadows = true
        const edge = palettes[settings.theme].edge
        for (let i = 0; i < 4; i++) {
            const wall = MeshBuilder.CreateBox(
                "boundary",
                {
                    width: i < 2 ? ARENA_SIZE + 1 : 0.6,
                    height: 0.8,
                    depth: i < 2 ? 0.6 : ARENA_SIZE + 1,
                },
                this.scene
            )
            wall.position = new Vector3(
                i > 1 ? (i === 2 ? -ARENA_HALF : ARENA_HALF) : 0,
                0.15,
                i < 2 ? (i === 0 ? -ARENA_HALF : ARENA_HALF) : 0
            )
            wall.material = this.material(edge)
        }
        // Subtle grid inside the playable boundary; scenery is visible only in 3D.
        for (let i = -ARENA_HALF + 10; i < ARENA_HALF; i += 10) {
            for (const axis of [0, 1]) {
                const line = MeshBuilder.CreateLines(
                    "grid",
                    {
                        points: axis
                            ? [
                                  new Vector3(-ARENA_HALF, 0.012, i),
                                  new Vector3(ARENA_HALF, 0.012, i),
                              ]
                            : [
                                  new Vector3(i, 0.012, -ARENA_HALF),
                                  new Vector3(i, 0.012, ARENA_HALF),
                              ],
                    },
                    this.scene
                )
                line.color = Color3.FromHexString(edge)
                line.alpha = 0.16
                line.isPickable = false
            }
        }
        this.scenery = new TransformNode("outside scenery", this.scene)
        for (let i = 0; i < 48; i++) {
            const angle = (i / 48) * Math.PI * 2,
                p = new TransformNode("scenery", this.scene)
            p.parent = this.scenery
            p.position = new Vector3(
                Math.sin(angle) * (ARENA_HALF * Math.SQRT2 + 8),
                0,
                Math.cos(angle) * (ARENA_HALF * Math.SQRT2 + 8)
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
        for (const obstacle of match.obstacles) this.buildObstacle(obstacle)
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
    buildObstacle(o: Obstacle) {
        const n = new TransformNode("themed obstacle", this.scene)
        n.position.set(o.x, 0, o.z)
        n.rotation.y = o.angle
        const theme = this.settings.theme
        const neon = theme === "Neon"
        // The low plinth marks the solid footprint clearly from either camera.
        const base = MeshBuilder.CreateCylinder(
            "obstacle footprint",
            {
                diameter: o.radius * 2,
                height: 0.24,
                tessellation: 32,
            },
            this.scene
        )
        base.parent = n
        base.position.y = 0.12
        base.material = this.material(
            neon ? "#ee61ed" : theme === "Sea" ? "#eee0b8" : "#aa9276",
            neon
        )
        base.isPickable = false
        this.shadow.addShadowCaster(base)
        const part = (
            shape: "sphere" | "box",
            scale: number[],
            pos: number[],
            color: string,
            glow = false
        ) => this.part(n, shape, scale, pos, color, glow)
        if (theme === "Sea") {
            if (o.variant === 0) {
                for (const x of [-1, 0, 1]) {
                    part(
                        "sphere",
                        [0.45, 2.5 - Math.abs(x) * 0.5, 0.5],
                        [x, 1.3, 0],
                        "#f49cb5"
                    )
                    const branch = part(
                        "sphere",
                        [1.1, 0.35, 0.4],
                        [x + 0.25, 1.6, 0],
                        "#ffbba5"
                    )
                    branch.rotation.z = 0.6
                }
            } else if (o.variant === 1) {
                for (const x of [-0.9, 0, 0.9]) {
                    const leaf = part(
                        "sphere",
                        [0.5, 3.2, 0.5],
                        [x, 1.6, 0],
                        x === 0 ? "#54b6ac" : "#7dc69f"
                    )
                    leaf.rotation.z = x * 0.3
                }
                part("sphere", [1.8, 0.5, 1.5], [0, 0.3, 0], "#cdbfab")
            } else {
                // A fish sculpture on a reef: decorative detail on a solid obstacle.
                part("sphere", [2.3, 1.15, 0.85], [0, 1.1, 0], "#ffbd79")
                const tail = part(
                    "box",
                    [0.8, 0.8, 0.25],
                    [-1.25, 1.1, 0],
                    "#ed8caa"
                )
                tail.rotation.z = Math.PI / 4
                part("sphere", [0.18, 0.18, 0.12], [0.75, 1.25, 0.4], "#463e59")
                part("sphere", [1.4, 0.7, 1.2], [0, 0.35, 0], "#c5b4d9")
            }
        } else if (theme === "Forest" || theme === "Garden") {
            if (o.variant === 0) {
                part("sphere", [0.8, 2.8, 0.8], [0, 1.5, 0], "#a77a67")
                part(
                    "sphere",
                    [3.7, 2.7, 3.7],
                    [0, 3.4, 0],
                    theme === "Garden" ? "#efacc3" : "#679d7c"
                )
                part(
                    "sphere",
                    [2.7, 2, 2.7],
                    [0.2, 4.4, 0],
                    theme === "Garden" ? "#ffd1d9" : "#92ba89"
                )
            } else if (o.variant === 1) {
                part("sphere", [3.7, 1.3, 1.4], [0, 0.8, 0], "#aa7b62")
                part("sphere", [0.15, 1.05, 1.15], [1.75, 0.8, 0], "#ecd1a1")
                part("sphere", [1.9, 0.25, 1], [-0.3, 1.45, 0], "#97b681")
            } else {
                for (const x of [-0.9, 0.9]) {
                    part("sphere", [0.4, 1.4, 0.4], [x, 0.8, 0], "#fff1d9")
                    part(
                        "sphere",
                        [1.7, 0.65, 1.7],
                        [x, 1.6, 0],
                        theme === "Garden" ? "#dca4cd" : "#ed9b91"
                    )
                    part(
                        "sphere",
                        [0.3, 0.12, 0.3],
                        [x + 0.2, 1.92, 0.2],
                        "#fff5e6"
                    )
                }
            }
        } else {
            const colors = ["#ff58d5", "#55ecff", "#bca0ff"]
            const color = colors[o.variant]
            if (o.variant === 0) {
                part("box", [2, 3.2, 2], [0, 1.8, 0], "#57436d")
                for (const x of [-1.03, 1.03])
                    part("box", [0.12, 3.4, 2.1], [x, 1.8, 0], color, true)
                for (const y of [0.5, 1.5, 2.5, 3.4])
                    part("box", [2.1, 0.09, 2.1], [0, y, 0], "#55ecff", true)
            } else if (o.variant === 1) {
                const ring = MeshBuilder.CreateTorus(
                    "neon sculpture",
                    { diameter: 3.3, thickness: 0.22, tessellation: 32 },
                    this.scene
                )
                ring.parent = n
                ring.position.y = 1.9
                ring.rotation.x = Math.PI / 2
                ring.material = this.material(color, true)
                ring.isPickable = false
                part("sphere", [1.1, 1.1, 1.1], [0, 1.9, 0], "#ff58d5", true)
            } else {
                for (const x of [-1, 0, 1]) {
                    const crystal = part(
                        "box",
                        [0.85, 2.3, 0.85],
                        [x, 1.5, 0],
                        colors[x + 1],
                        true
                    )
                    crystal.rotation.z = x * 0.35
                    crystal.rotation.y = Math.PI / 4
                }
            }
        }
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
                "sphere",
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
                if (this.settings.suit === "Petal Parade") {
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
                } else if (i > 0) {
                    // Overlapping fabric sleeves follow the body as it bends.
                    // The uncovered head keeps the player's chosen color visible.
                    const outfit = suitStyles[this.settings.suit]
                    this.part(
                        n,
                        "sphere",
                        [1.06, 0.94, 1.12],
                        [0, 0.55, 0],
                        outfit.fabric
                    )
                    this.part(
                        n,
                        "sphere",
                        [0.09, 0.06, 1.12],
                        [0, 1.02, 0],
                        outfit.trim,
                        this.settings.suit === "Neon Circuit"
                    )
                    const cuff = MeshBuilder.CreateTorus(
                        "fabric cuff",
                        {
                            diameter: 0.96,
                            thickness: 0.07,
                            tessellation: 20,
                        },
                        this.scene
                    )
                    cuff.parent = n
                    cuff.rotation.x = Math.PI / 2
                    cuff.position.set(0, 0.55, 0.37)
                    cuff.scaling.y = 0.88
                    cuff.material = this.material(
                        outfit.trim,
                        this.settings.suit === "Neon Circuit"
                    )
                    cuff.isPickable = false
                    this.shadow.addShadowCaster(cuff)
                    if (this.settings.suit === "Candy Ribbon" && i === 1) {
                        for (const side of [-1, 1]) {
                            const bow = this.part(
                                n,
                                "sphere",
                                [0.48, 0.16, 0.3],
                                [side * 0.24, 1.08, 0.1],
                                outfit.trim
                            )
                            bow.rotation.y = side * 0.5
                        }
                        this.part(
                            n,
                            "sphere",
                            [0.18, 0.2, 0.2],
                            [0, 1.08, 0.1],
                            "#d77899"
                        )
                    }
                    if (this.settings.suit === "Cloud Puff" && i === 1) {
                        for (const x of [-0.35, 0, 0.35])
                            this.part(
                                n,
                                "sphere",
                                [0.4, 0.28, 0.3],
                                [x, 0.98, 0.36],
                                outfit.trim
                            )
                    }
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
            if (["heart", "shield", "magnet"].includes(item.kind)) {
                const color =
                    item.kind === "heart"
                        ? "#ff96bf"
                        : item.kind === "shield"
                          ? "#78e4ff"
                          : "#dfacff"
                const materialKey = `power-shell-${item.kind}`
                if (!this.materials.has(materialKey)) {
                    const shellMaterial = new StandardMaterial(
                        materialKey,
                        this.scene
                    )
                    shellMaterial.diffuseColor = Color3.FromHexString(color)
                    shellMaterial.emissiveColor =
                        Color3.FromHexString(color).scale(0.8)
                    shellMaterial.alpha = 0.2
                    shellMaterial.backFaceCulling = false
                    this.materials.set(materialKey, shellMaterial)
                }
                const shell = MeshBuilder.CreateSphere(
                    "power shell",
                    { diameter: 2, segments: 16 },
                    this.scene
                )
                shell.parent = n
                shell.position.y = 0.8
                shell.material = this.materials.get(materialKey)!
                shell.isPickable = false
                const halo = MeshBuilder.CreateTorus(
                    "power halo",
                    { diameter: 2.1, thickness: 0.12, tessellation: 32 },
                    this.scene
                )
                halo.parent = n
                halo.position.y = 0.12
                halo.material = this.material(color, true)
                halo.isPickable = false
                this.part(
                    n,
                    "sphere",
                    [0.16, 0.16, 0.16],
                    [0.8, 1.6, 0],
                    "#fff7d5",
                    true
                )
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
        this.scenery.setEnabled(this.settings.view === "3D")
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
                const core = this.part(
                    n,
                    "sphere",
                    [1, 1, 1],
                    [0, 0.65, 0],
                    "#ffe7a3",
                    true
                )
                core.name = "blast-core"
                const ring = MeshBuilder.CreateTorus(
                    "blast-ring",
                    { diameter: 1, thickness: 0.1, tessellation: 32 },
                    this.scene
                )
                ring.parent = n
                ring.position.y = 0.12
                ring.material = this.material("#ffac69", true)
                ring.isPickable = false
                for (let i = 0; i < 8; i++) {
                    const spark = this.part(
                        n,
                        "sphere",
                        [0.26, 0.26, 0.26],
                        [0, 0.6, 0],
                        i % 2 ? "#ffbd57" : "#ff805f",
                        true
                    )
                    spark.name = `blast-spark-${i}`
                }
                for (let i = 0; i < 4; i++) {
                    const puff = this.part(
                        n,
                        "sphere",
                        [0.7, 0.7, 0.7],
                        [0, 0.6, 0],
                        "#b5a3b7"
                    )
                    puff.name = `blast-smoke-${i}`
                }
            }
            n.position = new Vector3(e.x, 0, e.z)
            const progress = Math.max(
                0,
                Math.min(1, 1 - (e.until - m.time) / EXPLOSION_DURATION)
            )
            const motion = this.settings.reduced ? 0.35 : progress
            for (const mesh of n.getChildMeshes()) {
                if (mesh.name === "blast-core") {
                    mesh.scaling.setAll(1.2 + Math.sin(motion * Math.PI) * 1.8)
                    mesh.visibility = this.settings.reduced
                        ? 0.8
                        : Math.max(0, 1 - progress * 2)
                } else if (mesh.name === "blast-ring") {
                    mesh.scaling.setAll(1 + motion * 6)
                    mesh.visibility = this.settings.reduced ? 0.8 : 1 - progress
                } else if (mesh.name.startsWith("blast-spark-")) {
                    const i = Number(mesh.name.split("-").at(-1)),
                        angle = (i * Math.PI) / 4
                    mesh.position.set(
                        Math.sin(angle) * motion * 3.5,
                        0.6 + Math.sin(motion * Math.PI) * 1.6,
                        Math.cos(angle) * motion * 3.5
                    )
                    mesh.visibility = this.settings.reduced ? 0 : 1 - progress
                } else {
                    const i = Number(mesh.name.split("-").at(-1)),
                        angle = (i * Math.PI) / 2
                    mesh.position.set(
                        Math.sin(angle) * motion * 1.5,
                        0.8 + motion * 2,
                        Math.cos(angle) * motion * 1.5
                    )
                    mesh.scaling.setAll(0.5 + motion)
                    mesh.visibility = this.settings.reduced
                        ? 0
                        : Math.sin(progress * Math.PI) * 0.55
                }
            }
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
            this.follow.reset()
            this.camera.mode = FreeCamera.ORTHOGRAPHIC_CAMERA
            const aspect =
                    this.engine.getRenderWidth() /
                    this.engine.getRenderHeight(),
                half = ARENA_HALF + 5
            this.camera.orthoLeft = -half * Math.max(1, aspect)
            this.camera.orthoRight = half * Math.max(1, aspect)
            this.camera.orthoTop = half * Math.max(1, 1 / aspect)
            this.camera.orthoBottom = -half * Math.max(1, 1 / aspect)
            this.camera.position.set(0, 160, -0.001)
            this.camera.setTarget(Vector3.Zero())
        } else {
            this.camera.mode = FreeCamera.PERSPECTIVE_CAMERA
            const pose = this.follow.update(
                {
                    x: h.x,
                    z: h.z,
                    heading: m.player.heading,
                    orbit: this.orbit,
                    zoom: this.zoom,
                    tilt: this.tilt,
                    riding: this.settings.camera === "Riding",
                    reduced: this.settings.reduced,
                },
                dt
            )
            this.camera.position.set(
                pose.position.x,
                pose.position.y,
                pose.position.z
            )
            this.camera.setTarget(
                new Vector3(pose.target.x, pose.target.y, pose.target.z)
            )
        }
        this.scene.render()
    }
    reset() {
        this.orbit = 0
        this.zoom = CAMERA_ZOOM_MAX
        this.tilt = 0
    }
    dispose() {
        this.resize.disconnect()
        this.scene.dispose()
        this.engine.dispose()
    }
}
