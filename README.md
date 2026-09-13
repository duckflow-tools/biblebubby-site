# BibleBubby landing page

WEB4 is a standalone daylight landing page with a Blender world and Bubby sculpt, white Rubik headline and supporting copy, one purple glass download capsule, a desktop QR, one Genesis phone on the path, and support/legal links. No framework, backend or external script is required.

## Publish

Copy this entire folder, including images, legal, motion.mjs and .nojekyll, to the separate GitHub Pages repository. All requests are relative. Serve .mjs as JavaScript, .webm as video/webm and .mp4 as video/mp4, ideally with byte-range support. Use HTTP for local viewing. Kyle owns publication; this lane has not deployed the page.

The capsule and QR both target https://apps.apple.com/app/id6802094254. The QR appears from 700 px. Legal content is unchanged. Support is support@biblebubby.com. The Genesis phone uses the existing reading capture; it is historical native evidence.

## Blender sources

The editable sources are assets/web/landing/build-v4.py and prepare-bubby-v4.py. The latter samples the exact outlines, colors and facial landmarks in assets/brand/credo/pegasus.svg. The result is a rounded front-view sculpt with real mesh depth. The second attempt joins head and body into a continuous cream surface; the first attempt remains in evidence. This is the Blender character path, with no Rive fallback or rig edits.

assets/web/landing/v4 contains bubby-v4.blend (keyed breathing and blink), daylight-world.blend, a 2400 x 1350 transparent hero still, both attempts and camera registration. Both Blender files are under 4 MB. The publishing images/v4 folder contains registered sky and hill plates, the character still and both video formats. Old Rive and SVG assets remain available as historical sources but are not loaded by WEB4.

Reproduce on native Windows PowerShell with Blender 5.1.2 and FFmpeg 8.1:

```powershell
python assets/web/landing/prepare-bubby-v4.py
& 'C:/Program Files/Blender Foundation/Blender 5.1/blender.exe' -b -t 8 --python assets/web/landing/build-v4.py -- rig
& 'C:/Program Files/Blender Foundation/Blender 5.1/blender.exe' -b -t 8 --python assets/web/landing/build-v4.py -- world
& 'C:/Program Files/Blender Foundation/Blender 5.1/blender.exe' -b -t 8 --python assets/web/landing/build-v4.py -- animation
& ./assets/web/landing/encode-v4.ps1
```

Host Python needs numpy, scipy, shapely, svgpathtools and Pillow. The generated mesh cache and PNG sequence are ignored and reproducible. No dependencies are installed into or substituted for node_modules.

## Motion and fallback

The idle is six seconds, 144 frames at 24 fps, with two gentle breaths and one quarter-second blink centered at 4.25 seconds. The primary 512-square VP9 WebM has alpha. H.264 stores RGB in its left 512-square half and a grayscale alpha matte in its right half; the page canvas reconstructs transparency. It is an authored Blender animation, not a screen recording. This fallback is intentional because ordinary H.264 cannot encode transparency. Playback tests decoded VP9 alpha and switches to H.264 when it is discarded or the primary request fails.

Only the sky and hill plates receive scroll parallax, capped at 16 px and 4.8 px. Bubby stays anchored and the phone is still. Reduced motion starts with the PNG and skips both videos. Live preference changes restore the still, and hidden/offscreen playback pauses. Failed media and disabled JavaScript preserve the still and download action.

## Evidence and current limits

Run these headless checks from the app worktree:

```powershell
node --test docs/design/explorations/web-landing/v4/motion-check.mjs
python docs/design/explorations/web-landing/v4/check-assets.py
python docs/design/explorations/web-landing/v4/check-media.py
node docs/design/explorations/web-landing/v4/capture-page.mjs
python docs/design/explorations/web-landing/v4/check-browser-frames.py
```

The v4 evidence directory contains the side-by-side, idle contact sheet and decoded measurements. The model silhouette overlaps the registered master by 98.1%. This is an author comparison, not independent visual acceptance.

The v4 directory contains actual 390 × 844 and 1280 × 900 viewport captures, full-page captures, reduced-motion and fallback captures, and 28 PNG motion frames. The local headless Edge evidence pass was authorized by Fable on September 12 at 21:15 and is now permitted by AGENTS.md. The capture script follows WEB3: isolated native headless Edge, a temporary profile and a loopback server under the `/landing/` prefix. It closes its browser and server. It loads no external page or script. Direct file screenshots were also checked; use the loopback script for ES-module and video playback evidence.

Both widths have one download, loaded images and no horizontal overflow; the phone begins below the first viewport. The final evidence pass fades the sky plate edges, places white haze below the copy, and moves the mobile phone below 844 px. Six sampled sky pixels beside supporting copy give white contrast of at least 4.70:1. Browser assertions cover VP9 alpha, actual looping, live and initial reduced motion, re-enabling motion, offscreen pause, H.264 fallback, total media failure and disabled JavaScript. The PNG trace confirms changing character pixels and stationary scenery. Headless Edge does not certify Safari or native iPhone performance; independent visual acceptance and publication remain separate.
