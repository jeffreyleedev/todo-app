import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTheme } from './useTheme';

const STORAGE_KEY = 'theme-preference';

// Helper to create a controllable matchMedia mock that lets tests capture and
// fire the 'change' event listener registered by useTheme.
function createMockMediaQuery(matches: boolean) {
  let capturedListener: ((e: MediaQueryListEvent) => void) | null = null;
  const mq = {
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: vi.fn(
      (_: string, handler: (e: MediaQueryListEvent) => void) => {
        capturedListener = handler;
      }
    ),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    fireChange(newMatches: boolean) {
      capturedListener?.({ matches: newMatches } as MediaQueryListEvent);
    },
  };
  return mq;
}

describe('useTheme', () => {
  // Preserve the matchMedia stub installed in setupTests.ts so tests that
  // override window.matchMedia don't bleed into later tests.
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    document.documentElement.classList.remove('dark');
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Initial theme resolution
  // ---------------------------------------------------------------------------
  describe('initial theme', () => {
    it('should default to light when OS preference is light and no stored preference exists', () => {
      // Global matchMedia stub in setupTests returns matches: false (light)
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');
    });

    it('should default to dark when OS preference is dark and no stored preference exists', () => {
      const mq = createMockMediaQuery(true);
      window.matchMedia = vi.fn().mockReturnValue(mq);

      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('dark');
    });

    it('should load "dark" preference from localStorage on init', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('dark');
    });

    it('should load "light" preference from localStorage on init', () => {
      localStorage.setItem(STORAGE_KEY, 'light');
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');
    });

    it('should fall back to OS preference when localStorage throws on read', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });
      // Global stub returns matches: false → light
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');
    });

    it('should fall back to OS preference when localStorage contains an invalid value', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-value');
      // Global stub returns matches: false → light
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');
    });
  });

  // ---------------------------------------------------------------------------
  // .dark class on <html>
  // ---------------------------------------------------------------------------
  describe('.dark class on <html>', () => {
    it('should add .dark class when theme is dark', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      renderHook(() => useTheme());
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should not add .dark class when theme is light', () => {
      renderHook(() => useTheme());
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should remove .dark class when toggled from dark to light', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      const { result } = renderHook(() => useTheme());
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      act(() => {
        result.current.toggleTheme();
      });

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should add .dark class when toggled from light to dark', () => {
      const { result } = renderHook(() => useTheme());
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      act(() => {
        result.current.toggleTheme();
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // toggleTheme
  // ---------------------------------------------------------------------------
  describe('toggleTheme', () => {
    it('should switch from light to dark', () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should switch from dark to light', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });

    it('should set the manual override so subsequent OS changes are ignored', () => {
      const mq = createMockMediaQuery(false);
      window.matchMedia = vi.fn().mockReturnValue(mq);

      const { result } = renderHook(() => useTheme());

      // Manually toggle to dark
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe('dark');

      // Simulate OS changing back to light — should be ignored due to manual override
      act(() => {
        mq.fireChange(false);
      });

      expect(result.current.theme).toBe('dark');
    });
  });

  // ---------------------------------------------------------------------------
  // OS preference change listener
  // ---------------------------------------------------------------------------
  describe('OS preference change listener', () => {
    it('should update theme when OS preference changes and no manual override exists', () => {
      const mq = createMockMediaQuery(false);
      window.matchMedia = vi.fn().mockReturnValue(mq);

      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');

      act(() => {
        mq.fireChange(true);
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should NOT attach an OS listener when a stored preference already exists', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');

      const mq = createMockMediaQuery(true);
      window.matchMedia = vi.fn().mockReturnValue(mq);

      renderHook(() => useTheme());

      // When hasManualOverride starts true the listener effect returns early
      expect(mq.addEventListener).not.toHaveBeenCalled();
    });

    it('should remove the OS change listener on unmount', () => {
      const mq = createMockMediaQuery(false);
      window.matchMedia = vi.fn().mockReturnValue(mq);

      const { unmount } = renderHook(() => useTheme());
      unmount();

      expect(mq.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });
  });

  // ---------------------------------------------------------------------------
  // localStorage persistence
  // ---------------------------------------------------------------------------
  describe('localStorage persistence', () => {
    it('should NOT write to localStorage on initial render when no stored preference exists', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      renderHook(() => useTheme());
      expect(setItemSpy).not.toHaveBeenCalled();
    });

    it('should write to localStorage after toggleTheme is called', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(setItemSpy).toHaveBeenCalledWith(STORAGE_KEY, 'dark');
    });

    it('should write the correct value on repeated toggles', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      }); // → dark
      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      }); // → light
      expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    });

    it('should not throw when localStorage.setItem throws (quota exceeded)', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const { result } = renderHook(() => useTheme());

      expect(() => {
        act(() => {
          result.current.toggleTheme();
        });
      }).not.toThrow();
    });
  });
});
