import { AddTodo } from '../features/todo/components/AddTodo';
import { TodoList } from '../features/todo/components/TodoList';
import { TodoStats } from '../features/todo/components/TodoStats';

export function HomePage() {
  return (
    <div className="w-full bg-surface-container-lowest rounded-xl shadow-card p-5 sm:p-6 md:p-lg flex flex-col gap-5 sm:gap-6 md:gap-lg border border-surface-variant/30">
      <div className="flex flex-col gap-base text-center">
        <h1 className="text-2xl sm:text-[28px] md:font-headline-lg leading-tight font-semibold tracking-tight text-on-surface">
          My Tasks
        </h1>
        <p className="font-body-md text-on-surface-variant">
          Stay focused and organized.
        </p>
      </div>

      <AddTodo />
      <TodoList />
      <TodoStats />
    </div>
  );
}
