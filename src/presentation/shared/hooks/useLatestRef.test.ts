import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useLatestRef } from './useLatestRef';

describe('useLatestRef', () => {
  it('holds the initial value on first render', () => {
    const { result } = renderHook(() => useLatestRef('first'));
    expect(result.current.current).toBe('first');
  });

  it('reflects the latest value after a re-render', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useLatestRef(value),
      { initialProps: { value: 'first' } }
    );
    rerender({ value: 'second' });
    expect(result.current.current).toBe('second');
  });

  it('keeps a stable ref object identity across renders', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useLatestRef(value),
      { initialProps: { value: 1 } }
    );
    const firstRef = result.current;
    rerender({ value: 2 });
    expect(result.current).toBe(firstRef);
  });
});
