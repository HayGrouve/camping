import React from 'react';
import { IChecklistItem } from '../../data/checklist';
import { useLocalStorage } from '../../hooks/useStorage';
import ChecklistItem from '../checklist-item/checklist-item.component';
import styles from './checklist.module.css';

interface IChecklist {
  title: string;
  checklistData: IChecklistItem[];
}

const Checklist: React.FC<IChecklist> = ({ title, checklistData }) => {
  const [campingData, setCampingData] = useLocalStorage(title, checklistData);

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

  return (
    <section className={styles.main}>
      <h2>{title}</h2>
      <div className={styles.wrapper}>
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
