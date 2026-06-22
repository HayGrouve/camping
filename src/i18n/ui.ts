import { Locale } from './locale';

export type UiKey =
  | 'app.title'
  | 'showRemaining'
  | 'showAll'
  | 'clearAll'
  | 'jumpTo'
  | 'allPacked'
  | 'allItemsPacked'
  | 'clearSection'
  | 'clearAllConfirm.title'
  | 'clearAllConfirm.message'
  | 'clearSectionConfirm.title'
  | 'clearSectionConfirm.message'
  | 'clearSectionConfirm.confirm'
  | 'confirm'
  | 'cancel'
  | 'scrollToTop'
  | 'switchLanguage'
  | 'jumpCategoriesAria'
  | 'sectionComplete';

const UI: Record<Locale, Record<UiKey, string>> = {
  bg: {
    'app.title': 'Списък за къмпинг на Цеко',
    'showRemaining': 'Покажи оставащите',
    'showAll': 'Покажи всички',
    'clearAll': 'Изчисти всичко',
    'jumpTo': 'Към…',
    'allPacked': 'Всичко е опаковано!',
    'allItemsPacked': 'Всички артикули са опаковани',
    'clearSection': 'Изчисти',
    'clearAllConfirm.title': 'Да изчистя ли всички отметки?',
    'clearAllConfirm.message':
      'Това ще премахне отметките от всички категории. Артикулите няма да бъдат изтрити.',
    'clearSectionConfirm.title': 'Да изчистя ли {category}?',
    'clearSectionConfirm.message': 'Това ще премахне отметките от тази категория.',
    'clearSectionConfirm.confirm': 'Изчисти секцията',
    'confirm': 'Потвърди',
    'cancel': 'Отказ',
    'scrollToTop': 'Към началото',
    'switchLanguage': 'Смяна на език',
    'jumpCategoriesAria': 'Към категории с оставащи артикули',
    'sectionComplete': 'Завършена',
  },
  en: {
    'app.title': "Ceko's Camping Checklist",
    'showRemaining': 'Show remaining',
    'showAll': 'Show all',
    'clearAll': 'Clear all',
    'jumpTo': 'Jump to…',
    'allPacked': 'All packed!',
    'allItemsPacked': 'All items packed',
    'clearSection': 'Clear',
    'clearAllConfirm.title': 'Clear all checkmarks?',
    'clearAllConfirm.message':
      'This will uncheck every item in all categories. Your items will not be deleted.',
    'clearSectionConfirm.title': 'Clear {category}?',
    'clearSectionConfirm.message': 'This will uncheck all items in this category.',
    'clearSectionConfirm.confirm': 'Clear section',
    'confirm': 'Confirm',
    'cancel': 'Cancel',
    'scrollToTop': 'Go to the top',
    'switchLanguage': 'Switch language',
    'jumpCategoriesAria': 'Jump to categories with remaining items',
    'sectionComplete': 'Complete',
  },
};

export const getUiString = (locale: Locale, key: UiKey): string => UI[locale][key];

export const formatProgressLabel = (
  locale: Locale,
  checked: number,
  total: number,
  percent: number
): string => {
  if (locale === 'bg') {
    return `${checked} от ${total} опаковани (${percent}%)`;
  }
  return `${checked} of ${total} packed (${percent}%)`;
};

export const interpolate = (template: string, values: Record<string, string>): string =>
  Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, value),
    template
  );
