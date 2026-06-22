# Camping Checklist UI/UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add sticky progress header, "show remaining" filter, quick-jump chips, confirmed clear actions, and mobile-friendly visual refresh while preserving existing localStorage checkmarks.

**Architecture:** Consolidate all 11 category slices into a single `useCampingChecklists` hook at the App level. Pure progress/filter logic lives in `progressUtils.ts` (unit tested). UI components become presentational — they receive data and callbacks from App via the hook.

**Tech Stack:** Create React App 5, React 18, TypeScript 4.7, CSS modules, Jest/RTL (CRA default), localStorage

**Spec:** `docs/superpowers/specs/2026-06-22-camping-checklist-ui-ux-design.md`

---

## File Structure

| File | Responsibility |
|---|---|
| `src/utils/progressUtils.ts` | Pure functions: progress calc, remaining filter, categories-with-remaining |
| `src/utils/progressUtils.test.ts` | Unit tests for progressUtils |
| `src/data/categories.ts` | Single config array: storage keys, display titles, anchor IDs, default data |
| `src/hooks/useCampingChecklists.ts` | Loads/saves all categories; exposes toggle, clear, showRemaining, derived state |
| `src/components/confirm-dialog/confirm-dialog.component.tsx` | Reusable confirmation modal |
| `src/components/confirm-dialog/confirm-dialog.module.css` | Modal styles |
| `src/components/progress-header/progress-header.component.tsx` | Sticky header: progress bar, toggle, chips, clear all |
| `src/components/progress-header/progress-header.module.css` | Sticky header styles |
| `src/components/checklist/checklist.component.tsx` | Presentational category card (no localStorage) |
| `src/components/checklist/checklist.module.css` | Card layout, section progress, scroll-margin-top |
| `src/components/checklist-item/checklist-item.component.tsx` | Full-row tap target row |
| `src/components/checklist-item/checklist-item.module.css` | 48px min-height row styles |
| `src/components/common/footer/footer.component.tsx` | Scroll-to-top FAB (restyle only) |
| `src/components/common/footer/footer.module.css` | FAB positioning and styles |
| `src/app/app.component.tsx` | Thin shell wiring hook → header + checklists |
| `src/app/app.module.css` | Grid layout adjustments (header moved to ProgressHeader) |
| `public/site.webmanifest` | Dark theme colors |
| `src/hooks/useStorage.js` | **Delete** after hook migration (no longer imported) |

---

### Task 1: Progress utilities (TDD)

**Files:**
- Create: `src/utils/progressUtils.ts`
- Create: `src/utils/progressUtils.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/utils/progressUtils.test.ts`:

```typescript
import {
  calcProgress,
  calcSectionProgress,
  filterRemainingItems,
  getCategoriesWithRemaining,
} from './progressUtils';
import { IChecklistData } from '../data/checklist';

const makeCategory = (
  items: Array<{ text: string; isChecked: boolean }>
): IChecklistData => ({
  data: items.map((item, index) => ({
    id: String(index),
    text: item.text,
    isChecked: item.isChecked,
  })),
  expiry: Date.now() + 864000000,
});

describe('calcProgress', () => {
  it('returns zero percent for empty categories', () => {
    expect(calcProgress([])).toEqual({ checked: 0, total: 0, percent: 0 });
  });

  it('counts checked items across multiple categories', () => {
    const categories = [
      makeCategory([
        { text: 'a', isChecked: true },
        { text: 'b', isChecked: false },
      ]),
      makeCategory([
        { text: 'c', isChecked: true },
        { text: 'd', isChecked: true },
      ]),
    ];
    expect(calcProgress(categories)).toEqual({
      checked: 3,
      total: 4,
      percent: 75,
    });
  });
});

describe('calcSectionProgress', () => {
  it('returns section counts', () => {
    const category = makeCategory([
      { text: 'a', isChecked: true },
      { text: 'b', isChecked: false },
    ]);
    expect(calcSectionProgress(category)).toEqual({
      checked: 1,
      total: 2,
    });
  });
});

describe('filterRemainingItems', () => {
  it('returns only unchecked items', () => {
    const category = makeCategory([
      { text: 'a', isChecked: true },
      { text: 'b', isChecked: false },
    ]);
    const filtered = filterRemainingItems(category);
    expect(filtered.data).toHaveLength(1);
    expect(filtered.data[0].text).toBe('b');
  });
});

describe('getCategoriesWithRemaining', () => {
  it('returns only incomplete categories with remaining counts', () => {
    const entries = [
      {
        storageKey: 'FOOD',
        displayTitle: 'Food',
        anchorId: 'food',
        data: makeCategory([
          { text: 'a', isChecked: true },
          { text: 'b', isChecked: false },
        ]),
      },
      {
        storageKey: 'SAFETY',
        displayTitle: 'Safety',
        anchorId: 'safety',
        data: makeCategory([{ text: 'c', isChecked: true }]),
      },
    ];
    expect(getCategoriesWithRemaining(entries)).toEqual([
      {
        storageKey: 'FOOD',
        displayTitle: 'Food',
        anchorId: 'food',
        remaining: 1,
      },
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --watchAll=false progressUtils.test.ts`

Expected: FAIL — module `./progressUtils` not found

- [ ] **Step 3: Write minimal implementation**

Create `src/utils/progressUtils.ts`:

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --watchAll=false progressUtils.test.ts`

Expected: PASS (4 test suites / 5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/utils/progressUtils.ts src/utils/progressUtils.test.ts
git commit -m "feat: add progress calculation utilities with tests"
```

---

### Task 2: Category configuration

**Files:**
- Create: `src/data/categories.ts`

- [ ] **Step 1: Create categories config**

Create `src/data/categories.ts`:

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/data/categories.ts
git commit -m "feat: add centralized category configuration"
```

---

### Task 3: Consolidated checklist hook

**Files:**
- Create: `src/hooks/useCampingChecklists.ts`

- [ ] **Step 1: Implement the hook**

Create `src/hooks/useCampingChecklists.ts`:

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useCampingChecklists.ts
git commit -m "feat: consolidate checklist state into useCampingChecklists hook"
```

---

### Task 4: Confirm dialog component

**Files:**
- Create: `src/components/confirm-dialog/confirm-dialog.component.tsx`
- Create: `src/components/confirm-dialog/confirm-dialog.module.css`

- [ ] **Step 1: Create CSS module**

Create `src/components/confirm-dialog/confirm-dialog.module.css`:

```css
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
}

.dialog {
  background: #323940;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 360px;
  width: 100%;
  border: 1px solid #3d4449;
}

.title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.message {
  color: #c8cdd0;
  margin-bottom: 1.25rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.cancelBtn {
  background: #3d4449;
  color: white;
  padding: 0.5rem 1rem;
}

.confirmBtn {
  background: #78b159;
  color: white;
  padding: 0.5rem 1rem;
}
```

- [ ] **Step 2: Create component**

Create `src/components/confirm-dialog/confirm-dialog.component.tsx`:

```tsx
import React from 'react';
import styles from './confirm-dialog.module.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  return (
    <div className={styles.backdrop} role='dialog' aria-modal='true' aria-labelledby='confirm-title'>
      <div className={styles.dialog}>
        <h2 id='confirm-title' className={styles.title}>
          {title}
        </h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button type='button' className={styles.cancelBtn} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type='button' className={styles.confirmBtn} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/confirm-dialog/
git commit -m "feat: add reusable confirm dialog component"
```

---

### Task 5: Progress header component

**Files:**
- Create: `src/components/progress-header/progress-header.component.tsx`
- Create: `src/components/progress-header/progress-header.module.css`

- [ ] **Step 1: Create CSS module**

Create `src/components/progress-header/progress-header.module.css`:

```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #292f33;
  border-bottom: 1px solid #3d4449;
  padding: 1rem 0 0.75rem;
  max-height: 120px;
  overflow: hidden;
}

.titleRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.title {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
}

.progressRow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.progressTrack {
  flex: 1;
  height: 8px;
  background: #3d4449;
  border-radius: 999px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: #78b159;
  border-radius: 999px;
  transition: width 0.2s ease;
}

.progressLabel {
  font-size: 0.9rem;
  white-space: nowrap;
  color: #c8cdd0;
}

.controlsRow {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.toggleBtn {
  background: #323940;
  color: white;
  padding: 0.4rem 0.75rem;
  border: 1px solid #3d4449;
  font-size: 0.9rem;
}

.toggleBtnActive {
  border-color: #78b159;
  color: #78b159;
}

.clearBtn {
  background: #3d4449;
  color: white;
  padding: 0.4rem 0.75rem;
  font-size: 0.9rem;
}

.allPacked {
  color: #78b159;
  font-size: 0.9rem;
}

.chipsRow {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  max-height: 2.6rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.25rem;
}

.chip {
  background: transparent;
  color: #78b159;
  border: 1px solid #78b159;
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
  white-space: nowrap;
}
```

- [ ] **Step 2: Create component**

Create `src/components/progress-header/progress-header.component.tsx`:

```tsx
import React, { useState } from 'react';
import { CategoryRemaining, ProgressSummary } from '../../utils/progressUtils';
import ConfirmDialog from '../confirm-dialog/confirm-dialog.component';
import styles from './progress-header.module.css';

interface ProgressHeaderProps {
  totalProgress: ProgressSummary;
  categoriesWithRemaining: CategoryRemaining[];
  showRemaining: boolean;
  isAllPacked: boolean;
  onToggleShowRemaining: () => void;
  onClearAll: () => void;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  totalProgress,
  categoriesWithRemaining,
  showRemaining,
  isAllPacked,
  onToggleShowRemaining,
  onClearAll,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const scrollToCategory = (anchorId: string) => {
    const element = document.getElementById(anchorId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Ceko&apos;s Camping Checklist</h1>
        </div>

        <div className={styles.progressRow}>
          <div className={styles.progressTrack} aria-hidden='true'>
            <div
              className={styles.progressFill}
              style={{ width: `${totalProgress.percent}%` }}
            />
          </div>
          <span className={styles.progressLabel}>
            {totalProgress.checked}/{totalProgress.total} packed ({totalProgress.percent}%)
          </span>
        </div>

        <div className={styles.controlsRow}>
          <button
            type='button'
            className={`${styles.toggleBtn} ${showRemaining ? styles.toggleBtnActive : ''}`}
            onClick={onToggleShowRemaining}
            aria-pressed={showRemaining}
          >
            {showRemaining ? 'Show all' : 'Show remaining'}
          </button>
          <button
            type='button'
            className={styles.clearBtn}
            onClick={() => setShowClearConfirm(true)}
          >
            Clear all
          </button>
          {isAllPacked && <span className={styles.allPacked}>All packed!</span>}
        </div>

        {categoriesWithRemaining.length > 0 && (
          <div className={styles.chipsRow} aria-label='Jump to categories with remaining items'>
            {categoriesWithRemaining.map((category) => (
              <button
                key={category.storageKey}
                type='button'
                className={styles.chip}
                onClick={() => scrollToCategory(category.anchorId)}
              >
                {category.displayTitle} ({category.remaining})
              </button>
            ))}
          </div>
        )}
      </header>

      {showClearConfirm && (
        <ConfirmDialog
          title='Clear all checkmarks?'
          message='This will uncheck every item in all categories. Your items will not be deleted.'
          confirmLabel='Clear all'
          onConfirm={() => {
            onClearAll();
            setShowClearConfirm(false);
          }}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </>
  );
};

export default ProgressHeader;
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/progress-header/
git commit -m "feat: add sticky progress header with jump chips"
```

---

### Task 6: Refactor checklist item (full-row tap target)

**Files:**
- Modify: `src/components/checklist-item/checklist-item.component.tsx`
- Modify: `src/components/checklist-item/checklist-item.module.css`

- [ ] **Step 1: Update CSS**

Replace `src/components/checklist-item/checklist-item.module.css` with:

```css
.row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 48px;
  padding: 0.5rem 0.75rem;
  margin: 0;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.row:hover,
.row:focus-visible {
  background: rgba(120, 177, 89, 0.12);
  outline: none;
}

.row:active {
  background: rgba(120, 177, 89, 0.2);
}

.checkbox {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
  pointer-events: none;
}

.label {
  flex: 1;
  cursor: pointer;
}

.checked {
  text-decoration: line-through;
  opacity: 0.5;
}
```

- [ ] **Step 2: Update component**

Replace `src/components/checklist-item/checklist-item.component.tsx` with:

```tsx
import React from 'react';
import styles from './checklist-item.module.css';

interface ChecklistItemProps {
  id: string;
  text: string;
  isChecked: boolean;
  onToggle: (id: string) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  id,
  text,
  isChecked,
  onToggle,
}) => {
  const labelStyles = [styles.label];
  if (isChecked) labelStyles.push(styles.checked);

  return (
    <button
      type='button'
      className={styles.row}
      onClick={() => onToggle(id)}
      aria-pressed={isChecked}
    >
      <input
        readOnly
        tabIndex={-1}
        checked={isChecked}
        type='checkbox'
        className={styles.checkbox}
        aria-hidden='true'
      />
      <span className={labelStyles.join(' ')}>{text}</span>
    </button>
  );
};

export default ChecklistItem;
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: errors in `checklist.component.tsx` until Task 7 — that is OK for this step; re-run after Task 7

- [ ] **Step 4: Commit**

```bash
git add src/components/checklist-item/
git commit -m "feat: make checklist rows full-width tap targets"
```

---

### Task 7: Refactor checklist (presentational card)

**Files:**
- Modify: `src/components/checklist/checklist.component.tsx`
- Modify: `src/components/checklist/checklist.module.css`

- [ ] **Step 1: Update CSS**

Replace `src/components/checklist/checklist.module.css` with:

```css
.wrapper {
  background: #323940;
  border: 1px solid #3d4449;
  border-radius: 8px;
  padding: 1rem;
  scroll-margin-top: 130px;
}

.wrapperComplete {
  border-color: rgba(120, 177, 89, 0.35);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.titleGroup {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.heading {
  color: #78b159;
  font-size: 1.1rem;
}

.sectionProgress {
  font-size: 0.85rem;
  color: #c8cdd0;
}

.clearBtn {
  background: #3d4449;
  color: white;
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
```

- [ ] **Step 2: Update component**

Replace `src/components/checklist/checklist.component.tsx` with:

```tsx
import React, { useState } from 'react';
import { IChecklistData } from '../../data/checklist';
import ChecklistItem from '../checklist-item/checklist-item.component';
import ConfirmDialog from '../confirm-dialog/confirm-dialog.component';
import styles from './checklist.module.css';

interface ChecklistProps {
  anchorId: string;
  displayTitle: string;
  data: IChecklistData;
  sectionProgress: { checked: number; total: number };
  isComplete: boolean;
  onToggleItem: (itemId: string) => void;
  onClearSection: () => void;
}

const Checklist: React.FC<ChecklistProps> = ({
  anchorId,
  displayTitle,
  data,
  sectionProgress,
  isComplete,
  onToggleItem,
  onClearSection,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const wrapperClass = isComplete
    ? `${styles.wrapper} ${styles.wrapperComplete}`
    : styles.wrapper;

  return (
    <>
      <section id={anchorId} className={wrapperClass}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.heading}>{displayTitle}</h2>
            <span className={styles.sectionProgress}>
              {sectionProgress.checked}/{sectionProgress.total}
            </span>
          </div>
          <button
            type='button'
            className={styles.clearBtn}
            onClick={() => setShowClearConfirm(true)}
          >
            Clear
          </button>
        </div>
        <div className={styles.checklist}>
          {data.data.map((item) => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              text={item.text}
              isChecked={item.isChecked}
              onToggle={onToggleItem}
            />
          ))}
        </div>
      </section>

      {showClearConfirm && (
        <ConfirmDialog
          title={`Clear ${displayTitle}?`}
          message='This will uncheck all items in this category.'
          confirmLabel='Clear section'
          onConfirm={() => {
            onClearSection();
            setShowClearConfirm(false);
          }}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </>
  );
};

export default Checklist;
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: errors in `app.component.tsx` until Task 8 — OK for now

- [ ] **Step 4: Commit**

```bash
git add src/components/checklist/
git commit -m "refactor: make checklist a presentational card component"
```

---

### Task 8: Rewire App component

**Files:**
- Modify: `src/app/app.component.tsx`
- Modify: `src/app/app.module.css`

- [ ] **Step 1: Update app CSS**

Replace `src/app/app.module.css` with:

```css
.main {
  max-width: min(1400px, 92%);
  margin: 0 auto;
  padding-bottom: 5rem;
}

.wrapper {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  margin-top: 1.25rem;
}
```

- [ ] **Step 2: Update App component**

Replace `src/app/app.component.tsx` with:

```tsx
import Checklist from '../components/checklist/checklist.component';
import Footer from '../components/common/footer/footer.component';
import ProgressHeader from '../components/progress-header/progress-header.component';
import { useCampingChecklists } from '../hooks/useCampingChecklists';
import styles from './app.module.css';

function App() {
  const {
    categories,
    totalProgress,
    categoriesWithRemaining,
    showRemaining,
    setShowRemaining,
    toggleItem,
    clearSection,
    clearAll,
    isAllPacked,
  } = useCampingChecklists();

  return (
    <main className={styles.main}>
      <ProgressHeader
        totalProgress={totalProgress}
        categoriesWithRemaining={categoriesWithRemaining}
        showRemaining={showRemaining}
        isAllPacked={isAllPacked}
        onToggleShowRemaining={() => setShowRemaining((prev) => !prev)}
        onClearAll={clearAll}
      />

      <div className={styles.wrapper}>
        {categories.map((category) => (
          <Checklist
            key={category.storageKey}
            anchorId={category.anchorId}
            displayTitle={category.displayTitle}
            data={category.data}
            sectionProgress={category.sectionProgress}
            isComplete={category.isComplete}
            onToggleItem={(itemId) => toggleItem(category.storageKey, itemId)}
            onClearSection={() => clearSection(category.storageKey)}
          />
        ))}
      </div>

      <Footer />
    </main>
  );
}

export default App;
```

- [ ] **Step 3: Delete unused hook**

Run: `rm src/hooks/useStorage.js`

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: no errors

- [ ] **Step 5: Run dev server smoke test**

Run: `npm start` (verify app loads, checkmarks persist, progress bar updates)

- [ ] **Step 6: Commit**

```bash
git add src/app/ src/hooks/useStorage.js
git commit -m "refactor: wire app through useCampingChecklists hook"
```

Note: if git is not initialized, skip commit steps throughout this plan.

---

### Task 9: Scroll-to-top FAB restyle

**Files:**
- Modify: `src/components/common/footer/footer.component.tsx`
- Modify: `src/components/common/footer/footer.module.css`

- [ ] **Step 1: Update CSS**

Replace `src/components/common/footer/footer.module.css` with:

```css
.fab {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #78b159;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  z-index: 90;
}

.fabHidden {
  display: none;
}
```

- [ ] **Step 2: Update component**

Replace `src/components/common/footer/footer.component.tsx` with:

```tsx
import React, { useEffect, useState } from 'react';
import styles from './footer.module.css';

const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 700);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type='button'
      title='Go to the top'
      aria-label='Scroll to top'
      onClick={scrollToTop}
      className={`${styles.fab} ${isVisible ? '' : styles.fabHidden}`}
    >
      ↑
    </button>
  );
};

export default Footer;
```

- [ ] **Step 3: Commit**

```bash
git add src/components/common/footer/
git commit -m "feat: restyle scroll-to-top as floating action button"
```

---

### Task 10: PWA manifest theme colors

**Files:**
- Modify: `public/site.webmanifest`

- [ ] **Step 1: Update manifest**

In `public/site.webmanifest`, change:

```json
"theme_color": "#292f33",
"background_color": "#292f33"
```

(was `#ffffff` for both)

- [ ] **Step 2: Commit**

```bash
git add public/site.webmanifest
git commit -m "fix: align PWA manifest colors with dark theme"
```

---

### Task 11: Final verification

**Files:** (none — verification only)

- [ ] **Step 1: Run unit tests**

Run: `npm test -- --watchAll=false`

Expected: all tests PASS

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: build succeeds with no TypeScript errors

- [ ] **Step 3: Manual mobile pass (Chrome DevTools, iPhone viewport)**

Checklist:
- [ ] Sticky header stays visible while scrolling
- [ ] Progress bar fraction matches checked items
- [ ] Jump chips scroll to correct section (not hidden under header)
- [ ] "Show remaining" hides checked items and completed categories
- [ ] Turning "Show remaining" off restores full list
- [ ] Clear all / section clear show confirmation dialogs
- [ ] Row tap targets feel comfortable (48px height)
- [ ] Pre-existing localStorage checkmarks still load (test before/after refactor with same browser profile)

- [ ] **Step 4: Final commit (if any fixups needed)**

```bash
git add -A
git commit -m "chore: address verification fixups for checklist UI refresh"
```

---

## Spec Coverage Check

| Spec requirement | Task |
|---|---|
| Sticky progress header | Task 5 |
| Quick-jump chips | Task 5 |
| "Show remaining" toggle | Task 3, 5, 8 |
| Confirmed clear actions | Task 4, 5, 7 |
| Section progress (`3/5`) | Task 7 |
| Full-row tap targets | Task 6 |
| Card layout + visual tokens | Task 7, 9 |
| Consolidated hook + localStorage compat | Task 2, 3, 8 |
| scroll-margin-top offset | Task 7 |
| "All packed!" state | Task 5 |
| PWA manifest colors | Task 10 |
| Unit tests for progress utils | Task 1 |
| Delete old useStorage hook | Task 8 |

## Success Criteria (from spec)

- [ ] Overall progress visible without scrolling → Task 5
- [ ] One tap jumps to categories with remaining items → Task 5
- [ ] "Show remaining" reduces scroll length → Task 3, 8
- [ ] 48px tap targets → Task 6
- [ ] Clear actions require confirmation → Task 4, 5, 7
- [ ] Existing localStorage checkmarks preserved → Task 3 (same storage keys)
