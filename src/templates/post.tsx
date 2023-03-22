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

export default function PostPage({ data: { markdownRemark: post } }) {
  return (
    <Layout>
      <Hero>
        <article className={'container is-max-desktop p-4'}>
          <div className={'level'}>
            <div className={'level-left'}>
              <div className={'level-item'}>
                <div>
                  <p className={'title is-2'}>{post.frontmatter.title}</p>
                  <p className={'has-text-weight-light'}>
                    {post.frontmatter.date}
                  </p>
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

          <section className={'content has-text-justified	'}>
            <div
              dangerouslySetInnerHTML={{
                __html: post.html,
              }}
            />
          </section>
        </article>
      </Hero>
    </Layout>
  );
}
