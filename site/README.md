# fwoelffel.me

> The repository root is my GitHub profile: its `README.md` shows on <https://github.com/fwoelffel>. The website lives here, in `site/`.

My corner of the web: a single holographic trading card that points to my GitHub and LinkedIn.

Built with [Astro](https://astro.build) as a fully static page: one HTML file, inlined CSS, ~3 kB of JavaScript, self-hosted fonts.

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

Everything personal lives in [`src/config.ts`](src/config.ts): name, role, card stats and links. Adding a link there adds it to the card. The photo is the live GitHub avatar.

The favicon is `public/favicon.svg`. Link previews (Open Graph) use the GitHub avatar too.

## Deploy

Every push touching `site/` builds the site. Pushes to `main` publish `dist/` to the `gh-pages` branch, which GitHub Pages serves at <https://fwoelffel.me> (`public/CNAME`).
