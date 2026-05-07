import { useState } from 'react';
import { useTodoStore } from '@/application';
import { TODO_MAX_LENGTH, isDuplicateTodo } from '@/domain';
import { Button } from '@/presentation/shared/components/Button';
import { cn } from '@/presentation/shared/utils/cn';
import { useCharacterCount } from '@/presentation/shared/hooks/useCharacterCount';

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

  const { isNearLimit, isAtLimit } = useCharacterCount(text);

  return (
    <div className="flex flex-col gap-12 w-full pl-20">
      <form onSubmit={handleSubmit} className="flex items-center gap-12 w-full">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          maxLength={TODO_MAX_LENGTH}
          className="flex-1 bg-canvas py-10 px-12 rounded-2 border border-text-secondary focus:border-mint focus-visible:ring-1 focus-visible:ring-ultraviolet/50 font-body text-text-primary placeholder:text-text-secondary transition-colors duration-150 outline-none"
        />
        <Button
          type="submit"
          data-testid="add-todo-button"
          variant="primary"
          size="md"
          disabled={!trimmed || trimmed.length > TODO_MAX_LENGTH || isDuplicate}
        >
          Add
        </Button>
      </form>
      <div className="flex items-center justify-end">
        <div
          data-testid="char-counter"
          className={cn(
            'font-caption',
            isAtLimit
              ? 'text-ultraviolet'
              : isNearLimit
                ? 'text-accent-yellow'
                : 'text-text-secondary'
          )}
        >
          {text.length} / {TODO_MAX_LENGTH}
        </div>
      </div>
    </div>
  );
}
