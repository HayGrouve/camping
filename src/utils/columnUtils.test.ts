import { partitionIntoColumns } from './columnUtils';

const totals = (weights: number[], groups: number[][]): number[] =>
  groups.map((group) => group.reduce((sum, index) => sum + weights[index], 0));

describe('partitionIntoColumns', () => {
  it('returns no columns for an empty list', () => {
    expect(partitionIntoColumns([], 3)).toEqual([]);
  });

  it('keeps everything in one column when asked for one', () => {
    expect(partitionIntoColumns([3, 1, 2], 1)).toEqual([[0, 1, 2]]);
  });

  it('never creates more columns than items', () => {
    expect(partitionIntoColumns([4, 2], 3)).toEqual([[0], [1]]);
  });

  it('preserves the original order across columns', () => {
    const groups = partitionIntoColumns([7, 8, 6, 14, 12, 9, 8, 7, 6, 9, 8], 3);
    expect(groups.flat()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('minimises the tallest column', () => {
    const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const groups = partitionIntoColumns(weights, 3);
    expect(Math.max(...totals(weights, groups))).toBe(17);
  });

  it('treats a column count below one as a single column', () => {
    expect(partitionIntoColumns([2, 2], 0)).toEqual([[0, 1]]);
  });
});
