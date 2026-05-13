import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { useEscapeKey } from './useEscapeKey';

describe('useEscapeKey', () => {
  it('calls handler when Escape is pressed', () => {
    const handler = vi.fn();
    renderHook(() => useEscapeKey(handler));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not call handler for non-Escape keys', () => {
    const handler = vi.fn();
    renderHook(() => useEscapeKey(handler));
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Tab' });
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes the listener on unmount', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useEscapeKey(handler));
    unmount();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('switches to the updated handler when the callback reference changes', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ cb }) => useEscapeKey(cb), {
      initialProps: { cb: first },
    });
    rerender({ cb: second });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(second).toHaveBeenCalledOnce();
    expect(first).not.toHaveBeenCalled();
  });

  it('does not re-register the listener when the callback reference changes', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ cb }) => useEscapeKey(cb), {
      initialProps: { cb: first },
    });
    const addSpy = vi.spyOn(document, 'addEventListener');
    rerender({ cb: second });
    expect(addSpy).not.toHaveBeenCalled();
    addSpy.mockRestore();
  });
});
