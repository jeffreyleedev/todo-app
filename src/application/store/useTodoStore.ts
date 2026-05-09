import { create } from 'zustand';
import {
  type Todo,
  type Filter,
  type Priority,
  createTodo,
  toggleTodo,
  validateTodoText,
  isDuplicateTodo,
} from '@/domain';
import { LocalStorageTodoRepository } from '@/infrastructure';

const repository = new LocalStorageTodoRepository();

interface TodoState {
  todos: Todo[];
  filter: Filter;

  // Actions
  addTodo: (text: string) => boolean;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setPriority: (id: string, priority?: Priority) => void;
  updateTodoText: (id: string, text: string) => boolean;
  clearCompleted: () => void;
  deleteAll: () => void;
  setFilter: (filter: Filter) => void;
  reorderTodos: (activeId: string, overId: string) => void;
}

export const useTodoStore = create<TodoState>((set, get) => {
  const saveTodos = (newTodos: Todo[]) => {
    set({ todos: newTodos });
    repository.save(newTodos);
  };

  return {
    todos: repository.load(),
    filter: 'all',

    addTodo: (text: string) => {
      try {
        validateTodoText(text);
      } catch {
        return false;
      }
      const todos = get().todos;
      if (isDuplicateTodo(text, todos)) return false;
      saveTodos([...todos, createTodo(text)]);
      return true;
    },

    toggleTodo: (id: string) => {
      saveTodos(get().todos.map((t) => (t.id === id ? toggleTodo(t) : t)));
    },

    deleteTodo: (id: string) => {
      saveTodos(get().todos.filter((t) => t.id !== id));
    },

    setPriority: (id: string, priority?: Priority) => {
      saveTodos(get().todos.map((t) => (t.id === id ? { ...t, priority } : t)));
    },

    updateTodoText: (id: string, text: string) => {
      try {
        validateTodoText(text);
      } catch {
        return false;
      }
      const todos = get().todos;
      if (isDuplicateTodo(text, todos, id)) return false;
      saveTodos(todos.map((t) => (t.id === id ? { ...t, text } : t)));
      return true;
    },

    clearCompleted: () => {
      saveTodos(get().todos.filter((t) => !t.completed));
    },

    deleteAll: () => {
      saveTodos([]);
    },

    setFilter: (filter: Filter) => {
      set({ filter });
    },

    reorderTodos: (activeId: string, overId: string) => {
      const { todos } = get();
      if (activeId === overId) return;

      const oldIndex = todos.findIndex((t) => t.id === activeId);
      const newIndex = todos.findIndex((t) => t.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      const newTodos = [...todos];
      const [moved] = newTodos.splice(oldIndex, 1);
      newTodos.splice(newIndex, 0, moved);
      saveTodos(newTodos);
    },
  };
});
