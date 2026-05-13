import { useReducer, useRef, useEffect, useCallback } from 'react';
import type { Todo } from '@/domain';

type EditState = { isEditing: boolean; text: string; error: string | null };
type EditAction =
  | { type: 'start'; text: string }
  | { type: 'setText'; value: string }
  | { type: 'setError'; error: string }
  | { type: 'saveSuccess' }
  | { type: 'cancel' };

export function editReducer(state: EditState, action: EditAction): EditState {
  switch (action.type) {
    case 'start':
      return { isEditing: true, text: action.text, error: null };
    case 'setText':
      return { ...state, text: action.value, error: null };
    case 'setError':
      return { ...state, error: action.error };
    case 'saveSuccess':
      return { ...state, isEditing: false, error: null };
    case 'cancel':
      return { ...state, isEditing: false, error: null };
  }
}

export function useTodoEdit(
  todo: Todo,
  updateTodoText: (id: string, text: string) => boolean
) {
  const [{ isEditing, text: editText, error: editError }, dispatch] =
    useReducer(editReducer, { isEditing: false, text: '', error: null });
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const setEditText = useCallback(
    (value: string) => dispatch({ type: 'setText', value }),
    []
  );

  const startEdit = useCallback(() => {
    if (todo.completed) return;
    dispatch({ type: 'start', text: todo.text });
  }, [todo.completed, todo.text]);

  const saveEdit = useCallback(() => {
    const trimmed = editText.trim();
    if (!trimmed) {
      dispatch({ type: 'setError', error: 'Task text cannot be empty.' });
      return;
    }
    if (updateTodoText(todo.id, trimmed)) {
      dispatch({ type: 'saveSuccess' });
    } else {
      dispatch({
        type: 'setError',
        error: 'A task with this text already exists.',
      });
    }
  }, [editText, todo.id, updateTodoText]);

  const cancelEdit = useCallback(() => {
    dispatch({ type: 'cancel' });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') saveEdit();
      else if (e.key === 'Escape') cancelEdit();
    },
    [saveEdit, cancelEdit]
  );

  const handleTextKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'F2') startEdit();
    },
    [startEdit]
  );

  return {
    isEditing,
    editText,
    setEditText,
    editError,
    editInputRef,
    startEdit,
    saveEdit,
    cancelEdit,
    handleKeyDown,
    handleTextKeyDown,
  };
}
