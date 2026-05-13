import { describe, it, expect } from 'vitest';
import { updateTodoById, partitionFilteredTodos } from './todoUtils';
import { createTodo } from '../entities/Todo';

describe('todoUtils', () => {
  const todos = [
    { ...createTodo('Todo 1'), completed: false },
    { ...createTodo('Todo 2'), completed: true },
    { ...createTodo('Todo 3'), completed: false },
  ];

  describe('updateTodoById', () => {
    it('updates the todo matching the given id', () => {
      const result = updateTodoById(todos, todos[0].id, (t) => ({
        ...t,
        completed: true,
      }));
      expect(result[0].completed).toBe(true);
      expect(result[1]).toBe(todos[1]);
      expect(result[2]).toBe(todos[2]);
    });

    it('leaves non-matching todos untouched', () => {
      const result = updateTodoById(todos, todos[1].id, (t) => ({
        ...t,
        text: 'Changed',
      }));
      expect(result[0]).toBe(todos[0]);
      expect(result[1].text).toBe('Changed');
      expect(result[2]).toBe(todos[2]);
    });

    it('returns array unchanged when id does not match any todo', () => {
      const result = updateTodoById(todos, 'nonexistent', (t) => ({
        ...t,
        completed: true,
      }));
      result.forEach((t, i) => expect(t).toBe(todos[i]));
    });
  });

  describe('partitionFilteredTodos', () => {
    it('"all" splits todos into active and completed', () => {
      const { activeTodos, completedTodos } = partitionFilteredTodos(
        todos,
        'all'
      );
      expect(activeTodos).toHaveLength(2);
      expect(completedTodos).toHaveLength(1);
    });

    it('"active" omits completed todos', () => {
      const { activeTodos, completedTodos } = partitionFilteredTodos(
        todos,
        'active'
      );
      expect(activeTodos).toHaveLength(2);
      expect(completedTodos).toHaveLength(0);
    });

    it('"completed" omits active todos', () => {
      const { activeTodos, completedTodos } = partitionFilteredTodos(
        todos,
        'completed'
      );
      expect(activeTodos).toHaveLength(0);
      expect(completedTodos).toHaveLength(1);
    });

    it('returns empty arrays for empty input', () => {
      const { activeTodos, completedTodos } = partitionFilteredTodos([], 'all');
      expect(activeTodos).toHaveLength(0);
      expect(completedTodos).toHaveLength(0);
    });

    it('all-active list: all go to activeTodos for "all" filter', () => {
      const allActive = todos.filter((t) => !t.completed);
      const { activeTodos, completedTodos } = partitionFilteredTodos(
        allActive,
        'all'
      );
      expect(activeTodos).toHaveLength(2);
      expect(completedTodos).toHaveLength(0);
    });

    it('all-completed list: all go to completedTodos for "all" filter', () => {
      const allCompleted = todos.filter((t) => t.completed);
      const { activeTodos, completedTodos } = partitionFilteredTodos(
        allCompleted,
        'all'
      );
      expect(activeTodos).toHaveLength(0);
      expect(completedTodos).toHaveLength(1);
    });
  });
});
