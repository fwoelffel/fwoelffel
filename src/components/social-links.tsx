import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import ExternalLink from './external-link';

const SocialLinks = ({ size = '2.5em' }) => (
  <div className='is-block'>
    <ExternalLink
      label='LinkedIn'
      to='https://www.linkedin.com/in/fredericwoelffel/'
    >
      <FaLinkedin size={size} />
    </ExternalLink>
    <ExternalLink
      label='Twitter'
      to='https://twitter.com/fwoelffel'>
      <FaTwitter size={size} />
    </ExternalLink>
    <ExternalLink
      label='Github'
      to='https://github.com/fwoelffel'>
      <FaGithub size={size} />
    </ExternalLink>
  </div>
);

export default SocialLinks;
