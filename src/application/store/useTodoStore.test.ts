import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTodoStore } from './useTodoStore';
import { TODO_MAX_LENGTH, filterTodos } from '@/domain';

const { mockSave, mockLoad } = vi.hoisted(() => ({
  mockSave: vi.fn(),
  mockLoad: vi.fn().mockReturnValue([]),
}));

vi.mock('@/infrastructure', () => ({
  LocalStorageTodoRepository: vi.fn().mockImplementation(function () {
    return {
      load: mockLoad,
      save: mockSave,
    };
  }),
}));

describe('useTodoStore', () => {
  beforeEach(() => {
    mockSave.mockClear();
    mockLoad.mockClear();
    mockLoad.mockReturnValue([]);
    useTodoStore.setState({ todos: [], filter: 'all' });
  });

  it('should add a todo', () => {
    useTodoStore.getState().addTodo('New Todo');
    const { todos } = useTodoStore.getState();
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe('New Todo');
    expect(mockSave).toHaveBeenCalledWith(todos);
  });

  it('should not add a duplicate todo', () => {
    useTodoStore.getState().addTodo('Duplicate');
    mockSave.mockClear();
    useTodoStore.getState().addTodo('Duplicate');
    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('should not add a duplicate todo (case-insensitive)', () => {
    useTodoStore.getState().addTodo('Duplicate');
    mockSave.mockClear();
    useTodoStore.getState().addTodo('duplicate');
    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('should set priority on a todo', () => {
    useTodoStore.getState().addTodo('Test');
    mockSave.mockClear();
    const id = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().setPriority(id, 'high');
    expect(useTodoStore.getState().todos[0].priority).toBe('high');
    expect(mockSave).toHaveBeenCalledWith(useTodoStore.getState().todos);
  });

  it('should clear priority on a todo', () => {
    useTodoStore.getState().addTodo('Test');
    const id = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().setPriority(id, 'high');
    useTodoStore.getState().setPriority(id, undefined);
    expect(useTodoStore.getState().todos[0].priority).toBeUndefined();
  });

  it('should be a no-op when setting priority on a non-existent todo', () => {
    useTodoStore.getState().addTodo('Test');
    useTodoStore.getState().setPriority('non-existent-id', 'high');
    expect(useTodoStore.getState().todos[0].priority).toBeUndefined();
  });

  it('should toggle a todo', () => {
    useTodoStore.getState().addTodo('Test');
    mockSave.mockClear();
    const id = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().toggleTodo(id);
    expect(useTodoStore.getState().todos[0].completed).toBe(true);
    expect(mockSave).toHaveBeenCalledWith(useTodoStore.getState().todos);
  });

  it('should be a no-op when toggling a non-existent todo', () => {
    useTodoStore.getState().addTodo('Test');
    mockSave.mockClear();
    useTodoStore.getState().toggleTodo('non-existent-id');
    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(useTodoStore.getState().todos[0].completed).toBe(false);
  });

  it('should delete a todo', () => {
    useTodoStore.getState().addTodo('Test');
    mockSave.mockClear();
    const id = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().deleteTodo(id);
    expect(useTodoStore.getState().todos).toHaveLength(0);
    expect(mockSave).toHaveBeenCalledWith([]);
  });

  it('should be a no-op when deleting a non-existent todo', () => {
    useTodoStore.getState().addTodo('Test');
    mockSave.mockClear();
    useTodoStore.getState().deleteTodo('non-existent-id');
    expect(useTodoStore.getState().todos).toHaveLength(1);
  });

  it('should set filter', () => {
    useTodoStore.getState().setFilter('active');
    expect(useTodoStore.getState().filter).toBe('active');
  });

  it('should clear completed todos', () => {
    useTodoStore.getState().addTodo('Todo 1');
    useTodoStore.getState().addTodo('Todo 2');
    const id = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().toggleTodo(id); // Complete first one

    mockSave.mockClear();
    useTodoStore.getState().clearCompleted();
    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(useTodoStore.getState().todos[0].completed).toBe(false);
    expect(mockSave).toHaveBeenCalledWith(useTodoStore.getState().todos);
  });

  it('should delete all todos', () => {
    useTodoStore.getState().addTodo('Todo 1');
    useTodoStore.getState().addTodo('Todo 2');
    useTodoStore.getState().addTodo('Todo 3');

    mockSave.mockClear();
    useTodoStore.getState().deleteAll();
    expect(useTodoStore.getState().todos).toHaveLength(0);
    expect(mockSave).toHaveBeenCalledWith([]);
  });

  it('should be a no-op when deleting all on an empty list', () => {
    useTodoStore.getState().deleteAll();
    expect(useTodoStore.getState().todos).toHaveLength(0);
  });

  describe('filterTodos (via domain)', () => {
    beforeEach(() => {
      useTodoStore.getState().addTodo('Active Todo');
      useTodoStore.getState().addTodo('Completed Todo');
      const id = useTodoStore.getState().todos[1].id;
      useTodoStore.getState().toggleTodo(id);
    });

    it('should return all todos when filter is all', () => {
      const { todos, filter } = useTodoStore.getState();
      const filtered = filterTodos(todos, filter);
      expect(filtered).toHaveLength(2);
    });

    it('should return only active todos when filter is active', () => {
      useTodoStore.getState().setFilter('active');
      const { todos, filter } = useTodoStore.getState();
      const filtered = filterTodos(todos, filter);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].text).toBe('Active Todo');
    });

    it('should return only completed todos when filter is completed', () => {
      useTodoStore.getState().setFilter('completed');
      const { todos, filter } = useTodoStore.getState();
      const filtered = filterTodos(todos, filter);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].text).toBe('Completed Todo');
    });
  });

  describe('reorderTodos', () => {
    it('should reorder todos when activeId and overId are different', () => {
      useTodoStore.getState().addTodo('Todo 1');
      useTodoStore.getState().addTodo('Todo 2');
      useTodoStore.getState().addTodo('Todo 3');

      mockSave.mockClear();
      const [id1, , id3] = useTodoStore.getState().todos.map((t) => t.id);
      useTodoStore.getState().reorderTodos(id1, id3);

      const texts = useTodoStore.getState().todos.map((t) => t.text);
      expect(texts).toEqual(['Todo 2', 'Todo 3', 'Todo 1']);
      expect(mockSave).toHaveBeenCalledWith(useTodoStore.getState().todos);
    });

    it('should not change order when activeId equals overId', () => {
      useTodoStore.getState().addTodo('Todo 1');
      useTodoStore.getState().addTodo('Todo 2');

      const id = useTodoStore.getState().todos[0].id;
      useTodoStore.getState().reorderTodos(id, id);

      const texts = useTodoStore.getState().todos.map((t) => t.text);
      expect(texts).toEqual(['Todo 1', 'Todo 2']);
    });

    it('should not change order when ids are not found', () => {
      useTodoStore.getState().addTodo('Todo 1');
      useTodoStore.getState().addTodo('Todo 2');

      useTodoStore.getState().reorderTodos('nonexistent', 'also-nonexistent');

      const texts = useTodoStore.getState().todos.map((t) => t.text);
      expect(texts).toEqual(['Todo 1', 'Todo 2']);
    });

    it('should not change order when only one id exists', () => {
      useTodoStore.getState().addTodo('Todo 1');
      useTodoStore.getState().addTodo('Todo 2');

      const [id1] = useTodoStore.getState().todos.map((t) => t.id);
      useTodoStore.getState().reorderTodos(id1, 'nonexistent');

      const texts = useTodoStore.getState().todos.map((t) => t.text);
      expect(texts).toEqual(['Todo 1', 'Todo 2']);
    });
  });

  describe('updateTodoText', () => {
    it('should update the text of an existing todo', () => {
      useTodoStore.getState().addTodo('Old text');
      const id = useTodoStore.getState().todos[0].id;
      mockSave.mockClear();

      useTodoStore.getState().updateTodoText(id, 'New text');

      expect(useTodoStore.getState().todos[0].text).toBe('New text');
      expect(mockSave).toHaveBeenCalledWith(useTodoStore.getState().todos);
    });

    it('should be a no-op when the id does not exist', () => {
      useTodoStore.getState().addTodo('Test');
      mockSave.mockClear();

      useTodoStore.getState().updateTodoText('nonexistent', 'New text');

      expect(useTodoStore.getState().todos[0].text).toBe('Test');
      expect(mockSave).toHaveBeenCalledWith(useTodoStore.getState().todos);
    });

    it('should persist text change via repository', () => {
      useTodoStore.getState().addTodo('Persist me');
      const id = useTodoStore.getState().todos[0].id;
      mockSave.mockClear();

      useTodoStore.getState().updateTodoText(id, 'Updated');

      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledWith(useTodoStore.getState().todos);
    });

    it('should return false when text exceeds TODO_MAX_LENGTH', () => {
      useTodoStore.getState().addTodo('Test');
      const id = useTodoStore.getState().todos[0].id;

      const result = useTodoStore
        .getState()
        .updateTodoText(id, 'a'.repeat(TODO_MAX_LENGTH + 1));
      expect(result).toBe(false);
    });
  });

  describe('initial hydration', () => {
    it('should use initialState with non-empty todos when set manually', () => {
      const mockTodos = [
        {
          id: 'hydrated-1',
          text: 'Persisted todo',
          completed: false,
          createdAt: Date.now(),
        },
      ];
      useTodoStore.setState({ todos: mockTodos });

      const { todos } = useTodoStore.getState();
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe('Persisted todo');
    });
  });
});
