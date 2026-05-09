import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CharCounter } from './CharCounter';
import { TODO_MAX_LENGTH } from '@/domain';
import { CHAR_WARNING_THRESHOLD } from '@/presentation/shared/utils/getCharacterStatus';

const nearLimit = Math.round(TODO_MAX_LENGTH * CHAR_WARNING_THRESHOLD);

describe('CharCounter', () => {
  it('renders length and max', () => {
    render(<CharCounter length={5} max={100} data-testid="cc" />);
    expect(screen.getByTestId('cc')).toHaveTextContent('5 / 100');
  });

  it('applies text-text-secondary when below warning threshold', () => {
    render(
      <CharCounter
        length={nearLimit - 1}
        max={TODO_MAX_LENGTH}
        data-testid="cc"
      />
    );
    expect(screen.getByTestId('cc')).toHaveClass('text-text-secondary');
  });

  it('applies text-accent-yellow when at warning threshold', () => {
    render(
      <CharCounter length={nearLimit} max={TODO_MAX_LENGTH} data-testid="cc" />
    );
    expect(screen.getByTestId('cc')).toHaveClass('text-accent-yellow');
  });

  it('applies text-ultraviolet when at limit', () => {
    render(
      <CharCounter
        length={TODO_MAX_LENGTH}
        max={TODO_MAX_LENGTH}
        data-testid="cc"
      />
    );
    expect(screen.getByTestId('cc')).toHaveClass('text-ultraviolet');
  });

  it('passes custom className through', () => {
    render(
      <CharCounter
        length={5}
        max={100}
        className="custom-class"
        data-testid="cc"
      />
    );
    expect(screen.getByTestId('cc')).toHaveClass('custom-class');
  });

  it('renders without data-testid', () => {
    const { container } = render(<CharCounter length={5} max={100} />);
    expect(container.firstChild).toHaveTextContent('5 / 100');
  });
});
