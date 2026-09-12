# BibleBubby landing page

Kyle's latest direction: flat Bubby beside a phone showing the real Home ascent, three screenshot-led learning beats and one App Store badge. This folder is a standalone static site with one stylesheet, local Rubik fonts, local images and an optional local Rive runtime. No framework, package install, build command, external script or backend is needed.

## Publish to the separate GitHub Pages repo

1. Copy the contents of this folder into the publishing repository's root, including `legal/`, `images/`, `vendor/`, `motion.mjs` and `.nojekyll`. Do not copy the app repository, evidence, Blender sources or secrets.
2. In that repository's Settings → Pages, choose “Deploy from a branch”, the publishing branch, and `/(root)`, then Save. All resource URLs are relative, including the Rive binary and WebAssembly, so a project URL with a repository prefix works. See [GitHub's publishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
3. After the page is checked, configure `biblebubby.com` in GitHub Pages and point the domain's web records in Squarespace at the values GitHub supplies. Preserve the support mailbox's mail records. Kyle owns publication and DNS; this lane has not deployed or changed either. [Squarespace domain pointing](https://support.squarespace.com/hc/en-us/articles/215744668-Pointing-a-Squarespace-domain).

## Finish before publication

- Replace the non-interactive `.store-badge` wrapper with an anchor to the verified public App Store listing. The badge itself is Apple's official SVG. `eas.json` lists App Store Connect id `6802094254`; a public listing was not verified. Remove the “App Store link coming soon” note when the link is live.
- The relative `legal/privacy.html` and `legal/terms.html` links are ready. Per Fable's September 12 direction, these mirror the app legal text exactly, including its update date and contact address, and share `styles.css`.
- Headless Edge captures at 390 × 844 and 1280 × 900 are in the app repo's `docs/design/explorations/web-landing/390.png` and `1280.png`. They show the static fallback over `file://`; check hosted scrolling and Rive behavior after publication. The five unrelated Windows test-suite failures are assigned to the Mac landing gate by Fable.

## Assets and motion

`images/bubby.svg` is the exact app master; `bubby.riv` uses `Bubby C` / `Bubby`. Without JavaScript, on reduced motion, or if the runtime fails, the SVG stays visible. With motion enabled, Bubby idles and the phone moves at 2.5% of scroll distance, capped at 14 pixels. Idle pauses offscreen and when the tab is hidden. The Rive runtime is vendored at 2.41.0 with its license and both WebAssembly variants. The Rubik font license is included beside the fonts.

The three screenshots are real September 12 native walkthrough captures from `docs/overview/captures/walk2-2026-09-12/`: `05-chunk-top.png`, `04-chunk1-hint.png`, and `01-home-start.png`. The last is also the texture in the Blender phone. They are unchanged historical captures, not new store-candidate certification. Editable phone source: `assets/web/landing/home-phone.blend`; reproducible script: `assets/web/landing/build-phone.py` in the app repository. Earlier concept boards and landscape renders are superseded and are not part of this website.

Headless checks from the app worktree:

```powershell
python docs/design/explorations/web-landing/check-landing.py
node --test docs/design/explorations/web-landing/motion-check.mjs
node docs/design/explorations/web-landing/render-legal.mjs --check
node docs/design/explorations/web-landing/capture-page.mjs
```

Add `--release` to the Python check to require legal links and both page screenshots. The capture helper runs native headless Edge and pins the CSS viewport because Edge's minimum window size can otherwise crop the narrow capture. Kyle still owns publication and the live App Store link.
