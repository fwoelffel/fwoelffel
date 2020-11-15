import React from 'react';
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import styles from './social-links.module.scss';
import ExternalLink from './external-link';

const SocialLinks = ({ size = '2.5em' }) => (
  <div className='is-block'>
    <ExternalLink
      className={styles.socialLink}
      label='LinkedIn'
      to='https://www.linkedin.com/in/fredericwoelffel/'>
      <FaLinkedin size={size} />
    </ExternalLink>
    <ExternalLink
      className={styles.socialLink}
      label='Twitter'
      to='https://twitter.com/fwoelffel'>
      <FaTwitter size={size} />
    </ExternalLink>
    <ExternalLink
      className={styles.socialLink}
      label='Github'
      to='https://github.com/fwoelffel'>
      <FaGithub size={size} />
    </ExternalLink>
    <ExternalLink
      className={styles.socialLink}
      label='contact'
      to='https://frdricwoelffel.typeform.com/to/TgRdLj'>
      <FaEnvelope size={size} />
    </ExternalLink>
  </div>
);

export default SocialLinks;
