export const CHAR_WARNING_THRESHOLD = 0.9;

export function getCharacterStatus(length: number, max: number) {
  return {
    isNearLimit: length >= max * CHAR_WARNING_THRESHOLD,
    isAtLimit: length >= max,
  };
}
