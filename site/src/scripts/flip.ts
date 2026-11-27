/** Turns a card over. Only the visible face stays focusable and exposed. */
export function setFlipped(card: HTMLElement, flipped: boolean): void {
  card.classList.toggle('is-flipped', flipped);
  for (const face of card.querySelectorAll<HTMLElement>('[data-face]')) {
    const hidden = (face.dataset.face === 'back') !== flipped;
    face.inert = hidden;
    face.ariaHidden = String(hidden);
  }
}
