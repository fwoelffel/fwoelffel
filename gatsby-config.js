const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:8000';
const GRAPHQL_URL = process.env.GRAPHQL_URL || 'https://api.github.com/graphql';
const GRAPHQL_TOKEN = process.env.GRAPHQL_TOKEN;

const fullName = 'Frédéric Woelffel';
const shortName = 'F. Woelffel';
const position = 'Back-end engineer';

module.exports = {
  siteMetadata: {
    title: fullName,
    position,
    siteUrl: PUBLIC_URL,
    about: `I'm a Node.js expert and javascript/typescript developer, fluent with Nestjs.`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/data`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: fullName,
        short_name: shortName,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`,
      },
    },
    {
       resolve: 'gatsby-plugin-sass',
       options: {
        implementation: require('sass'),
       },
    },
    'gatsby-transformer-yaml',
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'GitHub',
        fieldName: 'github',
        url: GRAPHQL_URL,
        headers: {
          Authorization: `Bearer ${GRAPHQL_TOKEN}`,
        },
      },
    },
    
  ],
};
