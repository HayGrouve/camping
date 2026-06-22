import { IChecklistData } from '../data/checklist';
import { ITEM_IDS } from '../data/item-ids';
import { mergeCategoryWithLocale } from './mergeCategoryWithLocale';

const catalog: IChecklistData = {
  data: [
    { id: ITEM_IDS.indoors.pillows, text: '', isChecked: false },
    { id: ITEM_IDS.indoors.blankets, text: '', isChecked: false },
  ],
  expiry: Date.now() + 864000000,
};

const itemText = {
  en: {
    [ITEM_IDS.indoors.pillows]: 'Pillows',
    [ITEM_IDS.indoors.blankets]: 'Blankets',
  },
  bg: {
    [ITEM_IDS.indoors.pillows]: 'Възглавници',
    [ITEM_IDS.indoors.blankets]: 'Одеяла',
  },
};

describe('mergeCategoryWithLocale', () => {
  it('returns localized text with unchecked defaults when no stored data', () => {
    const result = mergeCategoryWithLocale(catalog, null, 'bg', itemText);
    expect(result.data[0]).toEqual({
      id: ITEM_IDS.indoors.pillows,
      text: 'Възглавници',
      isChecked: false,
    });
  });

  it('matches stored checks by fixed id', () => {
    const stored: IChecklistData = {
      data: [{ id: ITEM_IDS.indoors.pillows, text: 'Pillows', isChecked: true }],
      expiry: Date.now() + 864000000,
    };
    const result = mergeCategoryWithLocale(catalog, stored, 'en', itemText);
    expect(result.data[0].isChecked).toBe(true);
    expect(result.data[1].isChecked).toBe(false);
  });

  it('migrates legacy random id via English text match', () => {
    const stored: IChecklistData = {
      data: [{ id: 'legacy-random-id', text: 'Blankets', isChecked: true }],
      expiry: Date.now() + 864000000,
    };
    const result = mergeCategoryWithLocale(catalog, stored, 'bg', itemText);
    expect(result.data[1]).toEqual({
      id: ITEM_IDS.indoors.blankets,
      text: 'Одеяла',
      isChecked: true,
    });
  });

  it('falls back to index match when text differs', () => {
    const stored: IChecklistData = {
      data: [{ id: 'legacy-random-id', text: 'Typo label', isChecked: true }],
      expiry: Date.now() + 864000000,
    };
    const result = mergeCategoryWithLocale(catalog, stored, 'en', itemText);
    expect(result.data[0].isChecked).toBe(true);
  });

  it('preserves expiry from catalog', () => {
    const result = mergeCategoryWithLocale(catalog, null, 'en', itemText);
    expect(result.expiry).toBe(catalog.expiry);
  });
});
