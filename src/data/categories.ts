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

export type CategoryIconId =
  | 'indoors'
  | 'outdoors'
  | 'furniture'
  | 'clothes'
  | 'food'
  | 'hygiene'
  | 'recreational'
  | 'cleanup'
  | 'safety'
  | 'firstaid'
  | 'personal';

export interface CategoryDefinition {
  storageKey: string;
  displayTitle: string;
  anchorId: string;
  iconId: CategoryIconId;
  defaultData: IChecklistData;
}

export const CATEGORIES: CategoryDefinition[] = [
  { storageKey: 'INDOORS', displayTitle: 'Indoors', anchorId: 'indoors', iconId: 'indoors', defaultData: indoors },
  { storageKey: 'OUTDOORS', displayTitle: 'Outdoors', anchorId: 'outdoors', iconId: 'outdoors', defaultData: outdoors },
  { storageKey: 'FURNITURE', displayTitle: 'Furniture', anchorId: 'furniture', iconId: 'furniture', defaultData: furniture },
  {
    storageKey: 'CLOTHES AND SHOES',
    displayTitle: 'Clothes and shoes',
    anchorId: 'clothes-and-shoes',
    iconId: 'clothes',
    defaultData: clothesAndShoes,
  },
  { storageKey: 'FOOD', displayTitle: 'Food', anchorId: 'food', iconId: 'food', defaultData: food },
  {
    storageKey: 'HYGIENE AND TOILETRIES',
    displayTitle: 'Hygiene and toiletries',
    anchorId: 'hygiene-and-toiletries',
    iconId: 'hygiene',
    defaultData: hygieneAndToiletries,
  },
  {
    storageKey: 'RECREATIONAL GEAR',
    displayTitle: 'Recreational gear',
    anchorId: 'recreational-gear',
    iconId: 'recreational',
    defaultData: recreational,
  },
  { storageKey: 'CLEAN-UP', displayTitle: 'Clean-up', anchorId: 'clean-up', iconId: 'cleanup', defaultData: cleanUp },
  { storageKey: 'SAFETY', displayTitle: 'Safety', anchorId: 'safety', iconId: 'safety', defaultData: safety },
  { storageKey: 'FIRST-AID', displayTitle: 'First-aid', anchorId: 'first-aid', iconId: 'firstaid', defaultData: firstAid },
  {
    storageKey: 'PERSONAL BELONGINGS',
    displayTitle: 'Personal belongings',
    anchorId: 'personal-belongings',
    iconId: 'personal',
    defaultData: personal,
  },
];
