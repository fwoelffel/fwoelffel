# Conventions

Personal homepage of Frédéric Woelffel, served at https://fwoelffel.me. Its job is to own the domain and point visitors to his profiles (GitHub, LinkedIn, more later). The experience is an interactive holographic trading card, available in several styles (variants) the visitor can switch between. The sport card is the default.

## Repository layout

This repository is named after the GitHub username, so it is also the **GitHub profile repository**: the root `README.md` is rendered at the top of https://github.com/fwoelffel.

- `README.md` (root): profile content only, written for profile visitors. It is intentionally empty for now (an empty file hides the profile README). Never put development docs, badges or setup instructions there, and never add `.github/README.md` (it would take over the repository page).
- `site/`: the website (Astro project, its own `README.md` with dev instructions). All site commands run from `site/`.
- `.github/`: CI and Dependabot, both pointed at `site/`.
- Root stays minimal: profile README, `LICENSE`, `CLAUDE.md`, `.gitignore`, `.github/`, `site/`.
- Paths starting with `src/` or `public/` are relative to `site/`; other paths are relative to the repository root.

## Product rules

- The card must work as well on a phone as on a desktop: touch drag tilts it, a tap/click flips it, the tilt sensor drives the foil where available.
- No buttons or controls around the card: the card is the whole UI. The holo/tilt effect is on by default, never behind an opt-in button (on iOS, motion access is requested on the first touch). One exception: the style selector under the card on mouse/trackpad devices (see Variants).
- The whole card, footer included, plus the selector or dots under it, must be visible without scrolling on phones (size it from `100dvh`; the deck reserves its room through `--card-reserve`).
- Keep it light. Static output only, no UI framework, no client-side dependency. JavaScript stays a few kB; prefer CSS for anything CSS can do.
- Animate only transforms, opacity and CSS custom properties. No `filter: blur()` or layout-triggering properties in per-frame updates. Pause work when the tab is hidden.
- Nothing moves forever: the idle drift settles after a few seconds and the loop stops until the next input (WCAG 2.2.2).
- Never block pinch-zoom (`touch-action: pinch-zoom` on the card, no `user-scalable=no`), and keep card text scaling with browser zoom (rem floor on the card width).
- Check every change on desktop, in portrait (375×812, 393×659, 320×568) and in short landscape (812×375), for every variant: links stay ≥ 44 px and the card footer is fully visible.
- Safari is the reference for the 3D flip: blend modes must stay isolated inside each face (`isolation: isolate`), otherwise Safari flattens the card (mirrored back, faces bleeding through). Faces are also hidden with `visibility` at the 90° mark.
- Opening: on arrival (JavaScript on, motion allowed) a sealed pack opens and the real cards fan out, then gather with the active card in front (~2.4 s, CSS only, `data-pack` in `Deck.astro`). Any tap, click or key skips it; never on switches, hash changes or back/forward restores. It replaces the card intro, which now plays only without JavaScript.
- Honour `prefers-reduced-motion` (no tilt loop, no flip/intro animation) and `prefers-color-scheme` (light and dark backgrounds).
- The page works without JavaScript: the front of the default card and its links are plain HTML; the other variants and the switcher stay hidden.
- Accessibility: real links and buttons, visible focus, only the visible face of the active card is focusable (`inert` + `aria-hidden` on the other face and on inactive cards), touch targets at least 44 px.
- Site copy is in French.
- The card stats are made up for fun; keep them labelled as such for assistive tech.

## Variants

Each card style is a variant. Variant ids: `sport` (default), `creature`, `arcane`.

- Switching: on mouse/trackpad devices (`(hover: hover) and (pointer: fine)`), a small segmented control under the card (a native radio group named "Style de carte"); on touch screens, a horizontal swipe anywhere on the page (left = next, right = previous, wrapping), with non-interactive dots under the card (the radios stay available to screen readers). ArrowLeft/ArrowRight switch too (not in text fields, not with modifiers). The URL hash names the active card (`#creature`; no hash or an unknown one = default) so a style can be shared.
- Touch: |dx| ≥ 50 px, |dx| > 1.5·|dy| and < 700 ms is a swipe (never flips nor opens a link); a tap under the slop flips; anything else tilts (only when started on the card).
- Switch animation: the cards slide out/in horizontally with a slight rotation (~400 ms, transform/opacity only); the incoming card shows its front and the intro never replays. Reduced motion: instant swap.
- With a single variant, no selector, no dots.
- Intellectual property: variants are "inspired by" trading-card genres only. Never use the names, logos, trademarks, characters, set symbols, energy/mana symbols or exact frame designs of existing games or leagues (FIFA/EA, Pokémon, Magic: The Gathering…) anywhere: UI text, code identifiers, comments, file names. Original, generic designs and our own words only.

### Adding a variant

Add a folder `src/variants/<id>/`; no other file changes. The registry (`src/variants/index.ts`) finds it with `import.meta.glob` and sorts by `order` (0 = default; orders unique; the folder name must equal the id).

- `index.ts`: `export default defineVariant({ id, label, order, ...data })` (`label` is the French name shown in the selector; extra fields are the variant's own content, e.g. made-up stats).
- `Front.astro`: the front face. It declares `type Props = FrontProps` (from `../types`): `number` is its collector number (show it in the footer), `eager` goes to its `Portrait`. Root element: a `Frame` (fills the face, rounded, clipped, shadow).
- `Back.astro`: the back face, no props. It wraps its emblem in the shared `components/card/Back.astro` (Frame, centred panel, host line, foil), themed with `--back-*`; it never re-implements that layout.
- Read shared data (`identity`, `links`) from `src/config.ts` and own data from `./index`.
- Optional `theme.css`, imported by both faces, scoped to `[data-variant='<id>']`: the variant's palette and the tokens of the shared parts. Prefix keyframes and global names with the id.
- Compose the shared parts in `src/components/card/`, never re-implement them: `Frame`, `Back` (the back face layout), `Portrait` (live avatar + initials fallback, `eager` only on the card shown on load), `Links` (the profile links, 44 px, new tab), `Foil` (holo/glare/sweep, last child of a positioned box; text that must stay readable above it gets `z-index: 1`), `Icon`. Each documents its `--frame-*`, `--back-*`, `--portrait-*`, `--link-*`, `--foil-*`/`--glare-*`/`--sweep-*` custom properties at the top of the file. Size everything in `em` (1 em = 1/21.25 of the card width, same 5:7 geometry for all variants), except touch targets (rem).
- The card shell (`Card.astro`) owns tilt, flip, faces, Safari fixes and sizing; the scripts (`src/scripts/`: `tilt`, `gyro`, `touch`, `flip`, `deck`) are shared and only drive the active card. Variants add no JavaScript.
- Check it on every viewport listed above, in light and dark, with reduced motion, and flipped.

## Code rules

- This project's Baseline target is Baseline 2024: use web platform features that are Baseline 2024 or older without fallbacks; anything newer needs a progressive-enhancement fallback.
- Shared personal data and links live in `src/config.ts` only; components read from it. Variant-specific content lives in that variant's `index.ts`.
- Fonts are self-hosted through `@fontsource` (Latin subsets only). The only third-party request at runtime is the live GitHub avatar (`avatars.githubusercontent.com`, by account id, so avatar changes show up without a deploy); if it fails to load, the `<img>` removes itself and the initials drawn underneath show instead (no local fallback photo). Nothing else: no Google Fonts, no analytics.
- Icons come from `@phosphor-icons/core`, inlined at build time through `src/components/card/Icon.astro`.
- The only image file is `public/favicon.svg`. No PNG favicons, no `og.png`, no local photo: link previews (`og:image`) also use the live GitHub avatar.
- Before committing: `npx prettier --check .`, `npm run check`, `npm run build`. CI runs the same.
- Pin exact versions for runtime dependencies.

## Git

- Commit directly on `main`.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, `refactor:`…), with a short body: a few lines at most.

## Deployment

`.github/workflows/deploy.yml` builds on every push and PR that touches `site/` or the workflow itself (profile README edits don't trigger it), and on `main` publishes `site/dist/` to the `gh-pages` branch (GitHub Pages source). It can also be run by hand (`workflow_dispatch`).

Dependabot PRs auto-merge (squash) from the same workflow's `automerge` job once the build passes: patch and minor updates only, majors wait for review. The merge uses `GITHUB_TOKEN`, which doesn't trigger push workflows, so the job then dispatches the workflow on `main` to deploy. No PAT, no branch protection needed (direct pushes to `main` stay allowed).

`site/public/CNAME` and `site/public/.nojekyll` must stay: without `.nojekyll`, GitHub Pages runs Jekyll, which drops the `_astro/` folder (images and fonts 404).
