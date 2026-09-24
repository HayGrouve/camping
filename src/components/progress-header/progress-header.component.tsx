import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { CATEGORIES } from '../../data/categories';
import { useTranslation } from '../../i18n/locale-context';
import { CategoryRemaining, ProgressSummary } from '../../utils/progressUtils';
import CategoryIcon, { CATEGORY_TINTS } from '../category-icon/category-icon.component';
import ConfirmDialog from '../confirm-dialog/confirm-dialog.component';
import { CheckIcon, ChevronDownIcon, ResetIcon } from '../icons/icons';
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
                <CheckIcon className={styles.badgeCheck} />
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
                  <ChevronDownIcon
                    className={`${styles.chevron} ${jumpPanelOpen ? styles.chevronOpen : ''}`}
                  />
                </button>

                {jumpPanelOpen && (
                  <div className={styles.jumpPanel}>
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
                              style={
                                iconId
                                  ? ({ '--tint': CATEGORY_TINTS[iconId] } as React.CSSProperties)
                                  : undefined
                              }
                            >
                              {iconId && (
                                <span className={styles.jumpIcon}>
                                  <CategoryIcon iconId={iconId} className={styles.jumpIconSvg} />
                                </span>
                              )}
                              <span className={styles.jumpName}>{category.displayTitle}</span>
                              <span className={styles.jumpCount}>{category.remaining}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
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
              <ResetIcon className={styles.toolIcon} />
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
              className={`${styles.progressFill} ${isAllPacked ? styles.progressFillAllPacked : ''}`}
              style={{ width: `${totalProgress.percent}%` }}
            />
          </div>
        </div>

        {showClearConfirm && (
          <ConfirmDialog
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
      </>
    );
  }
);

ProgressHeader.displayName = 'ProgressHeader';

export default ProgressHeader;
