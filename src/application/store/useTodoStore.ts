import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import {
  type Todo,
  type Filter,
  type Priority,
  type TodoRepository,
  createTodo,
  toggleTodo as applyToggle,
  validateTodoText,
  isDuplicateTodo,
  updateTodoById,
} from '@/domain';
import { LocalStorageTodoRepository } from '@/infrastructure';

const repository: TodoRepository = new LocalStorageTodoRepository();

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
      const todos = get().todos;
      if (isDuplicateTodo(text, todos)) return false;
      try {
        saveTodos([...todos, createTodo(text)]);
      } catch {
        return false;
      }
      return true;
    },

    toggleTodo: (id: string) => {
      const todos = get().todos;
      saveTodos(updateTodoById(todos, id, applyToggle));
    },

    deleteTodo: (id: string) => {
      const todos = get().todos;
      saveTodos(todos.filter((t) => t.id !== id));
    },

    setPriority: (id: string, priority?: Priority) => {
      const todos = get().todos;
      saveTodos(updateTodoById(todos, id, (t) => ({ ...t, priority })));
    },

    // Returns false for two distinct reasons: validation failure or duplicate.
    // TodoEditInput enforces maxLength and saveEdit guards the empty case, so
    // by the time this is called from useTodoEdit the only reachable false is
    // a duplicate. If new failure modes are added, update saveEdit accordingly.
    updateTodoText: (id: string, text: string) => {
      try {
        validateTodoText(text);
      } catch {
        return false;
      }
      const todos = get().todos;
      if (isDuplicateTodo(text, todos, id)) return false;
      saveTodos(updateTodoById(todos, id, (t) => ({ ...t, text })));
      return true;
    },

    clearCompleted: () => {
      const todos = get().todos;
      saveTodos(todos.filter((t) => !t.completed));
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

      saveTodos(arrayMove(todos, oldIndex, newIndex));
    },
  };
});
