import { TODO_MAX_LENGTH } from '@/domain';

export const CHAR_WARNING_THRESHOLD = 0.9;

export function useCharacterCount(text: string) {
  return {
    isNearLimit: text.length >= TODO_MAX_LENGTH * CHAR_WARNING_THRESHOLD,
    isAtLimit: text.length >= TODO_MAX_LENGTH,
  };
}
