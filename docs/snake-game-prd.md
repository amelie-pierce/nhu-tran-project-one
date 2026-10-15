# Snake Game — Product Requirements Document

## 1. Product and project scope

Snake Game is a public, single-player browser game for desktop, tablet, and mobile. Players survive, collect food, grow their snake, and earn a high score while avoiding wandering robotic snakes and stationary bombs. The presentation is colorful, playful, and cartoon-like, with polished shadows, colors, contrast, and usable controls.

The game is a new feature on a separate route within the existing React, TypeScript, and Vite website. Use Babylon.js for the game. Preserve existing features and behavior: isolate game code, styles, assets, and state; avoid changes to existing feature code beyond the integration necessary to register the new route. Installing Babylon.js and additional libraries or assets needed for visual quality is authorized. The new route is `/snake-game`.

This document specifies the product; it does not request implementation in this documentation task. Hosting and launch deadline are unspecified. Implementation phases and testable acceptance criteria are intentionally omitted at the owner's request.

## 2. Modes and cameras

Both 2D and 3D use the same world, immediate free-direction targeting, rules, and ongoing match state.

| View | Requirements |
| --- | --- |
| 2D | Top-down camera showing the entire map and its boundary, including on portrait screens. |
| 3D riding | Default 3D camera, near/above the snake's head to convey riding it. Part of the snake and nearby items remain visible. There is no human rider. |
| 3D chase | Adjustable alternative behind and above the snake, showing part of its body and surroundings. |

Players choose 2D or 3D during setup and can switch during gameplay. In 3D they can switch riding/chase cameras. Switching keeps position, target, score, length, lives, timers, hazards, and other match state. A minimap is available in 3D. Decorative scenery outside the boundary is hidden in 2D, leaving a clean margin around the playable map; it remains visible in 3D.


### Manual camera controls

Both 3D cameras smoothly follow the snake heading. Riding sits just above and behind the head, showing part of it; Chase sits higher and farther behind. Support manual orbit and zoom in 3D:

- Desktop: right-drag to orbit; mouse wheel to zoom.
- Mobile/tablet: two-finger drag to orbit; pinch to zoom.
- Reset Camera restores the selected Riding or Chase view.
- Releasing orbit resumes following from the adjusted angle.
- Limit zoom to prevent clipping through the snake or ground.

Camera inputs must not trigger map targets or held steering. Exact offsets and safe zoom limits remain tuning decisions.

## 3. Arena, maps, and appearance

Each arena is 100 × 100 world units. This supersedes the previous 150 × 150 arena. Snake width is 1 world unit. All maps are available from the start:

- Sea.
- Garden.
- Forest.
- Neon / robot / future.

Food has multiple shapes appropriate to the map, such as orange, apple, and grape forms where suitable. Each match randomly places up to 12 stationary themed obstacles inside the arena, clear of the starting/tutorial area and pickups. Obstacles block the head and cost one life on unprotected contact; steer away to resume. They remain solid during protection. Target guidance does not automatically route around obstacles. Sea uses coral, seaweed, and fish reef sculptures; Garden uses blossom trees, mossy logs, and mushrooms; Forest uses leafy trees, logs, and mushrooms; Neon uses luminous towers, rings, and crystals. Their low circular bases show the blocking footprint in 2D and 3D. The minimap includes obstacles.

Players independently select snake color and one of six suits. Every suit is usable on every map:

| Suit | Approved design direction |
| --- | --- |
| Bubble Diver | Silky aqua wetsuit wrapping the body, with pearl piping. |
| Petal Parade | Flower petals. |
| Woodland Sprite | Soft leaf-green jacket wrapping the body, with a cream seam. |
| Neon Circuit | Lilac flight jacket with luminous piping. |
| Candy Ribbon | Pink silk body wrap with cream ribbons and a bow. |
| Cloud Puff | Quilted blush puffer wrapping the body, with a fluffy collar. |

Suits differ cosmetically. All provide the same initial outer life layer; none grants an extra ability or a fourth life. Setup shows a snake preview matching the worn outfit. Petal Parade keeps its original flower-petal appearance. Other suits cover the body like clothing; the head retains the selected snake color.

## 4. Movement and input

The snake starts with 3 segments and 3 lives. Each match has a 3-second opening countdown. In Continue mode, the snake starts moving automatically when the countdown ends. In Stop mode, it waits for the first movement input. Movement input is accepted only after the countdown finishes.

Click/tap movement turns immediately toward the destination, without a turning radius or approach arc; a target is reached within 0.5 world units. Left/right controls make one immediate relative 90-degree turn per press and move straight while held. Release and press again for another turn. This supersedes the previous 180-degrees/second turning cap. Held steering temporarily overrides target guidance. Two movement behaviors are selectable independently of the 2D/3D view:

| Behavior | Click/tap target behavior |
| --- | --- |
| Stop | Travel toward the selected point and stop when it is reached. The world continues running. |
| Continue (default) | Travel toward the selected point, then continue moving in that direction. |

On desktop, support mouse and keyboard. Keyboard turning uses A/D and left/right arrows, always relative to the snake's own left/right. On mobile/tablet, support touch input without requiring a keyboard.

A click/tap selects a map position. In 3D, it selects a point on the visible ground with the same target behavior as 2D. Pressing dedicated visible left/right controls turns 90 degrees relative to the snake; holding continues along that heading and avoids a conflict with tapping the map. Keyboard turning has the same steering behavior. Turning from rest moves the snake forward while turning; it does not merely rotate in place.

In Stop mode, releasing steering returns to the latest unreached target, then stops. With no target, it stops immediately. A reached target is cleared, so it is not reused after later steering. In Continue mode, releasing held steering clears the old target and continues along the current heading.

At a boundary, the snake stops and loses one life on unprotected contact. Steering away resumes movement. Contact with the player's own body has no effect.

Stop is not Pause. While the player is stationary, robots move, hazards can hurt, and match timers continue. Pause freezes the entire match. Losing browser focus automatically pauses; returning focus leaves the match paused until the player selects Resume.

## 5. Growth, speed, and hazard progression

Basic food and robot marks each add 1 segment when eaten. Length is kept after losing a life.

Starting player speed is 6 world units/second. Every 10 added segments triggers a speed milestone: show a 3-second advance warning, then add 10% of starting speed (0.6 units/second), capped at 12 units/second. With an initial length of 3, thresholds occur at lengths 13, 23, 33, and so on. The first increase is to 6.6; maximum speed is reached after ten increases, at length 103.

There is one difficulty. Start with 2 robots and 3 bombs. Each 10-added-segment milestone also adds 1 robot and 1 bomb, with separate caps of 8 robots and 12 bombs. Bomb count can continue increasing until its own cap even if speed is already capped. With uninterrupted progression, robots reach 8 at length 63 and bombs reach 12 at length 93. Replacements maintain the current unlocked hazard population.

Dead robots and consumed bombs are replaced after 5 seconds, in free spaces away from the player. Exact safe spawn distance and whether hazard increases occur before or after the speed warning remain unresolved.

## 6. Lives, damage, and protection

| Lives remaining | Appearance |
| --- | --- |
| 3 | Selected suit over the snake. |
| 2 | Normal snake, without the suit. |
| 1 | Skeleton snake. |
| 0 | Game over. |

Each damaging collision removes one life. After either surviving hit, the snake stays at its position, keeps its score and length, and flickers for 3 seconds of damage protection. No relocation or respawn occurs. The third loss ends the match.

Protection from either damage recovery or a shield permits passing through robots and bombs. During protected contact the player loses no life, the robot does not die, and the bomb does not explode or get consumed. Protection is broader than simply cancelling player damage.

### Collision rules outside protection

Only head contact causes snake collision damage. Body-to-body overlap is harmless; movement direction does not determine responsibility:

| Event | Result |
| --- | --- |
| Player head touches robot body | Player loses 1 life. |
| Robot head touches player body | Robot dies. |
| Player head touches robot head | Player loses 1 life and robot dies. |
| Robot head touches another robot body | The snake whose head touches dies. |
| Robot head touches another robot head | Both robots die. |
| Player contacts a bomb | Player loses 1 life; bomb explodes visually and is consumed. |
| Robot contacts a bomb | Robot dies; bomb is consumed. |
| Player contacts its own body | No effect. |
| Player contacts map boundary | Stop; lose one life unless protected; steer away to resume. |

Bomb explosions have no area damage and do not affect nearby snakes. Head-to-body contact affects only the snake whose head touches the other body. Head-to-head contact affects both snakes, even when one is stationary. Body-to-body overlap has no effect. Apply a collision once per contact until separation. Robots ignore their own bodies and turn away from boundaries.

## 7. Robots and marks

Robots have rounded bodies and heads like the player, with distinct colors and an antenna. Robots spawn with a random 3–12 segments, wander randomly with immediate heading changes, and move at 80% of the player's current speed. They eat basic food and grow like the player. They can also eat robot marks. They cannot collect hearts, shields, or magnets.

Every robot death leaves one collectible mark per body segment, distributed along its body's last path. Marks are small glowing spots matching the dead robot's color. The owner calls these **marks**, rather than circles. Each mark:

- Awards 10 player points when collected by the player.
- Adds 1 segment to the collecting player or robot.
- Disappears 20 seconds after being created if uncollected.

Longer robots leave more marks and therefore more collectible points. Robots eating marks remove those marks from the map. Robot deaths do not have a separately approved direct score bonus.

## 8. Food, power-ups, and scoring

Maintain a target population of 40 basic foods. Replace each eaten food after 3 seconds; population may temporarily be below 40 while replacement is pending. The smaller arena retains the food count of 40.

Spawn one random heart/shield/magnet every 15 seconds, with no more than 3 uncollected power-ups on the map. Uncollected power-ups expire after 20 seconds. Exact random distribution is unresolved.

| Pickup | Effect |
| --- | --- |
| Basic food | Add 1 segment. Shape follows the map theme. |
| Heart | Restore 1 life, up to 3; restore skeleton → normal → selected suit appearance. At 3 lives, the heart stays on the map and is not collected. |
| Shield | 5 seconds of pass-through protection with flickering and a visible corner countdown. |
| Magnet | Attract only basic food within a fixed 10-world-unit radius for 5 seconds; show countdown. Radius never depends on snake length or segment dimensions. |
| Robot mark | 10 points and 1 added segment. |

Shield and magnet can be active together. Recollecting either restarts that effect's timer at 5 seconds rather than adding time. The interaction between overlapping damage protection and shield protection is not yet specified.

The owner delegated assignment of item points. Use this PRD scoring allocation:

| Collected item | Player points |
| --- | --- |
| Basic food | 10 |
| Robot mark | 10, explicitly selected by owner |
| Heart successfully collected | 25 |
| Shield | 15 |
| Magnet | 15 |

Score stays unchanged on damage. Survival time and length appear in results; no separate survival-time score or kill bonus is specified.

## 9. Screens and flow

Approved primary flow: **Home → Play Setup → 3-second Countdown → Gameplay → Game Over**.

### Home

Show the Snake Game name, an animated suited snake, a prominent Play button, four map previews, How to Play, Settings, and per-map Best Scores.

### Play setup

Choose map, suit, snake color, and starting 2D/3D view. Show a snake preview whose background follows the selected map; labels remain readable on Neon’s dark background. Continue is the default movement behavior and Riding is the default 3D camera. All maps and suits are immediately available.

### Gameplay HUD

- Score, three life indicators, and snake length.
- Advance speed warning.
- Shield and magnet countdowns in a corner.
- Pause control.
- 2D/3D switch.
- Stop/Continue toggle.
- Riding/Chase camera toggle in 3D.
- 3D minimap.
- Keyboard steering and tap/click destinations; no on-screen left/right buttons.
- Music and sound controls.

Keep controls readable and usable in desktop, mobile, tablet, portrait, and landscape layouts. Preserve the whole-arena view in 2D as layouts change. The minimap shows boundaries, player, robots, food, bombs, and power-ups. HUD placement remains a design detail.

### Pause

Freeze movement, robots, collisions, spawns, progression, match time, protection, and expiry timers. Browser focus loss triggers this same pause behavior. Returning browser focus keeps the game paused until Resume is selected. Survival time excludes the opening countdown and all pauses. Other menu actions remain unresolved.

### Game over

Show final score, the selected map's best score, final length, and survival time. Offer Retry and Home. Retry reuses the same setup selections and begins a fresh match; score, lives, length, hazards, and effect timers reset according to starting rules.

### Tutorial

A short skippable practice area teaches target taps/clicks, Stop/Continue, held steering, lives, power-ups, and camera switching. It is accessible again from Home. Offer the skippable tutorial on the first visit, save tutorial completion locally, and allow replay from Home. Tutorial results never change best scores.

## 10. UI, audio, and accessibility

Use rounded panels, blush and peach backgrounds, pastel pink panels, and deep rose/coral accents, readable dark text, and rounded lettering. Map artwork supplies theme-specific colors. Add believable visual depth through shadows and tactile-looking controls while retaining the cartoon game style. Use clear hierarchy and contrast; important states must have labels or icons rather than color alone.

Provide light looping music appropriate to each map, cheerful pickup effects, a distinct damage sound, and a rising speed-warning cue. Provide independent music and sound-effect controls. Asset sources and exact tracks remain unselected.

Include reduced-motion options, keyboard-accessible menus, and readable high-contrast HUD labels. Reduced-motion treatment must account for camera motion and protection flickering; its exact treatment is unresolved. Support touch interaction in portrait and landscape without requiring a keyboard.

## 11. Local persistence

Play requires no sign-in. Use `localStorage` for best scores and preferences. Maintain a separate best score for each map; 2D and 3D share that map's best score because players can switch within a match. Accounts and an online leaderboard are outside the requested scope.

Save map/suit/color choices, view/camera preferences, music and effects levels, reduced motion, tutorial completion, and per-map best scores in localStorage. Every new match starts in Continue mode; movement begins automatically when the 3-second countdown ends. Do not save unfinished matches. If storage fails, play still works; show a notice that scores and settings cannot be saved. The storage key schema remains an implementation detail. No backend is required by the agreed gameplay or local persistence requirements.

## 12. Open decisions — do not silently assume

These details require an owner decision or an explicitly delegated design choice before implementation locks them in:

1. Entry point to `/snake-game` from the existing website.
2. Countdown interruption behavior.
3. Target guidance path selection, fixed segment spacing/body-following model, and robot colors and appearance.
4. Simultaneous contact batching beyond the approved once-per-contact and initiator rules.
5. Exact hazard warning/spawn timing at a length milestone, safe spawn distance, and food/power-up placement rules.
6. Simultaneous or rapidly crossed growth milestones and warning scheduling.
7. Overlap of shield and damage protection; food attraction speed and consumption behavior under magnet effects.
8. Exact camera offsets and safe zoom limits.
9. Pause menu actions beyond Resume.
10. Unsupported-renderer behavior, browser support, performance targets, loading/error flows, asset selection, and asset licensing.

The agreed features and numeric rules above form the current scope. Open decisions are recorded explicitly rather than invented. No implementation phases or acceptance-criteria section is included.


## 2D readability update

The full-map 2D view uses an illustrated canvas layer with screen-size minimums: 17px food symbols, 20px bombs/power-ups, 25px obstacle symbols, and 12px snake bodies. Snake heads show eyes and robots retain antennae. YOU/ROBOT labels, distinct symbols, and a compact legend clarify the object types; a subdued grid reduces clutter. Petal Parade flowers and fabric seams distinguish outfits. Protection uses a steady ring, and damage still changes the appearance. Obstacle bases show their actual blocking radius; enlarged symbols are visual aids, not enlarged collision shapes.

The layer shares Babylon's full-map projection (100-unit arena and five-unit margin), so targeting and gameplay positions remain aligned across viewport sizes. 3D uses the original scene. Camera switches keep match state, and the overlay ignores pointer input so existing tap, keyboard, and touch steering continue to work. No collision sizes, item counts, or movement rules change.


## Controls and feedback refinement

- A new reachable target after an obstacle stop reorients the head before its first movement step. Obstacles remain solid: a destination through a blocker still requires the player to choose a route around it.
- 2D obstacles use gray square badges with desaturated theme symbols and corner studs. Food stays colorful and unboxed. The circular obstacle footprint and collision rules remain unchanged.
- The default and Reset Camera use the maximum existing camera-distance multiplier, 2.5 (the widest view); manual range remains 0.65–2.5.
- Bomb contact shows a 1.1-second local starburst/shockwave with sparks, smoke and a distinct explosion sound. 2D also shows BOOM!. This animation adds no area damage or camera shake.
- Hearts, shields, and magnets have bright colored shells/halos and a sparkle, distinct from food and bombs. Reduced motion uses steady shells and a static blast indicator. All animation timing uses match time, so Pause freezes effects.


## 3D camera comfort update

Keyboard turns remain immediate in the simulation. A separate camera-follow state smooths the heading, follow position, orbit, camera distance, height and look-ahead. Both camera position and look target derive from that same state, avoiding the old instant look-direction jump during a 90-degree turn. Automatic rotation follows the shortest angular path, eases out, and is capped at 144 degrees/second. Exponential easing makes follow behavior consistent across frame rates; long frame gaps cannot cause a large single-frame camera jump.

Entering 3D initializes directly at the current follow pose, avoiding a sweep from the overhead 2D camera. Riding/Chase, zoom and Reset Camera changes ease into place. Reduced-motion mode holds the current world-facing heading while smoothly following position; deliberate orbit and zoom still work. Switching reduced motion off smoothly resumes heading follow. No gameplay turning, collision or scoring rules change.


### Hold W to move forward

In either camera view, holding W moves straight along the current heading. In Stop mode, releasing W stops immediately unless a left/right control remains held. W clears the previous click destination; it does not resume on release. A/D and arrow keys still turn immediately while W is held, and releasing a turn keeps forward movement active. Continue mode retains forward movement after W release. Pause or focus loss clears held forward input; resuming requires a fresh W press. Countdown and game-over states ignore forward presses. Obstacles and arena boundaries block movement and cost one life unless protected.


### Up/Down keyboard controls

W and Up Arrow share hold-to-move behavior. S and Down Arrow turn the snake around immediately (180 degrees) once per press, then move along that heading while held. Key repeat never triggers additional turns; overlapping S/Down presses count as one held reverse control. Releasing one alias keeps movement active while another travel key is held. Releasing all travel keys stops in Stop mode unless a turn control remains held; Continue mode keeps moving. Pause/focus loss clears held keys and requires fresh presses. Both views use the same controls, and arrow keys do not scroll the page during play.


### 2D map controls and visible contact areas

In 2D, W/Up points toward the top of the map, S/Down toward the bottom, A/Left toward the left and D/Right toward the right. The latest held key wins; releasing it returns to the remaining held direction in Stop mode; Continue mode retains the latest chosen heading. Releasing all keys stops in Stop mode. 3D retains snake-relative controls. Switching views clears held input, and a fresh press is required. Pause/focus loss also clears map keys.

2D food and bombs have circular badges whose outer edges define their active area. The renderer and model share screen-space sizes, including the snake body outline; contact occurs when the visible snake and badge touch. The geometry updates with viewport size. Food still requires head contact; bombs still react to any body segment. 3D keeps its existing collision distances. Decorative emoji details do not enlarge the circular badge's hit area.


### Solid-surface damage

In both 2D and 3D, player head contact with an obstacle or arena boundary stops movement, clears the destination, and costs one life. This uses the same damage event, three-second recovery protection, shield immunity, and game-over behavior as bomb damage. Solids remain impassable even when protected. Holding movement into a surface counts as one contact and cannot drain additional lives after protection expires; moving away and contacting a surface again can cause another hit. Obstacles and boundaries remain in place and do not explode. Robot avoidance is unchanged.


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
