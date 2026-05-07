import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PriorityButton } from './PriorityButton';
import { cyclePriority } from '@/domain';

describe('PriorityButton', () => {
  describe('when priority is defined', () => {
    it('renders a button with data-testid="priority-pill" and displays the priority text', () => {
      render(<PriorityButton priority="high" onSetPriority={vi.fn()} />);
      const pill = screen.getByTestId('priority-pill');
      expect(pill).toBeInTheDocument();
      expect(pill).toHaveTextContent('high');
    });

    it('calls onSetPriority(cyclePriority(priority)) when clicked', () => {
      const onSetPriority = vi.fn();
      render(<PriorityButton priority="high" onSetPriority={onSetPriority} />);
      fireEvent.click(screen.getByTestId('priority-pill'));
      expect(onSetPriority).toHaveBeenCalledWith(cyclePriority('high'));
    });

    it('applies the correct color class per priority', () => {
      const { rerender } = render(
        <PriorityButton priority="high" onSetPriority={vi.fn()} />
      );
      expect(screen.getByTestId('priority-pill')).toHaveClass('bg-ultraviolet');

      rerender(<PriorityButton priority="medium" onSetPriority={vi.fn()} />);
      expect(screen.getByTestId('priority-pill')).toHaveClass(
        'bg-accent-yellow'
      );

      rerender(<PriorityButton priority="low" onSetPriority={vi.fn()} />);
      expect(screen.getByTestId('priority-pill')).toHaveClass('bg-mint');
    });
  });

  describe('when priority is undefined', () => {
    it('renders desktop add button with text "+PRIORITY"', () => {
      render(<PriorityButton priority={undefined} onSetPriority={vi.fn()} />);
      const btn = screen.getByTestId('priority-pill-add');
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveTextContent('+PRIORITY');
    });

    it('renders mobile add button', () => {
      render(<PriorityButton priority={undefined} onSetPriority={vi.fn()} />);
      expect(
        screen.getByTestId('priority-pill-add-mobile')
      ).toBeInTheDocument();
    });

    it('calls onSetPriority("high") when desktop add button is clicked', () => {
      const onSetPriority = vi.fn();
      render(
        <PriorityButton priority={undefined} onSetPriority={onSetPriority} />
      );
      fireEvent.click(screen.getByTestId('priority-pill-add'));
      expect(onSetPriority).toHaveBeenCalledWith('high');
    });

    it('calls onSetPriority("high") when mobile add button is clicked', () => {
      const onSetPriority = vi.fn();
      render(
        <PriorityButton priority={undefined} onSetPriority={onSetPriority} />
      );
      fireEvent.click(screen.getByTestId('priority-pill-add-mobile'));
      expect(onSetPriority).toHaveBeenCalledWith('high');
    });
  });
});
