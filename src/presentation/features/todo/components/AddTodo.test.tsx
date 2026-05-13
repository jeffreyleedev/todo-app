import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AddTodo } from './AddTodo';
import { useTodoStore } from '@/application';
import { TODO_MAX_LENGTH } from '@/domain';
import { resetTodoStore, createMockTodo } from '@/test-utils/storeMocks';

describe('AddTodo', () => {
  beforeEach(() => {
    resetTodoStore();
  });

  it('should render the input, submit button, and character counter', () => {
    render(<AddTodo />);
    expect(
      screen.getByPlaceholderText(/Add a new task.../i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('add-todo-button')).toBeInTheDocument();
    expect(screen.getByText(`0 / ${TODO_MAX_LENGTH}`)).toBeInTheDocument();
  });

  it('should update input value and character counter on change', () => {
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Buy milk' } });
    expect(input.value).toBe('Buy milk');
    expect(screen.getByText(`8 / ${TODO_MAX_LENGTH}`)).toBeInTheDocument();
  });

  it('should enforce maxLength attribute on input', () => {
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    expect(input.getAttribute('maxLength')).toBe(String(TODO_MAX_LENGTH));
  });

  it('should add todo to store and clear input on submit', () => {
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const button = screen.getByTestId('add-todo-button');

    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.click(button);

    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(useTodoStore.getState().todos[0].text).toBe('Buy milk');
    expect(input.value).toBe('');
  });

  it('should not add todo if input is empty', () => {
    render(<AddTodo />);
    const button = screen.getByTestId('add-todo-button');

    fireEvent.click(button);

    expect(useTodoStore.getState().todos).toHaveLength(0);
  });

  it('should disable button when input is whitespace-only', () => {
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const button = screen.getByTestId('add-todo-button');

    fireEvent.change(input, { target: { value: '     ' } });

    expect(button).toBeDisabled();
    expect(input.value).toBe('     ');
  });

  it('should add todo when form is submitted via Enter key', () => {
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const form = input.closest('form')!;

    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.submit(form);

    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(useTodoStore.getState().todos[0].text).toBe('Buy milk');
    expect(input.value).toBe('');
  });

  it('should trim whitespace from input before adding', () => {
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const button = screen.getByTestId('add-todo-button');

    fireEvent.change(input, { target: { value: '  Buy milk  ' } });
    fireEvent.click(button);

    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(useTodoStore.getState().todos[0].text).toBe('Buy milk');
  });

  it('should show normal color when under 90% of limit', () => {
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const counter = screen.getByTestId('char-counter');

    fireEvent.change(input, { target: { value: 'a'.repeat(50) } });
    expect(counter).toHaveClass('text-text-secondary');
  });

  it('should show normal color at exactly 89 characters', () => {
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const counter = screen.getByTestId('char-counter');

    fireEvent.change(input, { target: { value: 'a'.repeat(89) } });
    expect(counter).toHaveClass('text-text-secondary');
  });

  it('should show warning color when at or above 90% of limit', () => {
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const counter = screen.getByTestId('char-counter');

    fireEvent.change(input, { target: { value: 'a'.repeat(90) } });
    expect(counter).toHaveClass('text-accent-yellow');
  });

  it('should show warning color at exactly 99 characters', () => {
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const counter = screen.getByTestId('char-counter');

    fireEvent.change(input, { target: { value: 'a'.repeat(99) } });
    expect(counter).toHaveClass('text-accent-yellow');
  });

  it('should show error color when at 100% of limit', () => {
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const counter = screen.getByTestId('char-counter');

    fireEvent.change(input, { target: { value: 'a'.repeat(100) } });
    expect(counter).toHaveClass('text-ultraviolet');
  });

  it('should allow adding a todo with exactly max length characters', () => {
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const button = screen.getByTestId('add-todo-button');

    const maxText = 'a'.repeat(TODO_MAX_LENGTH);
    fireEvent.change(input, { target: { value: maxText } });
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(useTodoStore.getState().todos[0].text).toBe(maxText);
  });

  it('should not add todo and disable button when text is a duplicate of active todo', () => {
    useTodoStore.setState({
      todos: [createMockTodo({ text: 'Buy milk' })],
    });
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const button = screen.getByTestId('add-todo-button');

    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(input.value).toBe('Buy milk');
  });

  it('should disable button for case-insensitive duplicate', () => {
    useTodoStore.setState({
      todos: [createMockTodo({ text: 'Buy milk' })],
    });
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const button = screen.getByTestId('add-todo-button');

    fireEvent.change(input, { target: { value: 'BUY MILK' } });

    expect(button).toBeDisabled();
  });

  it('should disable button for trimmed-whitespace duplicate', () => {
    useTodoStore.setState({
      todos: [createMockTodo({ text: 'Buy milk' })],
    });
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const button = screen.getByTestId('add-todo-button');

    fireEvent.change(input, { target: { value: '  Buy milk  ' } });

    expect(button).toBeDisabled();
  });

  it('should enable button when matching todo is completed', () => {
    useTodoStore.setState({
      todos: [createMockTodo({ text: 'Buy milk', completed: true })],
    });
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const button = screen.getByTestId('add-todo-button');

    fireEvent.change(input, { target: { value: 'Buy milk' } });

    expect(button).toBeEnabled();
  });

  it('should show "Already exists." alert when input matches an active todo', () => {
    useTodoStore.setState({
      todos: [createMockTodo({ text: 'Buy milk' })],
    });
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Buy milk' } });

    expect(screen.getByRole('alert')).toHaveTextContent('Already exists.');
  });

  it('should hide "Already exists." alert when input changes to non-duplicate', () => {
    useTodoStore.setState({
      todos: [createMockTodo({ text: 'Buy milk' })],
    });
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Buy milk' } });
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Buy eggs' } });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should not add duplicate via form submit (Enter key guard)', () => {
    useTodoStore.setState({
      todos: [createMockTodo({ text: 'Buy milk' })],
    });
    render(<AddTodo />);
    const input = screen.getByPlaceholderText(
      /Add a new task.../i
    ) as HTMLInputElement;
    const form = input.closest('form')!;

    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.submit(form);

    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(input.value).toBe('Buy milk');
  });
});
