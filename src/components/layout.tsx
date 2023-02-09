import Footer from './footer';
import React from 'react';

const Layout = ({ children }) => (
  <>
    <div className='container'>{children}</div>
    <Footer />
  </>
);
export default Layout;
