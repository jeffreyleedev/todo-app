import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('light');
    localStorage.clear();
  });

  it('should render the TASKS branding', () => {
    render(<Header />);
    expect(screen.getByText('TASKS')).toBeInTheDocument();
  });

  it('should render within a header element', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should render theme toggle button with light_mode icon when theme is dark', () => {
    render(<Header />);
    const toggle = screen.getByRole('button', { name: /switch to light/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveTextContent('light_mode');
  });

  it('should render theme toggle button with dark_mode icon when .light class is present', () => {
    document.documentElement.classList.add('light');
    render(<Header />);
    const toggle = screen.getByRole('button', { name: /switch to dark/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveTextContent('dark_mode');
  });

  it('should have accessible aria-label on the theme toggle button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /switch to/i })).toHaveAttribute(
      'aria-label'
    );
  });
});
