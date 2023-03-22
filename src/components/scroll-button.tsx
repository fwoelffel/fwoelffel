import React, { useEffect, useState } from 'react';
import { FaAngleUp } from 'react-icons/fa';

export default function ScrollButton() {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);
  });

  return (
    <div
      className={'container has-text-right pr-5'}
      style={{
        display: visible ? 'inline' : 'none',
        position: 'fixed',
        width: '100%',
        bottom: '40px',
        height: '20px',
        cursor: 'pointer',
        opacity: '0.9',
      }}>
      <button className={'button is-outlined is-rounded'} onClick={scrollToTop}>
        <FaAngleUp size='1.5rem' />
      </button>
    </div>
  );
}
