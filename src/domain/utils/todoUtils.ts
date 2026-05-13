import type { Todo } from '@/domain/entities/Todo';
import type { Filter } from '@/domain/entities/Filter';

export function updateTodoById(
  todos: Todo[],
  id: string,
  updater: (t: Todo) => Todo
): Todo[] {
  return todos.map((t) => (t.id === id ? updater(t) : t));
}

export function partitionFilteredTodos(
  todos: Todo[],
  filter: Filter
): { activeTodos: Todo[]; completedTodos: Todo[] } {
  return todos.reduce<{ activeTodos: Todo[]; completedTodos: Todo[] }>(
    (acc, t) => {
      if (filter === 'active' && t.completed) return acc;
      if (filter === 'completed' && !t.completed) return acc;
      if (t.completed) acc.completedTodos.push(t);
      else acc.activeTodos.push(t);
      return acc;
    },
    { activeTodos: [], completedTodos: [] }
  );
}
