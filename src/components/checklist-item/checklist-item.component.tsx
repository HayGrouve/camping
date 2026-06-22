import React, { useEffect, useRef, useState } from 'react';
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
  const [flash, setFlash] = useState(false);
  const prevCheckedRef = useRef(isChecked);

  useEffect(() => {
    if (isChecked && !prevCheckedRef.current) {
      setFlash(true);
      const timer = window.setTimeout(() => setFlash(false), 200);
      prevCheckedRef.current = isChecked;
      return () => window.clearTimeout(timer);
    }
    prevCheckedRef.current = isChecked;
  }, [isChecked]);

  const labelStyles = [styles.label];
  if (isChecked) labelStyles.push(styles.checked);

  const checkboxStyles = [styles.checkbox];
  if (isChecked) checkboxStyles.push(styles.checkboxChecked);

  const rowClass = [styles.row, flash ? styles.rowFlash : ''].filter(Boolean).join(' ');

  return (
    <button
      type='button'
      className={rowClass}
      onClick={() => onToggle(id)}
      aria-pressed={isChecked}
    >
      <span className={checkboxStyles.join(' ')} aria-hidden='true'>
        {isChecked && (
          <svg
            className={styles.checkmark}
            viewBox='0 0 12 12'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M2 6l3 3 5-5' />
          </svg>
        )}
      </span>
      <span className={labelStyles.join(' ')}>{text}</span>
    </button>
  );
};

export default ChecklistItem;
