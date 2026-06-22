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
