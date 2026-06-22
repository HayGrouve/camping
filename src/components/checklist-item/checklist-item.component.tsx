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

  const rowClass = [styles.row, flash ? styles.rowFlash : ''].filter(Boolean).join(' ');

  return (
    <button
      type='button'
      className={rowClass}
      onClick={() => onToggle(id)}
      aria-pressed={isChecked}
    >
      <input
        readOnly
        tabIndex={-1}
        checked={isChecked}
        type='checkbox'
        className={styles.checkbox}
        aria-hidden='true'
      />
      <span className={labelStyles.join(' ')}>{text}</span>
    </button>
  );
};

export default ChecklistItem;
