import { IChecklistData, IChecklistItem } from '../data/checklist';
import { Locale } from './locale';

export type ItemTextMap = Record<Locale, Record<string, string>>;

const resolveChecked = (
  catalogIndex: number,
  catalogId: string,
  storedItems: IChecklistItem[],
  englishText: string
): boolean => {
  const byId = storedItems.find((item) => item.id === catalogId);
  if (byId) return byId.isChecked;

  const byText = storedItems.find((item) => item.text === englishText);
  if (byText) return byText.isChecked;

  const byIndex = storedItems[catalogIndex];
  return byIndex?.isChecked ?? false;
};

export const mergeCategoryWithLocale = (
  catalog: IChecklistData,
  stored: IChecklistData | null,
  locale: Locale,
  itemText: ItemTextMap
): IChecklistData => {
  const storedItems = stored?.data ?? [];

  const data = catalog.data.map((item, index) => {
    const englishText = itemText.en[item.id] ?? '';
    const text = itemText[locale][item.id] ?? englishText;
    const isChecked = resolveChecked(index, item.id, storedItems, englishText);

    return { id: item.id, text, isChecked };
  });

  return { data, expiry: catalog.expiry };
};
