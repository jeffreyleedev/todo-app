import type { Todo } from '@/domain/entities/Todo';
import type { Filter } from '@/domain/entities/Filter';

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
