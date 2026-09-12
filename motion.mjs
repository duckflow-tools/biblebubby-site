// Local Rive 2.41.0 runtime; page content remains usable without JavaScript.
export function createBubbyRig(rive, file) {
  const artboard = file.artboardByName('Bubby C');
  if (!artboard) throw new Error('Bubby C artboard unavailable');
  const definition = artboard.stateMachineByName('Bubby');
  if (!definition) { artboard.delete(); throw new Error('Bubby state machine unavailable'); }
  const model = file.defaultArtboardViewModel(artboard);
  const instance = model?.defaultInstance();
  if (instance) artboard.bindViewModelInstance(instance);
  const machine = new rive.StateMachineInstance(definition, artboard);
  if (instance) machine.bindViewModelInstance(instance);
  return {
    artboard,
    advance(seconds) { machine.advanceAndApply(seconds); },
    delete() { machine.delete(); instance?.unref(); artboard.delete(); },
  };
}

async function enhance() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = document.getElementById('hero-phone');
  const stage = document.getElementById('bubby-stage');
  const canvas = document.getElementById('bubby-idle');
  let scrollFrame = 0;
  function positionPhone() {
    scrollFrame = 0;
    phone.style.transform = reduced.matches ? '' : `translateY(${Math.min(14, Math.max(0, scrollY * 0.025))}px)`;
  }
  addEventListener('scroll', () => {
    if (!reduced.matches && !scrollFrame) scrollFrame = requestAnimationFrame(positionPhone);
  }, { passive: true });
  reduced.addEventListener('change', positionPhone);
  positionPhone();

  // Reduced motion starts with the exact SVG and avoids downloading the rig.
  if (reduced.matches) return;
  let rive, rig, file, renderer, frame = 0, previous = 0, visible = true, failed = false;
  function stop() {
    if (frame) rive.cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
  }
  function showStatic() { stage.removeAttribute('data-ready'); canvas.hidden = true; }
  function draw(time) {
    frame = 0;
    if (reduced.matches || document.hidden || !visible || failed) return;
    try {
      const seconds = previous ? Math.min((time - previous) / 1000, 0.05) : 1 / 60;
      previous = time;
      const size = Math.max(1, Math.round(stage.clientWidth * Math.min(devicePixelRatio || 1, 2)));
      if (canvas.width !== size) canvas.width = canvas.height = size;
      renderer.clear();
      rig.advance(seconds);
      renderer.save();
      renderer.align(rive.Fit.contain, rive.Alignment.center,
        { minX: 0, minY: 0, maxX: size, maxY: size }, rig.artboard.bounds);
      rig.artboard.draw(renderer);
      renderer.restore();
      canvas.hidden = false;
      stage.setAttribute('data-ready', '');
      frame = rive.requestAnimationFrame(draw);
    } catch {
      failed = true;
      stop();
      showStatic();
      rig?.delete();
      renderer?.delete();
      file?.delete();
    }
  }
  function resume() {
    stop();
    if (reduced.matches) showStatic();
    else if (!document.hidden && visible && !failed) frame = rive.requestAnimationFrame(draw);
  }
  try {
    const { default: Rive } = await import('./vendor/canvas_advanced.mjs');
    rive = await Rive({ locateFile: (name) => new URL(`./vendor/${name}`, import.meta.url).href });
    const response = await fetch(new URL('./images/bubby.riv', import.meta.url));
    if (!response.ok) throw new Error('Rig unavailable');
    file = await rive.load(new Uint8Array(await response.arrayBuffer()));
    if (!file) throw new Error('Rig could not load');
    rig = createBubbyRig(rive, file);
    renderer = rive.makeRenderer(canvas);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
    observer.observe(stage);
    reduced.addEventListener('change', resume);
    document.addEventListener('visibilitychange', resume);
    addEventListener('pagehide', stop);
    addEventListener('pageshow', resume);
    resume();
  } catch {
    failed = true;
    showStatic();
    rig?.delete();
    renderer?.delete();
    file?.delete();
  }
}

if (typeof document !== 'undefined') void enhance();
