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
  if (filter === 'active')
    return {
      activeTodos: todos.filter((t) => !t.completed),
      completedTodos: [],
    };
  if (filter === 'completed')
    return {
      activeTodos: [],
      completedTodos: todos.filter((t) => t.completed),
    };
  return {
    activeTodos: todos.filter((t) => !t.completed),
    completedTodos: todos.filter((t) => t.completed),
  };
}
