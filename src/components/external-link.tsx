import React from 'react';

const ExternalLink = ({ label, to, children }) => (
  <a
    href={to}
    target='_blank'
    rel='noopener noreferrer nofollow'
    aria-label={label}
    style={{ margin: 10 }}>
    {children}
  </a>
);

export default ExternalLink;
