import Footer from './footer';
import React from 'react';
import ScrollButton from './scroll-button';

const Layout = ({ children }) => (
  <>
    <div className='container pb-6'>
      {children}
      <ScrollButton />
    </div>
    <Footer />
  </>
);
export default Layout;
