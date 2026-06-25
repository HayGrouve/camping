# Sticky Section Headers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pin a compact category bar (icon, title, progress) below the main progress header while scrolling long checklist sections, on all screen sizes.

**Architecture:** Wrap the title group in a `position: sticky` container with `top: var(--header-height)`. Clear button stays outside the sticky wrapper so it scrolls away. Pure CSS — no new hooks or listeners.

**Tech Stack:** Create React App 5, React 18, TypeScript, CSS modules

**Spec:** `docs/superpowers/specs/2026-06-22-camping-sticky-section-headers-design.md`

---

## File Structure

| File | Change |
|---|---|
| `src/components/checklist/checklist.component.tsx` | Wrap title group in `.stickyBar` |
| `src/components/checklist/checklist.module.css` | Add `.stickyBar` sticky styles; tweak `.header` alignment |

---

### Task 1: Restructure checklist header markup

**Files:**
- Modify: `src/components/checklist/checklist.component.tsx`

- [ ] **Step 1: Wrap title content in `.stickyBar`**

Replace the `<div className={styles.header}>` block (lines 41–63) with:

```tsx
        <div className={styles.header}>
          <div className={styles.stickyBar}>
            <div className={styles.titleGroup}>
              <div className={styles.titleRow}>
                <CategoryIcon iconId={iconId} />
                <h2 className={styles.heading}>{displayTitle}</h2>
              </div>
              <span className={styles.sectionProgress}>
                {sectionProgress.checked}/{sectionProgress.total}
                {isComplete && (
                  <span className={styles.completeBadge} aria-label={t('sectionComplete')}>
                    ✓
                  </span>
                )}
              </span>
            </div>
          </div>
          <button
            type='button'
            className={styles.clearBtn}
            onClick={() => setShowClearConfirm(true)}
          >
            {t('clearSection')}
          </button>
        </div>
```

No other changes to props, dialog, or item list.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`  
Expected: PASS (`.stickyBar` class not in CSS yet — still valid TS)

- [ ] **Step 3: Commit**

```bash
git add src/components/checklist/checklist.component.tsx
git commit -m "feat: wrap section title in sticky bar container"
```

---

### Task 2: Sticky bar CSS

**Files:**
- Modify: `src/components/checklist/checklist.module.css`

- [ ] **Step 1: Update `.header` alignment**

Change `.header` from `align-items: center` to `align-items: flex-start` so the Clear button stays top-aligned when the sticky bar is taller than the button:

```css
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
```

- [ ] **Step 2: Add `.stickyBar` after `.header` block**

```css
.stickyBar {
  position: sticky;
  top: var(--header-height);
  z-index: 50;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
  margin-bottom: 0.25rem;
  flex: 1;
  min-width: 0;
}
```

Do **not** change `.wrapper` `scroll-margin-top`, `.wrapperComplete`, or main header z-index.

- [ ] **Step 3: Commit**

```bash
git add src/components/checklist/checklist.module.css
git commit -m "feat: sticky section header bar below main header"
```

---

### Task 3: Verification

- [ ] **Step 1: Run automated checks**

Run:

```bash
pnpm exec tsc --noEmit
CI=true pnpm exec react-scripts test --watchAll=false
pnpm run build
```

Expected: all pass

- [ ] **Step 2: Manual QA**

Run: `pnpm start`

- [ ] Scroll **Food** or **Clothes** (long sections) — icon, title, and `N/M` progress stay pinned under the main header
- [ ] **Clear** button is visible at the top of the section but scrolls away while mid-section
- [ ] Scroll into the **next section** — previous bar unsticks; new section bar pins
- [ ] **Desktop** two-column grid — each card pins independently
- [ ] **Jump to…** chip — section lands with correct offset (not hidden under headers)
- [ ] **Show remaining** toggle — sticky bar still shows full section title and total progress
- [ ] Expand **Jump to…** panel (main header grows) — sticky bars still align under main header
- [ ] **Completed section** — green card border and ✓ badge unchanged

- [ ] **Step 3: Update spec status**

In `docs/superpowers/specs/2026-06-22-camping-sticky-section-headers-design.md`, set `Status: Approved`.

- [ ] **Step 4: Commit (if user requests)**

```bash
git add docs/superpowers/specs/2026-06-22-camping-sticky-section-headers-design.md
git commit -m "docs: mark sticky section headers spec approved"
```

---

## Spec Coverage Checklist

| Spec requirement | Task |
|---|---|
| Sticky compact bar (icon, title, progress) | Task 1, 2 |
| Clear not pinned | Task 1 (outside `.stickyBar`) |
| All screen sizes | Task 2 (no media query — global sticky) |
| Subtle pinned look | Task 2 (background + border-bottom) |
| `top: var(--header-height)` | Task 2 |
| z-index 50 under main header 100 | Task 2 |
| No new JS/deps | Tasks 1–2 |
| Manual QA from spec | Task 3 |

---

## Troubleshooting

**Sticky bar doesn’t pin:** Confirm parent `.wrapper` does not set `overflow: hidden`. Current styles do not — sticky should work.

**Bar hides under main header:** Verify `--header-height` is set (open DevTools → `:root` computed style). `useHeaderHeight` runs on mount.

**Bar overlaps next section’s items:** `background: var(--color-surface)` on `.stickyBar` is required — already in Task 2.

**Clear still visible when pinned:** Clear must be a **sibling** of `.stickyBar`, not a child. Task 1 structure enforces this.
