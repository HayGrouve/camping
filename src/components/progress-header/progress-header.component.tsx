import { forwardRef, useEffect, useRef, useState } from 'react';
import { ArrowCounterClockwise, CaretDown, Check } from '@phosphor-icons/react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { CATEGORIES } from '../../data/categories';
import { useTranslation } from '../../i18n/locale-context';
import { CategoryRemaining, ProgressSummary } from '../../utils/progressUtils';
import CategoryIcon from '../category-icon/category-icon.component';
import ConfirmDialog from '../confirm-dialog/confirm-dialog.component';
import styles from './progress-header.module.css';

interface ProgressHeaderProps {
  totalProgress: ProgressSummary;
  categoriesWithRemaining: CategoryRemaining[];
  showRemaining: boolean;
  isAllPacked: boolean;
  onToggleShowRemaining: () => void;
  onClearAll: () => void;
}

const ProgressHeader = forwardRef<HTMLDivElement, ProgressHeaderProps>(
  (
    {
      totalProgress,
      categoriesWithRemaining,
      showRemaining,
      isAllPacked,
      onToggleShowRemaining,
      onClearAll,
    },
    ref
  ) => {
    const { t, tProgress } = useTranslation();
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [jumpPanelOpen, setJumpPanelOpen] = useState(false);
    const [badgePulse, setBadgePulse] = useState(false);
    const prevCheckedRef = useRef(totalProgress.checked);
    const jumpRef = useRef<HTMLDivElement>(null);
    const jumpPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (totalProgress.checked > prevCheckedRef.current) {
        setBadgePulse(true);
        const timer = window.setTimeout(() => setBadgePulse(false), 300);
        prevCheckedRef.current = totalProgress.checked;
        return () => window.clearTimeout(timer);
      }
      prevCheckedRef.current = totalProgress.checked;
    }, [totalProgress.checked]);

    useEffect(() => {
      if (!jumpPanelOpen) return;

      const handlePointerDown = (event: PointerEvent) => {
        if (!jumpRef.current?.contains(event.target as Node)) {
          setJumpPanelOpen(false);
        }
      };
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setJumpPanelOpen(false);
      };

      document.addEventListener('pointerdown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [jumpPanelOpen]);

    useEffect(() => {
      if (categoriesWithRemaining.length === 0) setJumpPanelOpen(false);
    }, [categoriesWithRemaining.length]);

    // Before the toolbar has stuck to the top, the open panel can run past the bottom of the
    // screen. Nudge the page up just enough to show all of it.
    useEffect(() => {
      if (!jumpPanelOpen) return;
      const panel = jumpPanelRef.current;
      const anchor = panel?.offsetParent;
      if (!panel || !anchor) return;

      // Offsets instead of the panel's own rect, which is still mid-animation here
      const panelBottom = anchor.getBoundingClientRect().top + panel.offsetTop + panel.offsetHeight;
      const overflow = panelBottom + 16 - window.innerHeight;
      if (overflow > 0) window.scrollBy({ top: overflow, behavior: 'smooth' });
    }, [jumpPanelOpen]);

    const scrollToCategory = (anchorId: string) => {
      const element = document.getElementById(anchorId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setJumpPanelOpen(false);
    };

    const setFilter = (remainingOnly: boolean) => {
      if (remainingOnly !== showRemaining) onToggleShowRemaining();
    };

    const progressLabel = tProgress(
      totalProgress.checked,
      totalProgress.total,
      totalProgress.percent
    );

    return (
      <>
        <div className={styles.headerWrapper} ref={ref}>
          <div className={styles.toolbar}>
            <span
              className={`${styles.countBadge} ${isAllPacked ? styles.countBadgeDone : ''} ${
                badgePulse ? styles.countBadgePulse : ''
              }`}
              aria-label={isAllPacked ? t('allItemsPacked') : progressLabel}
            >
              {isAllPacked ? (
                <Check className={styles.badgeCheck} weight='bold' aria-hidden='true' />
              ) : (
                <>
                  <strong>{totalProgress.checked}</strong>
                  <span className={styles.countTotal}>/{totalProgress.total}</span>
                </>
              )}
            </span>

            <div
              className={`${styles.segmented} ${showRemaining ? styles.segmentedRight : ''}`}
              role='group'
              aria-label={t('filterAria')}
            >
              <button
                type='button'
                className={`${styles.segment} ${!showRemaining ? styles.segmentActive : ''}`}
                aria-pressed={!showRemaining}
                onClick={() => setFilter(false)}
              >
                {t('filter.all')}
              </button>
              <button
                type='button'
                className={`${styles.segment} ${showRemaining ? styles.segmentActive : ''}`}
                aria-pressed={showRemaining}
                onClick={() => setFilter(true)}
              >
                {t('filter.remaining')}
              </button>
            </div>

            {categoriesWithRemaining.length > 0 && (
              <div className={styles.jump} ref={jumpRef}>
                <button
                  type='button'
                  className={`${styles.toolBtn} ${jumpPanelOpen ? styles.toolBtnOpen : ''}`}
                  onClick={() => setJumpPanelOpen((open) => !open)}
                  aria-expanded={jumpPanelOpen}
                >
                  {t('jumpTo')}
                  <CaretDown
                    className={`${styles.chevron} ${jumpPanelOpen ? styles.chevronOpen : ''}`}
                    weight='bold'
                    aria-hidden='true'
                  />
                </button>

                <AnimatePresence>
                  {jumpPanelOpen && (
                    <m.div
                      key='jump-panel'
                      ref={jumpPanelRef}
                      className={styles.jumpPanel}
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ul className={styles.jumpList} aria-label={t('jumpCategoriesAria')}>
                        {categoriesWithRemaining.map((category) => {
                          const iconId = CATEGORIES.find(
                            (definition) => definition.storageKey === category.storageKey
                          )?.iconId;
                          return (
                            <li key={category.storageKey}>
                              <button
                                type='button'
                                className={styles.jumpItem}
                                onClick={() => scrollToCategory(category.anchorId)}
                              >
                                {iconId && (
                                  <CategoryIcon iconId={iconId} className={styles.jumpIcon} />
                                )}
                                <span className={styles.jumpName}>{category.displayTitle}</span>
                                <span className={styles.jumpCount}>{category.remaining}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              type='button'
              className={`${styles.toolBtn} ${styles.clearBtn}`}
              onClick={() => setShowClearConfirm(true)}
              disabled={totalProgress.checked === 0}
              title={t('clearAll')}
              aria-label={t('clearAll')}
            >
              <ArrowCounterClockwise className={styles.toolIcon} weight='bold' aria-hidden='true' />
              <span className={styles.clearLabel}>{t('clearAll')}</span>
            </button>
          </div>

          <div
            className={styles.progressTrack}
            role='progressbar'
            aria-valuenow={totalProgress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={progressLabel}
          >
            <div
              className={styles.progressFill}
              style={{ transform: `translateX(${totalProgress.percent - 100}%)` }}
            />
          </div>
        </div>

        <AnimatePresence>
          {showClearConfirm && (
            <ConfirmDialog
              key='clear-all-confirm'
              title={t('clearAllConfirm.title')}
              message={t('clearAllConfirm.message')}
              confirmLabel={t('clearAll')}
              onConfirm={() => {
                onClearAll();
                setShowClearConfirm(false);
              }}
              onCancel={() => setShowClearConfirm(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }
);

ProgressHeader.displayName = 'ProgressHeader';

export default ProgressHeader;
