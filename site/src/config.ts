/**
 * Shared personal data, read by every card variant and the page metadata.
 * Variant-specific content (stats, edition…) lives in `src/variants/<id>/`.
 *
 * To add a link (blog, Mastodon…), append an entry to `links`: every card,
 * its accessible labels and the structured data pick it up. The cards have
 * room for three links before they get crowded.
 */

const firstName = 'Frédéric';
const lastName = 'Woelffel';
const url = 'https://fwoelffel.me';

export const identity = {
  firstName,
  lastName,
  fullName: `${firstName} ${lastName}`,
  initials: 'FW',
  role: 'Ingénieur logiciel',
  description:
    'Frédéric Woelffel, ingénieur logiciel. Retrouvez-moi sur GitHub et LinkedIn.',
  url,
  host: new URL(url).host,
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
