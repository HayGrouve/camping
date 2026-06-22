import React, { useEffect, useState } from 'react';
import styles from './footer.module.css';

const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 700);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type='button'
      title='Go to the top'
      aria-label='Scroll to top'
      onClick={scrollToTop}
      className={`${styles.fab} ${isVisible ? '' : styles.fabHidden}`}
    >
      ↑
    </button>
  );
};

export default Footer;
