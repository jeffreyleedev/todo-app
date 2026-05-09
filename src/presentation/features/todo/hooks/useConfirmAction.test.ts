import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useConfirmAction } from './useConfirmAction';

describe('useConfirmAction', () => {
  it('initial state has confirmAction as null', () => {
    const { result } = renderHook(() => useConfirmAction(vi.fn(), vi.fn()));
    expect(result.current.confirmAction).toBeNull();
  });

  it('setConfirmAction updates to clear-completed', () => {
    const { result } = renderHook(() => useConfirmAction(vi.fn(), vi.fn()));

    act(() => result.current.setConfirmAction('clear-completed'));

    expect(result.current.confirmAction).toBe('clear-completed');
  });

  it('setConfirmAction updates to delete-all', () => {
    const { result } = renderHook(() => useConfirmAction(vi.fn(), vi.fn()));

    act(() => result.current.setConfirmAction('delete-all'));

    expect(result.current.confirmAction).toBe('delete-all');
  });

  it('handleConfirm when clear-completed calls clearCompleted and resets to null', () => {
    const clearCompleted = vi.fn();
    const deleteAll = vi.fn();
    const { result } = renderHook(() =>
      useConfirmAction(clearCompleted, deleteAll)
    );

    act(() => result.current.setConfirmAction('clear-completed'));
    act(() => result.current.handleConfirm());

    expect(clearCompleted).toHaveBeenCalledOnce();
    expect(deleteAll).not.toHaveBeenCalled();
    expect(result.current.confirmAction).toBeNull();
  });

  it('handleConfirm when delete-all calls deleteAll and resets to null', () => {
    const clearCompleted = vi.fn();
    const deleteAll = vi.fn();
    const { result } = renderHook(() =>
      useConfirmAction(clearCompleted, deleteAll)
    );

    act(() => result.current.setConfirmAction('delete-all'));
    act(() => result.current.handleConfirm());

    expect(deleteAll).toHaveBeenCalledOnce();
    expect(clearCompleted).not.toHaveBeenCalled();
    expect(result.current.confirmAction).toBeNull();
  });

  it('handleConfirm when confirmAction is null calls neither action', () => {
    const clearCompleted = vi.fn();
    const deleteAll = vi.fn();
    const { result } = renderHook(() =>
      useConfirmAction(clearCompleted, deleteAll)
    );

    act(() => result.current.handleConfirm());

    expect(clearCompleted).not.toHaveBeenCalled();
    expect(deleteAll).not.toHaveBeenCalled();
  });

  it('setConfirmAction(null) after setting resets correctly', () => {
    const { result } = renderHook(() => useConfirmAction(vi.fn(), vi.fn()));

    act(() => result.current.setConfirmAction('delete-all'));
    act(() => result.current.setConfirmAction(null));

    expect(result.current.confirmAction).toBeNull();
  });
});
