import { useEffect, useRef, type RefObject } from 'react';

// Keeps a stable ref pointing at the latest value so an effect can read it without re-subscribing.
export function useLatestRef<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
