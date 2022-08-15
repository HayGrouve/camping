import Checklist from './components/checklist/checklist.component';
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
} from './data/checklist';

function App() {
  return (
    <main>
      <div className='header'>
        <h1>Ceko's Camping Checklist</h1>
        <img
          className='header-img'
          src='./android-chrome-512x512.png'
          alt='tent'
        />
      </div>
      <Checklist checklistData={indoors} title='INDOORS' />
      <Checklist checklistData={outdoors} title='OUTDOORS' />
      <Checklist checklistData={furniture} title='FURNITURE' />
      <Checklist checklistData={clothesAndShoes} title='CLOTHES AND SHOES' />
      <Checklist checklistData={food} title='FOOD' />
      <Checklist
        checklistData={hygieneAndToiletries}
        title='HYGIENE AND TOILETRIES'
      />
      <Checklist checklistData={recreational} title='RECREATIONAL GEAR' />
      <Checklist checklistData={cleanUp} title='CLEAN-UP' />
      <Checklist checklistData={safety} title='SAFETY' />
      <Checklist checklistData={firstAid} title='FIRST-AID' />
      <Checklist checklistData={personal} title='PERSONAL BELONGINGS' />
    </main>
  );
}

export default App;
