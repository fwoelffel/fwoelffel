import Footer from './footer';
import React from 'react';
import ScrollButton from './scroll-button';

const Layout = ({ children }) => (
  <>
    <div className='container'>{children}</div>
    <Footer />
    <ScrollButton />
  </>
);
export default Layout;
