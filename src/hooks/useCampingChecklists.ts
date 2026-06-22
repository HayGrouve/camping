import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { CATEGORIES, CategoryIconId } from '../data/categories';
import { IChecklistData } from '../data/checklist';
import { getCategoryTitle } from '../i18n/categories';
import { ITEM_TEXT } from '../i18n/items';
import { useLocale } from '../i18n/locale-context';
import { loadLocale, Locale } from '../i18n/locale';
import { mergeCategoryWithLocale } from '../i18n/mergeCategoryWithLocale';
import {
  calcProgress,
  calcSectionProgress,
  CategoryEntry,
  CategoryRemaining,
  filterRemainingItems,
  getCategoriesWithRemaining,
  ProgressSummary,
} from '../utils/progressUtils';

const readStoredCategory = (storageKey: string): IChecklistData | null => {
  try {
    const jsonValue = window.localStorage.getItem(storageKey);
    if (jsonValue != null) {
      const parsed = JSON.parse(jsonValue) as IChecklistData;
      if (parsed.expiry > Date.now()) return parsed;
    }
  } catch {
    // fall through
  }
  return null;
};

const loadAndMerge = (
  storageKey: string,
  defaultData: IChecklistData,
  locale: Locale
): IChecklistData => {
  const stored = readStoredCategory(storageKey);
  return mergeCategoryWithLocale(defaultData, stored, locale, ITEM_TEXT);
};

const persistCategory = (storageKey: string, data: IChecklistData): void => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  } catch {
    // session-only fallback — no throw
  }
};

const SHOW_REMAINING_KEY = 'camping-show-remaining';

const loadShowRemaining = (): boolean => {
  try {
    return sessionStorage.getItem(SHOW_REMAINING_KEY) === 'true';
  } catch {
    return false;
  }
};

const persistShowRemaining = (value: boolean): void => {
  try {
    sessionStorage.setItem(SHOW_REMAINING_KEY, String(value));
  } catch {
    // ignore
  }
};

export interface CampingChecklistView {
  storageKey: string;
  displayTitle: string;
  anchorId: string;
  iconId: CategoryIconId;
  data: IChecklistData;
  sectionProgress: { checked: number; total: number };
  isComplete: boolean;
}

export interface UseCampingChecklistsResult {
  categories: CampingChecklistView[];
  totalProgress: ProgressSummary;
  categoriesWithRemaining: CategoryRemaining[];
  showRemaining: boolean;
  setShowRemaining: Dispatch<SetStateAction<boolean>>;
  toggleItem: (storageKey: string, itemId: string) => void;
  clearSection: (storageKey: string) => void;
  clearAll: () => void;
  isAllPacked: boolean;
}

export const useCampingChecklists = (): UseCampingChecklistsResult => {
  const { locale } = useLocale();

  const [categoryState, setCategoryState] = useState<Record<string, IChecklistData>>(() => {
    const initial: Record<string, IChecklistData> = {};
    const initialLocale = loadLocale();
    CATEGORIES.forEach(({ storageKey, defaultData }) => {
      initial[storageKey] = loadAndMerge(storageKey, defaultData, initialLocale);
    });
    return initial;
  });

  const [showRemaining, setShowRemainingState] = useState(loadShowRemaining);

  useEffect(() => {
    setCategoryState((prev) => {
      const next: Record<string, IChecklistData> = {};
      CATEGORIES.forEach(({ storageKey, defaultData }) => {
        next[storageKey] = mergeCategoryWithLocale(
          defaultData,
          prev[storageKey] ?? null,
          locale,
          ITEM_TEXT
        );
      });
      return next;
    });
  }, [locale]);

  const setShowRemaining: Dispatch<SetStateAction<boolean>> = useCallback((value) => {
    setShowRemainingState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      persistShowRemaining(next);
      return next;
    });
  }, []);

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
      CATEGORIES.map(({ storageKey, anchorId }) => ({
        storageKey,
        displayTitle: getCategoryTitle(locale, storageKey),
        anchorId,
        data: categoryState[storageKey],
      })),
    [categoryState, locale]
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
          const categoryDef = CATEGORIES.find((c) => c.storageKey === entry.storageKey);

          if (showRemaining && isComplete) return null;

          return {
            storageKey: entry.storageKey,
            displayTitle: entry.displayTitle,
            anchorId: entry.anchorId,
            iconId: categoryDef!.iconId,
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
