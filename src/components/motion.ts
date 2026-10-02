import { useReducedMotion } from 'motion/react';

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// How long a freshly checked row stays visible before it folds away,
// so the check animation registers as feedback first.
const LEAVE_DELAY = 0.32;

/**
 * Enter / exit props for rows and sections that fold in and out of a list.
 * Height is animated on purpose: the content below has to follow smoothly,
 * and each element is small and short-lived.
 */
export const useCollapseMotion = () => {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.3;

  return {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto', transition: { duration, ease: EASE_OUT } },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration, ease: EASE_OUT, delay: reduceMotion ? 0 : LEAVE_DELAY },
    },
  };
};
