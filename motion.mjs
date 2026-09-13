// Six-second Blender idle. All page content is usable without this enhancement.
export function applyMatte(color, matte) {
  for (let i = 0; i < color.length; i += 4) color[i + 3] = matte[i];
  return color;
}
export function parallaxDistance(scroll, depth, reduced) {
  return reduced ? 0 : Math.min(16, Math.max(0, scroll * .025)) * depth;
}
export function canAnimate({ reduced, hidden, visible, failed }) {
  return !reduced && !hidden && visible && !failed;
}
export function enhance(scope = window) {
  const doc = scope.document;
  const reduced = scope.matchMedia('(prefers-reduced-motion: reduce)');
  const stage = doc.getElementById('bubby-stage');
  const canvas = doc.getElementById('bubby-idle');
  const video = doc.getElementById('bubby-video');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const matte = doc.createElement('canvas');
  matte.width = matte.height = 512;
  const mask = matte.getContext('2d', { willReadFrequently: true });
  let visible = true, failed = false, started = false, packed = false, ready = false;
  let frame = 0, scrollFrame = 0;
  const active = () => canAnimate({ reduced: reduced.matches, hidden: doc.hidden, visible, failed });
  const showStill = () => { stage.removeAttribute('data-ready'); canvas.hidden = true; };
  const stop = () => { video.pause(); scope.cancelAnimationFrame(frame); frame = 0; };
  function draw() {
    frame = 0;
    if (!active() || !ready) return;
    ctx.clearRect(0, 0, 512, 512);
    ctx.drawImage(video, 0, 0, 512, 512, 0, 0, 512, 512);
    if (packed) {
      mask.drawImage(video, 512, 0, 512, 512, 0, 0, 512, 512);
      const color = ctx.getImageData(0, 0, 512, 512);
      applyMatte(color.data, mask.getImageData(0, 0, 512, 512).data);
      ctx.putImageData(color, 0, 0);
    }
    canvas.hidden = false;
    stage.setAttribute('data-ready', packed ? 'h264' : 'vp9');
    frame = scope.requestAnimationFrame(draw);
  }
  function fail() {
    if (!packed) { packed = true; ready = false; load(); }
    else { failed = true; stop(); showStill(); }
  }
  function load() {
    video.src = new URL(packed ? './images/v4/bubby-idle.mp4' : './images/v4/bubby-idle.webm', import.meta.url).href;
    video.load();
  }
  function resume() {
    stop();
    if (reduced.matches) showStill();
    if (!active()) return;
    if (!started) { started = true; load(); }
    else if (ready) {
      void video.play().then(() => { if (active() && !frame) draw(); else if (!active()) video.pause(); }).catch(showStill);
    }
  }
  video.addEventListener('loadeddata', () => {
    // Some engines advertise VP9 but discard its alpha. Check decoded pixels.
    if (!packed) {
      ctx.clearRect(0, 0, 512, 512); ctx.drawImage(video, 0, 0);
      if (ctx.getImageData(0, 0, 1, 1).data[3] > 8) { fail(); return; }
    }
    ready = true; resume();
  });
  video.addEventListener('error', fail);
  function position() {
    scrollFrame = 0;
    for (const plate of doc.querySelectorAll('[data-depth]')) {
      const distance = parallaxDistance(scope.scrollY, Number(plate.dataset.depth), reduced.matches);
      plate.style.transform = distance ? `translateY(${distance}px)` : '';
    }
  }
  scope.addEventListener('scroll', () => {
    if (!reduced.matches && !scrollFrame) scrollFrame = scope.requestAnimationFrame(position);
  }, { passive: true });
  const observer = new scope.IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
  observer.observe(stage);
  reduced.addEventListener('change', () => { position(); resume(); });
  doc.addEventListener('visibilitychange', resume);
  scope.addEventListener('pagehide', stop);
  scope.addEventListener('pageshow', resume);
  position(); resume();
}
if (typeof window !== 'undefined') enhance();
