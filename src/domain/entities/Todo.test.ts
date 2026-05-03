import { describe, it, expect } from 'vitest';
import {
  createTodo,
  toggleTodo,
  TODO_MAX_LENGTH,
  isDuplicateTodo,
  nextPriority,
} from './Todo';

describe('createTodo', () => {
  it('should create a todo with the given text', () => {
    const todo = createTodo('Buy milk');
    expect(todo.text).toBe('Buy milk');
  });

  it('should throw an error if text exceeds max length', () => {
    const longText = 'a'.repeat(TODO_MAX_LENGTH + 1);
    expect(() => createTodo(longText)).toThrow(
      `Todo text cannot exceed ${TODO_MAX_LENGTH} characters.`
    );
  });

  it('should create a todo with text exactly at max length', () => {
    const exactText = 'a'.repeat(TODO_MAX_LENGTH);
    const todo = createTodo(exactText);
    expect(todo.text).toBe(exactText);
    expect(todo.completed).toBe(false);
  });

  it('should create a todo with completed set to false', () => {
    const todo = createTodo('Buy milk');
    expect(todo.completed).toBe(false);
  });

  it('should create a todo with a string id', () => {
    const todo = createTodo('Buy milk');
    expect(typeof todo.id).toBe('string');
    expect(todo.id.length).toBeGreaterThan(0);
  });

  it('should create a todo with a createdAt timestamp', () => {
    const before = Date.now();
    const todo = createTodo('Buy milk');
    const after = Date.now();

    expect(todo.createdAt).toBeGreaterThanOrEqual(before);
    expect(todo.createdAt).toBeLessThanOrEqual(after);
  });

  it('should create unique ids for each todo', () => {
    const todo1 = createTodo('Buy milk');
    const todo2 = createTodo('Walk dog');
    expect(todo1.id).not.toBe(todo2.id);
  });

  it('should create a todo without priority by default', () => {
    const todo = createTodo('Buy milk');
    expect(todo.priority).toBeUndefined();
  });
});

describe('toggleTodo', () => {
  it('should flip completed from false to true', () => {
    const todo = createTodo('Buy milk');
    const toggled = toggleTodo(todo);
    expect(toggled.completed).toBe(true);
  });

  it('should flip completed from true to false', () => {
    const todo = { ...createTodo('Buy milk'), completed: true };
    const toggled = toggleTodo(todo);
    expect(toggled.completed).toBe(false);
  });

  it('should preserve id, text, and createdAt', () => {
    const todo = createTodo('Buy milk');
    const toggled = toggleTodo(todo);
    expect(toggled.id).toBe(todo.id);
    expect(toggled.text).toBe(todo.text);
    expect(toggled.createdAt).toBe(todo.createdAt);
  });

  it('should return a new object (immutability)', () => {
    const todo = createTodo('Buy milk');
    const toggled = toggleTodo(todo);
    expect(toggled).not.toBe(todo);
  });

  it('should preserve priority when toggling', () => {
    const todo = { ...createTodo('Buy milk'), priority: 'high' as const };
    const toggled = toggleTodo(todo);
    expect(toggled.priority).toBe('high');
  });
});

describe('isDuplicateTodo', () => {
  it('should return true for exact match against active todo', () => {
    const todo = createTodo('Buy milk');
    expect(isDuplicateTodo('Buy milk', [todo])).toBe(true);
  });

  it('should return true case-insensitively', () => {
    const todo = createTodo('Buy milk');
    expect(isDuplicateTodo('buy MILK', [todo])).toBe(true);
  });

  it('should return true when input has surrounding whitespace', () => {
    const todo = createTodo('Buy milk');
    expect(isDuplicateTodo('  Buy milk  ', [todo])).toBe(true);
  });

  it('should return false when no todos exist', () => {
    expect(isDuplicateTodo('Buy milk', [])).toBe(false);
  });

  it('should return false when text does not match any active todo', () => {
    const todo = createTodo('Buy milk');
    expect(isDuplicateTodo('Walk dog', [todo])).toBe(false);
  });

  it('should return false when matching todo is completed', () => {
    const todo = { ...createTodo('Buy milk'), completed: true };
    expect(isDuplicateTodo('Buy milk', [todo])).toBe(false);
  });

  it('should return false after the matching todo is deleted', () => {
    const remaining = [createTodo('Walk dog')];
    expect(isDuplicateTodo('Buy milk', remaining)).toBe(false);
  });
});

describe('nextPriority', () => {
  it('should cycle from undefined to high', () => {
    expect(nextPriority(undefined)).toBe('high');
  });

  it('should cycle from high to medium', () => {
    expect(nextPriority('high')).toBe('medium');
  });

  it('should cycle from medium to low', () => {
    expect(nextPriority('medium')).toBe('low');
  });

  it('should cycle from low to undefined', () => {
    expect(nextPriority('low')).toBeUndefined();
  });

  it('should return high for unknown values', () => {
    // @ts-expect-error - testing fallback for invalid priority values
    expect(nextPriority('unknown')).toBe('high');
  });
});
