import { ALL_ITEM_IDS } from '../data/item-ids';
import { ITEM_TEXT } from './items';

describe('ITEM_TEXT', () => {
  it('has non-empty en and bg strings for every item id', () => {
    expect(ALL_ITEM_IDS).toHaveLength(78);
    ALL_ITEM_IDS.forEach((id) => {
      expect(ITEM_TEXT.en[id]?.trim()).toBeTruthy();
      expect(ITEM_TEXT.bg[id]?.trim()).toBeTruthy();
    });
  });
});
