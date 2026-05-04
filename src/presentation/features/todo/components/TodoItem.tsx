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
  high: 'bg-error-container text-on-error-container',
  medium: 'bg-tertiary-container text-on-tertiary-container',
  low: 'bg-secondary-container text-on-secondary-container',
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
        'group flex items-center justify-between px-md py-sm bg-surface-bright rounded-lg hover:bg-surface-container transition-colors duration-200',
        isDragging && 'opacity-50 z-50 shadow-lg'
      )}
    >
      <div
        className="flex items-center cursor-grab active:cursor-grabbing text-on-surface-variant hover:text-on-surface"
        {...attributes}
        {...listeners}
        data-testid="drag-handle"
      >
        <Icon name="drag_indicator" className="text-[20px]" />
      </div>
      <div className="flex items-center gap-sm w-full ml-sm">
        <label className="relative flex items-center justify-center w-[20px] h-[20px] shrink-0 cursor-pointer">
          <input
            type="checkbox"
            data-testid="todo-checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
            className="peer appearance-none w-[20px] h-[20px] rounded-sm border-2 border-outline checked:bg-primary checked:border-primary transition-colors cursor-pointer"
          />
          <Icon
            name="check"
            data-testid="todo-check-icon"
            className="absolute text-on-primary text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
          />
        </label>
        {isEditing ? (
          <div className="flex-1 flex flex-col gap-0.5">
            <input
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={saveEdit}
              maxLength={TODO_MAX_LENGTH}
              data-testid="todo-edit-input"
              className="w-full bg-surface-bright py-0.5 px-1 rounded border border-primary font-body-md text-on-surface outline-none"
            />
            <div
              data-testid="todo-edit-char-counter"
              className={cn(
                'text-xs text-right shrink-0',
                isAtLimit
                  ? 'text-error'
                  : isNearLimit
                    ? 'text-warning'
                    : 'text-outline'
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
              'font-body-md text-on-surface flex-1 transition-colors duration-200 break-all',
              !todo.completed && 'cursor-text',
              todo.completed &&
                'line-through text-on-surface-variant opacity-70'
            )}
          >
            {todo.text}
          </span>
        )}
      </div>
      <div className="flex items-center gap-sm">
        {!todo.completed &&
          (todo.priority ? (
            <button
              type="button"
              data-testid="priority-pill"
              onClick={() => setPriority(todo.id, nextPriority(todo.priority))}
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer transition-colors',
                priorityColors[todo.priority]
              )}
            >
              {todo.priority}
            </button>
          ) : (
            <button
              type="button"
              data-testid="priority-pill-add"
              onClick={() => setPriority(todo.id, 'high')}
              className="rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer transition-opacity bg-surface-variant text-on-surface-variant hover:bg-surface-container-high opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              +priority
            </button>
          ))}
        <IconButton
          onClick={() => deleteTodo(todo.id)}
          data-testid="delete-todo"
          icon="close"
          variant="error"
          className="opacity-100 md:opacity-0 md:group-hover:opacity-100"
        />
      </div>
    </div>
  );
}
