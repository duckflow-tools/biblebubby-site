# BibleBubby landing page

WEB3 is a standalone page: one outcome headline, one purple glass iPhone download, a flat green world at dawn, live Bubby, and one Genesis phone on the path. Local Rubik and vendored Rive 2.41.0 need no framework, external script, build service or backend.

## Publish

Copy this entire folder, including images, vendor, legal, motion.mjs and .nojekyll, to the separate GitHub Pages repository. All local requests are relative, including the Rive WASM mapping. Serve .mjs as JavaScript and .wasm as application/wasm. A file:// preview can block Rive fetches; use HTTP. Kyle owns publication and the domain. No site was published by this lane.

The single download capsule and desktop QR target https://apps.apple.com/app/id6802094254. The QR is hidden below 700 px. Its existing local generator is assets/web/landing/generate-qr.py; if the target changes, update the link, regenerate and decode the QR. Legal HTML is linked unchanged. Support is support@biblebubby.com.

## Source artwork

The brief’s suggested roadmap/images/ui folders were inspected. The reusable Home ascent artwork actually lives under assets/brand/credo/home on this host. Four SVG plates in images/world replace the retired Blender PNGs. docs/design/explorations/web-landing/v3/build-world.py reproduces them from the real background-hills.svg contours and cloud, plus vector/landmark-1.svg trees. The winding path and foreground contour are drawn as simple flat extensions; the natural tree colours are preserved. The sky gradient and edge haze are CSS. No imagegen or 3D rendering was used.

images/bubby.riv remains the WEB2 export: Bubby C artboard, Bubby machine, greet binding, with the existing approved SVG fallback. The Genesis image is byte-identical to docs/overview/captures/walk2-2026-09-12/05-chunk-top.png. It is historical native evidence, not a new build capture. The superseded second phone and four Blender PNGs were removed from this publishing folder.

## Motion and accessibility

Four scenery depths move by CSS transform, capped at 24 px; Bubby follows the path depth. The Rive rig breathes, greets once after 1.2 seconds of visible playback, then idles. It pauses when hidden or offscreen. The phone floats 5 px over six seconds. No other continuous motion is present.

Reduced motion shows static Bubby, removes parallax and phone float, and disables the pressed-button translation. Starting reduced skips Rive/WASM downloads; live preference changes work in both directions. A failed rig download or disabled JavaScript preserves the fallback and download. Keyboard focus and a skip link remain available. Text uses dark ink; the button label’s conservative contrast is 4.67:1, supporting text at least 4.74:1 across the sky endpoints, headline at least 6.60:1, and caption 14.85:1.

## Reproduce the evidence

From the app worktree on native Windows PowerShell:

- python docs/design/explorations/web-landing/v3/build-world.py
- python docs/design/explorations/web-landing/v3/check-assets.py
- node --test docs/design/explorations/web-landing/v3/motion-check.mjs
- node docs/design/explorations/web-landing/v3/capture-page.mjs

The asset check uses the host’s Pillow and zxing-cpp. Capture uses isolated headless Edge and a temporary loopback server, both closed on exit. It checks 390 and 1280 widths in light mode, overflow, local image loads, the single download, desktop-only QR, actual Rive pixel changes, phone movement, four scroll depths, reduced motion, blocked-rig fallback and disabled JavaScript. No interactive browser or review interface is opened. The reference study is separately reproducible with study-capture.mjs.

Viewport and full-page PNGs, reduced-motion evidence, sampled Bubby frames and structured check summaries live under docs/design/explorations/web-landing/v3. Every image is below 5 MB. Earlier WEB1/WEB2 layout and plate checks describe superseded versions; run the v3 checks for this page.
