import { useCallback } from 'react';
import type { Todo, Priority } from '@/domain';
import { useTodoStore } from '@/application';
import { IconButton } from '@/presentation/shared/components/IconButton';
import { Icon } from '@/presentation/shared/components/Icon';
import { cn } from '@/presentation/shared/utils/cn';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useShallow } from 'zustand/shallow';
import { PriorityButton } from './PriorityButton';
import { TodoEditInput } from './TodoEditInput';
import { useTodoEdit } from '../hooks/useTodoEdit';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo, setPriority, updateTodoText } = useTodoStore(
    useShallow((state) => ({
      toggleTodo: state.toggleTodo,
      deleteTodo: state.deleteTodo,
      setPriority: state.setPriority,
      updateTodoText: state.updateTodoText,
    }))
  );

  const {
    isEditing,
    editText,
    setEditText,
    editError,
    editInputRef,
    startEdit,
    saveEdit,
    handleKeyDown,
    handleTextKeyDown,
  } = useTodoEdit(todo, updateTodoText);

  const handleSetPriority = useCallback(
    (p?: Priority) => setPriority(todo.id, p),
    [setPriority, todo.id]
  );

  const handleDelete = useCallback(
    () => deleteTodo(todo.id),
    [deleteTodo, todo.id]
  );

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
      className={cn('pl-20 w-full relative', isDragging && 'opacity-50 z-50')}
    >
      <div className="absolute left-[8px] top-1/2 w-[4px] h-[4px] rounded-half bg-mint -translate-x-1/2 -translate-y-1/2" />

      <div
        className={cn(
          'w-full flex items-start justify-between gap-12 px-16 py-24 sm:px-24 rounded-20 border overflow-hidden transition-colors duration-150 group',
          todo.completed
            ? 'bg-slate border-mint-border'
            : 'bg-canvas border-text-primary'
        )}
      >
        <div className="flex items-start gap-12 flex-1 min-w-0 relative">
          <div
            className="shrink-0 mt-5 cursor-grab active:cursor-grabbing flex items-center"
            {...attributes}
            {...listeners}
            data-testid="drag-handle"
          >
            <Icon
              name="drag_indicator"
              className="text-[20px] text-text-secondary hover:text-mint transition-colors"
            />
          </div>
          <label className="relative flex items-center justify-center w-[20px] h-[20px] shrink-0 mt-5 cursor-pointer">
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
            <TodoEditInput
              editText={editText}
              editInputRef={editInputRef}
              onChange={setEditText}
              onKeyDown={handleKeyDown}
              onBlur={saveEdit}
              errorMessage={editError}
            />
          ) : (
            <span
              data-testid="todo-text"
              onDoubleClick={startEdit}
              tabIndex={todo.completed ? undefined : 0}
              onKeyDown={handleTextKeyDown}
              className={cn(
                'font-body flex-1 min-w-0 py-5 px-4 border border-transparent transition-colors duration-150 break-words',
                !todo.completed &&
                  'cursor-text group-hover:text-deep-link-blue',
                todo.completed && 'line-through text-text-secondary opacity-60'
              )}
            >
              {todo.text}
            </span>
          )}
        </div>
        <div className="flex items-start gap-12 shrink-0 mt-5">
          {!todo.completed && !isEditing && (
            <PriorityButton
              priority={todo.priority}
              onSetPriority={handleSetPriority}
            />
          )}
          {!isEditing && (
            <IconButton
              onClick={handleDelete}
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
