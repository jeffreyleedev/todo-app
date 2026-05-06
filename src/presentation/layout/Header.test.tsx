import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('should render the TASKS branding', () => {
    render(<Header />);
    expect(screen.getByText('TASKS')).toBeInTheDocument();
  });

  it('should render within a header element', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
