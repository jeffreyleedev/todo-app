import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { TodoList } from './TodoList';
import { createTodo } from '@/domain';
import { useTodoStore } from '@/application';

describe('TodoList', () => {
  beforeEach(() => {
    useTodoStore.setState({ todos: [], filter: 'all' });
  });

  it('should render empty state message when no todos', () => {
    render(<TodoList />);
    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  it('should render todos from store', () => {
    const todos = [createTodo('Todo 1'), createTodo('Todo 2')];
    useTodoStore.setState({ todos });

    render(<TodoList />);
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('should filter todos correctly', () => {
    const todos = [
      { ...createTodo('Active'), completed: false },
      { ...createTodo('Completed'), completed: true },
    ];
    useTodoStore.setState({ todos, filter: 'active' });

    render(<TodoList />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.queryByText('Completed')).not.toBeInTheDocument();
  });

  it('should show category empty state when todos exist but filter hides all', () => {
    const todos = [{ ...createTodo('Completed'), completed: true }];
    useTodoStore.setState({ todos, filter: 'active' });

    render(<TodoList />);
    expect(screen.getByText(/No tasks in this category/i)).toBeInTheDocument();
  });

  it('should render active todos before completed todos with a separator', () => {
    const todos = [
      { ...createTodo('Completed 1'), completed: true },
      { ...createTodo('Active 1'), completed: false },
      { ...createTodo('Completed 2'), completed: true },
    ];
    useTodoStore.setState({ todos, filter: 'all' });

    render(<TodoList />);
    const items = screen.getAllByTestId('todo-item');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Active 1');
    expect(items[1]).toHaveTextContent('Completed 1');
    expect(items[2]).toHaveTextContent('Completed 2');
    expect(screen.getByTestId('todo-separator')).toBeInTheDocument();
  });

  it('should not render separator when there are no completed todos', () => {
    const todos = [
      { ...createTodo('Active 1'), completed: false },
      { ...createTodo('Active 2'), completed: false },
    ];
    useTodoStore.setState({ todos, filter: 'all' });

    render(<TodoList />);
    expect(screen.queryByTestId('todo-separator')).not.toBeInTheDocument();
  });

  it('should render separator when there are both active and completed todos', () => {
    const todos = [
      { ...createTodo('Active'), completed: false },
      { ...createTodo('Completed'), completed: true },
    ];
    useTodoStore.setState({ todos, filter: 'all' });

    render(<TodoList />);
    expect(screen.getByTestId('todo-separator')).toBeInTheDocument();
  });

  it('should show only completed todos when filter is completed', () => {
    const todos = [
      { ...createTodo('Active'), completed: false },
      { ...createTodo('Completed'), completed: true },
    ];
    useTodoStore.setState({ todos, filter: 'completed' });

    render(<TodoList />);
    expect(screen.queryByText('Active')).not.toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});
