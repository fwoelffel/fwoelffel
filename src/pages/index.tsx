import React from 'react';
import Hero from '../components/hero';
import Layout from '../components/layout';
import Identity from '../components/identity';
import { graphql, useStaticQuery } from 'gatsby';

import '../styles.scss';

const query = graphql`
  query {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
  }
`;

export const Head = () => {
  const {
    site: {
      siteMetadata: { title, siteUrl },
    },
  } = useStaticQuery(query);
  return (
    <>
      <html lang='en' />
      <meta charSet='utf-8' />
      <meta name='description' content='Backend engineer' />
      <meta name='author' content='Frédéric Woelffel' />
      <title>{title}</title>
      <link rel='canonical' href={siteUrl} />
    </>
  );
};

const IndexPage = () => (
  <Layout>
    <Hero>
      <Identity />
    </Hero>
  </Layout>
);

export default IndexPage;
