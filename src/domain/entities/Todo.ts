export const TODO_MAX_LENGTH = 100;

export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: Priority;
}

export function createTodo(text: string): Todo {
  if (text.length > TODO_MAX_LENGTH) {
    throw new Error(`Todo text cannot exceed ${TODO_MAX_LENGTH} characters.`);
  }
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: Date.now(),
  };
}

export function nextPriority(
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

export function isDuplicateTodo(text: string, todos: Todo[]): boolean {
  const normalized = text.trim().toLowerCase();
  return todos.some(
    (todo) => !todo.completed && todo.text.toLowerCase() === normalized
  );
}
