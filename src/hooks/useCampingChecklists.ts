import { useCallback, useEffect, useMemo, useState } from 'react';
import { CATEGORIES } from '../data/categories';
import { IChecklistData } from '../data/checklist';
import {
  calcProgress,
  calcSectionProgress,
  CategoryEntry,
  CategoryRemaining,
  filterRemainingItems,
  getCategoriesWithRemaining,
  ProgressSummary,
} from '../utils/progressUtils';

const loadCategory = (storageKey: string, defaultData: IChecklistData): IChecklistData => {
  try {
    const jsonValue = window.localStorage.getItem(storageKey);
    if (jsonValue != null) {
      const parsed = JSON.parse(jsonValue) as IChecklistData;
      if (parsed.expiry > Date.now()) return parsed;
    }
  } catch {
    // fall through to default
  }
  return defaultData;
};

const persistCategory = (storageKey: string, data: IChecklistData): void => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  } catch {
    // session-only fallback — no throw
  }
};

export interface CampingChecklistView {
  storageKey: string;
  displayTitle: string;
  anchorId: string;
  data: IChecklistData;
  sectionProgress: { checked: number; total: number };
  isComplete: boolean;
}

export interface UseCampingChecklistsResult {
  categories: CampingChecklistView[];
  totalProgress: ProgressSummary;
  categoriesWithRemaining: CategoryRemaining[];
  showRemaining: boolean;
  setShowRemaining: (value: boolean) => void;
  toggleItem: (storageKey: string, itemId: string) => void;
  clearSection: (storageKey: string) => void;
  clearAll: () => void;
  isAllPacked: boolean;
}

export const useCampingChecklists = (): UseCampingChecklistsResult => {
  const [categoryState, setCategoryState] = useState<Record<string, IChecklistData>>(() => {
    const initial: Record<string, IChecklistData> = {};
    CATEGORIES.forEach(({ storageKey, defaultData }) => {
      initial[storageKey] = loadCategory(storageKey, defaultData);
    });
    return initial;
  });

  const [showRemaining, setShowRemaining] = useState(false);

  useEffect(() => {
    Object.entries(categoryState).forEach(([storageKey, data]) => {
      persistCategory(storageKey, data);
    });
  }, [categoryState]);

  const toggleItem = useCallback((storageKey: string, itemId: string) => {
    setCategoryState((prev) => {
      const current = prev[storageKey];
      if (!current) return prev;
      const data = current.data.map((item) =>
        item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
      );
      return { ...prev, [storageKey]: { ...current, data } };
    });
  }, []);

  const clearSection = useCallback((storageKey: string) => {
    setCategoryState((prev) => {
      const current = prev[storageKey];
      if (!current) return prev;
      const data = current.data.map((item) => ({ ...item, isChecked: false }));
      return { ...prev, [storageKey]: { ...current, data } };
    });
  }, []);

  const clearAll = useCallback(() => {
    setCategoryState((prev) => {
      const next: Record<string, IChecklistData> = {};
      Object.entries(prev).forEach(([key, category]) => {
        next[key] = {
          ...category,
          data: category.data.map((item) => ({ ...item, isChecked: false })),
        };
      });
      return next;
    });
  }, []);

  const categoryEntries: CategoryEntry[] = useMemo(
    () =>
      CATEGORIES.map(({ storageKey, displayTitle, anchorId }) => ({
        storageKey,
        displayTitle,
        anchorId,
        data: categoryState[storageKey],
      })),
    [categoryState]
  );

  const totalProgress = useMemo(
    () => calcProgress(categoryEntries.map((entry) => entry.data)),
    [categoryEntries]
  );

  const categoriesWithRemaining = useMemo(
    () => getCategoriesWithRemaining(categoryEntries),
    [categoryEntries]
  );

  const categories: CampingChecklistView[] = useMemo(
    () =>
      categoryEntries
        .map((entry) => {
          const sectionProgress = calcSectionProgress(entry.data);
          const isComplete = sectionProgress.checked === sectionProgress.total;
          const data =
            showRemaining && !isComplete ? filterRemainingItems(entry.data) : entry.data;

          if (showRemaining && isComplete) return null;

          return {
            storageKey: entry.storageKey,
            displayTitle: entry.displayTitle,
            anchorId: entry.anchorId,
            data,
            sectionProgress,
            isComplete,
          };
        })
        .filter((entry): entry is CampingChecklistView => entry !== null),
    [categoryEntries, showRemaining]
  );

  const isAllPacked = totalProgress.total > 0 && totalProgress.checked === totalProgress.total;

  return {
    categories,
    totalProgress,
    categoriesWithRemaining,
    showRemaining,
    setShowRemaining,
    toggleItem,
    clearSection,
    clearAll,
    isAllPacked,
  };
};
