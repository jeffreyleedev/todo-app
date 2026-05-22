import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAddTodo } from './useAddTodo';
import type { Todo } from '@/domain';
import { TODO_MAX_LENGTH } from '@/domain';

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 'todo-1',
  text: 'Buy milk',
  completed: false,
  createdAt: 1000,
  ...overrides,
});

describe('useAddTodo', () => {
  it('initial state: text empty, showDuplicateError false, canSubmit false', () => {
    const { result } = renderHook(() => useAddTodo([], vi.fn()));
    expect(result.current.text).toBe('');
    expect(result.current.showDuplicateError).toBe(false);
    expect(result.current.canSubmit).toBe(false);
  });

  it('setText updates text', () => {
    const { result } = renderHook(() => useAddTodo([], vi.fn()));
    act(() => result.current.setText('Buy eggs'));
    expect(result.current.text).toBe('Buy eggs');
  });

  it('canSubmit is true for valid non-duplicate text within limit', () => {
    const { result } = renderHook(() => useAddTodo([], vi.fn()));
    act(() => result.current.setText('Buy eggs'));
    expect(result.current.canSubmit).toBe(true);
  });

  it('canSubmit is false when text is whitespace-only', () => {
    const { result } = renderHook(() => useAddTodo([], vi.fn()));
    act(() => result.current.setText('   '));
    expect(result.current.canSubmit).toBe(false);
  });

  it('canSubmit is false when text exceeds TODO_MAX_LENGTH', () => {
    const { result } = renderHook(() => useAddTodo([], vi.fn()));
    act(() => result.current.setText('a'.repeat(TODO_MAX_LENGTH + 1)));
    expect(result.current.canSubmit).toBe(false);
  });

  it('showDuplicateError true when text matches an active todo (case-insensitive)', () => {
    const todos = [makeTodo({ text: 'Buy milk', completed: false })];
    const { result } = renderHook(() => useAddTodo(todos, vi.fn()));
    act(() => result.current.setText('BUY MILK'));
    expect(result.current.showDuplicateError).toBe(true);
    expect(result.current.canSubmit).toBe(false);
  });

  it('showDuplicateError false when matching todo is completed', () => {
    const todos = [makeTodo({ text: 'Buy milk', completed: true })];
    const { result } = renderHook(() => useAddTodo(todos, vi.fn()));
    act(() => result.current.setText('Buy milk'));
    expect(result.current.showDuplicateError).toBe(false);
    expect(result.current.canSubmit).toBe(true);
  });

  it('showDuplicateError is false when input is empty', () => {
    const todos = [makeTodo({ text: 'Buy milk', completed: false })];
    const { result } = renderHook(() => useAddTodo(todos, vi.fn()));
    expect(result.current.showDuplicateError).toBe(false);
  });

  it('showDuplicateError is false when input is whitespace-only', () => {
    const { result } = renderHook(() => useAddTodo([], vi.fn()));
    act(() => result.current.setText('   '));
    expect(result.current.showDuplicateError).toBe(false);
  });

  it('showDuplicateError is true when input is a non-empty duplicate', () => {
    const todos = [makeTodo({ text: 'Buy milk', completed: false })];
    const { result } = renderHook(() => useAddTodo(todos, vi.fn()));
    act(() => result.current.setText('Buy milk'));
    expect(result.current.showDuplicateError).toBe(true);
  });

  it('showDuplicateError is false when input is unique', () => {
    const todos = [makeTodo({ text: 'Buy milk', completed: false })];
    const { result } = renderHook(() => useAddTodo(todos, vi.fn()));
    act(() => result.current.setText('Buy eggs'));
    expect(result.current.showDuplicateError).toBe(false);
  });

  it('handleSubmit calls addTodo with trimmed text and resets text when canSubmit', () => {
    const addTodo = vi.fn().mockReturnValue(true);
    const { result } = renderHook(() => useAddTodo([], addTodo));
    act(() => result.current.setText('  Buy eggs  '));
    act(() =>
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent)
    );
    expect(addTodo).toHaveBeenCalledWith('Buy eggs');
    expect(result.current.text).toBe('');
  });

  it('handleSubmit does not call addTodo when canSubmit is false', () => {
    const addTodo = vi.fn();
    const { result } = renderHook(() => useAddTodo([], addTodo));
    act(() =>
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent)
    );
    expect(addTodo).not.toHaveBeenCalled();
  });
});
