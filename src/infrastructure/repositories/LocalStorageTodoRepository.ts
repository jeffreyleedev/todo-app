import type { Priority, Todo, TodoRepository } from '@/domain';
import { VALID_PRIORITIES } from '@/domain';

const STORAGE_KEY = 'todos_v2'; // versioned to avoid collisions with pre-1.0 schema

export function isValidTodo(value: unknown): value is Todo {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.text === 'string' &&
    typeof t.completed === 'boolean' &&
    typeof t.createdAt === 'number' &&
    (t.priority === undefined ||
      VALID_PRIORITIES.includes(t.priority as Priority))
  );
}

export class LocalStorageTodoRepository implements TodoRepository {
  load(): Todo[] {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (!item) return [];
      const parsed: unknown = JSON.parse(item);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isValidTodo);
    } catch (error) {
      console.error('Failed to load todos from localStorage', error);
      return [];
    }
  }

  save(todos: Todo[]): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos to localStorage', error);
    }
  }
}
