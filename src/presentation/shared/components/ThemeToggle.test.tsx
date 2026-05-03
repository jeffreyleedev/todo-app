import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeProvider } from '@/presentation/shared/context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  // ---------------------------------------------------------------------------
  // Icon rendering
  // ---------------------------------------------------------------------------
  it('should render the "dark_mode" icon when the current theme is light', () => {
    // No stored preference → defaults to light (OS stub returns matches: false)
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByText('dark_mode')).toBeInTheDocument();
  });

  it('should render the "light_mode" icon when the current theme is dark', () => {
    localStorage.setItem('theme-preference', 'dark');
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByText('light_mode')).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Accessible label
  // ---------------------------------------------------------------------------
  it('should have aria-label "Switch to dark mode" in light mode', () => {
    renderWithTheme(<ThemeToggle />);
    expect(
      screen.getByRole('button', { name: 'Switch to dark mode' })
    ).toBeInTheDocument();
  });

  it('should have aria-label "Switch to light mode" in dark mode', () => {
    localStorage.setItem('theme-preference', 'dark');
    renderWithTheme(<ThemeToggle />);
    expect(
      screen.getByRole('button', { name: 'Switch to light mode' })
    ).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Interaction — clicking toggles the theme
  // ---------------------------------------------------------------------------
  it('should switch to dark mode when clicked in light mode', () => {
    renderWithTheme(<ThemeToggle />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Switch to dark mode' })
    );

    // After toggle the icon and label should reflect dark mode
    expect(screen.getByText('light_mode')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Switch to light mode' })
    ).toBeInTheDocument();
  });

  it('should switch to light mode when clicked in dark mode', () => {
    localStorage.setItem('theme-preference', 'dark');
    renderWithTheme(<ThemeToggle />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Switch to light mode' })
    );

    // After toggle the icon and label should reflect light mode
    expect(screen.getByText('dark_mode')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Switch to dark mode' })
    ).toBeInTheDocument();
  });

  it('should apply the .dark class to <html> after toggling to dark', () => {
    renderWithTheme(<ThemeToggle />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Switch to dark mode' })
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should remove the .dark class from <html> after toggling back to light', () => {
    localStorage.setItem('theme-preference', 'dark');
    renderWithTheme(<ThemeToggle />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Switch to light mode' })
    );

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
