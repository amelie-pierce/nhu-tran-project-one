# Snake Game implementation notes

Implemented at `/snake-game` from `docs/snake-game-prd.md`. The owner explicitly delegated the PRD's open decisions during implementation.

## Integration and running

- The existing header has a Snake Game link. The game has an independent, lazy-loaded route outside the shop layout and a Back to the shop link. Existing shop features are retained.
- Game source is in `src/pages/snake-game/`: `model.ts` (simulation), `scene.ts` (Babylon renderer), `audio.ts` (synthesized audio), `SnakeGame.tsx` (UI/input), and scoped `snake.css`.
- Use a supported Node version (Node 22.12+ or 24 recommended for the existing Vite 8 project). Run `npm run dev`, then visit `/snake-game`. Build with `npm run build`.
- Rule tests: `node --experimental-strip-types --test tests/snake-game.test.mjs` with Node 24.

## Delegated decisions

1. **Countdown:** loss of focus or Pause freezes the current countdown; Resume continues it. All movement input during countdown is discarded. Returning home abandons the match. Browser reload always starts at Home.
2. **Guidance and body:** the head immediately faces each target before movement; the former turning cap and close-target guide arc are removed. Left/right input turns once by 90 degrees on a new press, then moves straight while held. Segments trail their predecessors at 0.85-unit spacing, with a 1-unit collision diameter. Newly grown segments begin at the tail and spread as it moves. Robots have rounded bodies, an antenna, and lavender, gold, or blue colors.
3. **Simulation and simultaneous contacts:** fixed 60 Hz simulation, with at most 100 ms of catch-up per rendered frame. Head-to-body contact affects only the snake whose head touches; head-to-head affects both. Body-only overlap has no effect. Each head contact remains latched until that head separates from the other snake. Each simulation tick batches robot deaths and bomb consumption; the player loses at most one life per tick. A protected contact is recorded and cannot retrigger until separation. Independent robot-to-bomb collisions still occur while the player is protected.
4. **Placement:** random locations inside ±45 units, at least 12 units from every player segment, 3 units from robots/bombs, and 1.5 units from other pickups. A bounded 500-attempt search prevents a frozen loop in an extremely crowded arena. At pathological crowding a bounded grid fallback relaxes item spacing but keeps spawns clear of obstacles. Initial items follow the same rules; practice has several deliberately nearby pickups.
5. **Milestones:** each crossed milestone schedules a separate three-second warning. Warnings queue sequentially; speed and hazard additions apply when each warning expires. Robot additions stop after six and bomb additions after nine, independent of the speed cap. The warning remains a level-up notification after speed caps.
6. **Protection and magnet:** shield and recovery timers run independently; protection lasts until both expire. Magnet pulls basic food within ten units at fourteen units/second; collection uses the active view’s food contact radius. Refreshing a pickup resets only that pickup's timer.
7. **Cameras:** Riding is 2.5 units behind and 2.8 above the head, looking six units ahead. Chase is ten behind and nine above, looking two ahead. Orbit offset persists relative to the heading. Zoom multiplier defaults and resets to 2.5 and clamps to 0.65–2.5; vertical position stays above 1.7. Pitch adjustment clamps to -1–12 units. A two-finger gesture suppresses tap targeting until the gesture ends. 2D fits the complete arena with a five-unit margin on every aspect ratio. A non-colliding locator ring makes the one-unit snake easier to find.
8. **Pause:** Resume and Return home are offered. Escape toggles pause. Focus loss clears held input and leaves the match paused. Pauses and countdown are excluded from survival time.
9. **Presentation/assets:** original SVG preview, procedural Babylon geometry, and synthesized Web Audio loops/effects; no downloaded media or new asset licenses. Each map uses a different palette and musical sequence base/tempo. Suits use overlapping fabric sleeves with seams and cuffs, plus a bow or fluffy collar where appropriate; Petal Parade retains its original petal geometry. Suits are cosmetic geometry, and one-life snakes use ivory bones. Power-ups use heart, shield, and magnet geometry.
10. **Accessibility:** native keyboard buttons, labels, a trapped settings/welcome dialog, visible focus rings, touch steering, adjustable independent audio levels, reduced animation, and storage-failure notices. System reduced-motion preference is respected on first use; reduced mode removes decorative bobbing/flicker and automatic camera rotation; camera translation remains smooth. Protection remains labelled in the HUD and indicated by a ring.
11. **Compatibility and errors:** target current WebGL-capable desktop and mobile browsers. A renderer-start failure displays recovery advice and Home. No backend, account, external asset request, or match persistence is introduced. Settings are validated and stored under `snake-garden.v1`; failures fall back to memory. No guaranteed device performance target has been established; initial arena is modest, but very long robot bodies increase collision work.

## Verification

- Production TypeScript and Vite build.
- Automated tests for countdown/input gating, Stop/Continue, relative steering, pause, damage/protection, collision responsibility, respawns, growth warning scheduling, magnet radius, hearts, expiry, and boundary recovery.
- Desktop browser smoke checks for Home → Setup → Gameplay, 2D/3D switching, minimap, and pause/resume; responsive portrait inspection.
- Physical multi-touch devices and a broad browser/hardware matrix still need device testing. The UI includes two-finger orbit/pinch handlers; automated rule tests do not emulate those browser gestures.

The existing Vite configuration emits a warning about its future native config loader and `__dirname`. Babylon's lazy game chunk may trigger Vite's chunk-size advisory; the shop does not eagerly load it.


## October 2026 UI revision

- Home, setup, dialogs, results, HUD, and controls use blush/peach surfaces, pastel pink selections, and dark rose text/actions. Map themes keep their own arena colors, and the setup preview background follows the selected map with light text for Neon.
- Bubble Diver is a silky wetsuit, Woodland Sprite a soft jacket, Neon Circuit a piped flight jacket, Candy Ribbon a silk wrap with a bow, and Cloud Puff a quilted puffer. SVG previews and Babylon outfits share fabric/trim colors. Petal Parade is preserved. Clothing disappears with the outer life layer; the head still shows the chosen color.
- Arena size is 100 × 100. Shared constants define the 50-unit half extent, 49.5-unit movement/target limit, and 45-unit spawn inset. Ground, boundary, grid, 2D camera, and minimap use the same dimensions. Food/hazard counts and snake width stay unchanged.
- Outside scenery is grouped and shown only in 3D. Switching back to 2D hides it immediately without changing the match. The camera retains a five-unit arena margin in portrait and landscape.
- Regression coverage checks spawn bounds, target clamping, and boundary stop/recovery for the smaller arena.

### Themed interior obstacles and robot update

- Match creation samples up to 12 obstacle centers inside ±42 units, at least 21 units from the origin and 12 units apart. Variants cycle across three theme-specific designs; position and rotation are randomized once per match and persist across camera switches and pauses.
- Each obstacle has a visible circular 2.4-unit solid footprint. Head movement stops at radius + 0.5 with one life lost unless protected, without item consumption. Player contact clears target guidance; held steering can turn away and resume. Protection does not bypass scenery. Robots anticipate obstacles within radius + 5 and steer away. No automatic player pathfinding is added.
- Spawn selection excludes obstacles by radius + 3. Practice pickups remain in the clear central area. The minimap draws obstacle footprints. Sea has coral, seaweed, and fish sculptures; Garden/Forest have trees, mossy logs, and mushrooms; Neon has bright emissive towers, rings, and crystals.
- Robots share the player's rounded segment shape, retaining their antenna and distinct colors. The smaller arena now also drives robot boundary avoidance and near-target guidance margins.

Validation for this revision: production build passed; all 26 simulation tests passed; renderer/model/test lint passed. Desktop and narrow browser checks covered map preview colors, Petal Parade, Candy Ribbon, Neon 2D/3D switching, and obstacle rendering. Five pre-existing React lint errors in SnakeGame.tsx remain (confirmed against HEAD); no browser console errors were observed during the smoke check.


## 2D readability update

The full-map 2D view uses an illustrated canvas layer with screen-size minimums: 17px food symbols, 20px bombs/power-ups, 25px obstacle symbols, and 12px snake bodies. Snake heads show eyes and robots retain antennae. YOU/ROBOT labels, distinct symbols, and a compact legend clarify the object types; a subdued grid reduces clutter. Petal Parade flowers and fabric seams distinguish outfits. Protection uses a steady ring, and damage still changes the appearance. Obstacle bases show their actual blocking radius; enlarged symbols are visual aids, not enlarged collision shapes.

The layer shares Babylon's full-map projection (100-unit arena and five-unit margin), so targeting and gameplay positions remain aligned across viewport sizes. 3D uses the original scene. Camera switches keep match state, and the overlay ignores pointer input so existing tap, keyboard, and touch steering continue to work. No collision sizes, item counts, or movement rules change.

2D readability validation: production build and new renderer lint passed; all 26 gameplay tests passed. Browser checks at the default viewport and 390 × 844 confirmed readable symbols, aligned tap targets, and 2D/3D switching with score/lives/length retained. No browser console errors were observed.


## Immediate controls and clearer feedback

- Removed target-approach waypoints and angular interpolation. New targets after a blocking contact can move directly away or along the obstacle, without the first step following the old blocked heading. Robots also change heading immediately. Movement speed, body spacing and collision sizes remain unchanged.
- Keyboard repeat does not repeat a turn while held. Releasing and pressing again turns another 90 degrees. Existing Stop/Continue release behavior is retained. Tutorial and accessible control names describe the new behavior.
- Shared camera bounds set the initial/reset multiplier to the existing maximum of 2.5, with wheel/pinch still clamped to 0.65–2.5.
- 2D obstacles use neutral square badges, grayscale symbols and corner studs. Pickups retain colorful symbols; power-ups gain colored glowing shells, inner gold rims and sparkle accents. 3D power-ups have translucent emissive shells and ground halos with cached materials.
- Bomb effects last 1.1 match seconds: local warm burst, expanding ring, eight sparks and smoke; 2D adds a BOOM! label. A dedicated synthesized explosion cue respects the effects volume. Reduced motion removes particle travel/pulsing and uses a steady local indicator. No area damage is added.

Validation: all 30 simulation tests pass, including obstacle retargeting, immediate reversal, held-input behavior, boundary recovery and explosion expiry/pause/no-area-damage. Focused lint passes for model, renderer, 2D drawing, audio and tests. Browser checks confirmed gray obstacle badges, power-up shells, both explosion renderers, reduced-motion behavior and the 2.5 default camera distance without console errors.


## 3D camera comfort update

Keyboard turns remain immediate in the simulation. A separate camera-follow state smooths the heading, follow position, orbit, camera distance, height and look-ahead. Both camera position and look target derive from that same state, avoiding the old instant look-direction jump during a 90-degree turn. Automatic rotation follows the shortest angular path, eases out, and is capped at 144 degrees/second. Exponential easing makes follow behavior consistent across frame rates; long frame gaps cannot cause a large single-frame camera jump.

Entering 3D initializes directly at the current follow pose, avoiding a sweep from the overhead 2D camera. Riding/Chase, zoom and Reset Camera changes ease into place. Reduced-motion mode holds the current world-facing heading while smoothly following position; deliberate orbit and zoom still work. Switching reduced motion off smoothly resumes heading follow. No gameplay turning, collision or scoring rules change.

Camera validation: production build and focused lint passed; all 36 camera/gameplay tests passed. Browser smoke checks exercised rapid left/right keyboard input in 3D with no console errors. Camera tests cover 30/60/144 FPS, shortest-angle wrap, long-frame limits, stable reduced-motion heading, and direct 3D initialization.


### Hold W to move forward

In either camera view, holding W moves straight along the current heading. In Stop mode, releasing W stops immediately unless a left/right control remains held. W clears the previous click destination; it does not resume on release. A/D and arrow keys still turn immediately while W is held, and releasing a turn keeps forward movement active. Continue mode retains forward movement after W release. Pause or focus loss clears held forward input; resuming requires a fresh W press. Countdown and game-over states ignore forward presses. Obstacles and arena boundaries block movement and cost one life unless protected.


### Up/Down keyboard controls

W and Up Arrow share hold-to-move behavior. S and Down Arrow turn the snake around immediately (180 degrees) once per press, then move along that heading while held. Key repeat never triggers additional turns; overlapping S/Down presses count as one held reverse control. Releasing one alias keeps movement active while another travel key is held. Releasing all travel keys stops in Stop mode unless a turn control remains held; Continue mode keeps moving. Pause/focus loss clears held keys and requires fresh presses. Both views use the same controls, and arrow keys do not scroll the page during play.


### 2D map controls and visible contact areas

In 2D, W/Up points toward the top of the map, S/Down toward the bottom, A/Left toward the left and D/Right toward the right. The latest held key wins; releasing it returns to the remaining held direction in Stop mode; Continue mode retains the latest chosen heading. Releasing all keys stops in Stop mode. 3D retains snake-relative controls. Switching views clears held input, and a fresh press is required. Pause/focus loss also clears map keys.

2D food and bombs have circular badges whose outer edges define their active area. The renderer and model share screen-space sizes, including the snake body outline; contact occurs when the visible snake and badge touch. The geometry updates with viewport size. Food still requires head contact; bombs still react to any body segment. 3D keeps its existing collision distances. Decorative emoji details do not enlarge the circular badge's hit area.


### Solid-surface damage

In both 2D and 3D, player head contact with an obstacle or arena boundary stops movement, clears the destination, and costs one life. This uses the same damage event, three-second recovery protection, shield immunity, and game-over behavior as bomb damage. Solids remain impassable even when protected. Holding movement into a surface counts as one contact and cannot drain additional lives after protection expires; moving away and contacting a surface again can cause another hit. Obstacles and boundaries remain in place and do not explode. Robot avoidance is unchanged.


New matches default to Continue movement mode. The snake automatically starts moving when the 3-second countdown ends; players can switch to Stop using the existing mode control.


### Magnet range and attraction feedback

Magnet range is 10 world units and pull speed is 14 units/second. Duration remains five seconds and only basic food is attracted. Both views show a pastel range ring, highlighted affected food, and inward-moving golden particles. 2D also shows faint connecting trails. Effects follow match time, freeze on pause, and disappear when the magnet expires or food leaves range/is collected. Reduced motion keeps steady range/food highlights and omits moving particles; gameplay attraction remains active.


### Head collision rules and Continue steering

Snake collisions are determined by head contact, not which segments moved toward each other. Head-to-body costs the attacking player one life or kills the attacking robot; the other snake survives. Head-to-head costs the player one life and kills the robot, or kills both robots. Body-only overlap is harmless. Existing player shield/recovery pass-through protection still applies. Each head contact triggers once until separation.

In 2D Continue mode, releasing a direction key keeps the latest chosen heading even if an older arrow remains held. Stop mode retains held-key fallback. Releasing keyboard travel in Continue clears any intervening click destination, preventing a stale target from overriding the selected heading. 3D keeps relative turning.


### Long-match input and robot lifecycle

Fresh 2D direction presses recover from missing key-release events; key repeat still does not override newer directions. In-game range sliders no longer swallow movement arrows. 3D turn releases are processed even after focus changes, and steering buttons only react to Space/Enter releases. Regression coverage includes 153-segment snakes at maximum speed and elapsed match time.

Robots spawn and respawn with random lengths of 3–12 segments. Full-body placement checks avoid solids, bombs and other snakes; crowded placement is deferred. Robot head contact with obstacles/boundaries is fatal, using the same death/marks/five-second replacement lifecycle as snake or bomb contact. Robots still attempt avoidance. Head-to-body kills the attacking robot; head-to-head kills both unprotected participants (the player loses a life). Robots have one life and cannot collect shields; player protection retains pass-through behavior.


### Special pickup contact and magnet rendering

Hearts, shields, and magnets use their visible shell/halo footprint for collection: 2D shares the screen-sized shell radius with the renderer, while 3D uses the 1.11-unit outer halo radius. Both add the snake head radius for edge contact. Shell geometry stays steady; only the glow pulses, so the hit area does not fluctuate. Decorative glow and sparkles are not solid pickup geometry. Full-health hearts remain uncollected.

2D no longer builds hidden 3D magnet trails, and 3D trail particles do not cast shadows. Magnet regression coverage exercises actual pickup, nearby food attraction, all keyboard directions, maximum speed, a long snake, and expiry in both views.


### Controls and long-match rendering

On-screen left/right buttons have been removed. Keyboard controls and tap/click destinations remain available. The 2D canvas is now the only scene rendered in 2D: hidden Babylon dynamic meshes and shadow rendering are skipped, the hidden minimap is not drawn, and clicks use the same projection as the canvas. Switching to 3D rebuilds dynamic visuals from current match state. 3D sphere/box parts share geometry buffers and segment positions reuse vectors, reducing mesh allocation during growth. These changes reduce rendering load; they do not establish the exact cause of the intermittent input freeze.
