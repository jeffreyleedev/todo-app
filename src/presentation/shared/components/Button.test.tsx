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
    expect(button).toHaveClass('bg-mint', 'text-black');
  });

  it('should apply secondary variant classes', () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-slate', 'text-text-muted');
  });

  it('should apply ghost variant classes', () => {
    render(<Button variant="ghost">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-text-primary');
  });

  it('should apply error variant classes', () => {
    render(<Button variant="error">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-ultraviolet', 'text-white');
  });

  it('should apply tertiary variant classes', () => {
    render(<Button variant="tertiary">Outlined</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'bg-transparent',
      'text-mint',
      'border',
      'border-mint',
      'rounded-40'
    );
  });

  it('should apply focus-visible classes on primary variant', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus-visible:bg-focus-cyan');
  });

  it('should apply sm size classes', () => {
    render(<Button size="sm">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-12', 'py-5', 'rounded-20');
  });

  it('should apply md size classes by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-24', 'py-10', 'rounded-24');
  });

  it('should apply lg size classes', () => {
    render(<Button size="lg">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-32', 'py-14', 'rounded-30');
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
    expect(button).toHaveClass('bg-mint');
  });
});
