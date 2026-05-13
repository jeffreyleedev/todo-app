import { useCallback } from 'react';
import { useTodoStore } from '@/application';
import { TodoItem } from './TodoItem';
import { Icon } from '@/presentation/shared/components/Icon';
import { useShallow } from 'zustand/shallow';
import { partitionFilteredTodos, type Todo } from '@/domain';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

function SortableSection({ todos }: { todos: Todo[] }) {
  return (
    <SortableContext
      items={todos.map((t) => t.id)}
      strategy={verticalListSortingStrategy}
    >
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </SortableContext>
  );
}

export function TodoList() {
  const { todos, filter, reorderTodos } = useTodoStore(
    useShallow((state) => ({
      todos: state.todos,
      filter: state.filter,
      reorderTodos: state.reorderTodos,
    }))
  );
  const { activeTodos, completedTodos } = partitionFilteredTodos(todos, filter);
  const totalTodos = todos.length;

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        reorderTodos(active.id as string, over.id as string);
      }
    },
    [reorderTodos]
  );

  if (activeTodos.length + completedTodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-64 opacity-40">
        <Icon
          name="inventory_2"
          className="text-[48px] text-text-secondary mb-24"
        />
        {totalTodos === 0 ? (
          <p className="text-center text-text-secondary font-body">
            No tasks yet. Add one above!
          </p>
        ) : (
          <p className="text-center text-text-secondary font-body">
            No tasks in this category.
          </p>
        )}
      </div>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="relative">
        <div className="absolute left-[8px] top-0 bottom-0 w-px border-l border-dashed border-purple-rule" />

        <div className="flex flex-col gap-16">
          <SortableSection todos={activeTodos} />

          {completedTodos.length > 0 && (
            <>
              <div
                data-testid="todo-separator"
                className="w-full h-px bg-mint-border/30 ml-32"
              />
              <SortableSection todos={completedTodos} />
            </>
          )}
        </div>
      </div>
    </DndContext>
  );
}
