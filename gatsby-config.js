module.exports = {
  siteMetadata: {
    title: 'Frédéric Woelffel',
    position: 'Back-end engineer',
    siteUrl: process.env.PUBLIC_URL || 'http://localhost:8000',
    about: `I'm a Node.js expert and javascript/typescript developer, fluent with Nestjs.`,
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-plugin-image',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sass',
  ],
};
