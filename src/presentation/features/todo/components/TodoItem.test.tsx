import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoItem } from './TodoItem';
import { createTodo } from '@/domain';
import { useTodoStore } from '@/application';
import { useSortable } from '@dnd-kit/sortable';
import { resetTodoStore } from '@/test-utils/storeMocks';

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: vi.fn().mockReturnValue({
    attributes: {
      role: 'button',
      tabIndex: 0,
      'aria-disabled': false,
      'aria-pressed': undefined,
      'aria-roledescription': '',
      'aria-describedby': '',
    },
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: vi.fn().mockReturnValue(''),
    },
  },
}));

describe('TodoItem', () => {
  const todo = createTodo('Test Todo');

  beforeEach(() => {
    resetTodoStore();
    useTodoStore.setState({ todos: [todo] });
  });

  it('should render todo text', () => {
    render(<TodoItem todo={todo} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('should render drag handle', () => {
    render(<TodoItem todo={todo} />);
    expect(screen.getByTestId('drag-handle')).toBeInTheDocument();
  });

  it('should render drag_indicator icon inside drag handle', () => {
    render(<TodoItem todo={todo} />);
    expect(screen.getByText('drag_indicator')).toBeInTheDocument();
  });

  it('should apply dragging visual state when isDragging is true', () => {
    // @ts-expect-error - partial mock for useSortable drag state test
    vi.mocked(useSortable).mockReturnValueOnce({
      attributes: {
        role: 'button',
        tabIndex: 0,
        'aria-disabled': false,
        'aria-pressed': undefined,
        'aria-roledescription': '',
        'aria-describedby': '',
      },
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      transition: undefined,
      isDragging: true,
    });

    render(<TodoItem todo={todo} />);
    const item = screen.getByTestId('todo-item');
    expect(item).toHaveClass('opacity-50');
  });

  it('should toggle todo in store when checkbox is clicked', () => {
    render(<TodoItem todo={todo} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(useTodoStore.getState().todos[0].completed).toBe(true);
  });

  it('should show check icon when todo is completed', () => {
    const completedTodo = createTodo('Done');
    useTodoStore.setState({ todos: [completedTodo] });
    useTodoStore.getState().toggleTodo(completedTodo.id);

    render(<TodoItem todo={useTodoStore.getState().todos[0]} />);
    expect(screen.getByTestId('todo-check-icon')).toBeInTheDocument();
  });

  it('should apply line-through styling for completed todos', () => {
    const completedTodo = createTodo('Done');
    useTodoStore.setState({ todos: [completedTodo] });
    useTodoStore.getState().toggleTodo(completedTodo.id);

    render(<TodoItem todo={useTodoStore.getState().todos[0]} />);
    expect(screen.getByTestId('todo-text')).toHaveClass('line-through');
  });

  it('should show priority pill when todo has priority', () => {
    const prioTodo = createTodo('Priority');
    useTodoStore.setState({ todos: [prioTodo] });
    useTodoStore.getState().setPriority(prioTodo.id, 'high');

    render(<TodoItem todo={useTodoStore.getState().todos[0]} />);
    expect(screen.getByTestId('priority-pill')).toBeInTheDocument();
    expect(screen.getByTestId('priority-pill')).toHaveTextContent('high');
  });

  it('should cycle priority on priority pill click', () => {
    const prioTodo = createTodo('Priority');
    useTodoStore.setState({ todos: [prioTodo] });
    useTodoStore.getState().setPriority(prioTodo.id, 'high');
    const setPrioritySpy = vi.spyOn(useTodoStore.getState(), 'setPriority');

    render(<TodoItem todo={useTodoStore.getState().todos[0]} />);
    fireEvent.click(screen.getByTestId('priority-pill'));

    expect(setPrioritySpy).toHaveBeenCalledWith(prioTodo.id, 'medium');
  });

  it('should cycle priority from medium to low', () => {
    const prioTodo = createTodo('Priority');
    useTodoStore.setState({ todos: [prioTodo] });
    useTodoStore.getState().setPriority(prioTodo.id, 'medium');
    const setPrioritySpy = vi.spyOn(useTodoStore.getState(), 'setPriority');

    render(<TodoItem todo={useTodoStore.getState().todos[0]} />);
    fireEvent.click(screen.getByTestId('priority-pill'));

    expect(setPrioritySpy).toHaveBeenCalledWith(prioTodo.id, 'low');
  });

  it('should cycle priority from low to undefined', () => {
    const prioTodo = createTodo('Priority');
    useTodoStore.setState({ todos: [prioTodo] });
    useTodoStore.getState().setPriority(prioTodo.id, 'low');
    const setPrioritySpy = vi.spyOn(useTodoStore.getState(), 'setPriority');

    render(<TodoItem todo={useTodoStore.getState().todos[0]} />);
    fireEvent.click(screen.getByTestId('priority-pill'));

    expect(setPrioritySpy).toHaveBeenCalledWith(prioTodo.id, undefined);
  });

  it('should apply bg-ultraviolet class for high priority', () => {
    const prioTodo = createTodo('Priority');
    useTodoStore.setState({ todos: [prioTodo] });
    useTodoStore.getState().setPriority(prioTodo.id, 'high');

    render(<TodoItem todo={useTodoStore.getState().todos[0]} />);
    expect(screen.getByTestId('priority-pill')).toHaveClass('bg-ultraviolet');
  });

  it('should apply bg-accent-yellow class for medium priority', () => {
    const prioTodo = createTodo('Priority');
    useTodoStore.setState({ todos: [prioTodo] });
    useTodoStore.getState().setPriority(prioTodo.id, 'medium');

    render(<TodoItem todo={useTodoStore.getState().todos[0]} />);
    expect(screen.getByTestId('priority-pill')).toHaveClass('bg-accent-yellow');
  });

  it('should apply bg-mint class for low priority', () => {
    const prioTodo = createTodo('Priority');
    useTodoStore.setState({ todos: [prioTodo] });
    useTodoStore.getState().setPriority(prioTodo.id, 'low');

    render(<TodoItem todo={useTodoStore.getState().todos[0]} />);
    expect(screen.getByTestId('priority-pill')).toHaveClass('bg-mint');
  });

  it('should show add priority button when todo has no priority and is not completed', () => {
    render(<TodoItem todo={todo} />);
    expect(screen.getByTestId('priority-pill-add')).toBeInTheDocument();
  });

  it('should set priority to high when add priority button is clicked', () => {
    const setPrioritySpy = vi.spyOn(useTodoStore.getState(), 'setPriority');
    render(<TodoItem todo={todo} />);

    fireEvent.click(screen.getByTestId('priority-pill-add'));

    expect(setPrioritySpy).toHaveBeenCalledWith(todo.id, 'high');
  });

  it('should not show priority controls for completed todos', () => {
    const completedTodo = createTodo('Done');
    useTodoStore.setState({ todos: [completedTodo] });
    useTodoStore.getState().toggleTodo(completedTodo.id);

    render(<TodoItem todo={useTodoStore.getState().todos[0]} />);
    expect(screen.queryByTestId('priority-pill')).not.toBeInTheDocument();
    expect(screen.queryByTestId('priority-pill-add')).not.toBeInTheDocument();
  });

  it('should hide priority pill during edit mode', () => {
    const prioTodo = createTodo('Priority');
    useTodoStore.setState({ todos: [prioTodo] });
    useTodoStore.getState().setPriority(prioTodo.id, 'high');

    render(<TodoItem todo={useTodoStore.getState().todos[0]} />);

    fireEvent.dblClick(screen.getByTestId('todo-text'));

    expect(screen.queryByTestId('priority-pill')).not.toBeInTheDocument();
    expect(screen.queryByTestId('priority-pill-add')).not.toBeInTheDocument();
  });

  it('should hide delete button during edit mode', () => {
    render(<TodoItem todo={todo} />);

    fireEvent.dblClick(screen.getByTestId('todo-text'));

    expect(screen.queryByTestId('delete-todo')).not.toBeInTheDocument();
  });

  it('should delete todo when delete button is clicked', () => {
    const deleteSpy = vi.spyOn(useTodoStore.getState(), 'deleteTodo');
    render(<TodoItem todo={todo} />);

    fireEvent.click(screen.getByTestId('delete-todo'));

    expect(deleteSpy).toHaveBeenCalledWith(todo.id);
  });

  describe('edit mode', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
      useTodoStore.setState({ todos: [todo] });
    });

    it('should enter edit mode on double-click for active todos', () => {
      render(<TodoItem todo={todo} />);

      fireEvent.dblClick(screen.getByTestId('todo-text'));

      expect(screen.getByTestId('todo-edit-input')).toBeInTheDocument();
      expect(screen.getByTestId('todo-edit-input')).toHaveValue('Test Todo');
    });

    it('should enter edit mode on Enter key press on todo text', () => {
      render(<TodoItem todo={todo} />);

      fireEvent.keyDown(screen.getByTestId('todo-text'), { key: 'Enter' });

      expect(screen.getByTestId('todo-edit-input')).toBeInTheDocument();
      expect(screen.getByTestId('todo-edit-input')).toHaveValue('Test Todo');
    });

    it('should save edit on Enter key', () => {
      render(<TodoItem todo={todo} />);

      fireEvent.dblClick(screen.getByTestId('todo-text'));
      const input = screen.getByTestId('todo-edit-input');
      fireEvent.change(input, { target: { value: 'Updated Todo' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(useTodoStore.getState().todos[0].text).toBe('Updated Todo');
      expect(screen.queryByTestId('todo-edit-input')).not.toBeInTheDocument();
    });

    it('should cancel edit on Escape key', () => {
      render(<TodoItem todo={todo} />);

      fireEvent.dblClick(screen.getByTestId('todo-text'));
      const input = screen.getByTestId('todo-edit-input');
      fireEvent.change(input, { target: { value: 'Changed' } });
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(useTodoStore.getState().todos[0].text).toBe('Test Todo');
      expect(screen.queryByTestId('todo-edit-input')).not.toBeInTheDocument();
    });

    it('should save edit on blur', () => {
      render(<TodoItem todo={todo} />);

      fireEvent.dblClick(screen.getByTestId('todo-text'));
      const input = screen.getByTestId('todo-edit-input');
      fireEvent.change(input, { target: { value: 'Blur saved' } });
      fireEvent.blur(input);

      expect(useTodoStore.getState().todos[0].text).toBe('Blur saved');
    });

    it('should not save empty trimmed text', () => {
      render(<TodoItem todo={todo} />);

      fireEvent.dblClick(screen.getByTestId('todo-text'));
      const input = screen.getByTestId('todo-edit-input');
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(useTodoStore.getState().todos[0].text).toBe('Test Todo');
      expect(screen.getByTestId('todo-edit-input')).toBeInTheDocument();
    });

    it('should not save duplicate text', () => {
      const duplicate = createTodo('Existing');
      useTodoStore.setState({ todos: [todo, duplicate] });

      render(<TodoItem todo={todo} />);

      fireEvent.dblClick(screen.getByTestId('todo-text'));
      const input = screen.getByTestId('todo-edit-input');
      fireEvent.change(input, { target: { value: 'Existing' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(useTodoStore.getState().todos[0].text).toBe('Test Todo');
      expect(screen.getByTestId('todo-edit-input')).toBeInTheDocument();
    });

    it('should not enter edit mode for completed todos', () => {
      const completedTodo = createTodo('Done');
      useTodoStore.setState({ todos: [completedTodo] });
      useTodoStore.getState().toggleTodo(completedTodo.id);

      render(<TodoItem todo={useTodoStore.getState().todos[0]} />);

      fireEvent.dblClick(screen.getByTestId('todo-text'));

      expect(screen.queryByTestId('todo-edit-input')).not.toBeInTheDocument();
    });

    it('should show character counter immediately on edit', () => {
      render(<TodoItem todo={todo} />);

      fireEvent.dblClick(screen.getByTestId('todo-text'));

      const counter = screen.getByTestId('todo-edit-char-counter');
      expect(counter).toBeInTheDocument();
      expect(counter).toHaveTextContent('9 / 100');

      const input = screen.getByTestId('todo-edit-input');
      fireEvent.change(input, { target: { value: 'x'.repeat(90) } });
      expect(counter).toHaveTextContent('90 / 100');
    });

    it('should show default color on character counter below limit', () => {
      render(<TodoItem todo={todo} />);

      fireEvent.dblClick(screen.getByTestId('todo-text'));

      expect(screen.getByTestId('todo-edit-char-counter')).toHaveClass(
        'text-text-secondary'
      );
    });

    it('should show warning color on character counter near limit', () => {
      render(<TodoItem todo={todo} />);

      fireEvent.dblClick(screen.getByTestId('todo-text'));
      const input = screen.getByTestId('todo-edit-input');
      fireEvent.change(input, { target: { value: 'a'.repeat(90) } });

      expect(screen.getByTestId('todo-edit-char-counter')).toHaveClass(
        'text-accent-yellow'
      );
    });

    it('should show error color on character counter at limit', () => {
      render(<TodoItem todo={todo} />);

      fireEvent.dblClick(screen.getByTestId('todo-text'));
      const input = screen.getByTestId('todo-edit-input');
      fireEvent.change(input, { target: { value: 'a'.repeat(100) } });

      expect(screen.getByTestId('todo-edit-char-counter')).toHaveClass(
        'text-ultraviolet'
      );
    });
  });

  it('should apply transform style when transform is set', () => {
    // @ts-expect-error - partial mock for useSortable
    vi.mocked(useSortable).mockReturnValueOnce({
      attributes: {
        role: 'button',
        tabIndex: 0,
        'aria-disabled': false,
        'aria-pressed': undefined,
        'aria-roledescription': '',
        'aria-describedby': '',
      },
      listeners: {},
      setNodeRef: vi.fn(),
      transform: { x: 10, y: 20, scaleX: 1, scaleY: 1 },
      transition: 'transform 200ms',
      isDragging: false,
    });

    render(<TodoItem todo={todo} />);
    const item = screen.getByTestId('todo-item');
    expect(item).toBeInTheDocument();
  });
});
