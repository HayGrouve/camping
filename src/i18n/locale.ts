export type Locale = 'bg' | 'en';

export const DEFAULT_LOCALE: Locale = 'bg';

const LOCALE_KEY = 'camping-locale';

const isLocale = (value: string): value is Locale => value === 'bg' || value === 'en';

export const loadLocale = (): Locale => {
  try {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    if (stored != null && isLocale(stored)) return stored;
  } catch {
    // fall through
  }
  return DEFAULT_LOCALE;
};

export const persistLocale = (locale: Locale): void => {
  try {
    window.localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // session-only fallback
  }
};
