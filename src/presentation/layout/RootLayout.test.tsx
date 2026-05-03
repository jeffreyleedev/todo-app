import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '@/presentation/shared/context/ThemeContext';
import { RootLayout } from './RootLayout';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

describe('RootLayout', () => {
  it('should render children content', () => {
    renderWithTheme(
      <RootLayout>
        <div data-testid="child-content">Hello</div>
      </RootLayout>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should render the Header', () => {
    renderWithTheme(
      <RootLayout>
        <div>Content</div>
      </RootLayout>
    );
    expect(screen.getByText('FocusTask')).toBeInTheDocument();
  });

  it('should render main element', () => {
    renderWithTheme(
      <RootLayout>
        <div>Content</div>
      </RootLayout>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
