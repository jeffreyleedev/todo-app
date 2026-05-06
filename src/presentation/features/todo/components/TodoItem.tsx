import { useState, useRef, useEffect } from 'react';
import type { Todo, Priority } from '@/domain';
import { useTodoStore } from '@/application';
import { IconButton } from '@/presentation/shared/components/IconButton';
import { Icon } from '@/presentation/shared/components/Icon';
import { cn } from '@/presentation/shared/utils/cn';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { nextPriority, TODO_MAX_LENGTH, isDuplicateTodo } from '@/domain';

interface TodoItemProps {
  todo: Todo;
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-ultraviolet text-white font-kicker px-10 py-4 rounded-20',
  medium: 'bg-accent-yellow text-black font-kicker px-10 py-4 rounded-20',
  low: 'bg-mint text-black font-kicker px-10 py-4 rounded-20',
};

export function TodoItem({ todo }: TodoItemProps) {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const setPriority = useTodoStore((state) => state.setPriority);
  const updateTodoText = useTodoStore((state) => state.updateTodoText);
  const todos = useTodoStore((state) => state.todos);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (todo.completed) return;
    setEditText(todo.text);
    setIsEditing(true);
  };

  const saveEdit = () => {
    const trimmed = editText.trim();
    if (
      trimmed &&
      trimmed.length <= TODO_MAX_LENGTH &&
      !isDuplicateTodo(trimmed, todos, todo.id)
    ) {
      updateTodoText(todo.id, trimmed);
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const isNearLimit = editText.length >= TODO_MAX_LENGTH * 0.9;
  const isAtLimit = editText.length >= TODO_MAX_LENGTH;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid="todo-item"
      className={cn(
        'flex items-start pl-20 relative',
        isDragging && 'opacity-50 z-50'
      )}
    >
      <div className="absolute left-[8px] top-1/2 w-[4px] h-[4px] rounded-half bg-mint -translate-x-1/2 -translate-y-1/2" />

      <div
        className={cn(
          'flex-1 flex items-center justify-between p-24 rounded-20 border transition-colors duration-150 group',
          todo.completed
            ? 'bg-slate border-mint-border'
            : 'bg-canvas border-text-primary'
        )}
      >
        <div className="flex items-center gap-12 w-full mr-12 relative">
          <div
            className="shrink-0 cursor-grab active:cursor-grabbing flex items-center"
            {...attributes}
            {...listeners}
            data-testid="drag-handle"
          >
            <Icon
              name="drag_indicator"
              className="text-[20px] text-text-secondary hover:text-mint transition-colors"
            />
          </div>
          <label className="relative flex items-center justify-center w-[20px] h-[20px] shrink-0 cursor-pointer">
            <input
              type="checkbox"
              data-testid="todo-checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="peer appearance-none w-[20px] h-[20px] rounded-2 border-2 border-text-secondary checked:bg-mint checked:border-mint transition-colors cursor-pointer"
            />
            <Icon
              name="check"
              data-testid="todo-check-icon"
              className="absolute text-black text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
            />
          </label>
          {isEditing ? (
            <div className="flex-1 relative">
              <input
                ref={editInputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={saveEdit}
                maxLength={TODO_MAX_LENGTH}
                data-testid="todo-edit-input"
                className="w-full bg-canvas py-5 pl-4 pr-[80px] rounded-2 border border-mint focus-visible:ring-1 focus-visible:ring-ultraviolet/50 font-body text-text-primary outline-none"
              />
              <div
                data-testid="todo-edit-char-counter"
                className={cn(
                  'absolute right-4 top-1/2 -translate-y-1/2 font-caption pointer-events-none bg-canvas pl-2 text-text-secondary',
                  isNearLimit && 'text-accent-yellow',
                  isAtLimit && 'text-ultraviolet'
                )}
              >
                {editText.length} / {TODO_MAX_LENGTH}
              </div>
            </div>
          ) : (
            <span
              data-testid="todo-text"
              onDoubleClick={handleDoubleClick}
              className={cn(
                'font-body flex-1 py-5 px-4 border border-transparent transition-colors duration-150 break-all',
                !todo.completed &&
                  'cursor-text group-hover:text-deep-link-blue',
                todo.completed && 'line-through text-text-secondary opacity-60'
              )}
            >
              {todo.text}
            </span>
          )}
        </div>
        <div className="flex items-center gap-12 shrink-0">
          {!todo.completed &&
            !isEditing &&
            (todo.priority ? (
              <button
                type="button"
                data-testid="priority-pill"
                onClick={() =>
                  setPriority(todo.id, nextPriority(todo.priority))
                }
                className={cn(
                  priorityColors[todo.priority],
                  'transition-opacity hover:opacity-80'
                )}
              >
                {todo.priority}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPriority(todo.id, 'high')}
                data-testid="priority-pill-add"
                className="font-kicker px-10 py-4 rounded-20 bg-slate text-text-secondary hover:text-mint hidden md:inline-flex md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              >
                +PRIORITY
              </button>
            ))}
          {!todo.completed && !isEditing && !todo.priority && (
            <button
              type="button"
              onClick={() => setPriority(todo.id, 'high')}
              className="md:hidden w-[24px] h-[24px] flex items-center justify-center rounded-half text-text-secondary hover:text-mint transition-colors"
              data-testid="priority-pill-add-mobile"
            >
              <Icon name="add" className="text-[16px]" />
            </button>
          )}
          {!isEditing && (
            <IconButton
              onClick={() => deleteTodo(todo.id)}
              data-testid="delete-todo"
              icon="close"
              variant="error"
              className="opacity-100 md:opacity-0 md:group-hover:opacity-100"
            />
          )}
        </div>
      </div>
    </div>
  );
}
