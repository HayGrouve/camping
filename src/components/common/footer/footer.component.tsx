import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../../i18n/locale-context';
import { ArrowUpIcon } from '../../icons/icons';
import styles from './footer.module.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 700);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
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
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      onClick={scrollToTop}
      className={`${styles.fab} ${isVisible ? '' : styles.fabHidden}`}
    >
      <ArrowUpIcon className={styles.icon} />
    </button>
  );
};

export default Footer;
