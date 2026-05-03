import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { TodoStats } from './TodoStats';
import { createTodo } from '@/domain';
import { useTodoStore } from '@/application';

describe('TodoStats', () => {
  beforeEach(() => {
    useTodoStore.setState({ todos: [], filter: 'all' });
  });

  it('should render active count', () => {
    const todos = [createTodo('Todo 1'), createTodo('Todo 2')];
    useTodoStore.setState({ todos });

    render(<TodoStats />);
    expect(screen.getByTestId('items-left')).toHaveTextContent('2 items left');
  });

  it('should use singular form for 1 item', () => {
    const todos = [createTodo('Todo 1')];
    useTodoStore.setState({ todos });

    render(<TodoStats />);
    expect(screen.getByTestId('items-left')).toHaveTextContent('1 item left');
  });

  it('should use plural form for 0 items', () => {
    useTodoStore.setState({ todos: [] });

    render(<TodoStats />);
    expect(screen.getByTestId('items-left')).toHaveTextContent('0 items left');
  });

  it('should clear completed todos after confirmation', () => {
    const active = createTodo('Active');
    const completed = { ...createTodo('Completed'), completed: true };
    useTodoStore.setState({ todos: [active, completed] });

    render(<TodoStats />);
    fireEvent.click(screen.getByRole('button', { name: /Clear completed/i }));

    const confirmButton = screen.getByTestId('confirm-dialog-confirm');
    fireEvent.click(confirmButton);

    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(useTodoStore.getState().todos[0].text).toBe('Active');
  });

  it('should not clear completed todos when cancelled', () => {
    const active = createTodo('Active');
    const completed = { ...createTodo('Completed'), completed: true };
    useTodoStore.setState({ todos: [active, completed], filter: 'all' });

    render(<TodoStats />);
    fireEvent.click(screen.getByRole('button', { name: /Clear completed/i }));

    const cancelButton = screen.getByTestId('confirm-dialog-cancel');
    fireEvent.click(cancelButton);

    expect(useTodoStore.getState().todos).toHaveLength(2);
  });

  it('should not render Clear completed when filter is active', () => {
    const completed = { ...createTodo('Completed'), completed: true };
    useTodoStore.setState({ todos: [completed], filter: 'active' });

    render(<TodoStats />);
    expect(
      screen.queryByRole('button', { name: /Clear completed/i })
    ).not.toBeInTheDocument();
  });

  it('should not render Clear completed when no completed todos exist', () => {
    useTodoStore.setState({
      todos: [createTodo('Active todo')],
      filter: 'all',
    });

    render(<TodoStats />);
    expect(
      screen.queryByRole('button', { name: /Clear completed/i })
    ).not.toBeInTheDocument();
  });

  it('should render Delete all when todos exist', () => {
    useTodoStore.setState({ todos: [createTodo('Task')] });

    render(<TodoStats />);
    expect(
      screen.getByRole('button', { name: /Delete all/i })
    ).toBeInTheDocument();
  });

  it('should not render Delete all when no todos exist', () => {
    render(<TodoStats />);
    expect(
      screen.queryByRole('button', { name: /Delete all/i })
    ).not.toBeInTheDocument();
  });

  it('should not render Delete all when filter is completed', () => {
    useTodoStore.setState({
      todos: [createTodo('Task')],
      filter: 'completed',
    });

    render(<TodoStats />);
    expect(
      screen.queryByRole('button', { name: /Delete all/i })
    ).not.toBeInTheDocument();
  });

  it('should delete all todos after confirmation', () => {
    useTodoStore.setState({
      todos: [
        createTodo('Task 1'),
        createTodo('Task 2'),
        createTodo('Task 3'),
      ],
    });

    render(<TodoStats />);
    fireEvent.click(screen.getByRole('button', { name: /Delete all/i }));

    const confirmButton = screen.getByTestId('confirm-dialog-confirm');
    fireEvent.click(confirmButton);

    expect(useTodoStore.getState().todos).toHaveLength(0);
  });

  it('should not delete todos when cancelled', () => {
    useTodoStore.setState({
      todos: [createTodo('Task 1'), createTodo('Task 2')],
    });

    render(<TodoStats />);
    fireEvent.click(screen.getByRole('button', { name: /Delete all/i }));

    const cancelButton = screen.getByTestId('confirm-dialog-cancel');
    fireEvent.click(cancelButton);

    expect(useTodoStore.getState().todos).toHaveLength(2);
  });
});
