import { Locale } from './locale';

export type UiKey =
  | 'app.title'
  | 'hero.eyebrow'
  | 'packed'
  | 'filter.all'
  | 'filter.remaining'
  | 'filterAria'
  | 'clearAll'
  | 'jumpTo'
  | 'allPacked'
  | 'allPackedMessage'
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
  | 'sectionComplete'
  | 'emptyState.title'
  | 'emptyState.message';

const UI: Record<Locale, Record<UiKey, string>> = {
  bg: {
    'app.title': 'Списък за къмпинг на Цеко',
    'hero.eyebrow': 'Списък за багаж',
    'packed': 'опаковано',
    'filter.all': 'Всички',
    'filter.remaining': 'Оставащи',
    'filterAria': 'Филтър на артикулите',
    'clearAll': 'Изчисти всичко',
    'jumpTo': 'Към',
    'allPacked': 'Всичко е опаковано!',
    'allPackedMessage': 'Всичко е опаковано. Приятно изкарване сред природата!',
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
    'sectionComplete': 'Готово',
    'emptyState.title': 'Всичко е в раницата',
    'emptyState.message': 'Няма оставащи артикули. Покажи всички, за да прегледаш списъка отново.',
  },
  en: {
    'app.title': "Ceko's Camping Checklist",
    'hero.eyebrow': 'Packing list',
    'packed': 'packed',
    'filter.all': 'All',
    'filter.remaining': 'Remaining',
    'filterAria': 'Filter items',
    'clearAll': 'Clear all',
    'jumpTo': 'Jump to',
    'allPacked': 'All packed!',
    'allPackedMessage': 'Everything is packed. Enjoy the great outdoors!',
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
    'sectionComplete': 'Done',
    'emptyState.title': 'Everything is in the backpack',
    'emptyState.message': 'No items left to pack. Switch to “All” to review the full list.',
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

export const formatRemainingLabel = (locale: Locale, remaining: number): string => {
  if (locale === 'bg') {
    return remaining === 1
      ? 'Остава 1 нещо за опаковане'
      : `Остават ${remaining} неща за опаковане`;
  }
  return remaining === 1 ? '1 item left to pack' : `${remaining} items left to pack`;
};

export const interpolate = (template: string, values: Record<string, string>): string =>
  Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, value),
    template
  );
