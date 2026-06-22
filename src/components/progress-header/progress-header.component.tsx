import React, { useState } from 'react';
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

const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  totalProgress,
  categoriesWithRemaining,
  showRemaining,
  isAllPacked,
  onToggleShowRemaining,
  onClearAll,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const scrollToCategory = (anchorId: string) => {
    const element = document.getElementById(anchorId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Ceko&apos;s Camping Checklist</h1>
        </div>

        <div className={styles.progressRow}>
          <div className={styles.progressTrack} aria-hidden='true'>
            <div
              className={styles.progressFill}
              style={{ width: `${totalProgress.percent}%` }}
            />
          </div>
          <span className={styles.progressLabel}>
            {totalProgress.checked}/{totalProgress.total} packed ({totalProgress.percent}%)
          </span>
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
          {isAllPacked && <span className={styles.allPacked}>All packed!</span>}
        </div>

        {categoriesWithRemaining.length > 0 && (
          <div className={styles.chipsRow} aria-label='Jump to categories with remaining items'>
            {categoriesWithRemaining.map((category) => (
              <button
                key={category.storageKey}
                type='button'
                className={styles.chip}
                onClick={() => scrollToCategory(category.anchorId)}
              >
                {category.displayTitle} ({category.remaining})
              </button>
            ))}
          </div>
        )}
      </header>

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
};

export default ProgressHeader;
