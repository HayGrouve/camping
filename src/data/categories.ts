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
  anchorId: string;
  iconId: CategoryIconId;
  defaultData: IChecklistData;
}

export const CATEGORIES: CategoryDefinition[] = [
  { storageKey: 'INDOORS', anchorId: 'indoors', iconId: 'indoors', defaultData: indoors },
  { storageKey: 'OUTDOORS', anchorId: 'outdoors', iconId: 'outdoors', defaultData: outdoors },
  { storageKey: 'FURNITURE', anchorId: 'furniture', iconId: 'furniture', defaultData: furniture },
  {
    storageKey: 'CLOTHES AND SHOES',
    anchorId: 'clothes-and-shoes',
    iconId: 'clothes',
    defaultData: clothesAndShoes,
  },
  { storageKey: 'FOOD', anchorId: 'food', iconId: 'food', defaultData: food },
  {
    storageKey: 'HYGIENE AND TOILETRIES',
    anchorId: 'hygiene-and-toiletries',
    iconId: 'hygiene',
    defaultData: hygieneAndToiletries,
  },
  {
    storageKey: 'RECREATIONAL GEAR',
    anchorId: 'recreational-gear',
    iconId: 'recreational',
    defaultData: recreational,
  },
  { storageKey: 'CLEAN-UP', anchorId: 'clean-up', iconId: 'cleanup', defaultData: cleanUp },
  { storageKey: 'SAFETY', anchorId: 'safety', iconId: 'safety', defaultData: safety },
  { storageKey: 'FIRST-AID', anchorId: 'first-aid', iconId: 'firstaid', defaultData: firstAid },
  {
    storageKey: 'PERSONAL BELONGINGS',
    anchorId: 'personal-belongings',
    iconId: 'personal',
    defaultData: personal,
  },
];
