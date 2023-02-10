import { resolve } from 'path';

export async function createPages({ graphql, actions }) {
  const { createPage } = actions;
  const queryResults = await graphql(`
    query AllPosts {
      allMarkdownRemark {
        edges {
          node {
            id
            html
            frontmatter {
              title
              date
              slug
            }
          }
        }
      }
    }
  `);
  const postTemplate = resolve(`src/templates/post.tsx`);
  queryResults.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: `/posts/${node.frontmatter.slug}`,
      component: postTemplate,
      context: { post: node },
    });
  });
}
