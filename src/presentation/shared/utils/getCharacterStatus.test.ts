import { describe, it, expect } from 'vitest';
import {
  getCharacterStatus,
  CHAR_WARNING_THRESHOLD,
} from './getCharacterStatus';
import { TODO_MAX_LENGTH } from '@/domain';

const nearLimit = Math.round(TODO_MAX_LENGTH * CHAR_WARNING_THRESHOLD); // 90

describe('getCharacterStatus', () => {
  it('isNearLimit is false below the warning threshold', () => {
    expect(getCharacterStatus(nearLimit - 1, TODO_MAX_LENGTH).isNearLimit).toBe(
      false
    );
  });

  it('isNearLimit is true at exactly the warning threshold', () => {
    expect(getCharacterStatus(nearLimit, TODO_MAX_LENGTH).isNearLimit).toBe(
      true
    );
  });

  it('isNearLimit is true above the warning threshold', () => {
    expect(getCharacterStatus(nearLimit + 1, TODO_MAX_LENGTH).isNearLimit).toBe(
      true
    );
  });

  it('isAtLimit is false below the max length', () => {
    expect(
      getCharacterStatus(TODO_MAX_LENGTH - 1, TODO_MAX_LENGTH).isAtLimit
    ).toBe(false);
  });

  it('isAtLimit is true at exactly the max length', () => {
    expect(getCharacterStatus(TODO_MAX_LENGTH, TODO_MAX_LENGTH).isAtLimit).toBe(
      true
    );
  });

  it('both flags are false for zero length', () => {
    const result = getCharacterStatus(0, TODO_MAX_LENGTH);
    expect(result.isNearLimit).toBe(false);
    expect(result.isAtLimit).toBe(false);
  });
});
