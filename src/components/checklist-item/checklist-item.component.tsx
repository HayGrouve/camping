import React from 'react';
import styles from './checklist-item.module.css';

interface ChecklistItemProps {
  id: string;
  text: string;
  isChecked: boolean;
  onToggle: (id: string) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  id,
  text,
  isChecked,
  onToggle,
}) => {
  const rowClass = [styles.row, isChecked ? styles.rowChecked : ''].filter(Boolean).join(' ');

  return (
    <button
      type='button'
      className={rowClass}
      onClick={() => onToggle(id)}
      aria-pressed={isChecked}
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
