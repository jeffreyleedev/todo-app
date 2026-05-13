import { useTodoStore } from '@/application';
import { TODO_MAX_LENGTH } from '@/domain';
import { useShallow } from 'zustand/shallow';
import { Button } from '@/presentation/shared/components/Button';
import { CharCounter } from '@/presentation/shared/components/CharCounter';
import { cn } from '@/presentation/shared/utils/cn';
import { FOCUS_RING } from '@/presentation/shared/utils/focusTokens';
import { useAddTodo } from '@/presentation/features/todo/hooks/useAddTodo';

export function AddTodo() {
  const { addTodo, todos } = useTodoStore(
    useShallow((state) => ({ addTodo: state.addTodo, todos: state.todos }))
  );
  const { text, setText, trimmed, isDuplicate, canSubmit, handleSubmit } =
    useAddTodo(todos, addTodo);

  return (
    <div className="flex flex-col gap-12 w-full pl-20">
      <form onSubmit={handleSubmit} className="flex items-center gap-12 w-full">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          maxLength={TODO_MAX_LENGTH}
          className={cn(
            'flex-1 bg-canvas py-10 px-12 rounded-2 border border-text-secondary focus:border-mint font-body text-text-primary placeholder:text-text-secondary transition-colors duration-150 outline-none',
            FOCUS_RING
          )}
        />
        <Button
          type="submit"
          data-testid="add-todo-button"
          variant="primary"
          size="md"
          disabled={!canSubmit}
        >
          Add
        </Button>
      </form>
      <div className="flex items-center">
        {isDuplicate && trimmed && (
          <p className="font-caption text-ultraviolet" role="alert">
            Already exists.
          </p>
        )}
        <CharCounter
          length={text.length}
          max={TODO_MAX_LENGTH}
          data-testid="char-counter"
          className="ml-auto"
        />
      </div>
    </div>
  );
}
