/**
 * The deck: one card per variant, stacked; only the active one is shown,
 * interactive and driven by the tilt engine. Switch with the style selector
 * (radio group), ArrowLeft/ArrowRight, a horizontal swipe on touch screens,
 * or the URL hash (#id; no hash or an unknown one is the default card).
 *
 * Markup contract (src/components/Deck.astro): `[data-deck]` holds one
 * `[data-slot=id]` per variant, each wrapping a `[data-card]`; optional
 * radios (value = id) and `[data-dot]` markers. A non-empty hash on load
 * sets `data-js="pending"` (the cards stay hidden until the right one is
 * shown); `data-js="ready"` once mounted. `data-pack` while the opening
 * pack plays (CSS only, first load).
 */
import { setFlipped } from './flip';
import { watchDeviceTilt } from './gyro';
import { createTilt } from './tilt';
import { trackTouches } from './touch';

type Step = 1 | -1;

/** Elements where ArrowLeft/ArrowRight edit text: leave them alone. */
const isTextField = (el: Element) =>
  (el as HTMLElement).isContentEditable ||
  el.matches(
    'textarea,select,input:not([type=radio],[type=checkbox],[type=button],[type=submit])',
  );

/** Run a CSS animation class once, then drop it. Cancelled if removed. */
function play(el: HTMLElement, className: string, done?: () => void): void {
  el.classList.add(className);
  Promise.all(el.getAnimations().map((a) => a.finished)).then(
    () => {
      el.classList.remove(className);
      done?.();
    },
    () => {},
  );
}

export function mountDeck(): void {
  const deck = document.querySelector<HTMLElement>('[data-deck]')!;
  const slots = [...deck.querySelectorAll<HTMLElement>('[data-slot]')];
  const ids = slots.map((slot) => slot.dataset.slot);
  const cards = slots.map((slot) =>
    slot.querySelector<HTMLElement>('[data-card]')!,
  );
  const radios = [
    ...deck.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
  ];
  const dots = [...deck.querySelectorAll<HTMLElement>('[data-dot]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tilt = createTilt(reducedMotion);
  let active = 0;
  let leaving: HTMLElement | null = null;

  function endPack(): boolean {
    return 'pack' in deck.dataset && delete deck.dataset.pack;
  }

  function setLive(slot: HTMLElement, live: boolean): void {
    slot.inert = !live;
    slot.ariaHidden = live ? null : 'true';
  }

  /** Done leaving: stop painting it, and turn it back front side up. */
  function stash(slot: HTMLElement): void {
    slot.classList.remove('is-leaving');
    slot.hidden = true;
    setFlipped(cards[slots.indexOf(slot)], false);
  }

  function indexFromHash(): number {
    let id = '';
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      // A malformed escape (#%E0) is just an unknown hash.
    }
    const index = ids.indexOf(id);
    return index < 0 ? 0 : index;
  }

  /** The address shows the active card, so it can be shared (#id). */
  function syncHash(): void {
    const hash = active === 0 ? '' : `#${ids[active]}`;
    if (location.hash === hash) return;
    history.replaceState(null, '', hash || location.pathname + location.search);
  }

  function show(index: number, step: Step, animate = true): void {
    const next = (index + slots.length) % slots.length;
    if (next === active) return;
    if (animate) endPack();
    const from = slots[active];
    const to = slots[next];

    // Cut short a switch still in progress.
    for (const slot of slots) slot.classList.remove('is-entering');
    // Coming back to the card still leaving: stash it too, and apply that
    // (forced style) while it is hidden, so it does not play a flip-back.
    if (leaving) {
      stash(leaving);
      if (leaving === to) void to.offsetWidth;
    }
    leaving = null;

    // Keep keyboard focus with the selection: on the card it left, or on
    // the radios (the arrow keys bypass their native navigation).
    const hadFocus =
      from.contains(document.activeElement) ||
      radios.includes(document.activeElement as HTMLInputElement);
    setLive(from, false);
    to.hidden = false;
    setLive(to, true);
    active = next;
    tilt.attach(cards[next]);

    radios.forEach((radio, i) => (radio.checked = i === next));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === next));
    if (hadFocus) radios[next].focus();
    syncHash();

    if (!animate || reducedMotion.matches) {
      stash(from);
      return;
    }
    deck.style.setProperty('--step', String(step));
    leaving = from;
    play(from, 'is-leaving', () => {
      if (leaving !== from) return;
      leaving = null;
      stash(from);
    });
    play(to, 'is-entering');
  }

  // ---- Inputs ---------------------------------------------------------------

  deck.addEventListener('change', (e) => {
    // The radios are the deck's only form controls.
    const index = radios.indexOf(e.target as HTMLInputElement);
    show(index, index > active ? 1 : -1);
  });

  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
      return;
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step || slots.length < 2 || isTextField(e.target as Element)) return;
    e.preventDefault(); // also keeps a focused radio from moving on its own
    show(active + step, step);
  });

  window.addEventListener('hashchange', () => {
    const index = indexFromHash();
    show(index, index > active ? 1 : -1);
    syncHash(); // drop an unknown hash
  });

  // A click on the active card flips it, except on its links.
  deck.addEventListener('click', (e) => {
    const target = e.target as Element;
    const card = target.closest<HTMLElement>('[data-card]');
    if (card === cards[active] && !target.closest('a'))
      setFlipped(card, !card.classList.contains('is-flipped'));
  });

  const touches = trackTouches({
    canDrag: (target) => cards[active].contains(target),
    onDrag: tilt.pointAt,
    onSwipe: (step) => show(active + step, step),
  });

  watchDeviceTilt(
    reducedMotion,
    (x, y) => tilt.input(x, y, false), // brighter foil only for direct touch
    touches.touching,
  );

  // ---- Opening pack -----------------------------------------------------------
  // Over when its animation is (even if this script loads late, or reduced
  // motion cancels it), or at once on any tap, click or key (the tap that
  // skips it is swallowed: no flip, no link), on a card switch, or on a
  // back/forward restore. Capture phase: before the deck's own handlers.

  let swallow = false;
  const pack = deck
    .getAnimations({ subtree: true })
    .find((a) => (a as CSSAnimation).animationName === 'pack-open');
  pack?.finished.then(endPack, endPack);
  addEventListener('pointerdown', () => (swallow = endPack()), true);
  addEventListener('keydown', endPack, true);
  addEventListener(
    'click',
    (e) => {
      if (swallow && e.detail) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      swallow = false;
    },
    true,
  );
  addEventListener('pageshow', (e) => e.persisted && endPack());

  // ---- Go -------------------------------------------------------------------

  show(indexFromHash(), 1, false);
  syncHash();
  tilt.attach(cards[active]);
  deck.dataset.js = 'ready';
}
