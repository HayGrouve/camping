import React, { useCallback, useEffect } from 'react';
import { IChecklistItem } from '../../data/checklist';
import { useLocalStorage } from '../../hooks/useStorage';
import ChecklistItem from '../checklist-item/checklist-item.component';
import styles from './checklist.module.css';

interface IChecklist {
  title: string;
  checklistData: IChecklistItem[];
  isClearAll?: boolean;
}

const Checklist: React.FC<IChecklist> = ({
  title,
  checklistData,
  isClearAll,
}) => {
  const [campingData, setCampingData] = useLocalStorage(title, checklistData);

  const clearCheckmark = useCallback(() => {
    setCampingData((prevData: IChecklistItem[]) => {
      const newData = prevData.map((item) => {
        return { ...item, isChecked: false };
      });
      return newData;
    });
  }, [setCampingData]);

  const handleClick = (id: string) => {
    setCampingData((prevData: IChecklistItem[]) => {
      const updatedData = prevData.map((item) => {
        if (item.id === id) {
          return { ...item, isChecked: !item.isChecked };
        }
        return item;
      });
      return updatedData;
    });
  };

  useEffect(() => {
    clearCheckmark();
  }, [isClearAll, clearCheckmark]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{title}</h2>
        <button className={styles.clearBtn} onClick={() => clearCheckmark()}>
          clear
        </button>
      </div>
      <div className={styles.checklist}>
        {campingData.map(
          (item: { id: string; text: string; isChecked: boolean }) => {
            const { id, text, isChecked } = item;
            return (
              <ChecklistItem
                key={id}
                id={id}
                text={text}
                isChecked={isChecked}
                handleClick={handleClick}
              />
            );
          }
        )}
      </div>
    </section>
  );
};

export default Checklist;
