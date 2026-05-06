import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RootLayout } from './RootLayout';

describe('RootLayout', () => {
  it('should render children content', () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Hello</div>
      </RootLayout>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should render the Header', () => {
    render(
      <RootLayout>
        <div>Content</div>
      </RootLayout>
    );
    expect(screen.getByText('TASKS')).toBeInTheDocument();
  });

  it('should render main element', () => {
    render(
      <RootLayout>
        <div>Content</div>
      </RootLayout>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
