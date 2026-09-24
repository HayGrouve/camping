import React from 'react';
import { useLocale, useTranslation } from '../../i18n/locale-context';
import { ProgressSummary } from '../../utils/progressUtils';
import { CheckIcon } from '../icons/icons';
import styles from './hero.module.css';

interface HeroProps {
  totalProgress: ProgressSummary;
  isAllPacked: boolean;
}

const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// [x, y, radius] — fixed so the sky doesn't reshuffle on every render
const STARS: Array<[number, number, number]> = [
  [60, 40, 1.2], [140, 110, 0.9], [230, 60, 1.4], [310, 150, 1], [390, 30, 1.1],
  [470, 95, 1.5], [545, 170, 0.9], [610, 45, 1.2], [690, 125, 1], [840, 35, 1.3],
  [905, 150, 0.9], [980, 80, 1.5], [1050, 30, 1], [1120, 130, 1.2], [1190, 70, 0.9],
  [1260, 160, 1.3], [1330, 45, 1.1], [1400, 110, 1.4], [30, 170, 1], [770, 180, 1.1],
];

// [x, baseY, height]
const TREES: Array<[number, number, number]> = [
  [30, 322, 70], [70, 318, 95], [110, 320, 60], [250, 314, 80], [285, 312, 110],
  [320, 314, 72], [430, 318, 64], [820, 316, 76], [860, 314, 104], [898, 316, 68],
  [1110, 312, 88], [1150, 310, 120], [1192, 312, 80], [1330, 316, 92], [1372, 318, 66],
  [1410, 320, 84],
];

const treePath = ([x, y, h]: [number, number, number]): string => {
  const w = h * 0.32;
  const tier = h * 0.42;
  return [
    `M${x} ${y - h}`,
    `L${x + w * 0.7} ${y - h + tier}`,
    `L${x + w * 0.4} ${y - h + tier}`,
    `L${x + w} ${y - h * 0.3}`,
    `L${x + w * 0.55} ${y - h * 0.3}`,
    `L${x + w * 1.2} ${y}`,
    `L${x - w * 1.2} ${y}`,
    `L${x - w * 0.55} ${y - h * 0.3}`,
    `L${x - w} ${y - h * 0.3}`,
    `L${x - w * 0.4} ${y - h + tier}`,
    `L${x - w * 0.7} ${y - h + tier}`,
    'Z',
  ].join(' ');
};

const Landscape: React.FC = () => (
  <svg
    className={styles.landscape}
    viewBox='0 0 1440 360'
    preserveAspectRatio='xMidYMax slice'
    aria-hidden='true'
  >
    <defs>
      <radialGradient id='hero-moon-glow'>
        <stop offset='0%' stopColor='#fff6dc' stopOpacity='0.45' />
        <stop offset='100%' stopColor='#fff6dc' stopOpacity='0' />
      </radialGradient>
      <radialGradient id='hero-fire-glow'>
        <stop offset='0%' stopColor='#ffb04a' stopOpacity='0.7' />
        <stop offset='100%' stopColor='#ff7a2a' stopOpacity='0' />
      </radialGradient>
    </defs>

    <g className={styles.stars}>
      {STARS.map(([x, y, r], index) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={r}
          style={{ animationDelay: `${(index % 7) * 0.6}s` }}
        />
      ))}
    </g>

    <circle cx='1010' cy='78' r='70' fill='url(#hero-moon-glow)' />
    <circle cx='1010' cy='78' r='20' fill='#f6efd9' />
    <circle cx='1019' cy='72' r='17' className={styles.moonShadow} />

    <path
      className={styles.far}
      d='M0 250 L120 205 L220 232 L360 150 L470 212 L560 182 L700 118 L820 200 L930 168 L1060 222 L1180 140 L1300 200 L1440 168 V360 H0Z'
    />
    <path
      className={styles.mid}
      d='M0 292 L90 262 L200 282 L320 226 L430 272 L540 252 L660 290 L780 244 L900 282 L1020 236 L1140 276 L1260 246 L1440 282 V360 H0Z'
    />

    <g className={styles.trees}>
      {TREES.map((tree) => (
        <path key={tree[0]} d={treePath(tree)} />
      ))}
    </g>

    <circle cx='660' cy='318' r='60' fill='url(#hero-fire-glow)' className={styles.fireGlow} />
    <path className={styles.tent} d='M540 326 L598 246 L656 326 Z' />
    <path className={styles.tentDoor} d='M584 326 L598 290 L612 326 Z' />
    <path className={styles.flame} d='M672 322 C664 312 670 304 674 296 C676 304 684 308 680 322 Z' />
    <path className={styles.logs} d='M660 326 L690 318 M662 318 L690 326' />

    <path className={styles.ground} d='M0 330 Q360 306 720 322 T1440 316 V360 H0Z' />
  </svg>
);

const Hero: React.FC<HeroProps> = ({ totalProgress, isAllPacked }) => {
  const { locale, setLocale } = useLocale();
  const { t, tProgress, tRemaining } = useTranslation();

  const remaining = totalProgress.total - totalProgress.checked;
  const ringOffset = RING_CIRCUMFERENCE * (1 - totalProgress.percent / 100);

  return (
    <header className={styles.hero}>
      <Landscape />

      <div className={styles.inner}>
        <div className={styles.topBar}>
          <span className={styles.eyebrow}>{t('hero.eyebrow')}</span>
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

        <div className={styles.content}>
          <div className={styles.text}>
            <h1 className={styles.title}>{t('app.title')}</h1>
            <p className={styles.status}>
              {isAllPacked ? t('allPackedMessage') : tRemaining(remaining)}
            </p>
          </div>

          <div
            className={`${styles.ring} ${isAllPacked ? styles.ringDone : ''}`}
            role='img'
            aria-label={tProgress(totalProgress.checked, totalProgress.total, totalProgress.percent)}
          >
            <svg viewBox='0 0 120 120' aria-hidden='true'>
              <circle className={styles.ringTrack} cx='60' cy='60' r={RING_RADIUS} />
              <circle
                className={styles.ringFill}
                cx='60'
                cy='60'
                r={RING_RADIUS}
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={ringOffset}
              />
            </svg>
            <div className={styles.ringLabel}>
              {isAllPacked ? (
                <CheckIcon className={styles.ringCheck} />
              ) : (
                <>
                  <span className={styles.ringPercent}>{totalProgress.percent}%</span>
                  <span className={styles.ringCaption}>{t('packed')}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
