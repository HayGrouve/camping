import { Locale } from './locale';

export type CategoryStorageKey =
  | 'INDOORS'
  | 'OUTDOORS'
  | 'FURNITURE'
  | 'CLOTHES AND SHOES'
  | 'FOOD'
  | 'HYGIENE AND TOILETRIES'
  | 'RECREATIONAL GEAR'
  | 'CLEAN-UP'
  | 'SAFETY'
  | 'FIRST-AID'
  | 'PERSONAL BELONGINGS';

const TITLES: Record<Locale, Record<CategoryStorageKey, string>> = {
  bg: {
    INDOORS: 'В палатката',
    OUTDOORS: 'На открито',
    FURNITURE: 'Мебели и сянка',
    'CLOTHES AND SHOES': 'Дрехи и обувки',
    FOOD: 'Храна',
    'HYGIENE AND TOILETRIES': 'Хигиена и тоалетни принадлежности',
    'RECREATIONAL GEAR': 'Оборудване за отдих',
    'CLEAN-UP': 'Почистване',
    SAFETY: 'Безопасност',
    'FIRST-AID': 'Първа помощ',
    'PERSONAL BELONGINGS': 'Лични вещи',
  },
  en: {
    INDOORS: 'Indoors',
    OUTDOORS: 'Outdoors',
    FURNITURE: 'Furniture',
    'CLOTHES AND SHOES': 'Clothes and shoes',
    FOOD: 'Food',
    'HYGIENE AND TOILETRIES': 'Hygiene and toiletries',
    'RECREATIONAL GEAR': 'Recreational gear',
    'CLEAN-UP': 'Clean-up',
    SAFETY: 'Safety',
    'FIRST-AID': 'First aid',
    'PERSONAL BELONGINGS': 'Personal belongings',
  },
};

export const getCategoryTitle = (locale: Locale, storageKey: string): string => {
  const titles = TITLES[locale];
  return titles[storageKey as CategoryStorageKey] ?? storageKey;
};
