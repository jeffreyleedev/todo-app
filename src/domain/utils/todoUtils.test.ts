import { describe, it, expect } from 'vitest';
import { filterTodos, countActive, countCompleted } from './todoUtils';
import { createTodo } from '../entities/Todo';

describe('todoUtils', () => {
  const todos = [
    { ...createTodo('Todo 1'), completed: false },
    { ...createTodo('Todo 2'), completed: true },
    { ...createTodo('Todo 3'), completed: false },
  ];

  describe('filterTodos', () => {
    it('should return all todos when filter is "all"', () => {
      expect(filterTodos(todos, 'all')).toHaveLength(3);
    });

    it('should return only active todos when filter is "active"', () => {
      const filtered = filterTodos(todos, 'active');
      expect(filtered).toHaveLength(2);
      expect(filtered.every((t) => !t.completed)).toBe(true);
    });

    it('should return only completed todos when filter is "completed"', () => {
      const filtered = filterTodos(todos, 'completed');
      expect(filtered).toHaveLength(1);
      expect(filtered.every((t) => t.completed)).toBe(true);
    });

    it('should return empty array for all filters when list is empty', () => {
      expect(filterTodos([], 'all')).toEqual([]);
      expect(filterTodos([], 'active')).toEqual([]);
      expect(filterTodos([], 'completed')).toEqual([]);
    });
  });

  describe('countActive', () => {
    it('should return correct count of active todos', () => {
      expect(countActive(todos)).toBe(2);
    });

    it('should return 0 when list is empty', () => {
      expect(countActive([])).toBe(0);
    });

    it('should return 0 when all todos are completed', () => {
      const allDone = todos.map((t) => ({ ...t, completed: true }));
      expect(countActive(allDone)).toBe(0);
    });

    it('should return the total count when all todos are active', () => {
      const allActive = todos.map((t) => ({ ...t, completed: false }));
      expect(countActive(allActive)).toBe(3);
    });
  });

  describe('countCompleted', () => {
    it('should return correct count of completed todos', () => {
      expect(countCompleted(todos)).toBe(1);
    });

    it('should return 0 when list is empty', () => {
      expect(countCompleted([])).toBe(0);
    });

    it('should return 0 when no todos are completed', () => {
      const noneDone = todos.map((t) => ({ ...t, completed: false }));
      expect(countCompleted(noneDone)).toBe(0);
    });

    it('should return the total count when all todos are completed', () => {
      const allDone = todos.map((t) => ({ ...t, completed: true }));
      expect(countCompleted(allDone)).toBe(3);
    });
  });
});
