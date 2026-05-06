import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('light');
    localStorage.clear();
  });

  describe('getSnapshot', () => {
    it('should return "dark" when no .light class on document.documentElement', () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('dark');
    });

    it('should return "light" when .light class is present', () => {
      document.documentElement.classList.add('light');
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');
    });
  });

  describe('toggle', () => {
    it('should add .light class and persist "light" to localStorage when toggling from dark', async () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('dark');

      await act(async () => {
        result.current.toggle();
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('light');
      });
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should remove .light class and persist "dark" to localStorage when toggling from light', async () => {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');

      await act(async () => {
        result.current.toggle();
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('dark');
      });
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });

  it('should not write to localStorage on initial render', () => {
    renderHook(() => useTheme());
    expect(localStorage.getItem('theme')).toBeNull();
  });

  describe('subscription', () => {
    it('should re-render when .light class is changed externally', async () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('dark');

      await act(async () => {
        document.documentElement.classList.add('light');
      });

      await waitFor(() => {
        expect(result.current.theme).toBe('light');
      });
    });
  });
});
