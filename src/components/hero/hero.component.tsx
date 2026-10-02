import React, { useEffect } from 'react';
import { Tent } from '@phosphor-icons/react';
import { AnimatePresence, useReducedMotion, useSpring, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import { useLocale, useTranslation } from '../../i18n/locale-context';
import { ProgressSummary } from '../../utils/progressUtils';
import styles from './hero.module.css';

interface HeroProps {
  totalProgress: ProgressSummary;
  isAllPacked: boolean;
}

type PhotoName = 'camp-dusk' | 'camp-morning';
type Orientation = 'portrait' | 'landscape';

// Keep in sync with scripts/generate-hero-images.mjs and the preloads in public/index.html
const PHOTO_BASE = `${process.env.PUBLIC_URL}/images`;
const WIDTHS: Record<Orientation, number[]> = {
  portrait: [720, 1080, 1440],
  landscape: [640, 960, 1440, 1920],
};
const SIZES: Record<Orientation, string> = {
  portrait: 'max(38vw, 75vh)',
  landscape: '100vw',
};
const DESKTOP_QUERY = '(min-width: 1024px)';

const srcSet = (name: PhotoName, orientation: Orientation, extension: 'avif' | 'jpg'): string =>
  WIDTHS[orientation]
    .map((width) => `${PHOTO_BASE}/${name}-${orientation}-${width}.${extension} ${width}w`)
    .join(', ');

const Photo: React.FC<{ name: PhotoName; alt: string }> = ({ name, alt }) => (
  <picture>
    <source
      media={DESKTOP_QUERY}
      type='image/avif'
      srcSet={srcSet(name, 'portrait', 'avif')}
      sizes={SIZES.portrait}
    />
    <source media={DESKTOP_QUERY} srcSet={srcSet(name, 'portrait', 'jpg')} sizes={SIZES.portrait} />
    <source type='image/avif' srcSet={srcSet(name, 'landscape', 'avif')} sizes={SIZES.landscape} />
    <img
      className={styles.photo}
      src={`${PHOTO_BASE}/${name}-landscape-960.jpg`}
      srcSet={srcSet(name, 'landscape', 'jpg')}
      sizes={SIZES.landscape}
      alt={alt}
      decoding='async'
    />
  </picture>
);

// Springs towards the new value through a motion value, so ticking never re-renders React.
const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const reduceMotion = useReducedMotion();
  const spring = useSpring(value, { stiffness: 140, damping: 26 });
  const rounded = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    if (reduceMotion) spring.jump(value);
    else spring.set(value);
  }, [spring, value, reduceMotion]);

  return <m.span>{rounded}</m.span>;
};

const Hero: React.FC<HeroProps> = ({ totalProgress, isAllPacked }) => {
  const { locale, setLocale } = useLocale();
  const { t, tProgress, tRemaining } = useTranslation();

  const remaining = totalProgress.total - totalProgress.checked;

  return (
    <header className={styles.hero}>
      <div className={styles.frame}>
        <div className={styles.photoLayer} aria-hidden={isAllPacked}>
          <Photo name='camp-dusk' alt={t('hero.photoAlt')} />
        </div>
        <AnimatePresence initial={false}>
          {isAllPacked && (
            <m.div
              key='arrived'
              className={styles.photoLayer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            >
              <Photo name='camp-morning' alt={t('hero.photoAltPacked')} />
            </m.div>
          )}
        </AnimatePresence>

        <div className={styles.topBar}>
          <span className={styles.eyebrow}>
            <Tent className={styles.eyebrowIcon} weight='bold' aria-hidden='true' />
            {t('hero.eyebrow')}
          </span>
          <div className={styles.langToggle} role='group' aria-label={t('switchLanguage')}>
            {(['bg', 'en'] as const).map((code) => (
              <button
                key={code}
                type='button'
                className={`${styles.langBtn} ${locale === code ? styles.langBtnActive : ''}`}
                aria-pressed={locale === code}
                onClick={() => setLocale(code)}
              >
                {code === 'bg' ? 'БГ' : 'EN'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <h1 className={styles.title}>{t('app.title')}</h1>
        <p className={styles.status}>
          {isAllPacked ? t('allPackedMessage') : tRemaining(remaining)}
        </p>

        <div
          className={styles.progress}
          role='img'
          aria-label={tProgress(totalProgress.checked, totalProgress.total, totalProgress.percent)}
        >
          <div className={styles.figures} aria-hidden='true'>
            <span className={styles.percent}>
              <AnimatedNumber value={totalProgress.percent} />%
            </span>
            <span className={styles.caption}>{t('packed')}</span>
            <span className={styles.count}>
              {totalProgress.checked}/{totalProgress.total}
            </span>
          </div>
          <div className={styles.bar} aria-hidden='true'>
            <div
              className={styles.barFill}
              style={{ transform: `translateX(${totalProgress.percent - 100}%)` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
