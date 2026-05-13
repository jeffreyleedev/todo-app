import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { editReducer, useTodoEdit } from './useTodoEdit';
import type { Todo } from '@/domain/entities/Todo';

const INITIAL_STATE = { isEditing: false, text: '', error: null };

describe('editReducer', () => {
  it('initial state: isEditing false, text empty, error null', () => {
    expect(INITIAL_STATE).toStrictEqual({
      isEditing: false,
      text: '',
      error: null,
    });
  });

  it('start: sets isEditing true, seeds text, clears any prior error', () => {
    const state = editReducer(
      { ...INITIAL_STATE, error: 'prior error' },
      { type: 'start', text: 'Buy milk' }
    );
    expect(state).toEqual({ isEditing: true, text: 'Buy milk', error: null });
  });

  it('setText: updates text and clears error', () => {
    const state = editReducer(
      { isEditing: true, text: 'old', error: 'some error' },
      { type: 'setText', value: 'new text' }
    );
    expect(state).toEqual({ isEditing: true, text: 'new text', error: null });
  });

  it('setError: sets error while preserving other fields', () => {
    const state = editReducer(
      { isEditing: true, text: 'hello', error: null },
      { type: 'setError', error: 'Already exists.' }
    );
    expect(state).toEqual({
      isEditing: true,
      text: 'hello',
      error: 'Already exists.',
    });
  });

  it('saveSuccess: clears isEditing and error, preserves text', () => {
    const state = editReducer(
      { isEditing: true, text: 'hello', error: 'oops' },
      { type: 'saveSuccess' }
    );
    expect(state).toEqual({ isEditing: false, text: 'hello', error: null });
  });

  it('cancel: clears isEditing and error, preserves text', () => {
    const state = editReducer(
      { isEditing: true, text: 'hello', error: 'oops' },
      { type: 'cancel' }
    );
    expect(state).toEqual({ isEditing: false, text: 'hello', error: null });
  });
});

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 'todo-1',
  text: 'Buy milk',
  completed: false,
  createdAt: 1000,
  ...overrides,
});

describe('useTodoEdit', () => {
  it('startEdit on incomplete todo sets isEditing and editText', () => {
    const todo = makeTodo({ text: 'Buy milk' });
    const { result } = renderHook(() =>
      useTodoEdit(todo, vi.fn().mockReturnValue(true))
    );

    act(() => result.current.startEdit());

    expect(result.current.isEditing).toBe(true);
    expect(result.current.editText).toBe('Buy milk');
  });

  it('startEdit on completed todo does not set isEditing', () => {
    const todo = makeTodo({ completed: true });
    const { result } = renderHook(() => useTodoEdit(todo, vi.fn()));

    act(() => result.current.startEdit());

    expect(result.current.isEditing).toBe(false);
  });

  it('saveEdit with valid text calls updateTodoText and clears isEditing', () => {
    const todo = makeTodo();
    const updateTodoText = vi.fn().mockReturnValue(true);
    const { result } = renderHook(() => useTodoEdit(todo, updateTodoText));

    act(() => result.current.startEdit());
    act(() => result.current.setEditText('New text'));
    act(() => result.current.saveEdit());

    expect(updateTodoText).toHaveBeenCalledWith('todo-1', 'New text');
    expect(result.current.isEditing).toBe(false);
  });

  it('saveEdit with whitespace-only text does not call updateTodoText', () => {
    const todo = makeTodo();
    const updateTodoText = vi.fn();
    const { result } = renderHook(() => useTodoEdit(todo, updateTodoText));

    act(() => result.current.startEdit());
    act(() => result.current.setEditText('   '));
    act(() => result.current.saveEdit());

    expect(updateTodoText).not.toHaveBeenCalled();
    expect(result.current.isEditing).toBe(true);
  });

  it('saveEdit when updateTodoText returns false keeps isEditing true', () => {
    const todo = makeTodo();
    const updateTodoText = vi.fn().mockReturnValue(false);
    const { result } = renderHook(() => useTodoEdit(todo, updateTodoText));

    act(() => result.current.startEdit());
    act(() => result.current.setEditText('Some text'));
    act(() => result.current.saveEdit());

    expect(result.current.isEditing).toBe(true);
  });

  it('cancelEdit sets isEditing to false without calling updateTodoText', () => {
    const todo = makeTodo();
    const updateTodoText = vi.fn();
    const { result } = renderHook(() => useTodoEdit(todo, updateTodoText));

    act(() => result.current.startEdit());
    act(() => result.current.cancelEdit());

    expect(result.current.isEditing).toBe(false);
    expect(updateTodoText).not.toHaveBeenCalled();
  });

  it('handleKeyDown Enter delegates to saveEdit', () => {
    const todo = makeTodo();
    const updateTodoText = vi.fn().mockReturnValue(true);
    const { result } = renderHook(() => useTodoEdit(todo, updateTodoText));

    act(() => result.current.startEdit());
    act(() => result.current.setEditText('Edited'));
    act(() =>
      result.current.handleKeyDown({ key: 'Enter' } as React.KeyboardEvent)
    );

    expect(updateTodoText).toHaveBeenCalledWith('todo-1', 'Edited');
    expect(result.current.isEditing).toBe(false);
  });

  it('handleKeyDown Escape delegates to cancelEdit', () => {
    const todo = makeTodo();
    const updateTodoText = vi.fn();
    const { result } = renderHook(() => useTodoEdit(todo, updateTodoText));

    act(() => result.current.startEdit());
    act(() =>
      result.current.handleKeyDown({ key: 'Escape' } as React.KeyboardEvent)
    );

    expect(result.current.isEditing).toBe(false);
    expect(updateTodoText).not.toHaveBeenCalled();
  });

  it('handleKeyDown other key causes no state change', () => {
    const todo = makeTodo();
    const updateTodoText = vi.fn();
    const { result } = renderHook(() => useTodoEdit(todo, updateTodoText));

    act(() => result.current.startEdit());
    act(() =>
      result.current.handleKeyDown({ key: 'Tab' } as React.KeyboardEvent)
    );

    expect(result.current.isEditing).toBe(true);
    expect(updateTodoText).not.toHaveBeenCalled();
  });

  it('handleTextKeyDown Enter enters edit mode', () => {
    const todo = makeTodo({ text: 'Buy milk' });
    const { result } = renderHook(() => useTodoEdit(todo, vi.fn()));

    act(() =>
      result.current.handleTextKeyDown({ key: 'Enter' } as React.KeyboardEvent)
    );

    expect(result.current.isEditing).toBe(true);
    expect(result.current.editText).toBe('Buy milk');
  });

  it('handleTextKeyDown F2 enters edit mode', () => {
    const todo = makeTodo({ text: 'Buy milk' });
    const { result } = renderHook(() => useTodoEdit(todo, vi.fn()));

    act(() =>
      result.current.handleTextKeyDown({ key: 'F2' } as React.KeyboardEvent)
    );

    expect(result.current.isEditing).toBe(true);
    expect(result.current.editText).toBe('Buy milk');
  });

  it('handleTextKeyDown other key does not enter edit mode', () => {
    const todo = makeTodo();
    const { result } = renderHook(() => useTodoEdit(todo, vi.fn()));

    act(() =>
      result.current.handleTextKeyDown({ key: 'Tab' } as React.KeyboardEvent)
    );

    expect(result.current.isEditing).toBe(false);
  });
});
