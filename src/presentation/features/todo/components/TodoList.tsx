import { useTodoStore } from '@/application';
import { TodoItem } from './TodoItem';
import { Icon } from '@/presentation/shared/components/Icon';
import { useShallow } from 'zustand/shallow';
import { filterTodos } from '@/domain';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export function TodoList() {
  const filteredTodos = useTodoStore(
    useShallow((state) => filterTodos(state.todos, state.filter))
  );
  const totalTodos = useTodoStore((state) => state.todos.length);
  const reorderTodos = useTodoStore((state) => state.reorderTodos);

  if (filteredTodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-xl opacity-60">
        <Icon
          name="inventory_2"
          className="text-[48px] text-outline/20 mb-md"
        />
        {totalTodos === 0 ? (
          <p className="text-center text-on-surface-variant font-body-md">
            No tasks yet. Add one above!
          </p>
        ) : (
          <p className="text-center text-on-surface-variant font-body-md">
            No tasks in this category.
          </p>
        )}
      </div>
    );
  }

  const activeTodos = filteredTodos.filter((t) => !t.completed);
  const completedTodos = filteredTodos.filter((t) => t.completed);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTodos(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-sm">
        <SortableContext
          items={activeTodos.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {activeTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </SortableContext>

        {completedTodos.length > 0 && (
          <>
            <div
              data-testid="todo-separator"
              className="w-full h-px bg-surface-variant"
            ></div>
            <SortableContext
              items={completedTodos.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {completedTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </SortableContext>
          </>
        )}
      </div>
    </DndContext>
  );
}
