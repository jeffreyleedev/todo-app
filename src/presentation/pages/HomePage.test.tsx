import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { HomePage } from './HomePage';
import { useTodoStore } from '@/application';

describe('HomePage', () => {
  beforeEach(() => {
    useTodoStore.setState({ todos: [], filter: 'all' });
  });

  it('should render the page heading', () => {
    render(<HomePage />);
    expect(
      screen.getByRole('heading', { name: /My Tasks/i })
    ).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    render(<HomePage />);
    expect(screen.getByText(/Stay focused and organized/i)).toBeInTheDocument();
  });

  it('should render the AddTodo input', () => {
    render(<HomePage />);
    expect(
      screen.getByPlaceholderText(/Add a new task.../i)
    ).toBeInTheDocument();
  });

  it('should render the empty TodoList state', () => {
    render(<HomePage />);
    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  it('should render TodoStats with items left text', () => {
    render(<HomePage />);
    expect(screen.getByTestId('items-left')).toBeInTheDocument();
  });
});
