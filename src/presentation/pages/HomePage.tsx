import { AddTodo } from '../features/todo/components/AddTodo';
import { TodoList } from '../features/todo/components/TodoList';
import { TodoStats } from '../features/todo/components/TodoStats';

export function HomePage() {
  return (
    <div className="w-full bg-canvas rounded-24 border border-text-primary p-20 sm:p-24 md:p-32 flex flex-col gap-20 sm:gap-24">
      <div className="flex flex-col gap-8 text-center">
        <h1 className="font-headline-lg text-text-primary">My Tasks</h1>
        <p className="font-body text-text-secondary">
          Stay focused and organized.
        </p>
      </div>

      <AddTodo />
      <TodoList />
      <TodoStats />
    </div>
  );
}
