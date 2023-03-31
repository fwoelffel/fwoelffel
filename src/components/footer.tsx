import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

const query = graphql`
  query GetSiteBuildTime {
    site {
      buildTime(formatString: "llll")
    }
  }
`;

const Footer = () => {
  const { site } = useStaticQuery(query);
  return (
    <footer className={'footer has-text-centered'}>
      <p>Last built {site.buildTime}</p>
      <p className='is-size-7 has-text-grey is-family-secondary'>
        ©{new Date().getFullYear()} Frédéric Woelffel
      </p>
    </footer>
  );
};

export default Footer;
