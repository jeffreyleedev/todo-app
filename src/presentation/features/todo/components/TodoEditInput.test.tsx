import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TodoEditInput } from './TodoEditInput';
import { TODO_MAX_LENGTH } from '@/domain';

const str = (n: number) => 'a'.repeat(n);

const defaultProps = {
  editText: 'hello',
  editInputRef: { current: null } as React.RefObject<HTMLInputElement | null>,
  onChange: vi.fn(),
  onKeyDown: vi.fn(),
  onBlur: vi.fn(),
};

describe('TodoEditInput', () => {
  it('renders the input with provided text', () => {
    render(<TodoEditInput {...defaultProps} />);
    expect(screen.getByTestId('todo-edit-input')).toHaveValue('hello');
  });

  it('char counter shows correct count and max', () => {
    render(<TodoEditInput {...defaultProps} editText="hello" />);
    expect(screen.getByTestId('todo-edit-char-counter')).toHaveTextContent(
      `5 / ${TODO_MAX_LENGTH}`
    );
  });

  it('char counter is secondary color below warning threshold', () => {
    render(<TodoEditInput {...defaultProps} editText="hello" />);
    const counter = screen.getByTestId('todo-edit-char-counter');
    expect(counter).toHaveClass('text-text-secondary');
    expect(counter).not.toHaveClass('text-accent-yellow');
    expect(counter).not.toHaveClass('text-ultraviolet');
  });

  it('char counter is yellow near the limit', () => {
    render(<TodoEditInput {...defaultProps} editText={str(90)} />);
    const counter = screen.getByTestId('todo-edit-char-counter');
    expect(counter).toHaveClass('text-accent-yellow');
    expect(counter).not.toHaveClass('text-ultraviolet');
  });

  it('char counter is ultraviolet at the limit', () => {
    render(<TodoEditInput {...defaultProps} editText={str(TODO_MAX_LENGTH)} />);
    const counter = screen.getByTestId('todo-edit-char-counter');
    expect(counter).toHaveClass('text-ultraviolet');
    expect(counter).not.toHaveClass('text-accent-yellow');
  });

  it('calls onChange with the new value when typing', () => {
    const onChange = vi.fn();
    render(<TodoEditInput {...defaultProps} onChange={onChange} />);
    fireEvent.change(screen.getByTestId('todo-edit-input'), {
      target: { value: 'new text' },
    });
    expect(onChange).toHaveBeenCalledWith('new text');
  });

  it('calls onKeyDown on key press', () => {
    const onKeyDown = vi.fn();
    render(<TodoEditInput {...defaultProps} onKeyDown={onKeyDown} />);
    fireEvent.keyDown(screen.getByTestId('todo-edit-input'), { key: 'Enter' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur when input loses focus', () => {
    const onBlur = vi.fn();
    render(<TodoEditInput {...defaultProps} onBlur={onBlur} />);
    fireEvent.blur(screen.getByTestId('todo-edit-input'));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('shows errorMessage when provided', () => {
    render(
      <TodoEditInput
        {...defaultProps}
        errorMessage="A task with this text already exists."
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'A task with this text already exists.'
    );
  });

  it('does not render alert when errorMessage is not provided', () => {
    render(<TodoEditInput {...defaultProps} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
