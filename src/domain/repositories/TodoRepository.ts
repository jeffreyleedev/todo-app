import type { Todo } from '../entities/Todo';

export interface TodoRepository {
  load(): Todo[];
  save(todos: Todo[]): void;
}
