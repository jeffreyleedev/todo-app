import { useState, useEffect, useRef } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme-preference';

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage unavailable (e.g. private browsing restrictions)
  }
  return null;
}

function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

/**
 * Manages the app's light/dark theme.
 *
 * - Defaults to the OS preference on first visit.
 * - Once the user explicitly toggles, their choice is persisted to localStorage
 *   and takes precedence over the OS setting from then on.
 * - While no stored preference exists, the theme continues to follow OS changes.
 */
export function useTheme() {
  // Track whether the user has made an explicit choice (either this session or
  // a previous one via localStorage).
  const hasManualOverride = useRef<boolean>(getStoredTheme() !== null);

  const [theme, setTheme] = useState<Theme>(
    () => getStoredTheme() ?? getSystemTheme()
  );

  // Apply / remove the `.dark` class on <html> and persist when there is a
  // manual override in effect.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (hasManualOverride.current) {
      persistTheme(theme);
    }
  }, [theme]);

  // While no manual override exists, keep in sync with OS preference changes.
  useEffect(() => {
    if (hasManualOverride.current) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!hasManualOverride.current) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    hasManualOverride.current = true;
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      persistTheme(next);
      return next;
    });
  };

  return { theme, toggleTheme };
}
