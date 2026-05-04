import { create } from 'zustand';
import {
  type Todo,
  type Filter,
  type Priority,
  createTodo,
  toggleTodo,
  filterTodos,
  countActive,
} from '@/domain';
import { LocalStorageTodoRepository } from '@/infrastructure';

const repository = new LocalStorageTodoRepository();

interface TodoState {
  todos: Todo[];
  filter: Filter;

  // Actions
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setPriority: (id: string, priority?: Priority) => void;
  updateTodoText: (id: string, text: string) => void;
  clearCompleted: () => void;
  deleteAll: () => void;
  setFilter: (filter: Filter) => void;
  reorderTodos: (activeId: string, overId: string) => void;

  // Selectors (derived state)
  getFilteredTodos: () => Todo[];
  getActiveCount: () => number;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: repository.load(),
  filter: 'all',

  addTodo: (text: string) => {
    const newTodo = createTodo(text);
    const newTodos = [...get().todos, newTodo];
    set({ todos: newTodos });
    repository.save(newTodos);
  },

  toggleTodo: (id: string) => {
    const newTodos = get().todos.map((t) => (t.id === id ? toggleTodo(t) : t));
    set({ todos: newTodos });
    repository.save(newTodos);
  },

  deleteTodo: (id: string) => {
    const newTodos = get().todos.filter((t) => t.id !== id);
    set({ todos: newTodos });
    repository.save(newTodos);
  },

  setPriority: (id: string, priority?: Priority) => {
    const newTodos = get().todos.map((t) =>
      t.id === id ? { ...t, priority } : t
    );
    set({ todos: newTodos });
    repository.save(newTodos);
  },

  updateTodoText: (id: string, text: string) => {
    const newTodos = get().todos.map((t) => (t.id === id ? { ...t, text } : t));
    set({ todos: newTodos });
    repository.save(newTodos);
  },

  clearCompleted: () => {
    const newTodos = get().todos.filter((t) => !t.completed);
    set({ todos: newTodos });
    repository.save(newTodos);
  },

  deleteAll: () => {
    set({ todos: [] });
    repository.save([]);
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
    set({ todos: newTodos });
    repository.save(newTodos);
  },

  getFilteredTodos: () => {
    const { todos, filter } = get();
    return filterTodos(todos, filter);
  },

  getActiveCount: () => {
    return countActive(get().todos);
  },
}));
