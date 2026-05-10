import { useState } from 'react';
import { useTodoStore } from '@/application';
import { TODO_MAX_LENGTH, isDuplicateTodo } from '@/domain';
import { useShallow } from 'zustand/shallow';
import { Button } from '@/presentation/shared/components/Button';
import { CharCounter } from '@/presentation/shared/components/CharCounter';
import { FOCUS_RING } from '@/presentation/shared/utils/focusRing';

export function AddTodo() {
  const [text, setText] = useState('');
  const { addTodo, todos } = useTodoStore(
    useShallow((state) => ({ addTodo: state.addTodo, todos: state.todos }))
  );

  const trimmed = text.trim();
  const isDuplicate = isDuplicateTodo(trimmed, todos);
  const canSubmit =
    !!trimmed && trimmed.length <= TODO_MAX_LENGTH && !isDuplicate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      addTodo(trimmed);
      setText('');
    }
  };

  return (
    <div className="flex flex-col gap-12 w-full pl-20">
      <form onSubmit={handleSubmit} className="flex items-center gap-12 w-full">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          maxLength={TODO_MAX_LENGTH}
          className={`flex-1 bg-canvas py-10 px-12 rounded-2 border border-text-secondary focus:border-mint ${FOCUS_RING} font-body text-text-primary placeholder:text-text-secondary transition-colors duration-150 outline-none`}
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
      <div className="flex items-center justify-end">
        <CharCounter
          length={text.length}
          max={TODO_MAX_LENGTH}
          data-testid="char-counter"
        />
      </div>
    </div>
  );
}
