import { IChecklistData, IChecklistItem } from '../data/checklist';

export interface ProgressSummary {
  checked: number;
  total: number;
  percent: number;
}

export interface SectionProgress {
  checked: number;
  total: number;
}

export interface CategoryEntry {
  storageKey: string;
  displayTitle: string;
  anchorId: string;
  data: IChecklistData;
}

export interface CategoryRemaining {
  storageKey: string;
  displayTitle: string;
  anchorId: string;
  remaining: number;
}

export const calcProgress = (categories: IChecklistData[]): ProgressSummary => {
  let checked = 0;
  let total = 0;

  categories.forEach((category) => {
    category.data.forEach((item) => {
      total += 1;
      if (item.isChecked) checked += 1;
    });
  });

  const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
  return { checked, total, percent };
};

export const calcSectionProgress = (category: IChecklistData): SectionProgress => {
  const checked = category.data.filter((item) => item.isChecked).length;
  return { checked, total: category.data.length };
};

export const filterRemainingItems = (category: IChecklistData): IChecklistData => {
  const data: IChecklistItem[] = category.data.filter((item) => !item.isChecked);
  return { ...category, data };
};

export const getCategoriesWithRemaining = (
  entries: CategoryEntry[]
): CategoryRemaining[] =>
  entries
    .map((entry) => {
      const { checked, total } = calcSectionProgress(entry.data);
      const remaining = total - checked;
      if (remaining === 0) return null;
      return {
        storageKey: entry.storageKey,
        displayTitle: entry.displayTitle,
        anchorId: entry.anchorId,
        remaining,
      };
    })
    .filter((entry): entry is CategoryRemaining => entry !== null);
