import { render, screen, renderHook, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider, useThemeContext } from './ThemeContext';

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  // useThemeContext
  // ---------------------------------------------------------------------------
  describe('useThemeContext', () => {
    it('should throw a descriptive error when used outside of ThemeProvider', () => {
      // Suppress React's own error output for this intentional throw
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const TestComponent = () => {
        useThemeContext();
        return null;
      };

      expect(() => render(<TestComponent />)).toThrow(
        'useThemeContext must be used within a <ThemeProvider>'
      );

      consoleSpy.mockRestore();
    });

    it('should return theme and toggleTheme when inside ThemeProvider', () => {
      const { result } = renderHook(() => useThemeContext(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBeDefined();
      expect(typeof result.current.toggleTheme).toBe('function');
    });

    it('should provide "light" theme by default when OS preference is light and no stored preference exists', () => {
      // Global matchMedia stub returns matches: false (light mode)
      const { result } = renderHook(() => useThemeContext(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('light');
    });

    it('should provide "dark" theme when localStorage has "dark" stored', () => {
      localStorage.setItem('theme-preference', 'dark');

      const { result } = renderHook(() => useThemeContext(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('dark');
    });
  });

  // ---------------------------------------------------------------------------
  // ThemeProvider
  // ---------------------------------------------------------------------------
  describe('ThemeProvider', () => {
    it('should render its children', () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Child content</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should make the theme value accessible to deeply nested consumers', () => {
      const DeepConsumer = () => {
        const { theme } = useThemeContext();
        return <span data-testid="theme-value">{theme}</span>;
      };

      render(
        <ThemeProvider>
          <div>
            <div>
              <DeepConsumer />
            </div>
          </div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    });

    it('should allow toggleTheme to change the theme via context', () => {
      const ToggleConsumer = () => {
        const { theme, toggleTheme } = useThemeContext();
        return (
          <div>
            <span data-testid="theme-value">{theme}</span>
            <button data-testid="toggle-btn" onClick={toggleTheme}>
              Toggle
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <ToggleConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('light');

      fireEvent.click(screen.getByTestId('toggle-btn'));

      expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    });
  });
});
