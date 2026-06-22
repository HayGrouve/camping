import { RefObject, useEffect } from 'react';

export const useHeaderHeight = (headerRef: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const updateHeight = () => {
      const height = element.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--header-height', `${Math.ceil(height)}px`);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [headerRef]);
};
