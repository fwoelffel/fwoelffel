import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import { FaArrowRight, FaCalendar } from 'react-icons/fa';

export const query = graphql`
  {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { published: { eq: true } } }
    ) {
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
    (!!allMarkdownRemark.edges.length && (
      <div className={'container is-max-desktop p-4'}>
        <h2 className={'title is-2 has-text-centered'}>Posts</h2>
        <hr></hr>
        {allMarkdownRemark.edges.map(({ node }) => (
          <article className={'media'}>
            <div className={'media-content'}>
              <Link to={`/posts/${node.frontmatter.slug}`}>
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
                </div>
              </Link>
            </div>
          </article>
        ))}
      </div>
    )) ||
    null
  );
};

export default Posts;
