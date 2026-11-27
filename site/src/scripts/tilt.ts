/**
 * Tilt and foil engine, shared by every card.
 *
 * Inputs (mouse hover handled here; touch drag and the tilt sensor call
 * `input`/`pointAt`) funnel into one target point that a single rAF loop
 * eases toward, writing the shell's CSS custom properties on the attached
 * (active) card only. Without input, a slow idle drift makes the foil
 * shimmer, then settles back to rest and the loop stops (WCAG 2.2.2). The
 * loop also stops while the tab is hidden and never runs under
 * prefers-reduced-motion.
 */

export interface Tilt {
  /** Drive this card from now on, starting from rest. */
  attach(card: HTMLElement): void;
  /** Aim at a point in card units (0..1, may overshoot a little). */
  input(x: number, y: number, hot?: boolean): void;
  /** Aim at a viewport point. */
  pointAt(clientX: number, clientY: number): void;
}

const IDLE_AFTER = 2500; // ms without input before the idle drift resumes
const DRIFT_FOR = 12000; // ms of idle drift before the card settles and stops
const TILT_X = 22; // max rotateY, degrees
const TILT_Y = 18; // max rotateX, degrees

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export function createTilt(reducedMotion: MediaQueryList): Tilt {
  let card!: HTMLElement;
  const target = { x: 0.5, y: 0.5 };
  const current = { x: 0.5, y: 0.5 };
  let hot = false; // brighter foil while someone is interacting
  let lastInput = -Infinity;
  let frame = 0; // rAF id, 0 while the loop is stopped
  let lastFrame = 0;
  let driftStart: number | null = null;

  function input(x: number, y: number, isHot = true): void {
    target.x = clamp(x, -0.3, 1.3);
    target.y = clamp(y, -0.3, 1.3);
    hot = isHot;
    lastInput = performance.now();
    start();
  }

  function pointAt(clientX: number, clientY: number): void {
    const r = card.getBoundingClientRect();
    input((clientX - r.left) / r.width, (clientY - r.top) / r.height);
  }

  function render(): void {
    const { x, y } = current;
    const style = card.style;
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
    if (card.contains(document.activeElement)) lastInput = now;
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
    if (frame || reducedMotion.matches || document.hidden) return;
    lastFrame = 0;
    frame = requestAnimationFrame(tick);
  }

  function stop(): void {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  /** Back to the flat pose. */
  function center(): void {
    current.x = target.x = 0.5;
    current.y = target.y = 0.5;
    hot = false;
    render();
  }

  function rest(): void {
    stop();
    center();
  }

  function attach(next: HTMLElement): void {
    // The previous card keeps its pose while it leaves; the new one starts
    // flat, with its own short drift.
    card = next;
    lastInput = -Infinity;
    driftStart = null;
    center();
    start();
  }

  document.addEventListener('visibilitychange', () =>
    document.hidden ? stop() : start(),
  );
  reducedMotion.addEventListener('change', () =>
    reducedMotion.matches ? rest() : start(),
  );

  // Mouse and pen: hovering anywhere on the page tilts the card.
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'touch') pointAt(e.clientX, e.clientY);
    },
    { passive: true },
  );

  return { attach, input, pointAt };
}
