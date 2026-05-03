import type { Todo } from '../entities/Todo';
import type { Filter } from '../entities/Filter';

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

export function countActive(todos: Todo[]): number {
  return todos.filter((t) => !t.completed).length;
}

export function countCompleted(todos: Todo[]): number {
  return todos.filter((t) => t.completed).length;
}
