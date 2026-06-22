import { DEFAULT_LOCALE, loadLocale, persistLocale } from './locale';

const LOCALE_KEY = 'camping-locale';

describe('loadLocale', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns bg when key is missing', () => {
    expect(loadLocale()).toBe(DEFAULT_LOCALE);
    expect(DEFAULT_LOCALE).toBe('bg');
  });

  it('returns saved en locale', () => {
    window.localStorage.setItem(LOCALE_KEY, 'en');
    expect(loadLocale()).toBe('en');
  });

  it('falls back to bg for invalid value', () => {
    window.localStorage.setItem(LOCALE_KEY, 'fr');
    expect(loadLocale()).toBe('bg');
  });
});

describe('persistLocale', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('persists valid locale', () => {
    persistLocale('en');
    expect(window.localStorage.getItem(LOCALE_KEY)).toBe('en');
  });
});
