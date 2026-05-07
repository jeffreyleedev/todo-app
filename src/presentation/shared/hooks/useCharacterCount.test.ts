import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCharacterCount, CHAR_WARNING_THRESHOLD } from './useCharacterCount';
import { TODO_MAX_LENGTH } from '@/domain';

const nearLimit = Math.round(TODO_MAX_LENGTH * CHAR_WARNING_THRESHOLD); // 90

describe('useCharacterCount', () => {
  it('isNearLimit is false below the warning threshold', () => {
    const { result } = renderHook(() =>
      useCharacterCount('a'.repeat(nearLimit - 1))
    );
    expect(result.current.isNearLimit).toBe(false);
  });

  it('isNearLimit is true at exactly the warning threshold', () => {
    const { result } = renderHook(() =>
      useCharacterCount('a'.repeat(nearLimit))
    );
    expect(result.current.isNearLimit).toBe(true);
  });

  it('isNearLimit is true above the warning threshold', () => {
    const { result } = renderHook(() =>
      useCharacterCount('a'.repeat(nearLimit + 1))
    );
    expect(result.current.isNearLimit).toBe(true);
  });

  it('isAtLimit is false below the max length', () => {
    const { result } = renderHook(() =>
      useCharacterCount('a'.repeat(TODO_MAX_LENGTH - 1))
    );
    expect(result.current.isAtLimit).toBe(false);
  });

  it('isAtLimit is true at exactly the max length', () => {
    const { result } = renderHook(() =>
      useCharacterCount('a'.repeat(TODO_MAX_LENGTH))
    );
    expect(result.current.isAtLimit).toBe(true);
  });

  it('both flags are false for empty string', () => {
    const { result } = renderHook(() => useCharacterCount(''));
    expect(result.current.isNearLimit).toBe(false);
    expect(result.current.isAtLimit).toBe(false);
  });
});
