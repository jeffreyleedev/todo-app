import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('should render children text', () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole('button', { name: /Click me/i })
    ).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply primary variant classes by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary', 'text-on-primary');
  });

  it('should apply secondary variant classes', () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary/10', 'text-primary');
  });

  it('should apply ghost variant classes', () => {
    render(<Button variant="ghost">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-on-surface-variant');
  });

  it('should apply error variant classes', () => {
    render(<Button variant="error">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-on-surface-variant');
  });

  it('should apply sm size classes', () => {
    render(<Button size="sm">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'px-md',
      'py-xs',
      'text-label-md',
      'rounded-full'
    );
  });

  it('should apply md size classes by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-md', 'py-sm', 'rounded-lg');
  });

  it('should apply lg size classes', () => {
    render(<Button size="lg">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-lg', 'py-md', 'rounded-xl');
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is passed', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should forward type="submit" prop', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should forward aria-label prop', () => {
    render(<Button aria-label="custom-label">Click me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'custom-label'
    );
  });

  it('should concatenate custom className', () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-primary');
  });
});
