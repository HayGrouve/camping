import { useState } from 'react';
import Checklist from '../components/checklist/checklist.component';
import Footer from '../components/common/footer/footer.component';
import {
  cleanUp,
  clothesAndShoes,
  firstAid,
  food,
  furniture,
  hygieneAndToiletries,
  indoors,
  outdoors,
  personal,
  recreational,
  safety,
} from '../data/checklist';
import styles from './app.module.css';

function App() {
  const [isClearAll, setIsClearAll] = useState(false);
  return (
    <main>
      <div className={styles.header}>
        <h1 className={styles.heading}>Ceko's Camping Checklist</h1>
        <img src='./android-chrome-512x512.png' alt='tent' />
        <button onClick={() => setIsClearAll(!isClearAll)}>clear all</button>
      </div>
      <div className={styles.wrapper}>
        <Checklist
          isClearAll={isClearAll}
          checklistData={indoors}
          title='INDOORS'
        />
        <Checklist
          isClearAll={isClearAll}
          checklistData={outdoors}
          title='OUTDOORS'
        />
        <Checklist
          isClearAll={isClearAll}
          checklistData={furniture}
          title='FURNITURE'
        />
        <Checklist
          isClearAll={isClearAll}
          checklistData={clothesAndShoes}
          title='CLOTHES AND SHOES'
        />
        <Checklist isClearAll={isClearAll} checklistData={food} title='FOOD' />
        <Checklist
          isClearAll={isClearAll}
          checklistData={hygieneAndToiletries}
          title='HYGIENE AND TOILETRIES'
        />
        <Checklist
          isClearAll={isClearAll}
          checklistData={recreational}
          title='RECREATIONAL GEAR'
        />
        <Checklist
          isClearAll={isClearAll}
          checklistData={cleanUp}
          title='CLEAN-UP'
        />
        <Checklist
          isClearAll={isClearAll}
          checklistData={safety}
          title='SAFETY'
        />
        <Checklist
          isClearAll={isClearAll}
          checklistData={firstAid}
          title='FIRST-AID'
        />
        <Checklist
          isClearAll={isClearAll}
          checklistData={personal}
          title='PERSONAL BELONGINGS'
        />
      </div>
      <Footer />
    </main>
  );
}

export default App;
