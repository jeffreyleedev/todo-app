import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useRef } from 'react';
import { useFocusTrap } from './useFocusTrap';

function Fixture({ count = 2 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref);
  return (
    <div ref={ref}>
      {Array.from({ length: count }, (_, i) => (
        <button key={i}>Button {i + 1}</button>
      ))}
    </div>
  );
}

describe('useFocusTrap', () => {
  it('focuses the first focusable element on mount', () => {
    const { getAllByRole } = render(<Fixture />);
    expect(document.activeElement).toBe(getAllByRole('button')[0]);
  });

  it('wraps Tab from the last element to the first', () => {
    const { getAllByRole } = render(<Fixture />);
    const buttons = getAllByRole('button');
    const last = buttons[buttons.length - 1];
    last.focus();
    fireEvent.keyDown(last, { key: 'Tab' });
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('wraps Shift+Tab from the first element to the last', () => {
    const { getAllByRole } = render(<Fixture />);
    const buttons = getAllByRole('button');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(buttons[buttons.length - 1]);
  });

  it('does not trap Tab when focus is not at the last element', () => {
    const { getAllByRole } = render(<Fixture count={3} />);
    const buttons = getAllByRole('button');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'Tab' });
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('does not trap Shift+Tab when focus is not at the first element', () => {
    const { getAllByRole } = render(<Fixture count={3} />);
    const buttons = getAllByRole('button');
    buttons[1].focus();
    fireEvent.keyDown(buttons[1], { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(buttons[1]);
  });

  it('ignores non-Tab keys', () => {
    const { getAllByRole } = render(<Fixture />);
    const buttons = getAllByRole('button');
    const last = buttons[buttons.length - 1];
    last.focus();
    fireEvent.keyDown(last, { key: 'Enter' });
    expect(document.activeElement).toBe(last);
  });
});
