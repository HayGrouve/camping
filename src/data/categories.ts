import {
  cleanUp,
  clothesAndShoes,
  firstAid,
  food,
  furniture,
  hygieneAndToiletries,
  IChecklistData,
  indoors,
  outdoors,
  personal,
  recreational,
  safety,
} from './checklist';

export interface CategoryDefinition {
  storageKey: string;
  displayTitle: string;
  anchorId: string;
  defaultData: IChecklistData;
}

export const CATEGORIES: CategoryDefinition[] = [
  { storageKey: 'INDOORS', displayTitle: 'Indoors', anchorId: 'indoors', defaultData: indoors },
  { storageKey: 'OUTDOORS', displayTitle: 'Outdoors', anchorId: 'outdoors', defaultData: outdoors },
  { storageKey: 'FURNITURE', displayTitle: 'Furniture', anchorId: 'furniture', defaultData: furniture },
  {
    storageKey: 'CLOTHES AND SHOES',
    displayTitle: 'Clothes and shoes',
    anchorId: 'clothes-and-shoes',
    defaultData: clothesAndShoes,
  },
  { storageKey: 'FOOD', displayTitle: 'Food', anchorId: 'food', defaultData: food },
  {
    storageKey: 'HYGIENE AND TOILETRIES',
    displayTitle: 'Hygiene and toiletries',
    anchorId: 'hygiene-and-toiletries',
    defaultData: hygieneAndToiletries,
  },
  {
    storageKey: 'RECREATIONAL GEAR',
    displayTitle: 'Recreational gear',
    anchorId: 'recreational-gear',
    defaultData: recreational,
  },
  { storageKey: 'CLEAN-UP', displayTitle: 'Clean-up', anchorId: 'clean-up', defaultData: cleanUp },
  { storageKey: 'SAFETY', displayTitle: 'Safety', anchorId: 'safety', defaultData: safety },
  { storageKey: 'FIRST-AID', displayTitle: 'First-aid', anchorId: 'first-aid', defaultData: firstAid },
  {
    storageKey: 'PERSONAL BELONGINGS',
    displayTitle: 'Personal belongings',
    anchorId: 'personal-belongings',
    defaultData: personal,
  },
];
