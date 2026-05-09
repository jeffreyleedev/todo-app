import { useState, useMemo } from 'react';

export type ConfirmAction = 'clear-completed' | 'delete-all' | null;

export function useConfirmAction(
  clearCompleted: () => void,
  deleteAll: () => void
) {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const actionMap = useMemo(
    () => ({ 'clear-completed': clearCompleted, 'delete-all': deleteAll }),
    [clearCompleted, deleteAll]
  );

  function handleConfirm() {
    if (confirmAction) actionMap[confirmAction]();
    setConfirmAction(null);
  }

  return { confirmAction, setConfirmAction, handleConfirm };
}
