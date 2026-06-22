# Camping Checklist UI/UX Round 2 — Warm Theme & Polish

**Date:** 2026-06-22  
**Status:** Approved  
**Approach:** A — token refresh + compact header + category icons + CSS animations  
**Builds on:** `2026-06-22-camping-checklist-ui-ux-design.md` (round 1)

## Goal

Further improve the phone-at-home packing experience with a warmer outdoors visual identity, a more compact sticky header, and subtle micro-animations — without adding new features (search, custom items, etc.).

## Priorities (user-selected)

1. Camping visual theme — icons, typography, warm outdoors personality
2. Micro-animations — check feedback, progress transitions, "all packed" moment
3. Compact mobile header — less vertical space, cleaner progress row

## Visual Direction

Warm outdoors feel: earthy browns, forest greens, softer contrast. Dark-mode friendly. System font stack only (no external fonts).

## Design Tokens

CSS custom properties defined in `src/index.css`, consumed across all CSS modules:

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#1f1b17` | Page background |
| `--color-surface` | `#2e2822` | Cards, secondary buttons |
| `--color-surface-raised` | `#3a332b` | Hover states, jump chip panel |
| `--color-border` | `#4a4239` | Card borders, dividers |
| `--color-text` | `#f0ebe3` | Primary text |
| `--color-text-muted` | `#a89f94` | Progress labels, section counts |
| `--color-accent` | `#6b9b5a` | Progress fill, headings, chips |
| `--color-accent-bright` | `#8bc47a` | Check flash, "All packed!" highlight |
| `--color-danger-muted` | `#9b6b5a` | Clear action buttons |
| `--header-height` | *(dynamic)* | Set by `useHeaderHeight` hook |

All existing hardcoded hex values in component CSS modules are replaced with these tokens.

## Category Icons

Add an `iconId` field to each entry in `src/data/categories.ts`. A new `CategoryIcon` component renders a small (~20px) inline SVG per category:

| Category | Icon motif |
|---|---|
| Indoors | Bed/pillow |
| Outdoors | Tent |
| Furniture | Chair |
| Clothes and shoes | Shirt |
| Food | Utensils/flame |
| Hygiene and toiletries | Droplet |
| Recreational gear | Ball/game |
| Clean-up | Trash/bag |
| Safety | Shield/sun |
| First-aid | Cross |
| Personal belongings | Wallet/phone |

Icons appear to the left of the category title in checklist card headers, colored with `--color-accent`.

## Compact Header Layout

Replace the current multi-row header with a tighter 3-row layout:

```
┌─────────────────────────────────────────┐
│  Ceko's Camping Checklist          4/76 │
│  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  [Show remaining] [Clear all] [Jump ▾]  │
└─────────────────────────────────────────┘
     ↓ (Jump panel expands below header)
┌─────────────────────────────────────────┐
│  Food (12) · Clothes (8) · Safety (3)…  │
└─────────────────────────────────────────┘
```

### Row 1 — Title + fraction badge
- Title on the left
- Compact fraction badge on the right: `4/76` (no percentage text visible)
- Percentage available via `aria-label` on the progress bar (e.g. "4 of 76 items packed, 5 percent")

### Row 2 — Progress bar
- Full width, 6px height
- Warm green fill (`--color-accent`) on brown track (`--color-border`)
- Rounded ends

### Row 3 — Controls
- Single row: **Show remaining**, **Clear all**, **Jump to…**
- **Jump to…** toggles an expandable chip panel (chevron rotates when open)
- Panel slides below the header with max-height ~120px and vertical scroll
- Tapping a chip scrolls to the category and auto-closes the panel
- Tapping **Jump to…** again or selecting a chip closes the panel

### All packed state
- Fraction badge shows a checkmark instead of numbers
- **Jump to…** button hidden (no remaining categories)
- **All packed!** text inline next to controls

### Dynamic scroll offset
- New `useHeaderHeight` hook uses `ResizeObserver` on the header element
- Sets `--header-height` on `document.documentElement`
- Checklist cards use `scroll-margin-top: var(--header-height)` instead of fixed `180px`
- Ensures jump targets clear the header whether the chip panel is open or closed

## Micro-animations

All CSS-only. Disabled when `prefers-reduced-motion: reduce` (existing global rule extended to new animations).

| Interaction | Animation |
|---|---|
| Check item | Row background flashes `--color-accent-bright` at 20% opacity for 200ms, then fades |
| Uncheck item | Instant revert, no flash |
| Progress bar fill | Width transition `0.3s ease-out` |
| Fraction badge | Scale pulse `1 → 1.08 → 1` when checked count increments |
| All packed | Progress bar soft green glow pulse (2 cycles); "All packed!" fades in over 300ms |
| Jump panel | `max-height` + opacity transition, 200ms ease |
| Category complete | Card border color transitions to `--color-accent` over 300ms |

No sound, haptics, or confetti.

## Components

| Component | Change |
|---|---|
| `src/index.css` | Add design tokens; update body colors to use tokens |
| `src/data/categories.ts` | Add `iconId` per category |
| `src/components/category-icon/` *(new)* | Renders SVG by `iconId` |
| `src/components/progress-header/` | Compact 3-row layout; jump panel toggle; fraction badge |
| `src/components/checklist/` | Category icon in header; token colors; complete-border animation |
| `src/components/checklist-item/` | Check flash animation class |
| `src/components/confirm-dialog/` | Token-based colors |
| `src/components/common/footer/` | Token colors on FAB |
| `src/hooks/useHeaderHeight.ts` *(new)* | ResizeObserver → `--header-height` CSS variable |
| `src/app/app.component.tsx` | Attach header ref to `useHeaderHeight` |
| `public/site.webmanifest` | `theme_color` and `background_color` → `#1f1b17` |

## Out of Scope

- Search
- Custom items
- Collapsible category sections (expand/collapse card bodies)
- "New trip" workflow
- Content cleanup (duplicate Water, mixed-language items)
- External fonts or npm UI libraries
- Stack migration

## Testing

### Manual mobile pass
- [ ] Header fits in ~3 rows when jump panel is closed
- [ ] Jump panel opens/closes smoothly; chips scroll when many categories remain
- [ ] Jump chip scrolls to correct category with proper header offset (panel open and closed)
- [ ] Fraction badge updates on check/uncheck
- [ ] Check flash animation plays on check (not on uncheck)
- [ ] "All packed!" state appears at 100%; Jump button hidden
- [ ] `prefers-reduced-motion` disables all new animations
- [ ] Category icons render for all 11 sections
- [ ] Warm palette applied consistently (no leftover old hex values)

### Automated
- Existing `progressUtils.test.ts` unchanged — no logic changes
- `pnpm exec tsc --noEmit` passes
- `pnpm run build` succeeds

## Success Criteria

- [ ] Header uses noticeably less vertical space than round 1 when jump panel is closed
- [ ] App feels warmer and more outdoors-themed without sacrificing readability
- [ ] Checking an item gives immediate visual feedback
- [ ] Jump-to-category works correctly with dynamic header height
- [ ] No new features beyond visual/UX polish
