# Jelly Breaker

A block breaker where everything is made of jelly. Bricks and the paddle are soft bodies that dent and wobble when hit, and the ball squishes on every bounce.

**Play:** https://jelly-breaker.vercel.app

## Controls

- **Touch:** drag anywhere to move the paddle, release to launch
- **Keyboard:** ← / → or A / D to move, Space to launch, P to pause, M to mute
- **Mouse:** move to steer, click to launch

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

The site is a static file hosted on Vercel.
