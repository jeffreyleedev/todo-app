import { useCallback, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
  const subscribe = useCallback((callback: () => void) => {
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const getSnapshot = useCallback((): Theme => {
    return document.documentElement.classList.contains('light')
      ? 'light'
      : 'dark';
  }, []);

  const getServerSnapshot = useCallback((): Theme => 'dark', []);

  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('light', next === 'light');
    localStorage.setItem('theme', next);
  }, [theme]);

  return { theme, toggle } as const;
}
