import React from 'react';
import styles from './checklist-item.module.css';
interface IChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
  handleClick: Function;
}

const ChecklistItem: React.FC<IChecklistItem> = ({
  id,
  text,
  isChecked,
  handleClick,
}) => {
  return (
    <div>
      <input
        checked={isChecked}
        type='checkbox'
        name={text}
        id={id}
        onChange={(e) =>
          //@ts-ignore
          handleClick(e.target.id)
        }
      />
      <label className={isChecked ? styles.checked : ''} htmlFor={id}>
        {text}
      </label>
    </div>
  );
};

export default ChecklistItem;
