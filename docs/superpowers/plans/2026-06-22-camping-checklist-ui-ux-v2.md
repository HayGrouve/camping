# Camping Checklist UI/UX V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply warm outdoors design tokens, category icons, compact sticky header with collapsible jump panel, CSS micro-animations, and dynamic scroll offset.

**Architecture:** CSS custom properties in `index.css` replace hardcoded colors project-wide. `CategoryIcon` maps `iconId` to inline SVGs. `ProgressHeader` gets a 3-row compact layout with toggleable chip panel. `useHeaderHeight` sets `--header-height` via `ResizeObserver` for accurate jump scrolling.

**Tech Stack:** Create React App 5, React 18, TypeScript, CSS modules, no new npm dependencies

**Spec:** `docs/superpowers/specs/2026-06-22-camping-checklist-ui-ux-v2-design.md`

---

## File Structure

| File | Responsibility |
|---|---|
| `src/index.css` | Design tokens (`:root`), global body styles using tokens |
| `src/data/categories.ts` | Add `iconId` to each category |
| `src/components/category-icon/category-icon.component.tsx` | Inline SVG renderer by `iconId` |
| `src/components/category-icon/category-icon.module.css` | Icon sizing/color |
| `src/hooks/useHeaderHeight.ts` | `ResizeObserver` → `--header-height` on `:root` |
| `src/components/progress-header/progress-header.component.tsx` | Compact 3-row layout, jump panel, fraction badge |
| `src/components/progress-header/progress-header.module.css` | Header + panel + animation styles |
| `src/components/checklist/checklist.component.tsx` | Pass `iconId`, render `CategoryIcon` |
| `src/components/checklist/checklist.module.css` | Token colors, complete border transition |
| `src/components/checklist-item/checklist-item.component.tsx` | Check-flash class on check |
| `src/components/checklist-item/checklist-item.module.css` | Flash animation keyframes |
| `src/components/confirm-dialog/confirm-dialog.module.css` | Token colors |
| `src/components/common/footer/footer.module.css` | Token colors on FAB |
| `src/app/app.component.tsx` | Wire header ref + pass `iconId` to Checklist |
| `public/site.webmanifest` | Theme colors → `#1f1b17` |

---

### Task 1: Design tokens

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add tokens and update global styles**

Replace the top of `src/index.css` (keep existing reset rules, update colors):

```css
:root {
  --color-bg: #1f1b17;
  --color-surface: #2e2822;
  --color-surface-raised: #3a332b;
  --color-border: #4a4239;
  --color-text: #f0ebe3;
  --color-text-muted: #a89f94;
  --color-accent: #6b9b5a;
  --color-accent-bright: #8bc47a;
  --color-danger-muted: #9b6b5a;
  --header-height: 140px;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--color-bg);
  color: var(--color-text);
  letter-spacing: 0.5px;
}
```

Also update the duplicate `body` block further down — merge into one block. Change `body { min-height... font-size: 1.1rem }` to `font-size: 1rem` and use token colors (remove hardcoded `#292f33` and `white`).

Update `button:hover` outline to use `var(--color-border)`.

- [ ] **Step 2: Verify build**

Run: `pnpm exec tsc --noEmit`

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add warm outdoors design tokens"
```

---

### Task 2: Category icons

**Files:**
- Modify: `src/data/categories.ts`
- Create: `src/components/category-icon/category-icon.component.tsx`
- Create: `src/components/category-icon/category-icon.module.css`

- [ ] **Step 1: Add iconId to categories**

Add to `CategoryDefinition`:

```typescript
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
```

Add `iconId` to each entry in `CATEGORIES`:

```typescript
{ storageKey: 'INDOORS', displayTitle: 'Indoors', anchorId: 'indoors', iconId: 'indoors', defaultData: indoors },
{ storageKey: 'OUTDOORS', displayTitle: 'Outdoors', anchorId: 'outdoors', iconId: 'outdoors', defaultData: outdoors },
{ storageKey: 'FURNITURE', displayTitle: 'Furniture', anchorId: 'furniture', iconId: 'furniture', defaultData: furniture },
{ storageKey: 'CLOTHES AND SHOES', displayTitle: 'Clothes and shoes', anchorId: 'clothes-and-shoes', iconId: 'clothes', defaultData: clothesAndShoes },
{ storageKey: 'FOOD', displayTitle: 'Food', anchorId: 'food', iconId: 'food', defaultData: food },
{ storageKey: 'HYGIENE AND TOILETRIES', displayTitle: 'Hygiene and toiletries', anchorId: 'hygiene-and-toiletries', iconId: 'hygiene', defaultData: hygieneAndToiletries },
{ storageKey: 'RECREATIONAL GEAR', displayTitle: 'Recreational gear', anchorId: 'recreational-gear', iconId: 'recreational', defaultData: recreational },
{ storageKey: 'CLEAN-UP', displayTitle: 'Clean-up', anchorId: 'clean-up', iconId: 'cleanup', defaultData: cleanUp },
{ storageKey: 'SAFETY', displayTitle: 'Safety', anchorId: 'safety', iconId: 'safety', defaultData: safety },
{ storageKey: 'FIRST-AID', displayTitle: 'First-aid', anchorId: 'first-aid', iconId: 'firstaid', defaultData: firstAid },
{ storageKey: 'PERSONAL BELONGINGS', displayTitle: 'Personal belongings', anchorId: 'personal-belongings', iconId: 'personal', defaultData: personal },
```

- [ ] **Step 2: Create CategoryIcon component**

Create `src/components/category-icon/category-icon.module.css`:

```css
.icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--color-accent);
}
```

Create `src/components/category-icon/category-icon.component.tsx`:

```tsx
import React from 'react';
import { CategoryIconId } from '../../data/categories';
import styles from './category-icon.module.css';

interface CategoryIconProps {
  iconId: CategoryIconId;
}

const ICONS: Record<CategoryIconId, React.ReactNode> = {
  indoors: (
    <path d='M3 14h18v2H3v-2zm2-8h14v10H5V6zm2 2v6h10V8H7z' />
  ),
  outdoors: (
    <path d='M12 3L4 18h16L12 3zm0 4.5L16.5 16h-9L12 7.5z' />
  ),
  furniture: (
    <path d='M4 10h16v2H4v-2zm2-4h12v3H6V6zm0 9h5v3H6v-3zm7 0h5v3h-5v-3z' />
  ),
  clothes: (
    <path d='M12 2l3 3h5v2h-1l-2 12H7L5 7H4V5h5l3-3z' />
  ),
  food: (
    <path d='M8 2v8c0 2.2 1.8 4 4 4s4-1.8 4-4V2h-2v8c0 1.1-.9 2-2 2s-2-.9-2-2V2H8zm-4 18h12v2H4v-2z' />
  ),
  hygiene: (
    <path d='M12 2c-2 4-6 6-6 10a6 6 0 0012 0c0-4-4-6-6-10z' />
  ),
  recreational: (
    <path d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 5h2v5h-2V7zm0 7h2v2h-2v-2z' />
  ),
  cleanup: (
    <path d='M6 2h12v2H6V2zm-1 4h14l-1.5 14h-11L5 6zm5 3v7h2V9h-2z' />
  ),
  safety: (
    <path d='M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z' />
  ),
  firstaid: (
    <path d='M10 2h4v6h6v4h-6v6h-4v-6H4v-4h6V2z' />
  ),
  personal: (
    <path d='M4 4h16v14H4V4zm2 2v10h12V6H6zm2 2h8v2H8V8zm0 4h5v2H8v-2z' />
  ),
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ iconId }) => (
  <svg
    className={styles.icon}
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden='true'
  >
    {ICONS[iconId]}
  </svg>
);

export default CategoryIcon;
```

- [ ] **Step 3: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`

Expected: PASS (Checklist not updated yet — may warn only after Task 5)

- [ ] **Step 4: Commit**

```bash
git add src/data/categories.ts src/components/category-icon/
git commit -m "feat: add category icons with iconId config"
```

---

### Task 3: useHeaderHeight hook

**Files:**
- Create: `src/hooks/useHeaderHeight.ts`

- [ ] **Step 1: Implement hook**

Create `src/hooks/useHeaderHeight.ts`:

```typescript
import { RefObject, useEffect } from 'react';

export const useHeaderHeight = (headerRef: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const updateHeight = () => {
      const height = element.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--header-height', `${Math.ceil(height)}px`);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [headerRef]);
};
```

- [ ] **Step 2: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useHeaderHeight.ts
git commit -m "feat: add useHeaderHeight hook for dynamic scroll offset"
```

---

### Task 4: Compact progress header

**Files:**
- Modify: `src/components/progress-header/progress-header.component.tsx`
- Modify: `src/components/progress-header/progress-header.module.css`

- [ ] **Step 1: Replace CSS module**

Replace `progress-header.module.css` entirely:

```css
.headerWrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.header {
  padding: 0.625rem 0 0.5rem;
}

.titleRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.title {
  font-size: clamp(1.1rem, 3.5vw, 1.5rem);
  letter-spacing: 0.02em;
}

.fractionBadge {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.fractionBadgePulse {
  animation: badgePulse 0.3s ease-out;
}

@keyframes badgePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

.progressTrack {
  width: 100%;
  height: 6px;
  background: var(--color-border);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progressFill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 999px;
  transition: width 0.3s ease-out;
}

.progressFillAllPacked {
  animation: glowPulse 1.5s ease-in-out 2;
}

@keyframes glowPulse {
  0%, 100% { box-shadow: none; }
  50% { box-shadow: 0 0 8px var(--color-accent-bright); }
}

.controlsRow {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
}

.toggleBtn,
.clearBtn,
.jumpBtn {
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.35rem 0.65rem;
  border: 1px solid var(--color-border);
  font-size: 0.85rem;
}

.toggleBtnActive {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.clearBtn {
  background: var(--color-surface-raised);
  border-color: var(--color-danger-muted);
  color: var(--color-text-muted);
}

.jumpBtnOpen {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.chevron {
  display: inline-block;
  transition: transform 0.2s ease;
}

.chevronOpen {
  transform: rotate(180deg);
}

.allPacked {
  color: var(--color-accent-bright);
  font-size: 0.85rem;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.jumpPanel {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.2s ease, opacity 0.2s ease;
  background: var(--color-surface-raised);
  border-bottom: 1px solid transparent;
}

.jumpPanelOpen {
  max-height: 120px;
  opacity: 1;
  border-bottom-color: var(--color-border);
  overflow-y: auto;
}

.chipsRow {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.5rem 0;
}

.chip {
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
  font-size: 0.78rem;
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .progressFill,
  .fractionBadgePulse,
  .progressFillAllPacked,
  .allPacked,
  .jumpPanel,
  .chevron {
    animation: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 2: Replace component**

Replace `progress-header.component.tsx`:

```tsx
import React, { forwardRef, useEffect, useRef, useState } from 'react';
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

const ProgressHeader = forwardRef<HTMLElement, ProgressHeaderProps>(
  (
    {
      totalProgress,
      categoriesWithRemaining,
      showRemaining,
      isAllPacked,
      onToggleShowRemaining,
      onClearAll,
    },
    ref
  ) => {
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [jumpPanelOpen, setJumpPanelOpen] = useState(false);
    const [badgePulse, setBadgePulse] = useState(false);
    const prevCheckedRef = useRef(totalProgress.checked);

    useEffect(() => {
      if (totalProgress.checked > prevCheckedRef.current) {
        setBadgePulse(true);
        const timer = window.setTimeout(() => setBadgePulse(false), 300);
        prevCheckedRef.current = totalProgress.checked;
        return () => window.clearTimeout(timer);
      }
      prevCheckedRef.current = totalProgress.checked;
    }, [totalProgress.checked]);

    const scrollToCategory = (anchorId: string) => {
      const element = document.getElementById(anchorId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setJumpPanelOpen(false);
    };

    const progressLabel = `${totalProgress.checked} of ${totalProgress.total} items packed, ${totalProgress.percent} percent`;

    return (
      <>
        <div className={styles.headerWrapper} ref={ref}>
          <header className={styles.header}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>Ceko&apos;s Camping Checklist</h1>
              <span
                className={`${styles.fractionBadge} ${badgePulse ? styles.fractionBadgePulse : ''}`}
                aria-label={isAllPacked ? 'All items packed' : progressLabel}
              >
                {isAllPacked ? '✓' : `${totalProgress.checked}/${totalProgress.total}`}
              </span>
            </div>

            <div
              className={styles.progressTrack}
              role='progressbar'
              aria-valuenow={totalProgress.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={progressLabel}
            >
              <div
                className={`${styles.progressFill} ${isAllPacked ? styles.progressFillAllPacked : ''}`}
                style={{ width: `${totalProgress.percent}%` }}
              />
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
              {categoriesWithRemaining.length > 0 && (
                <button
                  type='button'
                  className={`${styles.jumpBtn} ${jumpPanelOpen ? styles.jumpBtnOpen : ''}`}
                  onClick={() => setJumpPanelOpen((open) => !open)}
                  aria-expanded={jumpPanelOpen}
                >
                  Jump to…{' '}
                  <span className={`${styles.chevron} ${jumpPanelOpen ? styles.chevronOpen : ''}`}>
                    ▾
                  </span>
                </button>
              )}
              {isAllPacked && <span className={styles.allPacked}>All packed!</span>}
            </div>
          </header>

          <div
            className={`${styles.jumpPanel} ${jumpPanelOpen ? styles.jumpPanelOpen : ''}`}
            aria-hidden={!jumpPanelOpen}
          >
            <div className={styles.chipsRow} aria-label='Jump to categories with remaining items'>
              {categoriesWithRemaining.map((category) => (
                <button
                  key={category.storageKey}
                  type='button'
                  className={styles.chip}
                  onClick={() => scrollToCategory(category.anchorId)}
                  tabIndex={jumpPanelOpen ? 0 : -1}
                >
                  {category.displayTitle} ({category.remaining})
                </button>
              ))}
            </div>
          </div>
        </div>

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
  }
);

ProgressHeader.displayName = 'ProgressHeader';

export default ProgressHeader;
```

- [ ] **Step 3: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`

Expected: PASS (after Task 5 wires ref)

- [ ] **Step 4: Commit**

```bash
git add src/components/progress-header/
git commit -m "feat: compact progress header with collapsible jump panel"
```

---

### Task 5: Wire header ref + checklist icons

**Files:**
- Modify: `src/app/app.component.tsx`
- Modify: `src/components/checklist/checklist.component.tsx`
- Modify: `src/components/checklist/checklist.module.css`
- Modify: `src/hooks/useCampingChecklists.ts` (expose iconId in view)

- [ ] **Step 1: Expose iconId in CampingChecklistView**

In `useCampingChecklists.ts`, add `iconId: CategoryIconId` to `CampingChecklistView` interface and include it in the `categories` useMemo return object. Import `CategoryIconId` from `../data/categories`. Map from `CATEGORIES` when building each view entry:

```typescript
import { CATEGORIES, CategoryIconId } from '../data/categories';

// In CampingChecklistView interface:
iconId: CategoryIconId;

// In categories useMemo, when building return object, find iconId:
const categoryDef = CATEGORIES.find((c) => c.storageKey === entry.storageKey);
// ...
iconId: categoryDef!.iconId,
```

- [ ] **Step 2: Update Checklist component**

Add `iconId: CategoryIconId` to `ChecklistProps`. Import `CategoryIcon`. Update header:

```tsx
import CategoryIcon from '../category-icon/category-icon.component';
import { CategoryIconId } from '../../data/categories';

// In props: iconId: CategoryIconId;

<div className={styles.titleGroup}>
  <div className={styles.titleRow}>
    <CategoryIcon iconId={iconId} />
    <h2 className={styles.heading}>{displayTitle}</h2>
  </div>
  <span className={styles.sectionProgress}>
    {sectionProgress.checked}/{sectionProgress.total}
  </span>
</div>
```

- [ ] **Step 3: Update checklist CSS to tokens + scroll-margin**

Replace hardcoded hex in `checklist.module.css`:

```css
.wrapper {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  scroll-margin-top: var(--header-height);
  transition: border-color 0.3s ease;
}

.wrapperComplete {
  border-color: var(--color-accent);
}

.heading {
  color: var(--color-accent);
  font-size: 1.1rem;
}

.sectionProgress {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.clearBtn {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-danger-muted);
  color: var(--color-text-muted);
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.titleRow {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
```

- [ ] **Step 4: Wire App**

Update `app.component.tsx`:

```tsx
import { useRef } from 'react';
import { useHeaderHeight } from '../hooks/useHeaderHeight';

function App() {
  const headerRef = useRef<HTMLElement>(null);
  useHeaderHeight(headerRef);

  // ... existing hook usage ...

  return (
    <main className={styles.main}>
      <ProgressHeader
        ref={headerRef}
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
            iconId={category.iconId}
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
```

- [ ] **Step 5: Verify TypeScript**

Run: `pnpm exec tsc --noEmit`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/app.component.tsx src/components/checklist/ src/hooks/useCampingChecklists.ts
git commit -m "feat: wire header height ref and category icons in checklist cards"
```

---

### Task 6: Check flash animation

**Files:**
- Modify: `src/components/checklist-item/checklist-item.component.tsx`
- Modify: `src/components/checklist-item/checklist-item.module.css`

- [ ] **Step 1: Add flash CSS**

Add to `checklist-item.module.css` (replace hardcoded colors with tokens too):

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
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  outline: none;
}

.rowFlash {
  animation: checkFlash 0.2s ease-out;
}

@keyframes checkFlash {
  0% { background: color-mix(in srgb, var(--color-accent-bright) 20%, transparent); }
  100% { background: transparent; }
}

@media (prefers-reduced-motion: reduce) {
  .rowFlash {
    animation: none;
  }
}
```

If `color-mix` unsupported in target browsers, use `rgba(139, 196, 122, 0.2)` directly for flash/hover.

- [ ] **Step 2: Update component to flash on check**

Replace `checklist-item.component.tsx`:

```tsx
import React, { useEffect, useRef, useState } from 'react';
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
  const [flash, setFlash] = useState(false);
  const prevCheckedRef = useRef(isChecked);

  useEffect(() => {
    if (isChecked && !prevCheckedRef.current) {
      setFlash(true);
      const timer = window.setTimeout(() => setFlash(false), 200);
      prevCheckedRef.current = isChecked;
      return () => window.clearTimeout(timer);
    }
    prevCheckedRef.current = isChecked;
  }, [isChecked]);

  const labelStyles = [styles.label];
  if (isChecked) labelStyles.push(styles.checked);

  const rowClass = [styles.row, flash ? styles.rowFlash : ''].filter(Boolean).join(' ');

  return (
    <button
      type='button'
      className={rowClass}
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

- [ ] **Step 3: Commit**

```bash
git add src/components/checklist-item/
git commit -m "feat: add check flash animation on item toggle"
```

---

### Task 7: Token migration for remaining components

**Files:**
- Modify: `src/components/confirm-dialog/confirm-dialog.module.css`
- Modify: `src/components/common/footer/footer.module.css`
- Modify: `public/site.webmanifest`

- [ ] **Step 1: Update confirm dialog CSS**

Replace hardcoded colors with tokens:

```css
.dialog {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  /* keep other rules */
}
.message {
  color: var(--color-text-muted);
}
.cancelBtn {
  background: var(--color-surface-raised);
  color: var(--color-text);
}
.confirmBtn {
  background: var(--color-accent);
  color: var(--color-text);
}
```

- [ ] **Step 2: Update footer FAB**

```css
.fab {
  background: var(--color-accent);
  color: var(--color-text);
  /* keep positioning rules */
}
```

- [ ] **Step 3: Update manifest**

In `public/site.webmanifest`:

```json
"theme_color": "#1f1b17",
"background_color": "#1f1b17"
```

- [ ] **Step 4: Grep for leftover old hex values**

Run: `rg '#292f33|#323940|#78b159|#3d4449|#c8cdd0' src/`

Expected: no matches (all replaced with tokens)

- [ ] **Step 5: Commit**

```bash
git add src/components/confirm-dialog/ src/components/common/footer/ public/site.webmanifest
git commit -m "feat: migrate remaining components to design tokens"
```

---

### Task 8: Final verification

**Files:** none

- [ ] **Step 1: Run tests**

Run: `CI=true pnpm exec react-scripts test --watchAll=false`

Expected: 5/5 PASS

- [ ] **Step 2: Run build**

Run: `pnpm run build`

Expected: Compiled successfully

- [ ] **Step 3: Manual mobile checklist**

- [ ] Header is ~3 rows when jump panel closed
- [ ] Jump panel opens/closes; chips scroll
- [ ] Jump chip scrolls correctly (panel open and closed)
- [ ] Check flash on check only
- [ ] All packed: checkmark badge, glow, no Jump button
- [ ] All 11 category icons visible
- [ ] Warm palette throughout

- [ ] **Step 4: Commit fixups if any**

```bash
git add -A
git commit -m "chore: address v2 polish verification fixups"
```

---

## Spec Coverage Check

| Spec requirement | Task |
|---|---|
| Design tokens | Task 1, 7 |
| Category icons | Task 2, 5 |
| Compact 3-row header | Task 4 |
| Collapsible jump panel | Task 4 |
| Fraction badge (no %) | Task 4 |
| useHeaderHeight + scroll-margin | Task 3, 5 |
| Check flash animation | Task 6 |
| Progress/badge/panel animations | Task 4, 6 |
| All packed state | Task 4 |
| Token migration all components | Task 7 |
| PWA manifest | Task 7 |
| prefers-reduced-motion | Task 4, 6 |
| No new features | — (out of scope enforced) |

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-06-22-camping-checklist-ui-ux-v2.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks

**2. Inline Execution** — implement task-by-task in this session with checkpoints

Which approach?
