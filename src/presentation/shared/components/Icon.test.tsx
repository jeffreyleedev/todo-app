import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('should render the icon name as text content', () => {
    render(<Icon name="check" />);
    expect(screen.getByText('check')).toBeInTheDocument();
  });

  it('should apply fill font variation when fill is true', () => {
    render(<Icon name="check" fill />);
    const icon = screen.getByText('check');
    expect(icon).toHaveStyle("fontVariationSettings: 'FILL' 1");
  });

  it('should not apply fill font variation when fill is false', () => {
    render(<Icon name="check" />);
    const icon = screen.getByText('check');
    expect(icon).toHaveStyle("fontVariationSettings: 'FILL' 0");
  });

  it('should apply custom className', () => {
    render(<Icon name="check" className="text-primary" />);
    const icon = screen.getByText('check');
    expect(icon).toHaveClass('material-symbols-outlined', 'text-primary');
  });

  it('should forward additional props', () => {
    render(<Icon name="check" data-testid="my-icon" />);
    expect(screen.getByTestId('my-icon')).toBeInTheDocument();
  });
});
