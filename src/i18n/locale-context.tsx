import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getCategoryTitle } from './categories';
import { loadLocale, Locale, persistLocale } from './locale';
import {
  formatProgressLabel,
  getUiString,
  interpolate,
  UiKey,
} from './ui';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: UiKey) => string;
  tCategory: (storageKey: string) => string;
  tProgress: (checked: number, total: number, percent: number) => string;
  tInterpolate: (key: UiKey, values: Record<string, string>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => loadLocale());

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => getUiString(locale, key),
      tCategory: (storageKey) => getCategoryTitle(locale, storageKey),
      tProgress: (checked, total, percent) =>
        formatProgressLabel(locale, checked, total, percent),
      tInterpolate: (key, values) => interpolate(getUiString(locale, key), values),
    }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): Pick<LocaleContextValue, 'locale' | 'setLocale'> => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return { locale: ctx.locale, setLocale: ctx.setLocale };
};

export const useTranslation = (): LocaleContextValue => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useTranslation must be used within LocaleProvider');
  return ctx;
};
