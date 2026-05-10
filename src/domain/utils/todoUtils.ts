import type { Todo } from '@/domain/entities/Todo';
import type { Filter } from '@/domain/entities/Filter';

export function updateTodoById(
  todos: Todo[],
  id: string,
  updater: (t: Todo) => Todo
): Todo[] {
  return todos.map((t) => (t.id === id ? updater(t) : t));
}

export function filterTodos(todos: Todo[], filter: Filter): Todo[] {
  switch (filter) {
    case 'active':
      return todos.filter((t) => !t.completed);
    case 'completed':
      return todos.filter((t) => t.completed);
    default:
      return todos;
  }
}

export function partitionTodos(todos: Todo[]): {
  activeTodos: Todo[];
  completedTodos: Todo[];
} {
  return todos.reduce<{ activeTodos: Todo[]; completedTodos: Todo[] }>(
    (acc, t) => {
      if (t.completed) acc.completedTodos.push(t);
      else acc.activeTodos.push(t);
      return acc;
    },
    { activeTodos: [], completedTodos: [] }
  );
}
