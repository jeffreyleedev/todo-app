import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  LocalStorageTodoRepository,
  isValidTodo,
} from './LocalStorageTodoRepository';
import { createTodo } from '@/domain';

describe('isValidTodo', () => {
  it('returns true for a valid todo object', () => {
    expect(
      isValidTodo({
        id: 'abc',
        text: 'Buy milk',
        completed: false,
        createdAt: 1000,
      })
    ).toBe(true);
  });

  it('returns false for null', () => {
    expect(isValidTodo(null)).toBe(false);
  });

  it('returns false for a non-object primitive', () => {
    expect(isValidTodo('string')).toBe(false);
    expect(isValidTodo(42)).toBe(false);
  });

  it('returns false when id is missing or wrong type', () => {
    expect(
      isValidTodo({ text: 'Buy milk', completed: false, createdAt: 1000 })
    ).toBe(false);
    expect(
      isValidTodo({
        id: 123,
        text: 'Buy milk',
        completed: false,
        createdAt: 1000,
      })
    ).toBe(false);
  });

  it('returns false when text is missing or wrong type', () => {
    expect(isValidTodo({ id: 'abc', completed: false, createdAt: 1000 })).toBe(
      false
    );
    expect(
      isValidTodo({ id: 'abc', text: 99, completed: false, createdAt: 1000 })
    ).toBe(false);
  });

  it('returns false when completed is missing or wrong type', () => {
    expect(isValidTodo({ id: 'abc', text: 'Buy milk', createdAt: 1000 })).toBe(
      false
    );
    expect(
      isValidTodo({
        id: 'abc',
        text: 'Buy milk',
        completed: 'yes',
        createdAt: 1000,
      })
    ).toBe(false);
  });

  it('returns false when createdAt is missing or wrong type', () => {
    expect(isValidTodo({ id: 'abc', text: 'Buy milk', completed: false })).toBe(
      false
    );
    expect(
      isValidTodo({
        id: 'abc',
        text: 'Buy milk',
        completed: false,
        createdAt: '2024',
      })
    ).toBe(false);
  });

  it('returns true when priority is a valid value', () => {
    expect(
      isValidTodo({
        id: 'abc',
        text: 'Buy milk',
        completed: false,
        createdAt: 1000,
        priority: 'high',
      })
    ).toBe(true);
  });

  it('returns false when priority is an invalid string', () => {
    expect(
      isValidTodo({
        id: 'abc',
        text: 'Buy milk',
        completed: false,
        createdAt: 1000,
        priority: 'critical',
      })
    ).toBe(false);
  });
});

describe('LocalStorageTodoRepository', () => {
  let repository: LocalStorageTodoRepository;

  beforeEach(() => {
    repository = new LocalStorageTodoRepository();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it('should load empty array if localStorage is empty', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    expect(repository.load()).toEqual([]);
  });

  it('should load todos from localStorage', () => {
    const todos = [createTodo('Test')];
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(todos));
    expect(repository.load()).toEqual(todos);
  });

  it('should save todos to localStorage', () => {
    const todos = [createTodo('Test')];
    repository.save(todos);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'todos_v2',
      JSON.stringify(todos)
    );
  });

  it('should return empty array when localStorage contains invalid JSON', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('not-json');
    expect(repository.load()).toEqual([]);
  });

  it('should return empty array when stored value is not an array', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify({ id: '1', text: 'oops' })
    );
    expect(repository.load()).toEqual([]);
  });

  it('should filter out records missing required fields', () => {
    const valid = createTodo('Valid');
    const corrupt = [
      { text: 'no id or completed' },
      { id: 42, text: 'bad types', completed: 'yes', createdAt: 0 },
    ];
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify([valid, ...corrupt])
    );
    expect(repository.load()).toEqual([valid]);
  });

  it('should return empty array when localStorage.getItem throws', () => {
    vi.mocked(localStorage.getItem).mockImplementation(() => {
      throw new Error('Storage access denied');
    });
    expect(repository.load()).toEqual([]);
  });

  it('should gracefully handle localStorage.setItem throwing on save', () => {
    const todos = [createTodo('Test')];
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    expect(() => repository.save(todos)).not.toThrow();
  });
});
