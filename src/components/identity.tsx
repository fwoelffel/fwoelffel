import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import SocialLinks from './social-links';

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
        gatsbyImageData(
          layout: FIXED,
          width: 200,
          height: 200,
          placeholder: TRACED_SVG,
          quality: 100
        )
      }
    }
  }
`;

const Identity = () => {
  const { site, file } = useStaticQuery(query);
  const { position, title, about } = site.siteMetadata;
  console.debug({ file })
  return (
    <div className='has-text-centered'>
      <GatsbyImage
        image={file.childImageSharp.gatsbyImageData}
        alt='avatar'
        style={{
          borderRadius: '50%',
          margin: '30px auto',
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
