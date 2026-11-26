// One-off generator for the static images in public/ (favicons, Open Graph
// card). Run `node scripts/make-images.mjs` after changing the avatar or name.
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url));
const avatar = await read('../src/assets/avatar.jpeg');
const favicon = await read('../public/favicon.svg');

await sharp(favicon, { density: 600 })
  .resize(180, 180)
  .png()
  .toFile('public/apple-touch-icon.png');
await sharp(favicon, { density: 300 })
  .resize(48, 48)
  .png()
  .toFile('public/favicon.png');

// 1. The card, flat.
const W = 380;
const H = 532;
const P = 210; // portrait diameter
const card = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="card" cx="30%" cy="18%" r="100%">
      <stop offset="0" stop-color="#4b63ff"/><stop offset=".38" stop-color="#2338c9"/><stop offset="1" stop-color="#0f1a5c"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f6d77a"/><stop offset=".38" stop-color="#b88a2b"/>
      <stop offset=".6" stop-color="#f6e3a0"/><stop offset="1" stop-color="#a67a22"/>
    </linearGradient>
    <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff7ac8"/><stop offset=".25" stop-color="#ffe66b"/>
      <stop offset=".5" stop-color="#6bffd0"/><stop offset=".75" stop-color="#6bb8ff"/><stop offset="1" stop-color="#c08bff"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" rx="26" fill="url(#gold)"/>
  <rect x="14" y="14" width="${W - 28}" height="${H - 28}" rx="16" fill="url(#card)"/>
  <rect x="14" y="14" width="${W - 28}" height="${H - 28}" rx="16" fill="url(#foil)" opacity=".18"/>
  <circle cx="${W / 2}" cy="170" r="${P / 2 + 22}" fill="#9db0ff" opacity=".25"/>
  <circle cx="${W / 2}" cy="170" r="${P / 2 + 5}" fill="#f6d77a"/>
  <text x="${W / 2}" y="345" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="27" fill="#fff" letter-spacing="1">FRÉDÉRIC WOELFFEL</text>
  <text x="${W / 2}" y="378" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#ffe9a6" letter-spacing="4">INGÉNIEUR LOGICIEL</text>
  <line x1="40" y1="402" x2="${W - 40}" y2="402" stroke="#fff" stroke-opacity=".28"/>
  <rect x="40" y="420" width="${W - 80}" height="34" rx="9" fill="#fff" fill-opacity=".11" stroke="#fff" stroke-opacity=".22"/>
  <rect x="40" y="462" width="${W - 80}" height="34" rx="9" fill="#fff" fill-opacity=".11" stroke="#fff" stroke-opacity=".22"/>
  <text x="62" y="443" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="14" fill="#fff" letter-spacing="1">LINKEDIN</text>
  <text x="62" y="485" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="14" fill="#fff" letter-spacing="1">GITHUB</text>
</svg>`);

const mask = Buffer.from(
  `<svg width="${P}" height="${P}"><circle cx="${P / 2}" cy="${P / 2}" r="${P / 2}"/></svg>`,
);
const portrait = await sharp(avatar)
  .resize(P, P)
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer();

// 2. Portrait on the card, then tilt the whole thing.
const flat = await sharp(card)
  .composite([{ input: portrait, left: W / 2 - P / 2, top: 170 - P / 2 }])
  .png()
  .toBuffer();
const tilted = await sharp(flat)
  .rotate(-6, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
const meta = await sharp(tilted).metadata();

// 3. Background and text.
const cx = 360;
const bg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="75%">
      <stop offset="0" stop-color="#1b2150"/><stop offset="1" stop-color="#06070f"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#4b63ff" stop-opacity=".5"/><stop offset="1" stop-color="#4b63ff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="${cx}" cy="315" r="340" fill="url(#glow)"/>
  <text x="660" y="290" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="60" fill="#fff">Frédéric Woelffel</text>
  <text x="662" y="345" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#c9d0ff">Ingénieur logiciel</text>
  <text x="662" y="415" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#ffe9a6" letter-spacing="3">FWOELFFEL.ME</text>
</svg>`);

await sharp(bg)
  .composite([
    {
      input: tilted,
      left: Math.round(cx - meta.width / 2),
      top: Math.round(315 - meta.height / 2),
    },
  ])
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toFile('public/og.png');
console.log('public/ images written');
