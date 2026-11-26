# fwoelffel.me

> The repository root is my GitHub profile: its `README.md` shows on <https://github.com/fwoelffel>. The website lives here, in `site/`.

My corner of the web: a holographic trading card that points to my GitHub and LinkedIn, in several styles (swipe on a phone, or use the selector under the card).

Built with [Astro](https://astro.build) as a fully static page: one HTML file, inlined CSS, ~6 kB of JavaScript (under 3 kB gzipped), self-hosted fonts.

## Develop

```bash
cd site
npm install
npm run dev       # http://localhost:4321
npm run check     # type-check
npm run build     # static site in dist/
npm run preview   # serve dist/
```

Node version: see [`.nvmrc`](.nvmrc).

## Edit the content

Shared personal data lives in [`src/config.ts`](src/config.ts): name, role and links. Adding a link there adds it to every card. The photo is the live GitHub avatar.

Each card style is a folder in [`src/variants/`](src/variants/) (`index.ts` with its label, order and own content such as made-up stats, plus `Front.astro` and `Back.astro`). Adding a folder adds a style; the shared building blocks are in [`src/components/card/`](src/components/card/). See the repository's `CLAUDE.md` for the full contract.

The favicon is `public/favicon.svg`. Link previews (Open Graph) use the GitHub avatar too.

## Deploy

Every push touching `site/` builds the site. Pushes to `main` publish `dist/` to the `gh-pages` branch, which GitHub Pages serves at <https://fwoelffel.me> (`public/CNAME`).
