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
    expect(screen.getByRole('button', { name: /ALL/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ACTIVE/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /COMPLETED/i })
    ).toBeInTheDocument();
  });

  it('should highlight the active filter', () => {
    render(<TodoFilter />);
    const allButton = screen.getByRole('button', { name: /ALL/i });
    expect(allButton).toHaveClass('bg-mint');
  });

  it('should update store filter when a button is clicked', () => {
    render(<TodoFilter />);
    const activeButton = screen.getByRole('button', { name: /ACTIVE/i });

    fireEvent.click(activeButton);

    expect(useTodoStore.getState().filter).toBe('active');
  });

  it('should highlight the Active button after clicking it', () => {
    render(<TodoFilter />);
    const allButton = screen.getByRole('button', { name: /ALL/i });
    const activeButton = screen.getByRole('button', { name: /ACTIVE/i });

    fireEvent.click(activeButton);

    expect(allButton).not.toHaveClass('bg-mint');
    expect(activeButton).toHaveClass('bg-mint');
  });

  it('should highlight the Completed button after clicking it', () => {
    render(<TodoFilter />);
    const allButton = screen.getByRole('button', { name: /ALL/i });
    const completedButton = screen.getByRole('button', { name: /COMPLETED/i });

    fireEvent.click(completedButton);

    expect(allButton).not.toHaveClass('bg-mint');
    expect(completedButton).toHaveClass('bg-mint');
  });

  it('should switch highlight from Completed back to All', () => {
    useTodoStore.setState({ filter: 'completed' });
    render(<TodoFilter />);
    const allButton = screen.getByRole('button', { name: /ALL/i });
    const completedButton = screen.getByRole('button', { name: /COMPLETED/i });

    expect(completedButton).toHaveClass('bg-mint');
    fireEvent.click(allButton);

    expect(useTodoStore.getState().filter).toBe('all');
    expect(allButton).toHaveClass('bg-mint');
    expect(completedButton).not.toHaveClass('bg-mint');
  });

  it('should apply text-text-secondary class to inactive buttons', () => {
    useTodoStore.setState({ filter: 'all' });
    render(<TodoFilter />);
    const activeButton = screen.getByRole('button', { name: /ACTIVE/i });
    const completedButton = screen.getByRole('button', { name: /COMPLETED/i });

    expect(activeButton).toHaveClass('text-text-secondary');
    expect(completedButton).toHaveClass('text-text-secondary');
  });
});
