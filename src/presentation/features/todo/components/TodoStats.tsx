import { useTodoStore } from '@/application';
import { ConfirmDialog } from '@/presentation/shared/components/ConfirmDialog';
import { Button } from '@/presentation/shared/components/Button';
import { TodoFilter } from './TodoFilter';
import { useShallow } from 'zustand/shallow';
import {
  useConfirmAction,
  type ConfirmAction,
} from '../hooks/useConfirmAction';

const CONFIRM_CONFIG: Record<
  NonNullable<ConfirmAction>,
  { title: string; message: string; confirmLabel: string }
> = {
  'clear-completed': {
    title: 'Clear completed tasks?',
    message:
      'This will permanently remove all completed tasks. This action cannot be undone.',
    confirmLabel: 'Clear completed',
  },
  'delete-all': {
    title: 'Delete all tasks?',
    message:
      'This will permanently remove all tasks. This action cannot be undone.',
    confirmLabel: 'Delete all',
  },
};

export function TodoStats() {
  const { todos, filter, clearCompleted, deleteAll } = useTodoStore(
    useShallow((state) => ({
      todos: state.todos,
      filter: state.filter,
      clearCompleted: state.clearCompleted,
      deleteAll: state.deleteAll,
    }))
  );

  const { confirmAction, setConfirmAction, handleConfirm } = useConfirmAction(
    clearCompleted,
    deleteAll
  );

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;
  const showClearCompleted = filter !== 'active' && completedCount > 0;
  const hasOnlyCompleted = activeCount === 0 && completedCount > 0;
  const showDeleteAll =
    todos.length > 0 && filter !== 'completed' && !hasOnlyCompleted;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-12 sm:gap-0 sm:justify-between pt-20 border-t border-text-primary/20 mt-12 w-full pl-20">
      <span
        data-testid="items-left"
        className="font-caption text-text-secondary order-2 sm:order-1"
      >
        {activeCount} {activeCount === 1 ? 'ITEM' : 'ITEMS'} LEFT
      </span>

      <TodoFilter />

      <div className="flex gap-16 order-3">
        {showClearCompleted && (
          <Button
            variant="ghost"
            onClick={() => setConfirmAction('clear-completed')}
          >
            CLEAR COMPLETED
          </Button>
        )}
        {showDeleteAll && (
          <Button
            variant="ghost"
            onClick={() => setConfirmAction('delete-all')}
          >
            DELETE ALL
          </Button>
        )}
      </div>

      {confirmAction && (
        <ConfirmDialog
          {...CONFIRM_CONFIG[confirmAction]}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
