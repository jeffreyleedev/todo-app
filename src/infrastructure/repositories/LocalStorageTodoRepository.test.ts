import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalStorageTodoRepository } from './LocalStorageTodoRepository';
import { createTodo } from '@/domain';

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
