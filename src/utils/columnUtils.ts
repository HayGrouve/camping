/**
 * Splits an ordered list of weights into `columnCount` contiguous groups so that the
 * heaviest group is as light as possible (the linear partition problem). Returns the
 * groups as arrays of indices; reading order is preserved top to bottom, then left to right.
 */
export const partitionIntoColumns = (weights: number[], columnCount: number): number[][] => {
  const itemCount = weights.length;
  if (itemCount === 0) return [];

  const groupCount = Math.min(Math.max(1, Math.floor(columnCount)), itemCount);

  const prefix: number[] = [0];
  weights.forEach((weight, index) => prefix.push(prefix[index] + weight));

  // cost[g][i]: smallest possible heaviest group when the first i items form g groups
  const cost: number[][] = Array.from({ length: groupCount + 1 }, () =>
    new Array<number>(itemCount + 1).fill(Infinity)
  );
  const cut: number[][] = Array.from({ length: groupCount + 1 }, () =>
    new Array<number>(itemCount + 1).fill(0)
  );
  cost[0][0] = 0;

  for (let group = 1; group <= groupCount; group++) {
    for (let end = group; end <= itemCount; end++) {
      for (let start = group - 1; start < end; start++) {
        const candidate = Math.max(cost[group - 1][start], prefix[end] - prefix[start]);
        if (candidate < cost[group][end]) {
          cost[group][end] = candidate;
          cut[group][end] = start;
        }
      }
    }
  }

  const groups: number[][] = [];
  let end = itemCount;
  for (let group = groupCount; group >= 1; group--) {
    const start = cut[group][end];
    groups.unshift(Array.from({ length: end - start }, (_, offset) => start + offset));
    end = start;
  }
  return groups;
};
