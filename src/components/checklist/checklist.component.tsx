import React, { useState } from 'react';
import { CategoryIconId } from '../../data/categories';
import { IChecklistData } from '../../data/checklist';
import { useTranslation } from '../../i18n/locale-context';
import CategoryIcon, { CATEGORY_TINTS } from '../category-icon/category-icon.component';
import ChecklistItem from '../checklist-item/checklist-item.component';
import ConfirmDialog from '../confirm-dialog/confirm-dialog.component';
import { CheckIcon, ResetIcon } from '../icons/icons';
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

  const percent =
    sectionProgress.total === 0 ? 0 : (sectionProgress.checked / sectionProgress.total) * 100;

  return (
    <>
      <section
        id={anchorId}
        className={wrapperClass}
        style={{ '--tint': CATEGORY_TINTS[iconId] } as React.CSSProperties}
      >
        <div className={styles.stickyBar}>
          <span className={styles.headerIcon}>
            <CategoryIcon iconId={iconId} className={styles.headerIconSvg} />
          </span>
          <div className={styles.titleBlock}>
            <h2 className={styles.heading}>{displayTitle}</h2>
            <div className={styles.meta}>
              <div className={styles.miniTrack} aria-hidden='true'>
                <div className={styles.miniFill} style={{ width: `${percent}%` }} />
              </div>
              {isComplete ? (
                <span className={styles.completeBadge}>
                  <CheckIcon className={styles.completeIcon} />
                  {t('sectionComplete')}
                </span>
              ) : (
                <span className={styles.sectionProgress}>
                  {sectionProgress.checked}/{sectionProgress.total}
                </span>
              )}
            </div>
          </div>
          <button
            type='button'
            className={styles.clearBtn}
            onClick={() => setShowClearConfirm(true)}
            disabled={sectionProgress.checked === 0}
            aria-label={t('clearSection')}
            title={t('clearSection')}
          >
            <ResetIcon className={styles.clearIcon} />
          </button>
        </div>
        <ul className={styles.checklist}>
          {data.data.map((item) => (
            <li key={item.id}>
              <ChecklistItem
                id={item.id}
                text={item.text}
                isChecked={item.isChecked}
                onToggle={onToggleItem}
              />
            </li>
          ))}
        </ul>
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
