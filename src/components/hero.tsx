import React from 'react';

const Hero = ({ children }) => (
  <div className={'hero is-fullheight'}>
    <div className={'hero-body'}>
      <section className={'container'}>{children}</section>
    </div>
  </div>
);

export default Hero;
