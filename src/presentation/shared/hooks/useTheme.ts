import { useCallback, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

function getSnapshot(): Theme {
  return document.documentElement.classList.contains('light')
    ? 'light'
    : 'dark';
}

function getServerSnapshot(): Theme {
  return 'dark';
}

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('light', next === 'light');
    localStorage.setItem('theme', next);
  }, [theme]);

  return { theme, toggle } as const;
}
