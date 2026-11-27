/**
 * Touch gestures, anywhere on the page. One finger either:
 *  - taps (moves less than TAP_SLOP): the click that follows goes through,
 *    so it flips the card or opens a link;
 *  - swipes (fast, mostly horizontal): switches card, and the click that
 *    may follow is swallowed (no flip, no link);
 *  - or drags: tilts the card when it started on it; no click either.
 * Pinch-zoom (two fingers) is left to the browser. While the page is
 * zoomed in, one finger pans it instead: no swipe, and the root gets
 * `.is-zoomed` (the page and the card relax their touch-action).
 */

const TAP_SLOP = 10; // px a finger may move and still count as a tap
const SWIPE_MIN = 50; // px of horizontal travel
const SWIPE_RATIO = 1.5; // horizontal travel / vertical travel
const SWIPE_MAX_MS = 700;
const CLICK_GRACE = 600; // ms after a drag during which a click is ignored

export interface TouchOptions {
  /** Whether a touch starting on this element drives the tilt. */
  canDrag(target: Element): boolean;
  onDrag(clientX: number, clientY: number): void;
  /** 1: finger moved left (next card), -1: moved right (previous). */
  onSwipe(step: 1 | -1): void;
}

const isZoomed = () => visualViewport!.scale > 1.01;

export function trackTouches(options: TouchOptions): { touching(): boolean } {
  let id: number | null = null;
  let x0 = 0;
  let y0 = 0;
  let t0 = 0;
  let drag = false;
  let moved = false;
  let multi = false;
  let ignoreClicksUntil = 0;

  visualViewport!.addEventListener('resize', () =>
    document.documentElement.classList.toggle('is-zoomed', isZoomed()),
  );

  document.addEventListener(
    'pointerdown',
    (e) => {
      if (e.pointerType !== 'touch') return;
      if (id !== null) {
        multi = true; // a second finger: not a swipe
        return;
      }
      id = e.pointerId;
      ignoreClicksUntil = 0; // only the gesture that just ended may be swallowed
      x0 = e.clientX;
      y0 = e.clientY;
      t0 = e.timeStamp;
      moved = multi = false;
      drag = options.canDrag(e.target as Element);
      if (drag) options.onDrag(e.clientX, e.clientY);
    },
    { passive: true },
  );

  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerId !== id) return;
      if (Math.hypot(e.clientX - x0, e.clientY - y0) > TAP_SLOP) moved = true;
      if (drag) options.onDrag(e.clientX, e.clientY);
    },
    { passive: true },
  );

  document.addEventListener('pointerup', (e) => {
    if (e.pointerId !== id) return;
    id = null;
    if (!moved) return;
    ignoreClicksUntil = performance.now() + CLICK_GRACE;
    const dx = e.clientX - x0;
    const dy = e.clientY - y0;
    if (
      !multi &&
      !isZoomed() &&
      Math.abs(dx) >= SWIPE_MIN &&
      Math.abs(dx) > SWIPE_RATIO * Math.abs(dy) &&
      e.timeStamp - t0 < SWIPE_MAX_MS
    )
      options.onSwipe(dx < 0 ? 1 : -1);
  });

  document.addEventListener('pointercancel', (e) => {
    if (e.pointerId === id) id = null;
  });

  // Only a click synthesised right after a drag or swipe is swallowed;
  // keyboard (detail 0) and later clicks are never affected.
  document.addEventListener(
    'click',
    (e) => {
      if (e.detail !== 0 && performance.now() < ignoreClicksUntil) {
        e.preventDefault();
        e.stopPropagation();
      }
      ignoreClicksUntil = 0;
    },
    true,
  );

  return { touching: () => id !== null };
}
