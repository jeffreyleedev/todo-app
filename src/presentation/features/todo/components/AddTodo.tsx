import { useState } from 'react';
import { useTodoStore } from '@/application';
import { TODO_MAX_LENGTH, isDuplicateTodo } from '@/domain';
import { IconButton } from '@/presentation/shared/components/IconButton';
import { cn } from '@/presentation/shared/utils/cn';

export function AddTodo() {
  const [text, setText] = useState('');
  const addTodo = useTodoStore((state) => state.addTodo);
  const todos = useTodoStore((state) => state.todos);

  const trimmed = text.trim();
  const isDuplicate = isDuplicateTodo(trimmed, todos);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trimmed && trimmed.length <= TODO_MAX_LENGTH && !isDuplicate) {
      addTodo(trimmed);
      setText('');
    }
  };

  const isNearLimit = text.length >= TODO_MAX_LENGTH * 0.9;
  const isAtLimit = text.length >= TODO_MAX_LENGTH;

  return (
    <div className="flex flex-col gap-sm w-full">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full group"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          maxLength={TODO_MAX_LENGTH}
          className="w-full bg-surface py-sm pl-md pr-[60px] rounded-lg border border-transparent focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim/50 font-body-md text-on-surface placeholder:text-outline transition-all duration-200 outline-none"
        />
        <IconButton
          type="submit"
          data-testid="add-todo-button"
          icon="add"
          variant="primary"
          shape="square"
          className="absolute right-sm top-1/2 -translate-y-1/2"
          disabled={!trimmed || trimmed.length > TODO_MAX_LENGTH || isDuplicate}
        />
      </form>
      <div className="flex items-center justify-end gap-sm">
        <div
          data-testid="char-counter"
          className={cn(
            'text-xs text-right shrink-0',
            isAtLimit
              ? 'text-error'
              : isNearLimit
                ? 'text-warning'
                : 'text-outline'
          )}
        >
          {text.length} / {TODO_MAX_LENGTH}
        </div>
      </div>
    </div>
  );
}
