import React, { useEffect, useRef, useState } from 'react';
import { ArrowCounterClockwise, Check } from '@phosphor-icons/react';
import { AnimatePresence, useIsPresent } from 'motion/react';
import * as m from 'motion/react-m';
import { CategoryIconId } from '../../data/categories';
import { IChecklistData } from '../../data/checklist';
import { useTranslation } from '../../i18n/locale-context';
import CategoryIcon from '../category-icon/category-icon.component';
import ChecklistItem from '../checklist-item/checklist-item.component';
import ConfirmDialog from '../confirm-dialog/confirm-dialog.component';
import { useCollapseMotion } from '../motion';
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
  const collapse = useCollapseMotion();
  // The section only leaves once its last item is packed, so it shows as complete while it goes.
  const isLeaving = !useIsPresent();
  const showComplete = isComplete || isLeaving;
  const sectionRef = useRef<HTMLElement>(null);

  // Keyboard focus would be lost with the section, so pass it on to a neighbouring one,
  // or to the empty state's action when this was the last section.
  useEffect(() => {
    if (!isLeaving) return;
    const section = sectionRef.current;
    if (!section || !section.contains(document.activeElement)) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section'));
    const index = sections.indexOf(section);
    const neighbour = sections[index + 1] ?? sections[index - 1];
    const target =
      neighbour?.querySelector<HTMLButtonElement>('li button') ??
      document.querySelector<HTMLButtonElement>('[data-empty-action]');
    target?.focus();
  }, [isLeaving]);

  let percent = 0;
  if (showComplete) percent = 100;
  else if (sectionProgress.total > 0) {
    percent = (sectionProgress.checked / sectionProgress.total) * 100;
  }

  return (
    <>
      <m.section
        ref={sectionRef}
        id={anchorId}
        className={styles.wrapper}
        initial={collapse.initial}
        animate={collapse.animate}
        exit={collapse.exit}
      >
        <div className={styles.inner}>
          <div className={styles.stickyBar}>
            <CategoryIcon iconId={iconId} className={styles.headerIcon} />
            <h2 className={styles.heading}>{displayTitle}</h2>
            {showComplete ? (
              <span className={styles.completeBadge}>
                <Check className={styles.completeIcon} weight='bold' aria-hidden='true' />
                {t('sectionComplete')}
              </span>
            ) : (
              <span className={styles.sectionProgress}>
                {sectionProgress.checked}/{sectionProgress.total}
              </span>
            )}
            <button
              type='button'
              className={styles.clearBtn}
              onClick={() => setShowClearConfirm(true)}
              disabled={sectionProgress.checked === 0 || isLeaving}
              aria-label={t('clearSection')}
              title={t('clearSection')}
            >
              <ArrowCounterClockwise className={styles.clearIcon} aria-hidden='true' />
            </button>
            <div className={styles.rule} aria-hidden='true'>
              <div
                className={styles.ruleFill}
                style={{ transform: `translateX(${percent - 100}%)` }}
              />
            </div>
          </div>
          <ul className={styles.checklist}>
            <AnimatePresence initial={false}>
              {data.data.map((item) => (
                <m.li
                  key={item.id}
                  className={styles.item}
                  initial={collapse.initial}
                  animate={collapse.animate}
                  exit={collapse.exit}
                >
                  <ChecklistItem
                    id={item.id}
                    text={item.text}
                    isChecked={item.isChecked}
                    isSectionLeaving={isLeaving}
                    onToggle={onToggleItem}
                  />
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </m.section>

      <AnimatePresence>
        {showClearConfirm && (
          <ConfirmDialog
            key='clear-section-confirm'
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
      </AnimatePresence>
    </>
  );
};

export default Checklist;
