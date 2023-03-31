import React from 'react';

const Hero = ({ children }) => (
  <section className={'hero is-fullheight'}>
    <div className={'hero-body container'}>{children}</div>
  </section>
);

export default Hero;
