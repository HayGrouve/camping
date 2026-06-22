import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { CategoryRemaining, ProgressSummary } from '../../utils/progressUtils';
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

const ProgressHeader = forwardRef<HTMLElement, ProgressHeaderProps>(
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
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [jumpPanelOpen, setJumpPanelOpen] = useState(false);
    const [badgePulse, setBadgePulse] = useState(false);
    const prevCheckedRef = useRef(totalProgress.checked);

    useEffect(() => {
      if (totalProgress.checked > prevCheckedRef.current) {
        setBadgePulse(true);
        const timer = window.setTimeout(() => setBadgePulse(false), 300);
        prevCheckedRef.current = totalProgress.checked;
        return () => window.clearTimeout(timer);
      }
      prevCheckedRef.current = totalProgress.checked;
    }, [totalProgress.checked]);

    const scrollToCategory = (anchorId: string) => {
      const element = document.getElementById(anchorId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setJumpPanelOpen(false);
    };

    const progressLabel = `${totalProgress.checked} of ${totalProgress.total} items packed, ${totalProgress.percent} percent`;

    return (
      <>
        <div className={styles.headerWrapper} ref={ref}>
          <header className={styles.header}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>Ceko&apos;s Camping Checklist</h1>
              <span
                className={`${styles.fractionBadge} ${badgePulse ? styles.fractionBadgePulse : ''}`}
                aria-label={isAllPacked ? 'All items packed' : progressLabel}
              >
                {isAllPacked ? '✓' : `${totalProgress.checked}/${totalProgress.total}`}
              </span>
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

            <div className={styles.controlsRow}>
              <button
                type='button'
                className={`${styles.toggleBtn} ${showRemaining ? styles.toggleBtnActive : ''}`}
                onClick={onToggleShowRemaining}
                aria-pressed={showRemaining}
              >
                {showRemaining ? 'Show all' : 'Show remaining'}
              </button>
              <button
                type='button'
                className={styles.clearBtn}
                onClick={() => setShowClearConfirm(true)}
              >
                Clear all
              </button>
              {categoriesWithRemaining.length > 0 && (
                <button
                  type='button'
                  className={`${styles.jumpBtn} ${jumpPanelOpen ? styles.jumpBtnOpen : ''}`}
                  onClick={() => setJumpPanelOpen((open) => !open)}
                  aria-expanded={jumpPanelOpen}
                >
                  Jump to…{' '}
                  <span className={`${styles.chevron} ${jumpPanelOpen ? styles.chevronOpen : ''}`}>
                    ▾
                  </span>
                </button>
              )}
              {isAllPacked && <span className={styles.allPacked}>All packed!</span>}
            </div>
          </header>

          <div
            className={`${styles.jumpPanel} ${jumpPanelOpen ? styles.jumpPanelOpen : ''}`}
            aria-hidden={!jumpPanelOpen}
          >
            <div className={styles.chipsRow} aria-label='Jump to categories with remaining items'>
              {categoriesWithRemaining.map((category) => (
                <button
                  key={category.storageKey}
                  type='button'
                  className={styles.chip}
                  onClick={() => scrollToCategory(category.anchorId)}
                  tabIndex={jumpPanelOpen ? 0 : -1}
                >
                  {category.displayTitle} ({category.remaining})
                </button>
              ))}
            </div>
          </div>
        </div>

        {showClearConfirm && (
          <ConfirmDialog
            title='Clear all checkmarks?'
            message='This will uncheck every item in all categories. Your items will not be deleted.'
            confirmLabel='Clear all'
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
