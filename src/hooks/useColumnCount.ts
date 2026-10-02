import { RefObject, useLayoutEffect, useState } from 'react';

interface ColumnCountOptions {
  minColumnWidth: number;
  gap: number;
  maxColumns: number;
}

/** Number of columns that fit in the element, tracked as it resizes. */
export const useColumnCount = (
  containerRef: RefObject<HTMLElement | null>,
  { minColumnWidth, gap, maxColumns }: ColumnCountOptions
): number => {
  const [columnCount, setColumnCount] = useState(1);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateCount = () => {
      const width = element.getBoundingClientRect().width;
      const fitting = Math.floor((width + gap) / (minColumnWidth + gap));
      setColumnCount(Math.min(Math.max(fitting, 1), maxColumns));
    };

    updateCount();

    const observer = new ResizeObserver(updateCount);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, minColumnWidth, gap, maxColumns]);

  return columnCount;
};
