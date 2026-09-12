# BibleBubby landing page

WEB2 follows Kyle's concept 02: a quiet world, an outcome headline, and one iPhone download. This standalone static folder includes local Rubik, four Blender plates, the exported Bubby rig, and Rive 2.41.0. No external script, framework, build step, or backend is needed.

## Publish

Copy this entire folder, including images/world, vendor, legal, motion.mjs, and .nojekyll, into the separate static publishing repository. Serve over HTTPS with .mjs as JavaScript and .wasm as application/wasm. Relative URLs also work under a repository prefix. Opening index.html directly as a file can block Rive fetches and leave the static fallback visible.

Kyle owns publication and the Squarespace domain. Point the domain at the selected static host after reviewing the files. A Squarespace code-injection fragment alone is insufficient unless the full asset tree is hosted at matching paths. Preserve the support mailbox's mail records.

The download button and desktop QR both target https://apps.apple.com/app/id6802094254, the authorized placeholder listing. Public listing availability remains Kyle's publication check. The QR is generated locally by assets/web/landing/generate-qr.py using Python qrcode 8.2, with a four-module quiet zone. If the listing changes, update the anchor and generator, regenerate the image, and decode it again. Existing legal documents are linked unchanged.

## Assets and motion

Editable source: assets/web/landing/world-v2.blend (312,276 bytes). Blender 5.1.2 runs build-world-v2.py in background mode to reproduce the four 2400 by 1600 transparent plates. There is no baked character in the scene. Each PNG is under 5 MB; the scene is under 50 MB.

The Bubby C artboard and Bubby machine in images/bubby.riv supply the hero. The exported greet binding fires once after 1.2 seconds of visible animation, then returns to idle. The approved SVG is the static fallback. The loader maps its requested canvas_advanced.wasm filename to the vendored rive.wasm; preserve that mapping.

Scroll moves only scenery with CSS transforms, at four depths, capped at 24 px. Bubby shares the near plate's transform. Reduced motion shows the static character and disables every plate transform, including live preference changes. Starting reduced skips runtime and rig downloads; enabling motion later loads them. Offscreen and hidden-page animation pauses. Nothing else animates.

The two phone frames contain unchanged historical native screenshots. screen-reading.png comes from docs/overview/captures/walk2-2026-09-12/05-chunk-top.png. screen-note.png comes from evidence/TOUR1/frames/062-reader-note.png; the note sheet covers the older reader toolbar and page counter. These are genuine app captures, not generated UI or current native-build certification.

## Evidence and checks

Run from the app worktree on native Windows:

- node --test docs/design/explorations/web-landing/v2/motion-check.mjs
- python docs/design/explorations/web-landing/v2/check-assets.py
- node docs/design/explorations/web-landing/v2/capture-page.mjs

The asset check needs Pillow and zxing-cpp 3.1.1. Capture uses isolated headless Edge and a temporary loopback server, closed in its finally block. It checks the real browser runtime, overflow, single download action, responsive QR, reduced motion, blocked-rig fallback, and disabled JavaScript. Viewport screenshots at 390 by 844 and 1280 by 900, full-page images, sampled rig frames, and motion summaries are in docs/design/explorations/web-landing/v2. No interactive review page is opened. Earlier WEB1 checks describe the superseded page.
