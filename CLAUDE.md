# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Jelly Breaker is a mobile-first block breaker where bricks, paddle and ball are soft bodies. The entire game — HTML, CSS and JS — lives in one self-contained `index.html`. There is no build step, no package.json, no dependencies, no tests and no linter. The only external resource is the Fredoka font from Google Fonts. Keep it a single file with no dependencies unless asked otherwise.

## Commands

- Run locally: `npx serve .` (or open `index.html` directly in a browser)
- Deploy: static hosting on Vercel (https://jelly-breaker.vercel.app); `.vercel/` is gitignored

For automated checks in a browser, the game exposes a debug hook `window.__jelly`: getters `state`, `score`, `blocks`, `balls`, `lives`, `level`, `bx`/`br` (first ball's x/radius), `px` (pad x), `hps` (brick HP list), `gun`, `megaTier`, `sticky`, `pads`, `stuck`, `drops`, `panel`, plus `give(type)` to grant a power-up instantly. The in-game Pause → Debug menu also jumps levels, spawns power-ups and adds lives.

## Architecture (inside `index.html`'s single IIFE `<script>`)

Code is split into sections marked `/* ---------- name ---------- */` comments: layout, jelly soft body, game state, physics, rendering, audio, input, boot.

- **Coordinates:** the game simulates in a fixed logical space `W = 360` wide; `H` is derived from the viewport aspect ratio, clamped to 560–820. `resize()` computes `scale`/`ox`/`oy` to letterbox it, positions the DOM `#stage` (HUD + overlay) over the same rect, and derives `CEIL` (the top wall) from the HUD's bottom edge. Pointer input converts screen → logical with `(clientX - ox) / scale`. The canvas covers the full screen at `dpr` (capped at 2.5); a pre-rendered backdrop canvas `bg` is redrawn on resize.
- **Main loop:** `frame()` runs a fixed-timestep accumulator (`STEP = 1/120`) calling `update(STEP)`, then `render()` once per rAF. Everything is frozen while `state === 'paused'`.
- **State machine:** `state` is one of `menu`, `ready` (ball stuck to paddle), `play`, `clear` (level-clear timer), `paused` (`prevState` holds what to resume to), `over`.
- **Overlay panels:** `#ov` holds `.panel`s switched by `show(id)` (`panel` holds the current one): `pMain` (title / game over, via `showOv()`), `pPause`, `pDebug`, `pDesign` (level designer), `pOrder` (level order + JSON export/import). Buttons use `data-a="action"` and are handled by one delegated click listener calling `act()`; Escape goes `back()` one panel. The global `touchmove` blocker exempts `.panel` so menus can scroll.
- **Soft bodies (`class Jelly`):** a ring of points (`nx` per horizontal edge, `ny` per vertical edge), each sprung to its rest offset (`k`), damped (`c`), and smoothed toward its neighbours (`kn`). `impulse()` adds a Gaussian-falloff velocity kick. Bodies go to sleep (`awake = false`) when energy falls below a threshold; the paddle sets `always = true` to stay awake. `path()` draws a smooth quadratic curve through the ring.
- **Collisions are against rigid AABBs, not the jelly shape.** Blocks are `{x, y, hw, hh, hp, maxHp, type, r, c, ...}` and the ball collides with that box (`stepBall`); the jelly `j` is purely visual feedback driven by impulses (plus a shockwave impulse to blocks within 110px in `hitBlock`). `fixSpeed()` renormalises ball speed to `speed()` every step and enforces a minimum vertical component.
- **Ball squish** is a separate 1D spring (`s`, `sv`) along the last contact normal (`ax`, `ay`), set by `squish()`.
- **Levels:** string grids, 7 columns, up to 10 rows. Chars (see `BRICK`): `.` empty, `1`–`3` HP, `R` row-clear, `C` column-clear, `B` bomb (3×3), `H` regen (3 HP, +1 HP 3s after its last hit, then every 1.5s). `LEVELS` are only the built-in defaults (`DEFAULTS`, ids `b1`…); the live library and play order are in localStorage (`jellybreaker.levels`, `jellybreaker.order`), and `playlist()` resolves the order (falling back to `DEFAULTS`; `testMap` overrides it while testing a level from the designer). Levels loop; each loop upgrades some 1-HP bricks to 2 HP, and `speed()` rises 20/level up to 480. Blocks drop in with a staggered `delay` and are not collidable until it expires.
- **Level share codes:** the designer's Share/Load-from-text use a one-line code `JB:<name>:<row>/<row>/...` (`dsShare`, `parseLevel`). The parser also accepts bare 7-char rows (e.g. pasted from `LEVELS`) and lowercase letters.
- **Brick kills:** `hitBlock` → `killBlock`; row/col/bomb bricks queue an entry in `fx` that fires `special()` ~0.09s later, so specials it destroys chain with a visible cascade (`beams` / big `rings` for the visuals).
- **Power-ups** (`DROPS`: colour, drop weight, name; 14% chance on a brick kill, max 3 falling): `wide`, `multi` (max 7 balls), `pad` (twin pad beside the main one; `pads()` returns the active pad rects and must be used for anything touching the paddle), `gun` (`gun` ammo, tiers 3→5→10 stack per pickup; tap/Space fires `shots`), `sticky` (ball sticks to the pad, `aim()` swings the launch angle, release on pointer-up/Space), `mega` (`megaTier` 1–3 → ball radius 2x/3x/4x). All cleared by `clearPowers()` on life lost and game start.
- **Input:** a quick tap (<250ms, <12px) on the canvas fires the gun; any pointer-up releases stuck balls. The mouse wheel moves `targetX` and sets `wheelLock`, which ignores hover steering until the mouse moves ~40px.
- **Audio:** all Web Audio synthesis, no files. `audioInit()` builds `master` → `musicBus`/`sfxBus`; `tone()` and `noise()` are the primitives, `sfx.*` are the effects (pitch follows `combo` on a pentatonic scale), and `schedule()`/`playStep()` run a look-ahead music sequencer. The AudioContext is created on first user gesture and suspended/resumed with pause and page visibility.
- **Persistence:** `localStorage` keys `jellybreaker.best`, `jellybreaker.muted`, `jellybreaker.levels`, `jellybreaker.order`, always accessed inside `try/catch`.
- **Mobile:** scrolling, zoom, gestures and context menu are blocked; `buzz()` triggers haptics where `navigator.vibrate` exists; layout uses safe-area insets.

## Code style

Dense, compact JS: short variable names, multiple statements per line, minimal comments. Match this style when editing rather than expanding code into a verbose form.
