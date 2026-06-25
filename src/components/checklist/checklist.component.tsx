import React, { useState } from 'react';
import { CategoryIconId } from '../../data/categories';
import { IChecklistData } from '../../data/checklist';
import { useTranslation } from '../../i18n/locale-context';
import CategoryIcon from '../category-icon/category-icon.component';
import ChecklistItem from '../checklist-item/checklist-item.component';
import ConfirmDialog from '../confirm-dialog/confirm-dialog.component';
import styles from './checklist.module.css';

interface ChecklistProps {
  anchorId: string;
  displayTitle: string;
  iconId: CategoryIconId;
  data: IChecklistData;
  sectionProgress: { checked: number; total: number };
  isComplete: boolean;
  onToggleItem: (itemId: string) => void;
  onClearSection: () => void;
}

const Checklist: React.FC<ChecklistProps> = ({
  anchorId,
  displayTitle,
  iconId,
  data,
  sectionProgress,
  isComplete,
  onToggleItem,
  onClearSection,
}) => {
  const { t, tInterpolate } = useTranslation();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const wrapperClass = isComplete
    ? `${styles.wrapper} ${styles.wrapperComplete}`
    : styles.wrapper;

  return (
    <>
      <section id={anchorId} className={wrapperClass}>
        <div className={styles.stickyBar}>
          <div className={styles.titleGroup}>
            <div className={styles.titleRow}>
              <CategoryIcon iconId={iconId} />
              <h2 className={styles.heading}>{displayTitle}</h2>
            </div>
            <span className={styles.sectionProgress}>
              {sectionProgress.checked}/{sectionProgress.total}
              {isComplete && (
                <span className={styles.completeBadge} aria-label={t('sectionComplete')}>
                  ✓
                </span>
              )}
            </span>
          </div>
        </div>
        <button
          type='button'
          className={styles.clearBtn}
          onClick={() => setShowClearConfirm(true)}
        >
          {t('clearSection')}
        </button>
        <div className={styles.checklist}>
          {data.data.map((item) => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              text={item.text}
              isChecked={item.isChecked}
              onToggle={onToggleItem}
            />
          ))}
        </div>
      </section>

      {showClearConfirm && (
        <ConfirmDialog
          title={tInterpolate('clearSectionConfirm.title', { category: displayTitle })}
          message={t('clearSectionConfirm.message')}
          confirmLabel={t('clearSectionConfirm.confirm')}
          onConfirm={() => {
            onClearSection();
            setShowClearConfirm(false);
          }}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </>
  );
};

export default Checklist;
