import { resolve } from 'path';

export async function createPages({ graphql, actions }) {
  const { createPage } = actions;
  const allPostsQuery = await graphql(`
    query AllPosts {
      allMarkdownRemark {
        edges {
          node {
            id
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);
  const postTemplate = resolve(`src/templates/post.tsx`);
  allPostsQuery.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: `/posts/${node.frontmatter.slug}`,
      component: postTemplate,
      context: { id: node.id },
    });
  });
}
