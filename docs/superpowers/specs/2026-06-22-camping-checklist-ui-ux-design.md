# Camping Checklist UI/UX Redesign

**Date:** 2026-06-22  
**Status:** Approved  
**Approach:** Targeted refresh (A) + "Show remaining" toggle (C)

## Goal

Improve the phone-at-home packing experience for Ceko's Camping Checklist by addressing three pain points:

1. Scrolling through 11 sections to find unchecked items
2. No sense of overall packing progress
3. Dated visuals and small tap targets on mobile

## Context

- **Stack:** Create React App, TypeScript, CSS modules, localStorage persistence
- **Primary use:** Phone while packing at home before a trip
- **Navigation preference:** Keep long scroll; add sticky progress header with quick-jump links to categories that still have unchecked items
- **Out of scope:** Stack migration (ShadCN/Next.js), custom item editing, multi-user sync

## Layout & Information Architecture

### Sticky header (always visible while scrolling)

```
┌─────────────────────────────────────┐
│  Ceko's Camping Checklist           │
│  ████████░░░░  28/47 packed  (60%)  │
│  [Show remaining ▼]  [Clear all]    │
│  Jump: FOOD · CLOTHES · SAFETY …    │
└─────────────────────────────────────┘
```

| Element | Purpose |
|---|---|
| Progress bar + fraction + percentage | Overall packing status at a glance |
| "Show remaining" toggle | Hides checked items; hides fully completed categories |
| Quick-jump chips | Only categories with unchecked items; tap scrolls to section |
| Clear all | Moved from bare toggle button; requires confirmation |

### Main content (long scroll)

- 11 category **cards** in the same order as today
- Each card header: category name + section progress (`3/5`) + section-level Clear (confirmed)
- Checklist rows are **full-width tap targets** — tap anywhere on the row to toggle
- Completed sections get subtle visual treatment (muted border or checkmark badge)

### Footer

- Scroll-to-top becomes a styled floating action button (FAB)

### Mobile constraints

- Sticky header max ~120px tall
- Jump chips wrap to 2 lines, then horizontal scroll
- Minimum row height 48px
- Category headings use `scroll-margin-top` so jump targets are not hidden under the sticky header

### "Show remaining" behavior

- When on: render only unchecked items per section; hide sections with zero remaining items
- When off: restore full list with all checkmarks intact
- Toggle state lives in component/session state (not localStorage)

## State & Data Flow

### Problem

Each `Checklist` component currently owns its own `useLocalStorage` slice. The app cannot compute global progress or filter across sections.

### Solution

Consolidate into a single `useCampingChecklists` hook at the App level.

```
checklist.ts (defaults)
        ↓
useCampingChecklists()
  ├── loads 11 categories from localStorage (keys unchanged: "INDOORS", "FOOD", etc.)
  ├── persists on every toggle/clear
  └── exposes derived state:
        • totalProgress  { checked, total, percent }
        • categoriesWithRemaining  [{ title, anchorId, remaining }]
        • showRemaining  boolean
        ↓
App → ProgressHeader  (progress, chips, toggle, clearAll)
App → Checklist[]     (filtered or full data per section)
```

### localStorage compatibility

- Keys and shape unchanged: `{ data: IChecklistItem[], expiry: number }`
- Existing checked items survive the refactor
- Expiry logic (10 days) preserved from current `useLocalStorage` hook

### Derived computations

- `totalProgress`: sum of checked items / total items across all categories
- `categoriesWithRemaining`: categories where `checked < total`
- `filterRemaining`: when toggle on, return only items with `isChecked === false`

## Components

| Component | Status | Role |
|---|---|---|
| `ProgressHeader` | New | Sticky bar: title, progress, toggle, jump chips, Clear all |
| `ConfirmDialog` | New | Modal for Clear all and per-section clear |
| `useCampingChecklists` | New | Single source of truth for all category state |
| `progressUtils` | New | Pure functions: `calcProgress`, `filterRemaining`, `getCategoriesWithRemaining` |
| `Checklist` | Refactor | Presentational; receives data + callbacks; no own storage |
| `ChecklistItem` | Refactor | Full-row tap target |
| `ScrollToTopFab` | Refactor | Styled FAB replacing footer "Up" button |
| `App` | Refactor | Thin shell: hook + header + checklist grid |

## Interactions & Edge Cases

| Scenario | Behavior |
|---|---|
| Clear all / section clear | Confirm dialog → uncheck all items (does not delete items) |
| All items checked | Progress 100%; jump chips hidden; optional "All packed!" message |
| Show remaining + last item checked in section | Section disappears from view until toggle off |
| Jump chip tapped | Smooth scroll to section with header offset via `scroll-margin-top` |
| localStorage unavailable | Fall back to in-memory state for the session |
| Corrupt localStorage entry | Reset that section to defaults from `checklist.ts` |
| PWA manifest | Update `theme_color` and `background_color` to `#292f33` |

## Visual Design

Keep the existing camping aesthetic with refinements:

| Token | Value |
|---|---|
| Background | `#292f33` (unchanged) |
| Card background | `#323940` |
| Accent / progress fill | `#78b159` (unchanged) |
| Progress track | Muted gray (~`#3d4449`) |
| Border radius (cards, chips) | `8px` |
| Min tap row height | `48px` |

- Section headers: sentence case instead of ALL CAPS
- Mobile `h1`: `1.75rem` (down from `3rem`)
- Chips: pill shape; green outline when representing an active jump target
- Checked rows: strikethrough + reduced opacity (keep current pattern)
- Row active state: brief background flash on toggle

No new UI dependencies — CSS modules only.

## Testing

### Unit tests

- `calcProgress` — correct counts and percentage across mixed categories
- `filterRemaining` — hides checked items; empty categories excluded
- `getCategoriesWithRemaining` — only incomplete categories returned

### Manual mobile pass

- Sticky header does not overlap section content
- Jump chips scroll to correct section with proper offset
- "Show remaining" toggle shows/hides correctly
- Clear actions require confirmation and work as expected
- Existing localStorage data loads after refactor

## File Changes (expected)

```
src/
  hooks/
    useCampingChecklists.ts       (new)
    useStorage.js                 (keep or fold into new hook)
  utils/
    progressUtils.ts              (new)
    progressUtils.test.ts         (new)
  components/
    progress-header/              (new)
    confirm-dialog/               (new)
    checklist/                    (refactor)
    checklist-item/               (refactor)
    common/footer/                (refactor → scroll-to-top-fab)
  app/
    app.component.tsx             (refactor)
    app.module.css                (update)
public/
  site.webmanifest                (update theme colors)
```

## Success Criteria

- [ ] Overall progress visible without scrolling
- [ ] One tap jumps to any category with remaining items
- [ ] "Show remaining" reduces scroll length as items are packed
- [ ] All checklist rows meet 48px tap target on mobile
- [ ] Clear actions cannot fire accidentally
- [ ] Existing localStorage checkmarks preserved after deploy
