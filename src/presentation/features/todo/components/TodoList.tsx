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
      <div className="relative">
        <div className="absolute left-[8px] top-0 bottom-0 w-px border-l border-dashed border-purple-rule" />

        <div className="flex flex-col gap-16">
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
                className="w-full h-px bg-mint-border/30 ml-32"
              />
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
      </div>
    </DndContext>
  );
}
