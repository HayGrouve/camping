import React, { useEffect, useState } from 'react';
import styles from './footer.module.css';

interface IFooter {}

const Footer: React.FC<IFooter> = ({}) => {
  const [isScrollBtnVisible, setIsScrollBtnVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    scrolled > 700 ? setIsScrollBtnVisible(true) : setIsScrollBtnVisible(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);
    return () => {
      window.removeEventListener('scroll', toggleVisible);
    };
  }, []);
  return (
    <div className={styles.footer}>
      <button
        title='Go to the top'
        onClick={scrollToTop}
        style={{ display: isScrollBtnVisible ? 'inline' : 'none' }}
        className={styles.scrollToTop}
      >
        Up
      </button>
    </div>
  );
};

export default Footer;
