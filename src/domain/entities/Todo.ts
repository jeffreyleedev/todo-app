export const TODO_MAX_LENGTH = 100;

export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: Priority;
}

export function validateTodoText(text: string): void {
  if (text.length > TODO_MAX_LENGTH) {
    throw new Error(`Todo text cannot exceed ${TODO_MAX_LENGTH} characters.`);
  }
}

export function createTodo(text: string): Todo {
  validateTodoText(text);
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: Date.now(),
  };
}

// Two `undefined` entries: one to enter the cycle from no priority, one to exit back to none.
export function cyclePriority(
  current: Priority | undefined
): Priority | undefined {
  const order: (Priority | undefined)[] = [
    undefined,
    'high',
    'medium',
    'low',
    undefined,
  ];
  const idx = order.indexOf(current);
  return idx === -1 ? 'high' : order[idx + 1];
}

export function toggleTodo(todo: Todo): Todo {
  return {
    ...todo,
    completed: !todo.completed,
  };
}

export function isDuplicateTodo(
  text: string,
  todos: Todo[],
  excludeId?: string
): boolean {
  const normalized = text.trim().toLowerCase();
  return todos.some(
    (todo) =>
      !todo.completed &&
      todo.id !== excludeId &&
      todo.text.toLowerCase() === normalized
  );
}
