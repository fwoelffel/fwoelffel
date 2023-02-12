import { graphql } from 'gatsby';
import * as React from 'react';
import Hero from '../components/hero';
import Layout from '../components/layout';

export const query = graphql`
  query Post($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      id
      frontmatter {
        date
        title
      }
    }
  }
`;

export default function PostPage({ data }) {
  const { markdownRemark: post } = data;
  return (
    <Layout>
      <Hero>
        <article>
          <div>
            <h2 className={'title is-2'}>{post.frontmatter.title}</h2>
            <p className={'subtitle is-spaced'}>{post.frontmatter.date}</p>
            <section className={'content'}>
              <div
                dangerouslySetInnerHTML={{
                  __html: post.html,
                }}
              />
            </section>
          </div>
        </article>
      </Hero>
    </Layout>
  );
}
