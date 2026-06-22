# Camping Checklist Quick Wins

**Date:** 2026-06-22  
**Status:** Approved  
**Approach:** A — one bundled quick-wins pass

## Goal

Ship a set of low-effort, high-impact improvements across content, browser meta, visual polish, UX convenience, and dialog behavior — without adding new features.

## Scope

### 1. Content cleanup

**File:** `src/data/checklist.ts`

- Remove duplicate Food item `{ text: 'Water' }` (keep "Bottled water, soda and juice")
- Change first-aid item from `'Antihistamines(антиалергични лекарства)'` to `'Antihistamines'`

**Note:** Removing an item changes default list length. Existing localStorage entries retain their saved items until expiry; new users and expired sessions get the cleaned list.

### 2. Browser chrome

**File:** `public/index.html`

- `theme-color` → `#1f1b17` (match design tokens and manifest)
- `<title>` → `Ceko's Camping Checklist`
- Add:
  - `<meta name="apple-mobile-web-app-capable" content="yes" />`
  - `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />`

### 3. Custom checkboxes

**Files:** `src/components/checklist-item/checklist-item.component.tsx`, `checklist-item.module.css`

Replace visible native checkbox with styled control:

- Hide native `<input type="checkbox">` visually (`opacity: 0` or `sr-only` pattern) but keep for semantics, OR use `role="checkbox"` on button only with `aria-pressed`
- Render 20×20px rounded square (border-radius 4px)
- **Unchecked:** 2px border `--color-border`, transparent background
- **Checked:** background `--color-accent`, white SVG checkmark centered
- Existing row button, flash animation, and 48px tap target unchanged

### 4. Remember "Show remaining"

**File:** `src/hooks/useCampingChecklists.ts`

- Key: `camping-show-remaining` in `sessionStorage`
- On hook init: read boolean (default `false` if missing/invalid)
- On `setShowRemaining`: persist new value
- Session-scoped only (not localStorage) — resets when browser session ends

### 5. Safe-area padding

**Files:** `src/index.css`, `src/app/app.module.css`, `src/components/common/footer/footer.module.css`, `src/components/progress-header/progress-header.module.css`

- Main content horizontal padding: `max(0px, env(safe-area-inset-left))` / right equivalent
- Sticky header wrapper: `padding-top: env(safe-area-inset-top, 0px)`
- Scroll FAB: `bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px))`

### 6. Completed category badge

**Files:** `src/components/checklist/checklist.component.tsx`, `checklist.module.css`

- When `isComplete === true`, show a small green ✓ badge beside the section progress (`3/5` → `3/5 ✓` or separate badge element)
- Badge uses `--color-accent-bright`, 0.85rem
- Pairs with existing `wrapperComplete` border styling

### 7. Dialog UX

**File:** `src/components/confirm-dialog/confirm-dialog.component.tsx`

- Click on backdrop (`.backdrop`) calls `onCancel`
- `keydown` listener for `Escape` calls `onCancel`
- On mount: focus confirm or cancel button (cancel safer default — focus Cancel first)
- Trap focus within dialog while open (Tab cycles between Cancel and Confirm)
- Cleanup listeners on unmount

## Out of Scope

- Search, custom items, new trip flow
- Icon changes beyond existing set
- New animations
- Stack migration
- localStorage migration for removed Water item

## Files Changed (expected)

```
src/data/checklist.ts
public/index.html
src/components/checklist-item/checklist-item.component.tsx
src/components/checklist-item/checklist-item.module.css
src/hooks/useCampingChecklists.ts
src/index.css
src/app/app.module.css
src/components/progress-header/progress-header.module.css
src/components/common/footer/footer.module.css
src/components/checklist/checklist.component.tsx
src/components/checklist/checklist.module.css
src/components/confirm-dialog/confirm-dialog.component.tsx
```

## Testing

### Manual
- [ ] Food list has no duplicate Water on fresh load
- [ ] First-aid shows "Antihistamines" only
- [ ] Mobile browser chrome / installed PWA uses dark warm theme color
- [ ] Custom checkbox shows green check when checked
- [ ] "Show remaining" persists after page refresh in same tab
- [ ] "Show remaining" resets in new browser session
- [ ] FAB and header clear iPhone notch/home indicator
- [ ] Complete category shows ✓ badge
- [ ] Dialog closes on backdrop click and Escape
- [ ] Tab stays within dialog when open

### Automated
- `pnpm exec tsc --noEmit` passes
- `CI=true pnpm exec react-scripts test --watchAll=false` passes
- `pnpm run build` succeeds

## Success Criteria

- [ ] All 7 quick-win items implemented
- [ ] No new npm dependencies
- [ ] Existing checklist checkmarks preserved for unchanged items
