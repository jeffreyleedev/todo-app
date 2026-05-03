import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeProvider } from '@/presentation/shared/context/ThemeContext';
import { Header } from './Header';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('should render the FocusTask branding', () => {
    renderWithTheme(<Header />);
    expect(screen.getByText('FocusTask')).toBeInTheDocument();
  });

  it('should render the task icon', () => {
    renderWithTheme(<Header />);
    expect(screen.getByText('task_alt')).toBeInTheDocument();
  });

  it('should render within a header element', () => {
    renderWithTheme(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should render the theme toggle button', () => {
    renderWithTheme(<Header />);
    expect(
      screen.getByRole('button', { name: 'Switch to dark mode' })
    ).toBeInTheDocument();
  });

  it('should update the theme toggle label after clicking it', () => {
    renderWithTheme(<Header />);
    const toggle = screen.getByRole('button', { name: 'Switch to dark mode' });

    fireEvent.click(toggle);

    expect(
      screen.getByRole('button', { name: 'Switch to light mode' })
    ).toBeInTheDocument();
  });
});
