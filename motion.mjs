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
  const greeting = instance?.trigger('greet');
  if (!greeting) {
    machine.delete(); instance?.unref(); artboard.delete();
    throw new Error('Bubby greeting unavailable');
  }
  let elapsed = 0, greeted = false;
  return {
    artboard,
    advance(seconds) {
      elapsed += seconds;
      if (!greeted && elapsed >= 1.2) { greeting.trigger(); greeted = true; }
      machine.advanceAndApply(seconds);
    },
    get greeted() { return greeted; },
    get state() { return instance?.string('playing')?.value; },
    delete() { machine.delete(); instance?.unref(); artboard.delete(); },
  };
}

async function enhance() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const plates = [...document.querySelectorAll('[data-depth]')];
  const stage = document.getElementById('bubby-stage');
  const canvas = document.getElementById('bubby-idle');
  let scrollFrame = 0;
  function positionPlates() {
    scrollFrame = 0;
    for (const plate of plates) {
      const distance = Math.min(24, Math.max(0, scrollY * .035));
      plate.style.transform = reduced.matches ? '' : `translateY(${distance * Number(plate.dataset.depth)}px)`;
    }
  }
  addEventListener('scroll', () => {
    if (!reduced.matches && !scrollFrame) scrollFrame = requestAnimationFrame(positionPlates);
  }, { passive: true });
  reduced.addEventListener('change', positionPlates);
  positionPlates();

  // The approved static frame stays visible until a complete runtime draw.
  let rive, rig, file, renderer, frame = 0, previous = 0, visible = true, failed = false;
  function stop() {
    if (frame) rive.cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
  }
  function showStatic() { stage.removeAttribute('data-ready'); canvas.hidden = true; }
  function draw(time) {
    frame = 0;
    if (reduced.matches) { showStatic(); return; }
    if (document.hidden || !visible || failed) return;
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
    } catch (error) {
      console.warn('Bubby motion unavailable', error);
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
  let started = false;
  async function start() {
    if (started || reduced.matches) return;
    started = true;
    try {
      const { default: Rive } = await import('./vendor/canvas_advanced.mjs');
      // The upstream loader requests canvas_advanced.wasm; our vendor uses rive.wasm.
      rive = await Rive({ locateFile: () => new URL('./vendor/rive.wasm', import.meta.url).href });
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
    } catch (error) {
      console.warn('Bubby motion unavailable', error);
      failed = true;
      showStatic();
      rig?.delete();
      renderer?.delete();
      file?.delete();
    }
  }
  reduced.addEventListener('change', () => { if (!reduced.matches) void start(); });
  await start();
}

if (typeof document !== 'undefined') void enhance();
