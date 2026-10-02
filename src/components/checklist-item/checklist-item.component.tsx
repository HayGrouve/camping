import React, { useEffect, useRef } from 'react';
import { useIsPresent } from 'motion/react';
import styles from './checklist-item.module.css';

interface ChecklistItemProps {
  id: string;
  text: string;
  isChecked: boolean;
  /** The whole section is on its way out because its last item was packed. */
  isSectionLeaving?: boolean;
  onToggle: (id: string) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  id,
  text,
  isChecked,
  isSectionLeaving = false,
  onToggle,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  // A row only leaves the list because it was just packed, so show it checked on the way out.
  const isRowLeaving = !useIsPresent();
  const isLeaving = isRowLeaving || isSectionLeaving;
  const showChecked = isChecked || isLeaving;
  const rowClass = [styles.row, showChecked ? styles.rowChecked : ''].filter(Boolean).join(' ');

  // Hand keyboard focus to a neighbouring row instead of dropping it when this one goes away.
  useEffect(() => {
    if (!isRowLeaving) return;
    const button = buttonRef.current;
    if (!button || document.activeElement !== button) return;

    const row = button.closest('li');
    const neighbour = row?.nextElementSibling ?? row?.previousElementSibling;
    const target = neighbour?.querySelector('button');
    if (target instanceof HTMLButtonElement) target.focus();
  }, [isRowLeaving]);

  return (
    <button
      ref={buttonRef}
      type='button'
      className={rowClass}
      onClick={() => {
        if (!isLeaving) onToggle(id);
      }}
      aria-pressed={showChecked}
      aria-disabled={isLeaving || undefined}
    >
      <span className={styles.checkbox} aria-hidden='true'>
        <svg
          className={styles.checkmark}
          viewBox='0 0 12 12'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M2.5 6.2l2.4 2.4 4.6-5' pathLength={1} />
        </svg>
      </span>
      <span className={styles.label}>{text}</span>
    </button>
  );
};

export default ChecklistItem;
