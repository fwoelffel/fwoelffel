const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:8000';

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
    'gatsby-plugin-sass',
  ],
};
