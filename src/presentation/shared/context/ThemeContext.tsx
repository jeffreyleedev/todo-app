// Context files export both a Provider component and a hook — this is the
// standard React pattern and intentionally breaks fast-refresh's single-export
// requirement. The disable comment below is expected for all context modules.
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';
import { useTheme, type Theme } from '@/presentation/shared/hooks/useTheme';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeValues = useTheme();
  return (
    <ThemeContext.Provider value={themeValues}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within a <ThemeProvider>');
  }
  return ctx;
}
