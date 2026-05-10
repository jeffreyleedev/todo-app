import { useState, useCallback, useRef, useEffect } from 'react';

export function useConfirmAction<T extends string>(
  actions: Record<T, () => void>
) {
  const [confirmAction, setConfirmAction] = useState<T | null>(null);
  const actionsRef = useRef(actions);
  useEffect(() => {
    actionsRef.current = actions;
  });

  const handleConfirm = useCallback(() => {
    if (confirmAction !== null) actionsRef.current[confirmAction]();
    setConfirmAction(null);
  }, [confirmAction]);

  return { confirmAction, setConfirmAction, handleConfirm };
}
