import { describe, it, expect } from 'vitest';
import { filterTodos, partitionTodos } from './todoUtils';
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

  describe('partitionTodos', () => {
    it('should split todos into activeTodos and completedTodos', () => {
      const { activeTodos, completedTodos } = partitionTodos(todos);
      expect(activeTodos).toHaveLength(2);
      expect(completedTodos).toHaveLength(1);
      expect(activeTodos.every((t) => !t.completed)).toBe(true);
      expect(completedTodos.every((t) => t.completed)).toBe(true);
    });

    it('should return empty arrays when list is empty', () => {
      const { activeTodos, completedTodos } = partitionTodos([]);
      expect(activeTodos).toHaveLength(0);
      expect(completedTodos).toHaveLength(0);
    });

    it('should return all as activeTodos when none are completed', () => {
      const active = [createTodo('A'), createTodo('B')];
      const { activeTodos, completedTodos } = partitionTodos(active);
      expect(activeTodos).toHaveLength(2);
      expect(completedTodos).toHaveLength(0);
    });

    it('should return all as completedTodos when all are completed', () => {
      const completed = todos.filter((t) => t.completed);
      const { activeTodos, completedTodos } = partitionTodos(completed);
      expect(activeTodos).toHaveLength(0);
      expect(completedTodos).toHaveLength(1);
    });
  });
});
