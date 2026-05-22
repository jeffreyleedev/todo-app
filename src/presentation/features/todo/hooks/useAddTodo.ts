import { useState, useMemo, useCallback } from 'react';
import type { Todo } from '@/domain';
import { TODO_MAX_LENGTH, isDuplicateTodo } from '@/domain';

export function useAddTodo(todos: Todo[], addTodo: (text: string) => boolean) {
  const [text, setText] = useState('');

  const trimmed = text.trim();
  const isDuplicate = useMemo(
    () => isDuplicateTodo(trimmed, todos),
    [trimmed, todos]
  );
  const canSubmit =
    !!trimmed && trimmed.length <= TODO_MAX_LENGTH && !isDuplicate;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (canSubmit) {
        addTodo(trimmed);
        setText('');
      }
    },
    [canSubmit, trimmed, addTodo]
  );

  return {
    text,
    setText,
    showDuplicateError: isDuplicate && !!trimmed,
    canSubmit,
    handleSubmit,
  };
}
