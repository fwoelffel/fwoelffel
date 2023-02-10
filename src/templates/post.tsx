import * as React from 'react';
import Layout from '../components/layout';

export default function PostPage({ pageContext: { post } }) {
  return (
    <Layout>
      <article className={'hero is-fullheight'}>
        <div>
          <h2 className={'title is-2'}>{post.frontmatter.title}</h2>
          <p className={'subtitle is-spaced'}>{post.frontmatter.date}</p>
          <section className={'content'}>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </section>
        </div>
      </article>
    </Layout>
  );
}
