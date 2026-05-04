import { useState } from 'react';
import { useTodoStore } from '@/application';
import { countCompleted } from '@/domain';
import { ConfirmDialog } from '@/presentation/shared/components/ConfirmDialog';
import { TodoFilter } from './TodoFilter';

type ConfirmAction = 'clear-completed' | 'delete-all' | null;

export function TodoStats() {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const activeCount = useTodoStore((state) => state.getActiveCount());
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const deleteAll = useTodoStore((state) => state.deleteAll);

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const completedCount = countCompleted(todos);
  const showClearCompleted = filter !== 'active' && completedCount > 0;
  const hasOnlyCompleted = activeCount === 0 && completedCount > 0;
  const showDeleteAll = todos.length > 0 && filter !== 'completed' && !hasOnlyCompleted;

  function handleConfirm() {
    if (confirmAction === 'clear-completed') {
      clearCompleted();
    } else if (confirmAction === 'delete-all') {
      deleteAll();
    }
    setConfirmAction(null);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:justify-between pt-md border-t border-surface-variant/50 mt-sm w-full">
      <span
        data-testid="items-left"
        className="font-label-md text-label-md text-on-surface-variant order-2 sm:order-1"
      >
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <TodoFilter />

      <div className="flex gap-md order-3">
        {showClearCompleted && (
          <button
            onClick={() => setConfirmAction('clear-completed')}
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Clear completed
          </button>
        )}
        {showDeleteAll && (
          <button
            onClick={() => setConfirmAction('delete-all')}
            className="font-label-md text-label-md text-on-surface-variant hover:text-error transition-colors"
          >
            Delete all
          </button>
        )}
      </div>

      {confirmAction === 'clear-completed' && (
        <ConfirmDialog
          title="Clear completed tasks?"
          message="This will permanently remove all completed tasks. This action cannot be undone."
          confirmLabel="Clear completed"
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {confirmAction === 'delete-all' && (
        <ConfirmDialog
          title="Delete all tasks?"
          message="This will permanently remove all tasks. This action cannot be undone."
          confirmLabel="Delete all"
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
