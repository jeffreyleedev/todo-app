import type { Todo, TodoRepository } from '@/domain';

const STORAGE_KEY = 'todos_v2'; // New key for the new schema (string IDs, createdAt)

export class LocalStorageTodoRepository implements TodoRepository {
  load(): Todo[] {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
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
