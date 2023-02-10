import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import { FaArrowRight, FaCalendar, FaTwitter } from 'react-icons/fa';

export const query = graphql`
  query {
    allMarkdownRemark {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            date
            slug
          }
        }
      }
    }
  }
`;

const Posts = () => {
  const { allMarkdownRemark } = useStaticQuery(query);
  return (
    <div className={'container is-max-desktop p-4'}>
      <h2 className={'title is-2 has-text-centered'}>Posts</h2>
      <hr></hr>
      {allMarkdownRemark.edges.map(({ node }) => (
        <article className={'media'}>
          <div className={'media-content'}>
            <div className={'content'}>
              <div className={'level'}>
                <div className={'level-left'}>
                  <div className={'level-item'}>
                    <p className={'title is-3'}>{node.frontmatter.title}</p>
                  </div>
                </div>
                <div className={'level-right'}>
                  <div className={'level-item has-text-grey-light'}>
                    <FaCalendar className={'icon is-small mr-1'} />
                    <p className={'has-text-weight-light'}>
                      {node.frontmatter.date}
                    </p>
                  </div>
                </div>
              </div>
              <br />
              {node.excerpt}
            </div>
            <div className={'has-text-right'}>
              <Link
                className={'is-small'}
                to={`/posts/${node.frontmatter.slug}`}>
                <FaArrowRight className={'icon is-small'} />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Posts;
