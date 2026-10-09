# Jelly Breaker

A block breaker where everything is made of jelly. Bricks and the paddle are soft bodies that dent and wobble when hit, and the ball squishes on every bounce.

**Play:** https://jelly-breaker.vercel.app

## Controls

- **Touch:** drag anywhere to move the paddle, release to launch, quick tap to fire the gun / release a sticky ball
- **Keyboard:** ← / → or A / D to move, Space to launch / fire / release, P to pause, Esc for the pause menu (and back), M to mute
- **Mouse:** move or scroll the wheel to steer, click to launch / fire / release

## Bricks and power-ups

- Bricks: 1–3 hit, row-clear ↔, column-clear ↕, bomb ✸ (3×3, chains), regen ✚ (3 hits, heals if left alone for 3s)
- Power-ups: Wide, Multi, Twin pad, Gun (3 → 5 → 10 shots as you stack it), Sticky (catch the ball, launch along the swinging arrow), Mega ball (2x → 3x → 4x)

## Level designer

Pause → Debug → Level designer lets you paint levels on a 7×10 grid, save them, and test them straight away. Level order reorders, removes and adds levels, and exports/imports everything as JSON. Levels are saved in the browser's localStorage. To ship a level, paste its rows into `LEVELS` in `index.html`.

## Features

- Spring-ring soft-body physics for bricks and paddle, with hit shockwaves through neighbouring bricks
- Six level layouts that loop with tougher bricks and a faster ball
- Wide-paddle and multiball power-ups, two-hit bricks, combo scoring, saved best score
- Music and sound effects synthesized live with the Web Audio API (no audio files)
- Mobile first: locked scrolling and zoom, safe-area aware, haptics on Android

## Project layout

Everything lives in a single self-contained `index.html` (no build step, no dependencies). Open it in a browser or serve the folder with any static server:

```sh
npx serve .
```

## Deploying

The site is a static file hosted on Vercel. The Vercel project is linked to this repo, so every push to `main` deploys to production automatically.
