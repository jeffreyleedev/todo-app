import { useTodoStore } from '@/application';
import type { Todo } from '@/domain';

export function resetTodoStore(): void {
  useTodoStore.setState({ todos: [], filter: 'all' });
}

let mockIdCounter = 0;

export function createMockTodo(overrides?: Partial<Todo>): Todo {
  return {
    id: `mock-${++mockIdCounter}`,
    text: 'Mock todo',
    completed: false,
    createdAt: 0,
    ...overrides,
  };
}
