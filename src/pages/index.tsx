import React from 'react';
import Hero from '../components/hero';
import Layout from '../components/layout';
import Identity from '../components/identity';

import '../styles.scss'

const IndexPage = () => (
  <Layout>
    <Hero>
      <Identity />
    </Hero>
  </Layout>
);

export default IndexPage;
