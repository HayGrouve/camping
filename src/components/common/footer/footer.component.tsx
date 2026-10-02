import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp } from '@phosphor-icons/react';
import { useTranslation } from '../../../i18n/locale-context';
import styles from './footer.module.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // The sentinel covers the first stretch of the page; once it scrolls out, offer the way back up.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(!entry.isIntersecting);
    });
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden='true' />
      <button
        type='button'
        title={t('scrollToTop')}
        aria-label={t('scrollToTop')}
        aria-hidden={!isVisible}
        tabIndex={isVisible ? 0 : -1}
        onClick={scrollToTop}
        className={`${styles.fab} ${isVisible ? '' : styles.fabHidden}`}
      >
        <ArrowUp className={styles.icon} weight='bold' aria-hidden='true' />
      </button>
    </>
  );
};

export default Footer;
