import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../../i18n/locale-context';
import styles from './footer.module.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();
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
      title={t('scrollToTop')}
      aria-label={t('scrollToTop')}
      onClick={scrollToTop}
      className={`${styles.fab} ${isVisible ? '' : styles.fabHidden}`}
    >
      ↑
    </button>
  );
};

export default Footer;
