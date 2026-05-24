import { useEffect } from 'react';
import { useLatestRef } from './useLatestRef';

export function useEscapeKey(onEscape: () => void) {
  const onEscapeRef = useLatestRef(onEscape);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscapeRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscapeRef]);
}
