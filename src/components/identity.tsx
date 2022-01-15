import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import SocialLinks from './social-links';
import Img from 'gatsby-image';

const query = graphql`
  query {
    site {
      siteMetadata {
        position
        title
        about
      }
    }
    file(relativePath: { eq: "avatar.jpeg" }) {
      childImageSharp {
        fixed(width: 200, height: 200, quality: 100) {
          ...GatsbyImageSharpFixed_tracedSVG
        }
      }
    }
  }
`;

const Identity = () => {
  const { site, file } = useStaticQuery(query);
  const { position, title, about } = site.siteMetadata;
  return (
    <div className='has-text-centered'>
      <Img
        fixed={file.childImageSharp.fixed}
        alt='avatar'
        style={{
          borderRadius: '50%',
          margin: 30,
          boxShadow:
            '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        }}
      />
      <h1 className='title is-1 is-spaced is-uppercase'>{title}</h1>
      <h2 className='subtitle'>{position}</h2>
      <SocialLinks />
      {!!about ? (
        <div
          className=' has-text-centered is-family-code'
          style={{
            margin: 20,
          }}>
          {about}
        </div>
      ) : null}
    </div>
  );
};

export default Identity;
