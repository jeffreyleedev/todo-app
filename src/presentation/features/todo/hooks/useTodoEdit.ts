import { useState, useReducer, useRef, useEffect, useCallback } from 'react';
import type { Todo } from '@/domain';

type EditState = { text: string; error: string | null };
type EditAction =
  | { type: 'setText'; value: string }
  | { type: 'setError'; error: string }
  | { type: 'clearError' };

function editReducer(state: EditState, action: EditAction): EditState {
  switch (action.type) {
    case 'setText':
      return { text: action.value, error: null };
    case 'setError':
      return { ...state, error: action.error };
    case 'clearError':
      return { ...state, error: null };
  }
}

export function useTodoEdit(
  todo: Todo,
  updateTodoText: (id: string, text: string) => boolean
) {
  const [isEditing, setIsEditing] = useState(false);
  const [{ text: editText, error: editError }, dispatch] = useReducer(
    editReducer,
    {
      text: '',
      error: null,
    }
  );
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
    dispatch({ type: 'setText', value: todo.text });
    setIsEditing(true);
  }, [todo.completed, todo.text]);

  const saveEdit = useCallback(() => {
    const trimmed = editText.trim();
    if (!trimmed) {
      dispatch({ type: 'setError', error: 'Task text cannot be empty.' });
      return;
    }
    if (updateTodoText(todo.id, trimmed)) {
      setIsEditing(false);
      dispatch({ type: 'clearError' });
    } else {
      dispatch({
        type: 'setError',
        error: 'A task with this text already exists.',
      });
    }
  }, [editText, todo.id, updateTodoText]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    dispatch({ type: 'clearError' });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') saveEdit();
      else if (e.key === 'Escape') cancelEdit();
    },
    [saveEdit, cancelEdit]
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
  };
}
