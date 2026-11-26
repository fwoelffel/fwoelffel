/**
 * Everything personal lives here. To add a link (blog, Mastodon…), append an
 * entry to `links`: the card, its accessible labels and the structured data
 * pick it up. The card has room for three links before it gets crowded.
 */

export const identity = {
  firstName: 'Frédéric',
  lastName: 'Woelffel',
  initials: 'FW',
  role: 'Ingénieur logiciel',
  description:
    'Frédéric Woelffel, ingénieur logiciel. Retrouvez-moi sur GitHub et LinkedIn.',
  url: 'https://fwoelffel.me',
  /**
   * GitHub account id (not the username, so a rename doesn't break it).
   * The card shows this account's live avatar: updating the GitHub avatar
   * updates the site within minutes, no deploy needed.
   */
  githubId: 5467696,
} as const;

/** URL of the live GitHub avatar at a given pixel size. */
export const githubAvatar = (size: number) =>
  `https://avatars.githubusercontent.com/u/${identity.githubId}?s=${size}`;

/** Playful trading-card stats. They are made up, and the page says so. */
export const card = {
  rating: 92,
  rank: 'ING',
  edition: '★ Holo · 001/001',
  stats: [
    { value: 90, label: 'PRO' },
    { value: 91, label: 'ARC' },
    { value: 93, label: 'QUA' },
    { value: 89, label: 'LIV' },
    { value: 86, label: 'COM' },
    { value: 94, label: 'CUR' },
  ],
} as const;

export type IconName = 'github' | 'linkedin';

interface Link {
  label: string;
  /** Short line under the label. */
  caption: string;
  href: string;
  icon: IconName;
}

export const links: Link[] = [
  {
    label: 'LinkedIn',
    caption: 'Mon parcours',
    href: 'https://www.linkedin.com/in/fwoelffel/',
    icon: 'linkedin',
  },
  {
    label: 'GitHub',
    caption: 'Mon code',
    href: 'https://github.com/fwoelffel',
    icon: 'github',
  },
];
