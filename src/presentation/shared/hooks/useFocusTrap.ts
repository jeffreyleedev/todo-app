import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const initialFocusable =
      el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    initialFocusable[0]?.focus();
    const trapTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const atFirst = document.activeElement === first;
      const atLast = document.activeElement === last;
      if (e.shiftKey && atFirst) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && atLast) {
        e.preventDefault();
        first?.focus();
      }
    };
    el.addEventListener('keydown', trapTab);
    return () => el.removeEventListener('keydown', trapTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
