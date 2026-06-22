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
  const labelStyles = [styles.label];
  if (isChecked) labelStyles.push(styles.checked);

  return (
    <button
      type='button'
      className={styles.row}
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
