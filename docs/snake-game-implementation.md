# Snake Game implementation notes

Implemented at `/snake-game` from `docs/snake-game-prd.md`. The owner explicitly delegated the PRD's open decisions during implementation.

## Integration and running

- The existing header has a Snake Game link. The game has an independent, lazy-loaded route outside the shop layout and a Back to the shop link. Existing shop features are retained.
- Game source is in `src/pages/snake-game/`: `model.ts` (simulation), `scene.ts` (Babylon renderer), `audio.ts` (synthesized audio), `SnakeGame.tsx` (UI/input), and scoped `snake.css`.
- Use a supported Node version (Node 22.12+ or 24 recommended for the existing Vite 8 project). Run `npm run dev`, then visit `/snake-game`. Build with `npm run build`.
- Rule tests: `node --experimental-strip-types --test tests/snake-game.test.mjs` with Node 24.

## Delegated decisions

1. **Countdown:** loss of focus or Pause freezes the current countdown; Resume continues it. All movement input during countdown is discarded. Returning home abandons the match. Browser reload always starts at Home.
2. **Guidance and body:** the shortest angular turn toward the target is capped at pi radians/second. Segments trail their predecessors at 0.85-unit spacing, with a 1-unit collision diameter. Newly grown segments begin at the tail and spread as it moves. Robots have blocky bodies, an antenna, and lavender, gold, or blue colors.
3. **Simulation and simultaneous contacts:** fixed 60 Hz simulation, with at most 100 ms of catch-up per rendered frame. Contact-point displacement projected toward the opposing segment determines responsibility. A snake pair stays in one contact until every overlapping segment separates. Each simulation tick batches robot deaths and bomb consumption; the player loses at most one life per tick. A protected contact is recorded and cannot retrigger until separation. Independent robot-to-bomb collisions still occur while the player is protected.
4. **Placement:** random locations inside ±70 units, at least 12 units from every player segment, 3 units from robots/bombs, and 1.5 units from other pickups. A bounded 500-attempt search prevents a frozen loop in an extremely crowded arena. At pathological crowding the final sampled position is used. Initial items follow the same rules; practice has several deliberately nearby pickups.
5. **Milestones:** each crossed milestone schedules a separate three-second warning. Warnings queue sequentially; speed and hazard additions apply when each warning expires. Robot additions stop after six and bomb additions after nine, independent of the speed cap. The warning remains a level-up notification after speed caps.
6. **Protection and magnet:** shield and recovery timers run independently; protection lasts until both expire. Magnet pulls basic food within three units at nine units/second; collection occurs within 0.95 units of the head. Refreshing a pickup resets only that pickup's timer.
7. **Cameras:** Riding is 2.5 units behind and 2.8 above the head, looking six units ahead. Chase is ten behind and nine above, looking two ahead. Orbit offset persists relative to the heading. Zoom multiplier clamps to 0.65–2.5; vertical position stays above 1.7. Pitch adjustment clamps to -1–12 units. A two-finger gesture suppresses tap targeting until the gesture ends. 2D fits the complete arena with a five-unit margin on every aspect ratio. A non-colliding locator ring makes the one-unit snake easier to find.
8. **Pause:** Resume and Return home are offered. Escape toggles pause. Focus loss clears held input and leaves the match paused. Pauses and countdown are excluded from survival time.
9. **Presentation/assets:** original SVG preview, procedural Babylon geometry, and synthesized Web Audio loops/effects; no downloaded media or new asset licenses. Each map uses a different palette and musical sequence base/tempo. Suits are cosmetic geometry, and one-life snakes use ivory bones. Power-ups use heart, shield, and magnet geometry.
10. **Accessibility:** native keyboard buttons, labels, a trapped settings/welcome dialog, visible focus rings, touch steering, adjustable independent audio levels, reduced animation, and storage-failure notices. System reduced-motion preference is respected on first use; reduced mode removes decorative bobbing/flicker and camera smoothing. Protection remains labelled in the HUD and indicated by a ring.
11. **Compatibility and errors:** target current WebGL-capable desktop and mobile browsers. A renderer-start failure displays recovery advice and Home. No backend, account, external asset request, or match persistence is introduced. Settings are validated and stored under `snake-garden.v1`; failures fall back to memory. No guaranteed device performance target has been established; initial arena is modest, but very long robot bodies increase collision work.

## Verification

- Production TypeScript and Vite build.
- Automated tests for countdown/input gating, Stop/Continue, relative steering, pause, damage/protection, collision responsibility, respawns, growth warning scheduling, magnet radius, hearts, expiry, and boundary recovery.
- Desktop browser smoke checks for Home → Setup → Gameplay, 2D/3D switching, minimap, and pause/resume; responsive portrait inspection.
- Physical multi-touch devices and a broad browser/hardware matrix still need device testing. The UI includes two-finger orbit/pinch handlers; automated rule tests do not emulate those browser gestures.

The existing Vite configuration emits a warning about its future native config loader and `__dirname`. Babylon's lazy game chunk may trigger Vite's chunk-size advisory; the shop does not eagerly load it.

