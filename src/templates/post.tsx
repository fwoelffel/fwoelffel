import { graphql } from 'gatsby';
import * as React from 'react';
import { FaBookOpen } from 'react-icons/fa';
import Hero from '../components/hero';
import Layout from '../components/layout';

import '../prism.scss';

export const query = graphql`
  query Post($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      id
      timeToRead
      frontmatter {
        date
        title
      }
    }
  }
`;

export const Head = ({ data: { markdownRemark: post } }) => (
  <>
    <title>{post.frontmatter.title}</title>
    <meta name='description' content={post.excerpt} />
  </>
);

export default function PostPage(p) {
  console.debug(p);
  const {
    data: { markdownRemark: post },
  } = p;
  return (
    <Layout>
      <article className={'container is-max-desktop p-4'}>
        <div className={'level hero is-small'}>
          <div className={'hero-body p-0'}>
            <div className={'level-left'}>
              <div className={'level-item'}>
                <div>
                  <h1 className={'title is-1'}>{post.frontmatter.title}</h1>
                  <p className={'has-text-weight-light'}></p>
                </div>
              </div>
            </div>
            <div className={'level-right'}>
              <div className={'level-item has-text-grey-light'}>
                <FaBookOpen className={'icon is-small mr-1'} />
                <p className={'has-text-weight-light'}>
                  {post.timeToRead} minute{post.timeToRead > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className={'content has-text-justified'}>
          <div
            dangerouslySetInnerHTML={{
              __html: post.html,
            }}
          />
        </section>
      </article>
    </Layout>
  );
}
