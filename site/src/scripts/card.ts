/**
 * Holographic card interactions.
 *
 * Input sources, in priority order:
 *  - mouse/pen hovering anywhere on the page;
 *  - a finger dragging on the card (a short tap flips it);
 *  - the device's tilt sensor, on phones;
 *  - otherwise a slow idle drift so the foil shimmers, which settles back
 *    to rest after a few seconds (WCAG 2.2.2: nothing moves forever).
 *
 * Everything funnels into one target point that a single rAF loop eases
 * toward, writing a handful of CSS custom properties. The loop stops while
 * the tab is hidden and never starts under prefers-reduced-motion.
 */

interface Point {
  x: number;
  y: number;
}

const IDLE_AFTER = 2500; // ms without input before the idle drift resumes
const DRIFT_FOR = 12000; // ms of idle drift before the card settles and stops
const TAP_SLOP = 10; // px a finger may move and still count as a tap
const TILT_X = 22; // max rotateY, degrees
const TILT_Y = 18; // max rotateX, degrees

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** iOS 13+ gates motion sensors behind a permission prompt. */
type PermissionedOrientation = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

export function mountCard(): void {
  const card = document.getElementById('card');
  const front = document.getElementById('front');
  const back = document.getElementById('back');
  if (!card || !front || !back) return;

  const style = card.style;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ---- Flip -------------------------------------------------------------

  let flipped = false;
  function setFlipped(value: boolean): void {
    flipped = value;
    card!.classList.toggle('is-flipped', flipped);
    // Only the visible face is reachable by keyboard and screen readers.
    front!.inert = flipped;
    back!.inert = !flipped;
    front!.setAttribute('aria-hidden', String(flipped));
    back!.setAttribute('aria-hidden', String(!flipped));
  }

  // ---- Tilt state -------------------------------------------------------

  const target: Point = { x: 0.5, y: 0.5 };
  const current: Point = { x: 0.5, y: 0.5 };
  let hot = false; // brighter foil while someone is interacting
  let lastInput = -Infinity;
  let frame = 0;
  let lastFrame = 0;
  let running = false;
  let driftStart: number | null = null;

  function input(x: number, y: number): void {
    target.x = clamp(x, -0.3, 1.3);
    target.y = clamp(y, -0.3, 1.3);
    hot = true;
    lastInput = performance.now();
    start();
  }

  function render(): void {
    const { x, y } = current;
    style.setProperty('--rx', `${((y - 0.5) * -TILT_Y).toFixed(2)}deg`);
    style.setProperty('--ry', `${((x - 0.5) * TILT_X).toFixed(2)}deg`);
    style.setProperty('--px', `${(x * 100).toFixed(1)}%`);
    style.setProperty('--py', `${(y * 100).toFixed(1)}%`);
    style.setProperty('--bx', `${(clamp(x, 0, 1) * 100).toFixed(1)}%`);
    style.setProperty('--by', `${(clamp(y, 0, 1) * 100).toFixed(1)}%`);
    style.setProperty('--ho', hot ? '0.55' : '0.38');
  }

  function tick(now: number): void {
    // Keyboard users inside the card count as active: no drift under focus.
    if (card!.contains(document.activeElement)) lastInput = now;
    const idle = now - lastInput > IDLE_AFTER;
    let settled = false;
    if (idle) {
      driftStart ??= now;
      hot = false;
      if (now - driftStart < DRIFT_FOR) {
        const t = now / 1000;
        target.x = 0.5 + Math.sin(t * 0.9) * 0.32;
        target.y = 0.5 + Math.cos(t * 0.7) * 0.26;
      } else {
        target.x = target.y = 0.5;
        settled =
          Math.abs(current.x - 0.5) < 0.002 &&
          Math.abs(current.y - 0.5) < 0.002;
      }
    } else {
      driftStart = null;
    }
    // Frame-rate independent easing: snappy under a finger, lazy when idle.
    const dt = Math.min(now - (lastFrame || now), 100);
    lastFrame = now;
    const ease = 1 - Math.pow(idle ? 0.94 : 0.75, dt / 16.7);
    current.x += (target.x - current.x) * ease;
    current.y += (target.y - current.y) * ease;
    render();
    if (settled) stop();
    else frame = requestAnimationFrame(tick);
  }

  function start(): void {
    if (running || motion.matches || document.hidden) return;
    running = true;
    lastFrame = 0;
    frame = requestAnimationFrame(tick);
  }

  function stop(): void {
    running = false;
    cancelAnimationFrame(frame);
  }

  function rest(): void {
    stop();
    current.x = target.x = 0.5;
    current.y = target.y = 0.5;
    hot = false;
    render();
  }

  document.addEventListener('visibilitychange', () =>
    document.hidden ? stop() : start(),
  );
  motion.addEventListener('change', () => (motion.matches ? rest() : start()));

  // ---- Mouse / pen: hover anywhere on the page --------------------------

  function relative(clientX: number, clientY: number): Point {
    const r = card!.getBoundingClientRect();
    return { x: (clientX - r.left) / r.width, y: (clientY - r.top) / r.height };
  }

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      const p = relative(e.clientX, e.clientY);
      input(p.x, p.y);
    },
    { passive: true },
  );

  // ---- Touch: drag on the card tilts it, a tap flips it -----------------

  let touchId: number | null = null;
  let touchStart: Point = { x: 0, y: 0 };
  let dragged = false;
  let touchEnded = 0;

  card.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch' || touchId !== null) return;
    touchId = e.pointerId;
    touchStart = { x: e.clientX, y: e.clientY };
    dragged = false;
    const p = relative(e.clientX, e.clientY);
    input(p.x, p.y);
  });

  card.addEventListener('pointermove', (e) => {
    if (e.pointerId !== touchId) return;
    if (
      Math.hypot(e.clientX - touchStart.x, e.clientY - touchStart.y) > TAP_SLOP
    )
      dragged = true;
    const p = relative(e.clientX, e.clientY);
    input(p.x, p.y);
  });

  const endTouch = (e: PointerEvent) => {
    if (e.pointerId !== touchId) return;
    touchId = null;
    touchEnded = performance.now();
  };
  card.addEventListener('pointerup', endTouch);
  card.addEventListener('pointercancel', endTouch);

  card.addEventListener('click', (e) => {
    // Only a click synthesised right after a touch drag is ignored; keyboard
    // (detail 0) and later mouse clicks are never affected by a stale flag.
    const fromDrag =
      dragged && e.detail !== 0 && performance.now() - touchEnded < 600;
    dragged = false;
    if ((e.target as Element).closest('a')) {
      // A drag that ends on a link should not open it.
      if (fromDrag) e.preventDefault();
      return;
    }
    if (!fromDrag) setFlipped(!flipped);
  });

  // ---- Device tilt -------------------------------------------------------

  let baseline: number | null = null;
  // Sensor angles are in the device frame; remap them to the screen frame.
  function screenAngle(): number {
    return ((screen.orientation.angle % 360) + 360) % 360;
  }
  screen.orientation.addEventListener('change', () => (baseline = null));

  function onOrientation(e: DeviceOrientationEvent): void {
    if (e.beta === null || e.gamma === null || touchId !== null) return;
    const { beta, gamma } = e;
    // side: left/right roll as seen on screen; forward: tilt toward the user.
    const [side, forward] = {
      0: [gamma, beta],
      90: [beta, -gamma],
      180: [-gamma, -beta],
      270: [-beta, gamma],
    }[screenAngle() as 0 | 90 | 180 | 270] ?? [gamma, beta];
    // Remember how the phone is held at first, and tilt relative to that,
    // easing the baseline so it re-centres over time.
    baseline ??= clamp(forward, 10, 70);
    baseline += (clamp(forward, 10, 70) - baseline) * 0.01;
    const x = 0.5 + clamp(side / 30, -1, 1) * 0.5;
    const y = 0.5 + clamp((forward - baseline) / 25, -1, 1) * 0.5;
    input(x, y);
    hot = false; // keep the brighter foil for direct touches
  }

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const Orientation = window.DeviceOrientationEvent as
    PermissionedOrientation | undefined;
  if (coarse && Orientation && !motion.matches) {
    // Android: events flow right away. iOS: they flow too if the visitor
    // already allowed motion access for this site.
    window.addEventListener('deviceorientation', onOrientation);
    if (typeof Orientation.requestPermission === 'function') {
      // iOS only grants sensor access from a user gesture, so ask on the
      // visitor's first touch anywhere on the page. No button needed; until
      // then (or if refused) touch drag and the idle drift drive the foil.
      document.addEventListener(
        'touchend',
        () => {
          Orientation.requestPermission!().catch(() => {});
        },
        { once: true, passive: true },
      );
    }
  }

  // ---- Go ------------------------------------------------------------------

  if (motion.matches) rest();
  else start();
}
