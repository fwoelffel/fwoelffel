import React from 'react';

const ExternalLink = ({ label, to, children, className }) => (
  <a className={className} href={to} target='_blank' rel='noopener noreferrer' aria-label={label}>
    {children}
  </a>
);

export default ExternalLink;
