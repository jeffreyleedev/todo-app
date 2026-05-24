import { useState, useCallback } from 'react';
import { useLatestRef } from './useLatestRef';

export function useConfirmAction<T extends string>(
  actions: Record<T, () => void>
) {
  const [confirmAction, setConfirmAction] = useState<T | null>(null);
  const actionsRef = useLatestRef(actions);

  const handleConfirm = useCallback(() => {
    if (confirmAction !== null) actionsRef.current[confirmAction]();
    setConfirmAction(null);
  }, [confirmAction, actionsRef]);

  return { confirmAction, setConfirmAction, handleConfirm };
}
