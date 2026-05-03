import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { TodoFilter } from './TodoFilter';
import { useTodoStore } from '@/application';

describe('TodoFilter', () => {
  beforeEach(() => {
    useTodoStore.setState({ filter: 'all' });
  });

  it('should render all filter buttons', () => {
    render(<TodoFilter />);
    expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Active/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Completed/i })
    ).toBeInTheDocument();
  });

  it('should highlight the active filter', () => {
    render(<TodoFilter />);
    const allButton = screen.getByRole('button', { name: /All/i });
    expect(allButton).toHaveClass('text-primary');
  });

  it('should update store filter when a button is clicked', () => {
    render(<TodoFilter />);
    const activeButton = screen.getByRole('button', { name: /Active/i });

    fireEvent.click(activeButton);

    expect(useTodoStore.getState().filter).toBe('active');
  });

  it('should highlight the Active button after clicking it', () => {
    render(<TodoFilter />);
    const allButton = screen.getByRole('button', { name: /All/i });
    const activeButton = screen.getByRole('button', { name: /Active/i });

    fireEvent.click(activeButton);

    expect(allButton).not.toHaveClass('text-primary');
    expect(activeButton).toHaveClass('text-primary');
  });

  it('should highlight the Completed button after clicking it', () => {
    render(<TodoFilter />);
    const allButton = screen.getByRole('button', { name: /All/i });
    const completedButton = screen.getByRole('button', { name: /Completed/i });

    fireEvent.click(completedButton);

    expect(allButton).not.toHaveClass('text-primary');
    expect(completedButton).toHaveClass('text-primary');
  });

  it('should switch highlight from Completed back to All', () => {
    useTodoStore.setState({ filter: 'completed' });
    render(<TodoFilter />);
    const allButton = screen.getByRole('button', { name: /All/i });
    const completedButton = screen.getByRole('button', { name: /Completed/i });

    expect(completedButton).toHaveClass('text-primary');
    fireEvent.click(allButton);

    expect(useTodoStore.getState().filter).toBe('all');
    expect(allButton).toHaveClass('text-primary');
    expect(completedButton).not.toHaveClass('text-primary');
  });

  it('should apply text-on-surface-variant class to inactive buttons', () => {
    useTodoStore.setState({ filter: 'all' });
    render(<TodoFilter />);
    const activeButton = screen.getByRole('button', { name: /Active/i });
    const completedButton = screen.getByRole('button', { name: /Completed/i });

    expect(activeButton).toHaveClass('text-on-surface-variant');
    expect(completedButton).toHaveClass('text-on-surface-variant');
  });
});
