# Conventions

Personal homepage of Frédéric Woelffel, served at https://fwoelffel.me. Its job is to own the domain and point visitors to his profiles (GitHub, LinkedIn, more later). The experience is one interactive holographic trading card.

## Repository layout

This repository is named after the GitHub username, so it is also the **GitHub profile repository**: the root `README.md` is rendered at the top of https://github.com/fwoelffel.

- `README.md` (root): profile content only, written for profile visitors. It is intentionally empty for now (an empty file hides the profile README). Never put development docs, badges or setup instructions there, and never add `.github/README.md` (it would take over the repository page).
- `site/`: the website (Astro project, its own `README.md` with dev instructions). All site commands run from `site/`.
- `.github/`: CI and Dependabot, both pointed at `site/`.
- Root stays minimal: profile README, `LICENSE`, `CLAUDE.md`, `.github/`, `site/`.

## Product rules

- The card must work as well on a phone as on a desktop: touch drag tilts it, a tap/click flips it, the tilt sensor drives the foil where available. Check every change at 375×812 as well as on desktop.
- No buttons or controls around the card: the card is the whole UI. The holo/tilt effect is on by default, never behind an opt-in button (on iOS, motion access is requested on the first touch).
- The whole card, footer included, must be visible without scrolling on phones (size it from `100dvh`).
- Keep it light. Static output only, no UI framework, no client-side dependency. JavaScript stays a few kB; prefer CSS for anything CSS can do.
- Animate only transforms, opacity and CSS custom properties. No `filter: blur()` or layout-triggering properties in per-frame updates. Pause work when the tab is hidden.
- Nothing moves forever: the idle drift settles after a few seconds and the loop stops until the next input (WCAG 2.2.2).
- Never block pinch-zoom (`touch-action: pinch-zoom` on the card, no `user-scalable=no`), and keep card text scaling with browser zoom (rem floor on the card width).
- Check portrait (375×812, 320×568) and short landscape (812×375): links stay ≥ 44 px and the card footer is fully visible.
- Safari is the reference for the 3D flip: blend modes must stay isolated inside each face (`isolation: isolate`), otherwise Safari flattens the card (mirrored back, faces bleeding through). Faces are also hidden with `visibility` at the 90° mark.
- Honour `prefers-reduced-motion` (no tilt loop, no flip/intro animation) and `prefers-color-scheme` (light and dark backgrounds).
- The page works without JavaScript: the front of the card and its links are plain HTML.
- Accessibility: real links and buttons, visible focus, only the visible face of the card is focusable (`inert` on the other one), touch targets at least 44 px.
- Site copy is in French.
- The card stats are made up for fun; keep them labelled as such for assistive tech.

## Code rules

- Paths below are relative to `site/`.
- This project's Baseline target is Baseline 2024: use web platform features that are Baseline 2024 or older without fallbacks; anything newer needs a progressive-enhancement fallback.
- Personal data and links live in `src/config.ts` only; components read from it.
- Fonts are self-hosted through `@fontsource` (Latin subsets only). The only third-party request at runtime is the live GitHub avatar (`avatars.githubusercontent.com`, by account id, so avatar changes show up without a deploy); if it fails to load, the `<img>` removes itself and the initials drawn underneath show instead (no local fallback photo). Nothing else: no Google Fonts, no analytics.
- Icons come from `@phosphor-icons/core`, inlined at build time through `src/components/Icon.astro`.
- The only image file is `public/favicon.svg`. No PNG favicons, no `og.png`, no local photo: link previews (`og:image`) also use the live GitHub avatar.
- Before committing: `npx prettier --check .`, `npm run check`, `npm run build`. CI runs the same.
- Pin exact versions for runtime dependencies.

## Git

- Commit directly on `main`.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, `refactor:`…), with a short body: a few lines at most.

## Deployment

`.github/workflows/deploy.yml` builds on every push and PR that touches `site/` (profile README edits don't trigger it), and on `main` publishes `site/dist/` to the `gh-pages` branch (GitHub Pages source). It can also be run by hand (`workflow_dispatch`).

Dependabot PRs auto-merge (squash) from the same workflow's `automerge` job once the build passes: patch and minor updates only, majors wait for review. The merge uses `GITHUB_TOKEN`, which doesn't trigger push workflows, so the job then dispatches the workflow on `main` to deploy. No PAT, no branch protection needed (direct pushes to `main` stay allowed).

`site/public/CNAME` and `site/public/.nojekyll` must stay: without `.nojekyll`, GitHub Pages runs Jekyll, which drops the `_astro/` folder (images and fonts 404).
