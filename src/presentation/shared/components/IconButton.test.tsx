import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('should render the specified icon', () => {
    render(<IconButton icon="check" />);
    expect(screen.getByText('check')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<IconButton icon="check" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply primary variant classes', () => {
    render(<IconButton icon="check" variant="primary" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-mint', 'text-black');
  });

  it('should apply ghost variant classes by default', () => {
    render(<IconButton icon="check" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-text-secondary');
  });

  it('should apply error variant classes', () => {
    render(<IconButton icon="check" variant="error" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-text-secondary');
  });

  it('should apply square shape classes', () => {
    render(<IconButton icon="check" shape="square" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-4');
  });

  it('should apply circle shape classes by default', () => {
    render(<IconButton icon="check" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-half');
  });

  it('should forward data-testid and other props', () => {
    render(<IconButton icon="check" data-testid="delete-todo" />);
    expect(screen.getByTestId('delete-todo')).toBeInTheDocument();
  });

  it('should pass fill prop to inner Icon', () => {
    render(<IconButton icon="check" fill />);
    const icon = screen.getByText('check');
    expect(icon).toHaveStyle("fontVariationSettings: 'FILL' 1");
  });

  it('should pass fill=false to inner Icon by default', () => {
    render(<IconButton icon="check" />);
    const icon = screen.getByText('check');
    expect(icon).toHaveStyle("fontVariationSettings: 'FILL' 0");
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<IconButton icon="check" disabled onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is passed', () => {
    render(<IconButton icon="check" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should forward type="submit" prop', () => {
    render(<IconButton icon="check" type="submit" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should concatenate custom className', () => {
    render(<IconButton icon="check" className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('rounded-half');
  });
});
